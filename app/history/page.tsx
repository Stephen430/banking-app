import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowDown, ArrowUp } from "lucide-react"
import { getUser, getTransactionHistory } from "@/lib/actions"
import { AppHeader } from "@/components/app-header"

export default async function HistoryPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const transactions = await getTransactionHistory(user.id)

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="Transaction History" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>View all your recent banking transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No transactions found.</p>
                <Link href="/transactions">
                  <Button>Make Your First Transaction</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "deposit" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize text-foreground">{transaction.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description || `${transaction.type} transaction`}
                        </p>
                        <p className="text-xs text-muted-foreground/70">Account: {transaction.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
