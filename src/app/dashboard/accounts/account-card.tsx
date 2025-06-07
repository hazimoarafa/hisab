"use client";

import { AddAccountModal } from "@/app/dashboard/accounts/add-account-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Building,
  CreditCard,
  DollarSign,
  Edit,
  MoreVertical,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface Account {
  id: number;
  name: string;
  type: "ASSET" | "LIABILITY";
  balance: number;
}

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getAccountIcon = (accountName: string, accountType: string) => {
    const name = accountName.toLowerCase();
    if (
      name.includes("bank") ||
      name.includes("checking") ||
      name.includes("savings")
    )
      return <Wallet className="h-5 w-5" />;
    if (name.includes("credit") || name.includes("loan"))
      return <CreditCard className="h-5 w-5" />;
    if (name.includes("investment") || name.includes("stock"))
      return <TrendingUp className="h-5 w-5" />;
    if (name.includes("cash") || name.includes("money"))
      return <DollarSign className="h-5 w-5" />;
    if (name.includes("property") || name.includes("real estate"))
      return <Building className="h-5 w-5" />;
    if (accountType === "ASSET") return <PiggyBank className="h-5 w-5" />;
    return <CreditCard className="h-5 w-5" />;
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const isAsset = account.type === "ASSET";

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getAccountIcon(account.name, account.type)}
              <span className="truncate">{account.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  isAsset
                    ? "text-green-700 border-green-700/20"
                    : "text-destructive border-destructive/20",
                )}
              >
                {isAsset ? "Asset" : "Liability"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              isAsset
                ? account.balance >= 0
                  ? "text-green-600"
                  : "text-destructive"
                : account.balance >= 0
                ? "text-destructive"
                : "text-green-600",
            )}
          >
            {formatCurrency(account.balance)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {isAsset
              ? account.balance >= 0
                ? "Positive Balance"
                : "Negative Balance"
              : account.balance >= 0
              ? "Amount Owed"
              : "Credit Balance"}
          </div>
        </CardContent>
      </Card>

      <AddAccountModal
        account={account}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
}
