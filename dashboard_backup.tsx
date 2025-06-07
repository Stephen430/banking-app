import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  PlusCircle, Eye, ArrowUpDown, History, 
  TrendingUp, Bell, CreditCard, Shield, 
  Wallet, User, ChevronRight, Banknote, 
  Landmark, LineChart, BarChart3, CircleDollarSign,
  Settings, AlertTriangle, DollarSign, 
  TrendingDown, CheckCircle, BarChart4, PieChart,
  Calendar, Home, Activity
} from "lucide-react"
import Link from "next/link"
import { getUser, getUserAccounts, getTransactionHistory } from "@/lib/actions"
import { LogoutButton } from "@/components/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Helper functions
function calculateTotalBalance(accounts: any[]) {
  return accounts.reduce((total, account) => total + account.balance, 0);
}

function calculateMonthlyChange(transactions: any[]) {
  // Get current month and previous month
  const now = new Date();
  const currentMonth = now.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  
  // Filter transactions by month
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.createdAt);
    return date.getMonth() === currentMonth;
  });
  
  const previousMonthTransactions = transactions.filter(t => {
    const date = new Date(t.createdAt);
    return date.getMonth() === previousMonth;
  });
  
  // Calculate totals
  const currentTotal = currentMonthTransactions.reduce((total, t) => {
    return t.type === 'deposit' ? total + t.amount : total - t.amount;
  }, 0);
  
  const previousTotal = previousMonthTransactions.reduce((total, t) => {
    return t.type === 'deposit' ? total + t.amount : total - t.amount;
  }, 0);
  
  // Calculate percentage change
  if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
  
  const percentageChange = ((currentTotal - previousTotal) / Math.abs(previousTotal)) * 100;
  return Math.round(percentageChange);
}

// Generate category spending data from transactions
function getCategorySpending(transactions: any[]) {
  // For demo purposes, categorize transactions based on description keywords
  const categories = [
    { name: "Housing", amount: 0, color: "#4F46E5" },
    { name: "Food", amount: 0, color: "#10B981" },
    { name: "Transport", amount: 0, color: "#F59E0B" },
    { name: "Entertainment", amount: 0, color: "#EC4899" },
    { name: "Utilities", amount: 0, color: "#6366F1" }
  ];
  
  // Define keywords for each category
  const categoryKeywords = {
    Housing: ["rent", "mortgage", "home", "apartment", "house"],
    Food: ["grocery", "restaurant", "food", "meal", "dining"],
    Transport: ["gas", "car", "uber", "lyft", "transit", "train", "bus"],
    Entertainment: ["movie", "subscription", "game", "sport", "concert"],
    Utilities: ["electric", "water", "internet", "phone", "utility"]
  };
  
  // Process withdrawals only
  const withdrawals = transactions.filter(t => t.type === "withdrawal");
  
  withdrawals.forEach(transaction => {
    const desc = (transaction.description || "").toLowerCase();
    let matched = false;
    
    // Check each category for keywords
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        const categoryIndex = categories.findIndex(c => c.name === category);
        if (categoryIndex >= 0) {
          categories[categoryIndex].amount += transaction.amount;
          matched = true;
          break;
        }
      }
    }
    
    // If no match, add to "Other" category
    if (!matched) {
      // Find or create "Other" category
      let otherIndex = categories.findIndex(c => c.name === "Other");
      if (otherIndex === -1) {
        categories.push({ name: "Other", amount: transaction.amount, color: "#94A3B8" });
      } else {
        categories[otherIndex].amount += transaction.amount;
      }
    }
  });
  
  return categories.sort((a, b) => b.amount - a.amount);
}

// Mock spending data for charts when no real data exists
const mockMonthlySpending = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 1500 },
  { month: "Apr", amount: 2200 },
  { month: "May", amount: 1700 }
];

// Helper function to generate security score
function getSecurityScore() {
  return Math.floor(Math.random() * 30) + 70; // Score between 70-100
}

// Format currency amounts consistently
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const accounts = await getUserAccounts(user.id);
  const totalBalance = calculateTotalBalance(accounts);
  
  // Get recent transactions (last 5)
  const allTransactions = user.id ? await getTransactionHistory(user.id) : [];
  const recentTransactions = allTransactions.slice(0, 5);
  
  const securityScore = getSecurityScore();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-5 fixed h-full">
        <div className="flex items-center mb-8">
          <Banknote className="h-7 w-7 text-blue-600 mr-2" />
          <span className="text-xl font-bold">SecureBank</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" 
                className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
            <Landmark className="h-5 w-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/accounts" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Wallet className="h-5 w-5 mr-3" />
            <span>Accounts</span>
          </Link>
          
          <Link href="/transactions" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <ArrowUpDown className="h-5 w-5 mr-3" />
            <span>Transactions</span>
          </Link>
          
          <Link href="/history" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <History className="h-5 w-5 mr-3" />
            <span>History</span>
          </Link>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <Link href="/settings" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <User className="h-5 w-5 mr-3" />
            <span>Profile</span>
          </Link>
          
          <Link href="/security" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Shield className="h-5 w-5 mr-3" />
            <span>Security</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="md:hidden">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-3 w-3"></span>
              </div>
              
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium mr-2">{user.firstName} {user.lastName}</span>
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section with Balance Overview */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.firstName}</h1>
            <p className="text-gray-600">Here's your financial overview for today</p>
          </div>
          
          {/* Financial Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium opacity-90">Total Balance</h3>
                  <Wallet className="h-5 w-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold mb-2">${totalBalance.toFixed(2)}</p>
                <p className="text-sm opacity-80">Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</p>
                
                <div className="mt-6">
                  <Link href="/accounts">
                    <Button variant="secondary" size="sm" className="text-blue-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
                  <History className="h-5 w-5 text-gray-500" />
                </div>
                <div className="space-y-2">
                  {recentTransactions.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600">Latest transaction</p>
                        <Badge variant="outline" className={recentTransactions[0]?.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                          {recentTransactions[0]?.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold">${recentTransactions[0]?.amount?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-gray-500">{recentTransactions[0]?.description || 'No description'}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent transactions</p>
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
                  <h3 className="text-lg font-medium text-gray-800">Security Score</h3>
                  <Shield className="h-5 w-5 text-gray-500" />
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">{securityScore}/100</span>
                </div>
                <Progress value={securityScore} className="h-2 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
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
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/accounts/create">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex items-center p-6 h-full">
                    <PlusCircle className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Create Account</h3>
                      <p className="text-sm text-gray-600">Open new account</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/transactions">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex items-center p-6 h-full">
                    <ArrowUpDown className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Transfer</h3>
                      <p className="text-sm text-gray-600">Move money</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/transactions">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex items-center p-6 h-full">
                    <CircleDollarSign className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Deposit</h3>
                      <p className="text-sm text-gray-600">Add funds</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/history">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex items-center p-6 h-full">
                    <CreditCard className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <h3 className="font-semibold">Payments</h3>
                      <p className="text-sm text-gray-600">Manage bills</p>
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
                      <p className="text-gray-600 mb-4">You don't have any accounts yet.</p>
                      <Link href="/accounts/create">
                        <Button>Create Your First Account</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {accounts.map((account) => (
                        <div key={account.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                              {account.accountType.toLowerCase().includes('saving') ? 
                                <Landmark className="h-6 w-6 text-blue-600" /> : 
                                <CreditCard className="h-6 w-6 text-blue-600" />
                              }
                            </div>
                            <div>
                              <h3 className="font-semibold">{account.accountType} Account</h3>
                              <p className="text-sm text-gray-600">Account #{account.accountNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${account.balance.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">Available Balance</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
