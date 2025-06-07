"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUser, getUserAccounts, getTransactionHistory } from "@/lib/actions"
import { 
  ArrowLeft, Plus, CreditCard, Wallet, 
  Landmark, Shield, Eye, EyeOff, BarChart3, 
  Calendar, Clock, ArrowUpDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/app-header"

// Helper function to calculate account age in days
function calculateAccountAge(createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper function to get account utilization percentage
function getAccountUtilization(account: any, transactions: any[]) {
  // For checking accounts, calculate transaction frequency
  if (account.accountType === "Checking") {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentTransactions = transactions.filter(t => 
      t.accountId === account.id && 
      new Date(t.createdAt) > last30Days
    );
    
    // Calculate activity score based on transaction frequency
    return Math.min(100, Math.round((recentTransactions.length / 15) * 100));
  } 
  // For savings accounts, calculate how close to a savings goal they might be
  else {
    // Arbitrary calculation - assume savings goal is relative to balance
    const assumedGoal = account.balance * 1.5;
    return Math.min(100, Math.round((account.balance / assumedGoal) * 100));
  }
}

// Helper function to format date
function formatDate(dateString: string) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options as any);
}

export default function AccountsPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [allTransactions, setAllTransactions] = useState<any[]>([])
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getUser()
        if (!userData) {
          router.push("/login")
          return
        }
        
        setUser(userData)
        
        const userAccounts = await getUserAccounts(userData.id)
        setAccounts(userAccounts)
        
        const transactions = await getTransactionHistory(userData.id)
        setAllTransactions(transactions)
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const formatBalance = (amount: number) => {
    return isBalanceVisible ? `$${amount.toFixed(2)}` : "••••••"
  }

  // Group accounts by type
  const checkingAccounts = accounts.filter(acc => acc.accountType === "Checking");
  const savingsAccounts = accounts.filter(acc => acc.accountType === "Savings");
  
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="Accounts" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header section with summary information */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">My Financial Accounts</h1>
              <p className="text-muted-foreground mb-4">Manage and monitor all your banking accounts</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 px-3 py-1">
                <Wallet className="h-4 w-4 mr-1" />
                <span>{accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}</span>
              </Badge>
              <Link href="/accounts/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Financial summary cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-primary-foreground/90">Total Balance</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBalanceVisibility}
                    className="text-primary-foreground hover:bg-primary-foreground/20 p-1"
                  >
                    {isBalanceVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Wallet className="h-6 w-6 text-primary-foreground/80" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-2 text-primary-foreground">{formatBalance(totalBalance)}</p>
              <p className="text-sm text-primary-foreground/80">Across all your accounts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-foreground">Checking Accounts</h3>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatBalance(checkingAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {checkingAccounts.length} {checkingAccounts.length === 1 ? 'account' : 'accounts'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-foreground">Savings Accounts</h3>
                <Landmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatBalance(savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {savingsAccounts.length} {savingsAccounts.length === 1 ? 'account' : 'accounts'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="checking">Checking</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {accounts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">No accounts found</h2>
                  <p className="text-muted-foreground mb-6">Create your first account to get started with banking.</p>
                  <Link href="/accounts/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {accounts.map((account) => {
                  const accountAge = calculateAccountAge(account.createdAt);
                  const utilization = getAccountUtilization(account, allTransactions);
                  
                  // Filter transactions for this account
                  const accountTransactions = allTransactions.filter(t => t.accountId === account.id);
                  const recentTransactions = accountTransactions.slice(0, 3);
                  
                  return (
                    <Card key={account.id} className="overflow-hidden border-t-4 border-primary">
                      <CardHeader className="bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              <div className={`p-2 rounded-full mr-3 ${
                                account.accountType === "Checking" ? "bg-primary/10" : "bg-green-100 dark:bg-green-900/30"
                              }`}>
                                {account.accountType === "Checking" ? (
                                  <CreditCard className="h-5 w-5 text-primary" />
                                ) : (
                                  <Landmark className="h-5 w-5 text-green-600 dark:text-green-400" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-xl text-foreground">{account.accountType} Account</CardTitle>
                                <CardDescription className="text-muted-foreground">Account Number: {account.accountNumber}</CardDescription>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" /> 
                              <span>Opened {formatDate(account.createdAt)} • {accountAge} days ago</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatBalance(account.balance)}</p>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-5 gap-6">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-foreground">Account Utilization</span>
                                <span className="text-sm text-muted-foreground">{utilization}%</span>
                              </div>
                              <Progress value={utilization} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {account.accountType === "Checking" ? 
                                  "Based on transaction activity" : 
                                  "Based on savings targets"}
                              </p>
                            </div>
                            
                            <div className="flex space-x-4">
                              <Link href={`/transactions?account=${account.id}`} className="flex-1">
                                <Button variant="default" className="w-full">
                                  <ArrowUpDown className="h-4 w-4 mr-2" />
                                  Transaction
                                </Button>
                              </Link>
                              <Link href={`/history?account=${account.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                  <Clock className="h-4 w-4 mr-2" />
                                  History
                                </Button>
                              </Link>
                            </div>
                          </div>
                          
                          <div className="md:col-span-3 border-l border-border pl-6">
                            <h4 className="font-medium mb-3 flex items-center text-foreground">
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Recent Activity
                            </h4>
                            
                            {recentTransactions.length > 0 ? (
                              <div className="space-y-2">
                                {recentTransactions.map((transaction) => (
                                  <div key={transaction.id} className="flex justify-between items-center border-b border-border pb-2">
                                    <div className="flex items-center">
                                      <div className={`p-1 rounded-full ${transaction.type === "deposit" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} mr-2`}>
                                        <ArrowUpDown className={`h-3 w-3 ${transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
                                      </div>
                                      <span className="text-sm text-foreground">{transaction.description || `${transaction.type} transaction`}</span>
                                    </div>
                                    <div className={`text-sm font-medium ${transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                      {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No recent transactions for this account.</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="checking">
            {checkingAccounts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">No checking accounts found</h2>
                  <p className="text-muted-foreground mb-6">Create a checking account for everyday banking.</p>
                  <Link href="/accounts/create">
                    <Button>Create Checking Account</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {checkingAccounts.map((account) => {
                  const accountTransactions = allTransactions.filter(t => t.accountId === account.id);
                  const recentTransactions = accountTransactions.slice(0, 3);
                  
                  return (
                    <Card key={account.id} className="overflow-hidden border-t-4 border-primary">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-foreground">Checking Account</CardTitle>
                              <CardDescription className="text-muted-foreground">Account Number: {account.accountNumber}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatBalance(account.balance)}</p>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-4">
                          <Link href={`/transactions?account=${account.id}`}>
                            <Button variant="default">Make Transaction</Button>
                          </Link>
                          <Link href={`/history?account=${account.id}`}>
                            <Button variant="outline">View History</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="savings">
            {savingsAccounts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">No savings accounts found</h2>
                  <p className="text-muted-foreground mb-6">Create a savings account to start building your future.</p>
                  <Link href="/accounts/create">
                    <Button>Create Savings Account</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {savingsAccounts.map((account) => {
                  const accountTransactions = allTransactions.filter(t => t.accountId === account.id);
                  const recentTransactions = accountTransactions.slice(0, 3);
                  
                  return (
                    <Card key={account.id} className="overflow-hidden border-t-4 border-green-500 dark:border-green-400">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                              <Landmark className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-foreground">Savings Account</CardTitle>
                              <CardDescription className="text-muted-foreground">Account Number: {account.accountNumber}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">${account.balance.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-4">
                          <Link href={`/transactions?account=${account.id}`}>
                            <Button variant="default">Make Transaction</Button>
                          </Link>
                          <Link href={`/history?account=${account.id}`}>
                            <Button variant="outline">View History</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
