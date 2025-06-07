"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  PlusCircle, Eye, EyeOff, ArrowUpDown, History, 
  TrendingUp, Bell, CreditCard, Shield, 
  Wallet, User, ChevronRight, Banknote, 
  Landmark, LineChart, BarChart3, CircleDollarSign,
  AlertTriangle, Percent, PieChart
} from "lucide-react"
import Link from "next/link"
import { getUser, getUserAccounts, getTransactionHistory } from "@/lib/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppHeader } from "@/components/app-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Helper function to calculate totals
function calculateTotalBalance(accounts: any[]) {
  return accounts.reduce((total, account) => total + account.balance, 0);
}

// Mock spending data for charts
const mockMonthlySpending = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 1500 },
  { month: "Apr", amount: 2200 },
  { month: "May", amount: 1700 }
];

// Mock spending by category
const mockSpendingByCategory = [
  { category: "Housing", amount: 1200 },
  { category: "Food", amount: 450 },
  { category: "Transport", amount: 380 },
  { category: "Utilities", amount: 320 },
  { category: "Entertainment", amount: 250 },
  { category: "Other", amount: 200 }
];

// Mock savings goals
const mockSavingsGoals = [
  { name: "Vacation", target: 5000, current: 2500, endDate: "2025-12-20" },
  { name: "New Car", target: 15000, current: 4200, endDate: "2026-06-15" },
  { name: "Emergency Fund", target: 10000, current: 7800, endDate: "2025-09-01" }
];

