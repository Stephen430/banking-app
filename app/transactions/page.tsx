"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, PlusCircle, MinusCircle, CircleDollarSign, Clock, AlertCircle, CheckCircle, CreditCard, Landmark, ArrowRightLeft, InfoIcon, BarChart, TrendingUp, Shield } from "lucide-react"
import { getUserAccounts, makeTransaction, getUser } from "@/lib/actions"
import { AppHeader } from "@/components/app-header"

type Account = {
  id: string
  accountNumber: string
  accountType: string
  balance: number
  createdAt?: string
}

// Format currency values consistently
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date in a user-friendly way
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Generate a mock recent transaction history
function generateRecentTransactions(accountId: string): any[] {
  if (!accountId) return [];
  
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  
  return [
    {
      id: "recent1",
      accountId,
      type: "deposit",
      amount: 150.00,
      description: "Direct Deposit - Payroll",
      createdAt: new Date(now.getTime() - oneDay * 2).toISOString()
    },
    {
      id: "recent2",
      accountId,
      type: "withdrawal",
      amount: 45.99,
      description: "Online Purchase - Amazon",
      createdAt: new Date(now.getTime() - oneDay * 4).toISOString()
    },
    {
      id: "recent3",
      accountId,
      type: "withdrawal",
      amount: 80.00,
      description: "ATM Withdrawal",
      createdAt: new Date(now.getTime() - oneDay * 7).toISOString()
    }
  ];
}

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [transactionType, setTransactionType] = useState("deposit")
  const [amount, setAmount] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeStep, setActiveStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const searchParams = useSearchParams()
  const preselectedAccount = searchParams.get("account")

  useEffect(() => {
    async function loadData() {
      try {
        // Load user data
        const userData = await getUser()
        setUser(userData)
        
        // Load accounts
        const userAccounts = await getUserAccounts()
        setAccounts(userAccounts)
        if (preselectedAccount) {
          setSelectedAccount(preselectedAccount)
        }
      } catch (error) {
        setError("Failed to load data")
      }
    }
    loadData()
  }, [preselectedAccount])

  function validateForm(): { isValid: boolean; errorMessage: string } {
    if (!selectedAccount) {
      return { isValid: false, errorMessage: "Please select an account" };
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      return { isValid: false, errorMessage: "Please enter a valid amount" };
    }
    
    const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
    
    if (transactionType === "withdrawal" && selectedAcc && parseFloat(amount) > selectedAcc.balance) {
      return { isValid: false, errorMessage: "Insufficient funds for this withdrawal" };
    }
    
    return { isValid: true, errorMessage: "" };
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // Allow only numeric input with up to 2 decimal places
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  }

  function handleNextStep() {
    const { isValid, errorMessage } = validateForm();
    if (isValid) {
      setActiveStep(2);
      setShowConfirmation(true);
      setError("");
    } else {
      setError(errorMessage);
    }
  }

  function handlePreviousStep() {
    setActiveStep(1);
    setShowConfirmation(false);
  }

  async function handleConfirmTransaction() {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("accountId", selectedAccount);
    formData.append("transactionType", transactionType);
    formData.append("amount", amount);
    formData.append("description", description);

    try {
      const result = await makeTransaction(formData);
      if (result.success) {
        setSuccess("Transaction completed successfully!");
        setActiveStep(3);
        
        // Reload accounts to show updated balance
        const userAccounts = await getUserAccounts();
        setAccounts(userAccounts);
        
        // Clear form for potential next transaction
        setTimeout(() => {
          setAmount("");
          setDescription("");
          setShowConfirmation(false);
        }, 3000);
      } else {
        setError(result.error || "Transaction failed");
        setActiveStep(1);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setActiveStep(1);
    } finally {
      setIsLoading(false);
    }
  }
  
  function resetTransaction() {
    setActiveStep(1);
    setShowConfirmation(false);
    setSuccess("");
    setError("");
    setAmount("");
    setDescription("");
  }

  const selectedAccountData = accounts.find((acc) => acc.id === selectedAccount);
  const recentTransactions = generateRecentTransactions(selectedAccount);

  return (
    <div className="min-h-screen bg-background">
      {user && <AppHeader user={user} title="Money Transfer" />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Money Transfer</h1>
          </div>
          
          <Link href="/history">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              View Transaction History
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        {/* Transaction Status Indicator */}
        <div className="mb-8">
          <div className="w-full bg-secondary h-2 rounded-full mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                activeStep === 3 ? "bg-green-500 dark:bg-green-400 w-full" : 
                activeStep === 2 ? "bg-primary w-2/3" : "bg-primary w-1/3"
              }`}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <span>1</span>
              </div>
              <span className="text-xs mt-1 text-muted-foreground">Enter Details</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <span>2</span>
              </div>
              <span className="text-xs mt-1 text-muted-foreground">Confirm</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                activeStep >= 3 ? "bg-green-500 dark:bg-green-400 text-white" : "bg-muted text-muted-foreground"
              }`}>
                <span>3</span>
              </div>
              <span className="text-xs mt-1 text-muted-foreground">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Transaction Form Column */}
          <div className="lg:col-span-7">
            <Card className="shadow-lg border">
              <CardHeader className={`${
                activeStep === 3 ? "bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800" :
                showConfirmation ? "bg-accent border-b" : "border-b"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-foreground">
                      {activeStep === 3 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                      ) : showConfirmation ? (
                        <InfoIcon className="h-5 w-5 text-primary mr-2" />
                      ) : (
                        <ArrowRightLeft className="h-5 w-5 text-primary mr-2" />
                      )}
                      {activeStep === 3 ? "Transaction Complete" : 
                       showConfirmation ? "Confirm Transaction" : "Transaction Details"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {activeStep === 3 ? "Your transaction was processed successfully" :
                       showConfirmation ? "Please verify the transaction details before confirming" :
                       "Make a deposit or withdrawal from your account"}
                    </CardDescription>
                  </div>
                  {activeStep === 3 && (
                    <Badge className="bg-green-500 dark:bg-green-400">Completed</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {activeStep === 3 ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Transaction Successful!</h3>
                    <p className="text-muted-foreground mb-6 text-center">
                      Your {transactionType} of {formatCurrency(parseFloat(amount))} has been processed successfully.
                    </p>
                    <div className="bg-accent p-4 rounded-lg w-full mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Transaction Type</p>
                          <p className="font-medium text-foreground capitalize">{transactionType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className={`font-medium ${transactionType === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {transactionType === "deposit" ? "+" : "-"}{formatCurrency(parseFloat(amount))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Account</p>
                          <p className="font-medium text-foreground">{selectedAccountData?.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date & Time</p>
                          <p className="font-medium text-foreground">{formatDate(new Date().toISOString())}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={resetTransaction} variant="outline">New Transaction</Button>
                      <Link href="/history">
                        <Button>View All Transactions</Button>
                      </Link>
                    </div>
                  </div>
                ) : showConfirmation ? (
                  <div className="space-y-6">
                    <div className="bg-accent p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Transaction Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">From/To Account:</span>
                          <span className="font-medium text-foreground">{selectedAccountData?.accountType} - {selectedAccountData?.accountNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Transaction Type:</span>
                          <span className="font-medium capitalize flex items-center text-foreground">
                            {transactionType === "deposit" ? (
                              <><ArrowDown className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" /> Deposit</>
                            ) : (
                              <><ArrowUp className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" /> Withdrawal</>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className={`font-bold ${transactionType === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {formatCurrency(parseFloat(amount) || 0)}
                          </span>
                        </div>
                        {description && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Description:</span>
                            <span className="text-foreground">{description}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Current Balance:</span>
                          <span className="font-medium text-foreground">{formatCurrency(selectedAccountData?.balance || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Balance After Transaction:</span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(transactionType === "deposit" 
                              ? (selectedAccountData?.balance || 0) + parseFloat(amount || "0") 
                              : (selectedAccountData?.balance || 0) - parseFloat(amount || "0")
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h4>
                          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button 
                        onClick={handlePreviousStep} 
                        variant="outline"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleConfirmTransaction}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            Processing
                            <span className="ml-2 flex">
                              <span className="animate-bounce">.</span>
                              <span className="animate-bounce animate-delay-200">.</span>
                              <span className="animate-bounce animate-delay-400">.</span>
                            </span>
                          </span>
                        ) : (
                          "Confirm Transaction"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Tabs defaultValue="deposit" value={transactionType} onValueChange={(value) => setTransactionType(value as "deposit" | "withdrawal")}>
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="deposit" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-400">
                          <PlusCircle className="h-4 w-4 mr-2" /> Deposit
                        </TabsTrigger>
                        <TabsTrigger value="withdrawal" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 dark:data-[state=active]:bg-red-900/30 dark:data-[state=active]:text-red-400">
                          <MinusCircle className="h-4 w-4 mr-2" /> Withdrawal
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="deposit" className="mt-0">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6 border border-green-200 dark:border-green-800">
                          <h3 className="flex items-center text-sm font-medium text-green-800 dark:text-green-400 mb-2">
                            <InfoIcon className="h-4 w-4 mr-1" /> Deposit Information
                          </h3>
                          <p className="text-xs text-green-700 dark:text-green-300">Funds will be immediately available in your account.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="withdrawal" className="mt-0">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-6 border border-red-200 dark:border-red-800">
                          <h3 className="flex items-center text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                            <InfoIcon className="h-4 w-4 mr-1" /> Withdrawal Information
                          </h3>
                          <p className="text-xs text-red-700 dark:text-red-300">The amount cannot exceed your available balance.</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>Select Account</Label>
                        <div className="space-y-3">
                          {accounts.map((account) => (
                            <div
                              key={account.id}
                              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedAccount === account.id
                                  ? 'border-primary bg-primary/5 shadow-md'
                                  : 'border-border hover:border-primary/50 bg-card'
                              }`}
                              onClick={() => setSelectedAccount(account.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    account.accountType === "Checking" 
                                      ? "bg-primary/10" 
                                      : "bg-green-100 dark:bg-green-900/20"
                                  }`}>
                                    {account.accountType === "Checking" ? (
                                      <CreditCard className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Landmark className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-foreground">{account.accountType} Account</h3>
                                    <p className="text-sm text-muted-foreground">Account: •••• {account.accountNumber.slice(-4)}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Opened: {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-foreground">{formatCurrency(account.balance)}</p>
                                  <p className="text-xs text-muted-foreground">Available Balance</p>
                                  {transactionType === "withdrawal" && (
                                    <div className="mt-1">
                                      {account.balance < 100 ? (
                                        <Badge variant="destructive" className="text-xs">Low Balance</Badge>
                                      ) : account.balance < 500 ? (
                                        <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">Limited</Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">Available</Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Selection indicator */}
                              {selectedAccount === account.id && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              
                              {/* Account features */}
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex space-x-4">
                                    <span className="flex items-center text-muted-foreground">
                                      <Shield className="h-3 w-3 mr-1" />
                                      FDIC Insured
                                    </span>
                                    {account.accountType === "Checking" && (
                                      <span className="flex items-center text-muted-foreground">
                                        <CreditCard className="h-3 w-3 mr-1" />
                                        Debit Card
                                      </span>
                                    )}
                                    {account.accountType === "Savings" && (
                                      <span className="flex items-center text-green-600 dark:text-green-400">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        2.5% APY
                                      </span>
                                    )}
                                  </div>
                                  {transactionType === "withdrawal" && account.balance < parseFloat(amount || "0") && amount && (
                                    <span className="text-red-600 dark:text-red-400 font-medium">
                                      Insufficient Funds
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {accounts.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground mb-2">No accounts available</p>
                            <Link href="/accounts/create">
                              <Button variant="outline" size="sm">
                                Create New Account
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="amount">Amount</Label>
                          {selectedAccountData && transactionType === "withdrawal" && (
                            <span className="text-xs text-primary">Available: {formatCurrency(selectedAccountData.balance)}</span>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={handleAmountChange}
                            className="pl-7 bg-background"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        
                        {selectedAccountData && amount && (
                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground mb-1">Transaction Preview</p>
                            <div className="bg-accent p-2 rounded flex justify-between items-center">
                              <span className="text-sm text-foreground">New Balance:</span>
                              <span className="font-medium text-foreground">
                                {formatCurrency(transactionType === "deposit" 
                                  ? (selectedAccountData.balance || 0) + parseFloat(amount || "0") 
                                  : (selectedAccountData.balance || 0) - parseFloat(amount || "0")
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input 
                          id="description" 
                          name="description" 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Transaction description" 
                          className="bg-background"
                        />
                      </div>

                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start border border-red-200 dark:border-red-800">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h4>
                            <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={handleNextStep} 
                        className="w-full mt-4"
                        disabled={!selectedAccount || !amount || parseFloat(amount) <= 0}
                      >
                        Continue to Review
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Info & Recent Transactions Column */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {selectedAccountData ? (
                <Card className="border shadow-lg overflow-hidden">
                  <CardHeader className={`${
                    selectedAccountData.accountType === "Checking" ? "bg-primary/10" : "bg-green-50 dark:bg-green-900/20"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          selectedAccountData.accountType === "Checking" ? "bg-primary/20" : "bg-green-100 dark:bg-green-900/30"
                        }`}>
                          {selectedAccountData.accountType === "Checking" ? (
                            <CreditCard className="h-5 w-5 text-primary" />
                          ) : (
                            <Landmark className="h-5 w-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{selectedAccountData.accountType} Account</CardTitle>
                          <CardDescription className="text-muted-foreground">{selectedAccountData.accountNumber}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        selectedAccountData.accountType === "Checking" ? "border-primary/20 text-primary" : "border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                      }>
                        {selectedAccountData.accountType}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                      <p className="text-3xl font-bold text-foreground">{formatCurrency(selectedAccountData.balance)}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Account Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-accent p-3 rounded">
                          <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                          <p className="font-medium text-foreground">{selectedAccountData.accountType}</p>
                        </div>
                        <div className="bg-accent p-3 rounded">
                          <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                          <p className="font-medium text-foreground">{selectedAccountData.accountNumber}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-sm font-medium flex items-center mb-2 text-foreground">
                          <BarChart className="h-4 w-4 mr-1" /> Recent Activity
                        </h3>
                        {recentTransactions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No recent transactions</p>
                        ) : (
                          <div className="space-y-3">
                            {recentTransactions.map((transaction) => (
                              <div key={transaction.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                                <div className="flex items-center">
                                  <div className={`p-1.5 rounded-full mr-3 ${
                                    transaction.type === "deposit" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                                  }`}>
                                    {transaction.type === "deposit" ? (
                                      <ArrowDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <ArrowUp className="h-3 w-3 text-red-600 dark:text-red-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                                  </div>
                                </div>
                                <div className={`font-medium text-sm ${
                                  transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                }`}>
                                  {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 text-center">
                          <Link href="/history">
                            <Button variant="outline" size="sm">View All Transactions</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Select an account to view details</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="bg-accent p-8 rounded-lg mb-6">
                      <CircleDollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2 text-foreground">No Account Selected</h3>
                      <p className="text-muted-foreground mb-4">Please select an account to view its details and make transactions.</p>
                    </div>
                    <div className="space-y-2">
                      {accounts.length === 0 ? (
                        <Link href="/accounts/create">
                          <Button>Create Your First Account</Button>
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground">You have {accounts.length} account{accounts.length !== 1 ? 's' : ''} available for transactions</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-1.5 rounded-full mr-3">
                      <ArrowDown className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Deposits</h3>
                      <p className="text-xs text-muted-foreground">Funds are available immediately in your account.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-1.5 rounded-full mr-3">
                      <ArrowUp className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Withdrawals</h3>
                      <p className="text-xs text-muted-foreground">You cannot withdraw more than your available balance.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-1.5 rounded-full mr-3">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Transaction History</h3>
                      <p className="text-xs text-muted-foreground">All transactions are recorded and can be viewed in your history page.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
