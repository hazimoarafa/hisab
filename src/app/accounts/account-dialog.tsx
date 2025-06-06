"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAccount, getAccountById, updateAccount } from "@/lib/queries/account"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

// For now, using hardcoded user ID. In a real app, this would come from authentication
const USER_ID = 1

interface AccountDialogProps {
  mode?: 'add' | 'edit'
  accountId?: number
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export default function AccountDialog({ 
  mode = 'add', 
  accountId, 
  isOpen: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  trigger 
}: AccountDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAccount, setIsLoadingAccount] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    institution: '',
    balance: ''
  })

  // Use controlled or uncontrolled state based on props
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = controlledOnOpenChange || setInternalOpen

  const accountTypes = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'credit_card', label: 'Credit Card' }
  ]

  // Load account data when editing and dialog opens
  useEffect(() => {
    if (mode === 'edit' && isOpen && accountId) {
      loadAccountData()
    } else if (mode === 'add' && isOpen) {
      // Reset form for add mode
      setFormData({ type: '', institution: '', balance: '' })
    }
  }, [mode, isOpen, accountId])

  const loadAccountData = async () => {
    if (!accountId) return
    
    setIsLoadingAccount(true)
    try {
      const account = await getAccountById(accountId)
      if (account) {
        setFormData({
          type: account.type,
          institution: account.institution || '',
          balance: account.balance
        })
      }
    } catch (error) {
      console.error('Error loading account:', error)
    } finally {
      setIsLoadingAccount(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (mode === 'add') {
        await createAccount({
          userId: USER_ID,
          type: formData.type as 'checking' | 'savings' | 'credit_card',
          institution: formData.institution,
          balance: formData.balance || '0.00'
        })
        console.log('Account created successfully:', formData)
      } else if (mode === 'edit' && accountId) {
        await updateAccount(accountId, {
          type: formData.type as 'checking' | 'savings' | 'credit_card',
          institution: formData.institution,
          balance: formData.balance
        })
        console.log('Account updated successfully:', formData)
      }
      
      setIsOpen(false)
      if (mode === 'add') {
        setFormData({ type: '', institution: '', balance: '' })
      }
      
      // Refresh the page to see the changes
      window.location.reload()
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} account:`, error)
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (mode === 'add') {
      setFormData({ type: '', institution: '', balance: '' })
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{mode === 'add' ? 'Add Account' : 'Edit Account'}</DialogTitle>
        <DialogDescription>
          {mode === 'add' 
            ? 'Add a new bank account or credit card to your financial dashboard.'
            : 'Update your account information and current balance.'
          }
        </DialogDescription>
      </DialogHeader>
      
      {mode === 'edit' && isLoadingAccount ? (
        <div className="flex items-center justify-center py-6">
          <div className="text-sm text-muted-foreground">Loading account data...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Account Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              type="text"
              placeholder="e.g., Chase Bank, American Express"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance">
              {mode === 'add' ? 'Initial Balance' : 'Current Balance'}
            </Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => handleInputChange('balance', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.type || !formData.institution || isLoading}>
              {isLoading 
                ? (mode === 'add' ? 'Adding...' : 'Updating...')
                : (mode === 'add' ? 'Add Account' : 'Update Account')
              }
            </Button>
          </div>
        </form>
      )}
    </DialogContent>
  )

  // For add mode with default trigger, or when used as controlled component
  if (mode === 'add' && !trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  // For controlled usage (edit mode or custom trigger)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {dialogContent}
    </Dialog>
  )
}