// Helper function to generate security score
function getSecurityScore() {
  return Math.floor(Math.random() * 30) + 70; // Score between 70-100
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Helper function to calculate days remaining
function getDaysRemaining(dateString: string) {
  const targetDate = new Date(dateString);
  const currentDate = new Date();
  const diff = targetDate.getTime() - currentDate.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
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
        
        const allTransactions = userData.id ? await getTransactionHistory(userData.id) : []
        setRecentTransactions(allTransactions.slice(0, 5))
        
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

  const totalBalance = calculateTotalBalance(accounts)
  const securityScore = getSecurityScore()
  
  // Calculate deposit and withdrawal totals for insights
  const allTransactions = recentTransactions // This would need to be all transactions in a real app
  const depositTotal = allTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const withdrawalTotal = allTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0)

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const formatBalance = (amount: number) => {
    return isBalanceVisible ? `$${amount.toFixed(2)}` : "••••••"
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-5 fixed h-full">
        <div className="flex items-center mb-8">
          <Banknote className="h-7 w-7 text-primary mr-2" />
          <span className="text-xl font-bold text-foreground">SecureBank</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" 
                className="flex items-center px-4 py-3 text-primary bg-primary/10 rounded-lg">
            <Landmark className="h-5 w-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/accounts" 
                className="flex items-center px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors">
            <Wallet className="h-5 w-5 mr-3" />
            <span>Accounts</span>
          </Link>
          
          <Link href="/transactions" 
                className="flex items-center px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors">
            <ArrowUpDown className="h-5 w-5 mr-3" />
            <span>Transactions</span>
          </Link>
          
          <Link href="/history" 
                className="flex items-center px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors">
            <History className="h-5 w-5 mr-3" />
            <span>History</span>
          </Link>
          
          <div className="border-t border-border my-4"></div>
          
          <Link href="/profile" 
                className="flex items-center px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors">
            <User className="h-5 w-5 mr-3" />
            <span>Profile</span>
          </Link>
          
          <Link href="/security" 
                className="flex items-center px-4 py-3 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors">
            <Shield className="h-5 w-5 mr-3" />
            <span>Security</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <AppHeader user={user} title="Dashboard" />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section with Balance Overview */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-foreground">Welcome back, {user.firstName}</h1>
            <p className="text-muted-foreground">Here's your financial overview for today</p>
          </div>
          
          {/* Financial Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-card-foreground">Total Balance</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleBalanceVisibility}
                      className="text-card-foreground hover:bg-accent p-1"
                    >
                      {isBalanceVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-2 text-card-foreground">{formatBalance(totalBalance)}</p>
                <p className="text-sm text-muted-foreground">Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</p>
                
                <div className="mt-6">
                  <Link href="/accounts">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  {recentTransactions.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Latest transaction</p>
                        <Badge variant="outline" className={recentTransactions[0]?.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {recentTransactions[0]?.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{formatBalance(recentTransactions[0]?.amount || 0)}</p>
                      <p className="text-xs text-muted-foreground">{recentTransactions[0]?.description || 'No description'}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent transactions</p>
                  )}
                  
                  <div className="mt-6">
                    <Link href="/history">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Transactions
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-foreground">Security Score</h3>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-foreground">{securityScore}/100</span>
                </div>
                <Progress value={securityScore} className="h-2 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  {securityScore > 90 ? 'Excellent! Your account is very secure.' :
                   securityScore > 75 ? 'Good security. Consider adding 2FA for better protection.' :
                   'Enhance your account security with additional measures.'}
                </p>
                <Link href="/security">
                  <Button variant="outline" size="sm" className="w-full">
                    Improve Security
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/accounts/create">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full hover:bg-accent/50">
                  <CardContent className="flex items-center p-6 h-full">
                    <PlusCircle className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <h3 className="font-semibold text-foreground">Create Account</h3>
                      <p className="text-sm text-muted-foreground">Open new account</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/transactions">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full hover:bg-accent/50">
                  <CardContent className="flex items-center p-6 h-full">
                    <ArrowUpDown className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                    <div>
                      <h3 className="font-semibold text-foreground">Transfer</h3>
                      <p className="text-sm text-muted-foreground">Move money</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/transactions">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full hover:bg-accent/50">
                  <CardContent className="flex items-center p-6 h-full">
                    <CircleDollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <h3 className="font-semibold text-foreground">Deposit</h3>
                      <p className="text-sm text-muted-foreground">Add funds</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/history">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full hover:bg-accent/50">
                  <CardContent className="flex items-center p-6 h-full">
                    <CreditCard className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
                    <div>
                      <h3 className="font-semibold text-foreground">Payments</h3>
                      <p className="text-sm text-muted-foreground">Manage bills</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
          
          {/* Account Tabs */}
          <Tabs defaultValue="accounts" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Accounts</CardTitle>
                      <CardDescription>Overview of your banking accounts</CardDescription>
                    </div>
                    <Link href="/accounts">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <span>View All</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {accounts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You don't have any accounts yet.</p>
                      <Link href="/accounts/create">
                        <Button>Create Your First Account</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {accounts.map((account) => (
                        <div key={account.id} className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-3 rounded-full mr-4">
                              {account.accountType.toLowerCase().includes('saving') ? 
                                <Landmark className="h-6 w-6 text-primary" /> : 
                                <CreditCard className="h-6 w-6 text-primary" />
                              }
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{account.accountType} Account</h3>
                              <p className="text-sm text-muted-foreground">Account #{account.accountNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">{formatBalance(account.balance)}</p>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="spending">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Monthly Spending</CardTitle>
                    <CardDescription className="text-muted-foreground">Your spending trends over the past 5 months</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80 flex items-center justify-center">
                      <div className="w-full h-full p-4">
                        {/* Simulated chart using div elements as bars */}
                        <div className="flex h-64 items-end space-x-2">
                          {mockMonthlySpending.map((item, i) => (
                            <div key={item.month} className="flex-1 flex flex-col items-center">
                              <div 
                                className={`w-full rounded-t-md ${i % 2 === 0 ? 'bg-primary' : 'bg-primary/80'}`} 
                                style={{ height: `${(item.amount / 2500) * 100}%` }}
                              ></div>
                              <div className="mt-2 text-sm font-medium text-foreground">{item.month}</div>
                              <div className="text-xs text-muted-foreground">${item.amount}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Spending by Category</CardTitle>
                    <CardDescription className="text-muted-foreground">How your money is being spent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSpendingByCategory.map((category) => (
                        <div key={category.category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{category.category}</span>
                            <span className="text-sm text-muted-foreground">${category.amount}</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                category.category === 'Housing' ? 'bg-primary' :
                                category.category === 'Food' ? 'bg-red-500 dark:bg-red-400' :
                                category.category === 'Transport' ? 'bg-yellow-500 dark:bg-yellow-400' :
                                category.category === 'Utilities' ? 'bg-green-500 dark:bg-green-400' :
                                category.category === 'Entertainment' ? 'bg-purple-500 dark:bg-purple-400' : 'bg-orange-500 dark:bg-orange-400'
                              }`} 
                              style={{ width: `${(category.amount / 1200) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Financial Summary</CardTitle>
                    <CardDescription className="text-muted-foreground">Key financial metrics and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-accent p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Deposits</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatBalance(depositTotal)}</p>
                        </div>
                        <div className="bg-accent p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatBalance(withdrawalTotal)}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-base font-semibold mb-4 text-foreground">Income vs. Spending</h4>
                        <div className="flex items-center mb-2">
                          <div className="w-full bg-secondary rounded-full h-4 mr-2">
                            <div 
                              className="bg-green-500 dark:bg-green-400 h-4 rounded-l-full" 
                              style={{ width: `${Math.min(100, (depositTotal / (depositTotal + withdrawalTotal || 1)) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-foreground">{Math.round((depositTotal / (depositTotal + withdrawalTotal || 1)) * 100)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Income ratio to spending</p>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-base font-semibold mb-2 text-foreground">Tips & Insights</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2 mt-0.5" />
                            <span className="text-muted-foreground">Consider increasing your savings rate by at least 5%.</span>
                          </li>
                          <li className="flex items-start">
                            <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                            <span className="text-muted-foreground">Your balance has grown 12% since last month.</span>
                          </li>
                          <li className="flex items-start">
                            <Percent className="h-4 w-4 text-primary mr-2 mt-0.5" />
                            <span className="text-muted-foreground">You could earn more interest with our premium savings account.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Savings Goals</CardTitle>
                    <CardDescription className="text-muted-foreground">Track your progress towards financial targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mockSavingsGoals.map((goal) => {
                        const progressPercent = (goal.current / goal.target) * 100;
                        const daysRemaining = getDaysRemaining(goal.endDate);
                        
                        return (
                          <div key={goal.name} className="space-y-2">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-foreground">{goal.name}</h4>
                              <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>${goal.current} of ${goal.target}</span>
                              <span>{daysRemaining} days remaining</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      <Link href="/goals" className="block">
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add New Savings Goal
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Recent Transactions Table */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="flex items-center text-primary">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {recentTransactions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No transactions found</p>
                  <Link href="/transactions">
                    <Button>Make Your First Transaction</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="py-3 px-6 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-accent/50 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} mr-3`}>
                                {transaction.type === 'deposit' ? (
                                  <ArrowUpDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowUpDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <span className="font-medium capitalize text-foreground">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm text-foreground">{transaction.description}</td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm text-muted-foreground">{transaction.accountNumber}</td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                          <td className={`py-4 px-6 whitespace-nowrap text-sm font-semibold text-right ${
                            transaction.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
