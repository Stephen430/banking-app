"use client"

import React, { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar,
  PieChart, BarChart3, Target, Wallet, CreditCard, ArrowUpRight,
  ArrowDownRight, AlertCircle, CheckCircle2, Filter, Download
} from "lucide-react"
import { getUser, getUserAccounts, getTransactionHistory } from "@/lib/actions"
import { AppHeader } from "@/components/app-header"

type SpendingCategory = {
  name: string
  amount: number
  percentage: number
  color: string
  trend: "up" | "down" | "stable"
  transactions: number
}

type MonthlyData = {
  month: string
  income: number
  expenses: number
  savings: number
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("30") // 30, 90, 365 days

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getUser()
        if (!userData) {
          redirect("/login")
          return
        }

        const userAccounts = await getUserAccounts(userData.id)
        const userTransactions = await getTransactionHistory(userData.id)

        setUser(userData)
        setAccounts(userAccounts)
        setTransactions(userTransactions)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-1 items-center justify-center pt-20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate analytics data
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  const filterDate = new Date()
  filterDate.setDate(filterDate.getDate() - parseInt(timeFilter))
  
  const filteredTransactions = transactions.filter(t => 
    new Date(t.createdAt) >= filterDate
  )

  const totalIncome = filteredTransactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses

  // Mock spending categories (in a real app, this would be calculated from transaction descriptions)
  const spendingCategories: SpendingCategory[] = [
    { name: "Food & Dining", amount: 1250, percentage: 35, color: "bg-red-500", trend: "up", transactions: 23 },
    { name: "Transportation", amount: 850, percentage: 24, color: "bg-blue-500", trend: "down", transactions: 12 },
    { name: "Shopping", amount: 620, percentage: 17, color: "bg-green-500", trend: "up", transactions: 8 },
    { name: "Entertainment", amount: 480, percentage: 13, color: "bg-yellow-500", trend: "stable", transactions: 15 },
    { name: "Utilities", amount: 380, percentage: 11, color: "bg-purple-500", trend: "stable", transactions: 4 },
  ]

  // Mock monthly data
  const monthlyData: MonthlyData[] = [
    { month: "Jan", income: 5200, expenses: 3800, savings: 1400 },
    { month: "Feb", income: 5200, expenses: 4200, savings: 1000 },
    { month: "Mar", income: 5500, expenses: 3900, savings: 1600 },
    { month: "Apr", income: 5200, expenses: 4100, savings: 1100 },
    { month: "May", income: 5800, expenses: 4300, savings: 1500 },
    { month: "Jun", income: 5200, expenses: 3650, savings: 1550 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="Financial Analytics" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Analytics</h1>
              <p className="text-muted-foreground">Insights into your spending and saving patterns</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <ArrowDownRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Income</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+8.5% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">+2.3% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Net Savings</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(netSavings)}</p>
                  <p className={`text-xs ${netSavings > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {netSavings > 0 ? "↗" : "↘"} {Math.abs((netSavings / totalIncome) * 100).toFixed(1)}% savings rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Spending Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending Breakdown</CardTitle>
                  <CardDescription>Your top spending categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spendingCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{category.name}</span>
                          <span className="text-muted-foreground">{formatCurrency(category.amount)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={category.percentage} className="flex-1" />
                          <span className="text-xs text-muted-foreground w-12">{category.percentage}%</span>
                          {category.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                          {category.trend === "down" && <TrendingDown className="h-3 w-3 text-green-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Comparison</CardTitle>
                  <CardDescription>Income vs Expenses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.slice(-3).map((month, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{month.month}</span>
                          <div className="text-right">
                            <p className="text-sm text-green-600 dark:text-green-400">+{formatCurrency(month.income)}</p>
                            <p className="text-sm text-red-600 dark:text-red-400">-{formatCurrency(month.expenses)}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress value={(month.income / 6000) * 100} className="h-2 bg-green-100 dark:bg-green-900/20" />
                          <Progress value={(month.expenses / 6000) * 100} className="h-2 bg-red-100 dark:bg-red-900/20" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Net: {formatCurrency(month.savings)} ({((month.savings / month.income) * 100).toFixed(1)}% saved)
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {spendingCategories.map((category, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <Badge variant={category.trend === "up" ? "destructive" : category.trend === "down" ? "default" : "secondary"}>
                        {category.trend === "up" && "↗ Rising"}
                        {category.trend === "down" && "↘ Falling"}
                        {category.trend === "stable" && "→ Stable"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-2xl font-bold text-foreground mb-1">{formatCurrency(category.amount)}</p>
                    <p className="text-sm text-muted-foreground">{category.transactions} transactions</p>
                    <div className="mt-4">
                      <Progress value={category.percentage} />
                      <p className="text-xs text-muted-foreground mt-1">{category.percentage}% of total spending</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
                <CardDescription>6-month financial performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyData.map((month, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{month.month} 2024</h4>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{formatCurrency(month.savings)} saved</p>
                          <p className="text-xs text-muted-foreground">{((month.savings / month.income) * 100).toFixed(1)}% rate</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Income</p>
                          <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(month.income)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expenses</p>
                          <p className="font-medium text-red-600 dark:text-red-400">{formatCurrency(month.expenses)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Savings</p>
                          <p className="font-medium text-primary">{formatCurrency(month.savings)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Goals</CardTitle>
                  <CardDescription>Track your financial objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-foreground">Emergency Fund</h4>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$7,500 of $10,000</span>
                      <span>$2,500 to go</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-foreground">Vacation Fund</h4>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$2,000 of $5,000</span>
                      <span>$3,000 to go</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-foreground">New Car</h4>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                    <Progress value={25} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$5,000 of $20,000</span>
                      <span>$15,000 to go</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Health Score</CardTitle>
                  <CardDescription>Overall assessment of your financial wellness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted-foreground opacity-20"/>
                        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="339.3" strokeDashoffset="67.86" strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">80</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Good</h3>
                    <p className="text-muted-foreground">Your financial health is looking strong!</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Savings Rate</span>
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-foreground">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Emergency Fund</span>
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-foreground">3 months</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Spending Control</span>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-foreground">Fair</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
