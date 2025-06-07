import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccounts } from "@/db/queries/accounts";
import { cn } from "@/lib/utils";

const USER_ID = 1;

export default async function AccountsPage() {
  const accounts = await getAccounts(USER_ID);
  return (
    <>
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle>
              <Badge
                className={cn(
                  "mr-2",
                  account.type === "ASSET" && "bg-green-500",
                  account.type === "LIABILITY" &&
                    "bg-destructive text-destructive-foreground",
                )}
              >
                {account.type}
              </Badge>
              {account.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${account.balance}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
