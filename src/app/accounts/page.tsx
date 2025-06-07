import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccounts } from "@/db/queries/accounts";
import { cn } from "@/lib/utils";

const USER_ID = 1;

export default async function AccountsPage() {
  const accounts = await getAccounts(USER_ID);
  const assets = accounts.filter(a=>a.type==="ASSET").map(a=>a.balance).reduce((a,c)=>Number(a)+Number(c))
  const liabilities = accounts.filter(a=>a.type==="LIABILITY").map(a=>a.balance).reduce((a,c)=>Number(a)+Number(c))
  const netWorth = assets - liabilities
  return (
    <div className="space-y-4">
      <h1>Net Worth: {netWorth}</h1>
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle>
             
              {account.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", account.type === "ASSET" && account.balance >= 0 ? "text-green-500" : "text-destructive", account.type==="LIABILITY" && account.balance >= 0 ? "text-destructive" : "text-green-500"  )}>
              ${account.balance}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
