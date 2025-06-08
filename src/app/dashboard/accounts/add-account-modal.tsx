"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccountWithInitialBalance, updateAccount } from "@/db/queries/accounts";
import { Account, accountType } from "@/db/schema";
import { getAccountTypeDisplayName, isAssetAccountType } from "@/lib/account-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Account name is required").max(255, "Name too long"),
  type: z.enum(accountType.enumValues, {
    required_error: "Please select an account type",
  }),
  initialBalance: z.coerce.number(),
});

type FormData = z.infer<typeof formSchema>;

// TODO: Replace with actual user authentication
const USER_ID = 1;

interface AccountWithBalance extends Account {
  balance: number;
}

interface AccountModalProps {
  account?: AccountWithBalance;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddAccountModal({ account, trigger, open: controlledOpen, onOpenChange }: AccountModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!account;

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "CHECKING",
      initialBalance: 0,
    },
  });

  // Update form values when account prop changes
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
        initialBalance: account.balance,
      });
    } else {
      form.reset({
        name: "",
        type: "CHECKING",
        initialBalance: 0,
      });
    }
  }, [account, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (account) {
        // Update existing account (without changing balance)
        await updateAccount(
          account.id,
          data.name,
          data.type
        );
        console.log("Account updated successfully");
      } else {
        // Create new account with initial balance
        await createAccountWithInitialBalance(
          USER_ID,
          data.name,
          data.type,
          data.initialBalance,
        );
        console.log("Account created successfully");
      }

      setOpen(false);
      if (!isEditing) {
        form.reset();
      }
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to ${isEditing ? "update" : "create"} account. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Add Account
    </Button>
  );

  // If controlled externally (open prop provided), don't render trigger
  const isControlled = controlledOpen !== undefined;

  // Group account types by category for better UX
  const assetTypes = accountType.enumValues.filter(type => isAssetAccountType(type));
  const liabilityTypes = accountType.enumValues.filter(type => !isAssetAccountType(type));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Account" : "Add New Account"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chase Checking, Credit Card, Investment Account"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-sm font-semibold text-green-700">Assets</div>
                      {assetTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getAccountTypeDisplayName(type)}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-sm font-semibold text-red-700 mt-2">Liabilities</div>
                      {liabilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getAccountTypeDisplayName(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "Current Balance" : "Initial Balance"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isEditing}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    {isEditing ? (
                      "Balance cannot be edited directly. Use transactions to change account balance."
                    ) : (
                      <>
                        For assets: positive = money you have, negative = money you
                        owe
                        <br />
                        For liabilities: positive = debt you owe, negative = credit
                        balance
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Account" : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
