import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountTypeEnum } from "@/db/schema";
import { getUserAccounts } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet
} from "lucide-react";
import AccountActions from "./account-actions";
import AccountDialog from "./account-dialog";

// For now, we'll use a hardcoded user ID. In a real app, this would come from authentication
const USER_ID = 1;

function getAccountIcon(type: (typeof accountTypeEnum.enumValues)[number]) {
  switch (type) {
    case "checking":
      return <Wallet className="h-5 w-5" />;
    case "savings":
      return <PiggyBank className="h-5 w-5" />;
    case "credit_card":
      return <CreditCard className="h-5 w-5" />;
  }
}

function getAccountTypeLabel(
  type: (typeof accountTypeEnum.enumValues)[number],
) {
  switch (type) {
    case "checking":
      return "Checking";
    case "savings":
      return "Savings";
    case "credit_card":
      return "Credit Card";
  }
}

function getAccountTypeColor(
  type: (typeof accountTypeEnum.enumValues)[number],
) {
  switch (type) {
    case "checking":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "savings":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "credit_card":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  }
}

async function getAccountsData() {
  try {
    const accounts = await getUserAccounts(USER_ID);
    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export default async function AccountsPage() {
  const accounts = await getAccountsData();

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0,
  );
  const cashAccounts = accounts.filter((acc) => acc.type !== "credit_card");
  const creditCards = accounts.filter((acc) => acc.type === "credit_card");
  const totalCash = cashAccounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0,
  );
  const totalCredit = Math.abs(
    creditCards.reduce((sum, account) => sum + Number(account.balance), 0),
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts, credit cards, and balances
          </p>
        </div>
        <AccountDialog mode="add" />
      </div>
      {accounts.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first bank account or credit card.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cash
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalCash)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {cashAccounts.length} accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Credit Card Debt
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalCredit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {creditCards.length} cards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Balance
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalBalance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cash minus credit debt
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Accounts List */}
          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">
                            {account.institution || "Unknown Bank"}{" "}
                            {getAccountTypeLabel(account.type)}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getAccountTypeColor(account.type)}
                          >
                            {getAccountTypeLabel(account.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {account.institution || "Unknown Institution"}
                          <span>
                            {" "}
                            • Last updated:{" "}
                            {account.updatedAt.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${
                            Number(account.balance) < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatCurrency(Math.abs(Number(account.balance)))}
                        </div>
                        {account.type === "credit_card" &&
                          Number(account.balance) < 0 && (
                            <p className="text-xs text-muted-foreground">
                              Outstanding balance
                            </p>
                          )}
                      </div>
                      <AccountActions
                        accountId={account.id} 
                        accountName={`${account.institution || "Unknown Bank"} ${getAccountTypeLabel(account.type)}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
