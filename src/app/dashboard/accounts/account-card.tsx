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
import { Account } from "@/db/schema";
import { getAccountCategory, getAccountTypeDisplayName } from "@/lib/account-utils";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Banknote,
  Briefcase,
  Building,
  Car,
  CreditCard,
  DollarSign,
  Edit,
  FileText,
  GraduationCap,
  HandCoins,
  Home,
  LandPlot,
  MoreVertical,
  PiggyBank,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface AccountWithBalance extends Account {
  balance: number;
}

interface AccountCardProps {
  account: AccountWithBalance;
}

export function AccountCard({ account }: AccountCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getAccountIcon = (accountType: Account["type"]) => {
    switch (accountType) {
      // Asset Types
      case "CHECKING":
        return <Wallet className="h-5 w-5" />;
      case "SAVINGS":
        return <PiggyBank className="h-5 w-5" />;
      case "MONEY_MARKET":
        return <Banknote className="h-5 w-5" />;
      case "CD":
        return <Receipt className="h-5 w-5" />;
      case "INVESTMENT":
        return <TrendingUp className="h-5 w-5" />;
      case "REAL_ESTATE":
        return <LandPlot className="h-5 w-5" />;
      case "VEHICLE":
        return <Car className="h-5 w-5" />;
      case "OTHER_ASSET":
        return <Briefcase className="h-5 w-5" />;
      
      // Liability Types
      case "CREDIT_CARD":
        return <CreditCard className="h-5 w-5" />;
      case "MORTGAGE":
        return <Home className="h-5 w-5" />;
      case "AUTO_LOAN":
        return <Car className="h-5 w-5" />;
      case "LEASE":
        return <Building className="h-5 w-5" />;
      case "STUDENT_LOAN":
        return <GraduationCap className="h-5 w-5" />;
      case "PERSONAL_LOAN":
        return <HandCoins className="h-5 w-5" />;
      case "LINE_OF_CREDIT":
        return <FileText className="h-5 w-5" />;
      case "OTHER_LIABILITY":
        return <DollarSign className="h-5 w-5" />;
      
      default:
        // Fallback icon based on category
        const category = getAccountCategory(accountType);
        return category === "ASSET" ? <PiggyBank className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />;
    }
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const accountCategory = getAccountCategory(account.type);
  const isAsset = accountCategory === "ASSET";

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getAccountIcon(account.type)}
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
                {getAccountTypeDisplayName(account.type)}
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
