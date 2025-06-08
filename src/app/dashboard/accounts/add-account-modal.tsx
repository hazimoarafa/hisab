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
import { createAccountWithInitialBalance, createPropertyForExistingAccount, createRealEstateAccountWithProperty, getRealEstateProperty, updateAccount, updateRealEstateProperty } from "@/db/queries/accounts";
import { Account, accountType } from "@/db/schema";
import { RealEstateProperty } from "@/db/schema/properties";
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
  // Address fields for real estate accounts
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
}).refine((data) => {
  // If account type is REAL_ESTATE, address fields are required
  if (data.type === "REAL_ESTATE") {
    return !!(data.addressLine1 && data.city && data.stateProvince && data.postalCode);
  }
  return true;
}, {
  message: "Address fields are required for real estate accounts",
  path: ["addressLine1"],
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
  const [propertyData, setPropertyData] = useState<RealEstateProperty | null>(null);
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
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "United States",
    },
  });

  // Watch the account type to show/hide address fields
  const selectedAccountType = form.watch("type");
  const isRealEstateAccount = selectedAccountType === "REAL_ESTATE";

  // Load property data for real estate accounts when editing
  useEffect(() => {
    if (account && account.type === "REAL_ESTATE" && isEditing) {
      const loadPropertyData = async () => {
        try {
          const property = await getRealEstateProperty(account.id);
          setPropertyData(property);
        } catch (error) {
          console.error("Error loading property data:", error);
        }
      };
      loadPropertyData();
    }
  }, [account, isEditing]);

  // Update form values when account prop changes
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
        initialBalance: account.balance,
        addressLine1: propertyData?.addressLine1 || "",
        addressLine2: propertyData?.addressLine2 || "",
        city: propertyData?.city || "",
        stateProvince: propertyData?.stateProvince || "",
        postalCode: propertyData?.postalCode || "",
        country: propertyData?.country || "United States",
      });
    } else {
      form.reset({
        name: "",
        type: "CHECKING",
        initialBalance: 0,
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "United States",
      });
    }
  }, [account, form, propertyData]);

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

        // If this is a real estate account, also update property data
        if (data.type === "REAL_ESTATE") {
          if (propertyData) {
            // Update existing property
            await updateRealEstateProperty(account.id, {
              addressLine1: data.addressLine1!,
              addressLine2: data.addressLine2,
              city: data.city!,
              stateProvince: data.stateProvince!,
              postalCode: data.postalCode!,
              country: data.country || "United States",
            });
          } else {
            // Create new property if account type was changed to REAL_ESTATE
            await createPropertyForExistingAccount(account.id, {
              addressLine1: data.addressLine1!,
              addressLine2: data.addressLine2,
              city: data.city!,
              stateProvince: data.stateProvince!,
              postalCode: data.postalCode!,
              country: data.country || "United States",
            });
          }
        }
        console.log("Account updated successfully");
      } else {
        // Create new account
        if (data.type === "REAL_ESTATE") {
          // Create real estate account with property details
          await createRealEstateAccountWithProperty(
            USER_ID,
            data.name,
            data.initialBalance,
            {
              addressLine1: data.addressLine1!,
              addressLine2: data.addressLine2,
              city: data.city!,
              stateProvince: data.stateProvince!,
              postalCode: data.postalCode!,
              country: data.country || "United States",
            }
          );
        } else {
          // Create regular account with initial balance
          await createAccountWithInitialBalance(
            USER_ID,
            data.name,
            data.type,
            data.initialBalance,
          );
        }
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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

            {/* Address fields for real estate accounts */}
            {isRealEstateAccount && (
              <>
                <div className="text-sm font-semibold text-blue-700 mt-4">Property Address</div>
                
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apt 4B, Unit 200, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stateProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NY"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

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
                    ) : isRealEstateAccount ? (
                      "Enter the current estimated value of this property."
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
