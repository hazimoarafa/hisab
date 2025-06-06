"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteAccount } from "@/lib/queries"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

interface DeleteAccountDialogProps {
  accountId: number
  accountName: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteAccountDialog({ 
  accountId, 
  accountName, 
  isOpen, 
  onOpenChange 
}: DeleteAccountDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await deleteAccount(accountId)
      console.log('Account deleted successfully:', accountId)
      onOpenChange(false)
      
      // Refresh the page to see the changes
      window.location.reload()
    } catch (error) {
      console.error('Error deleting account:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the account and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 