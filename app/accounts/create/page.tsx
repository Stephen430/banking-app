"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Landmark, ShieldCheck, Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { createAccount, getUser } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AppHeader } from "@/components/app-header"

type Feature = {
  title: string;
  description: string;
};

type AccountType = "Checking" | "Savings";

const accountFeatures: Record<AccountType, Feature[]> = {
  Checking: [
    { title: "No Minimum Balance", description: "Maintain your account with no minimum balance requirements" },
    { title: "Free Debit Card", description: "Get a free debit card for everyday purchases" },
    { title: "Online Banking", description: "24/7 access to your account through our secure online portal" },
    { title: "Mobile Deposits", description: "Deposit checks from anywhere using our mobile app" }
  ],
  Savings: [
    { title: "High Interest Rate", description: "Earn more on your savings with our competitive interest rates" },
    { title: "Automatic Transfers", description: "Set up recurring transfers from your checking account" },
    { title: "Goal Setting", description: "Create and track savings goals for specific purposes" },
    { title: "FDIC Insured", description: "Your deposits are insured up to $250,000" }
  ]
};

const accountComparison: Record<AccountType, {
  monthlyFee: string;
  minimumBalance: string;
  atm: string;
  transfers: string;
  interestRate: string;
  bestFor: string;
}> = {
  Checking: {
    monthlyFee: "$0",
    minimumBalance: "$0",
    atm: "Free at in-network ATMs",
    transfers: "Unlimited",
    interestRate: "0.01%",
    bestFor: "Everyday transactions and bill payments"
  },
  Savings: {
    monthlyFee: "$0 with $500 balance",
    minimumBalance: "$500 to avoid fees",
    atm: "Limited access",
    transfers: "6 per month",
    interestRate: "1.25%",
    bestFor: "Building emergency funds and saving for goals"
  }
};

function CreateAccountPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);
        const userData = await getUser();
        if (userData) {
          setUser(userData);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error loading user data", error);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountType) {
      setError("Please select an account type");
      return;
    }
    
    if (!initialDeposit || parseFloat(initialDeposit) <= 0) {
      setError("Please enter a valid initial deposit amount");
      return;
    }
    
    if (accountType === "Savings" && parseFloat(initialDeposit) < 500) {
      setError("Savings accounts require a minimum initial deposit of $500");
      return;
    }
    
    if (accountType === "Checking" && parseFloat(initialDeposit) < 25) {
      setError("Checking accounts require a minimum initial deposit of $25");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      
      const formData = new FormData();
      formData.append("accountType", accountType);
      formData.append("initialDeposit", initialDeposit);
      
      const result = await createAccount(formData);
      
      if (result?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/accounts");
        }, 2000);
      } else {
        setError(result?.error || "Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Setting up account creation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader user={user} title="Create a New Account" />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {success ? (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-foreground">Account Created Successfully!</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Your new {accountType} account has been created with an initial deposit of ${parseFloat(initialDeposit).toFixed(2)}.
                  </CardDescription>
                  <Button onClick={() => router.push("/accounts")} className="mt-2">
                    Go to My Accounts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="choose" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="choose">1. Choose Account Type</TabsTrigger>
                <TabsTrigger value="create" disabled={!accountType}>2. Complete Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="choose" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Your Account Type</CardTitle>
                    <CardDescription>
                      Select the type of account that best fits your financial needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card className={`border-2 cursor-pointer transition-all ${accountType === "Checking" ? "border-primary bg-primary/5" : "hover:border-primary/50 bg-card"}`} 
                          onClick={() => setAccountType("Checking")}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="rounded-full bg-primary/10 p-2 mr-2">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            {accountType === "Checking" && (
                              <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl mt-2 text-foreground">Checking Account</CardTitle>
                          <CardDescription>Perfect for everyday transactions and bill payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {accountFeatures.Checking.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <ShieldCheck className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-medium text-foreground">{feature.title}:</span> <span className="text-muted-foreground">{feature.description}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className={`border-2 cursor-pointer transition-all ${accountType === "Savings" ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20" : "hover:border-green-200 dark:hover:border-green-800 bg-card"}`} 
                          onClick={() => setAccountType("Savings")}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2 mr-2">
                              <Landmark className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            {accountType === "Savings" && (
                              <Badge className="bg-green-500 dark:bg-green-600 text-white">Selected</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl mt-2 text-foreground">Savings Account</CardTitle>
                          <CardDescription>Great for building your savings and earning interest</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {accountFeatures.Savings.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0 mt-0.5" />                                <div>
                                  <span className="font-medium text-foreground">{feature.title}:</span> <span className="text-muted-foreground">{feature.description}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-3">Account Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-3 text-left font-medium">Feature</th>
                              <th className="p-3 text-left font-medium">Checking</th>
                              <th className="p-3 text-left font-medium">Savings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(accountComparison.Checking).map((key) => (
                              <tr key={key} className="border-b">
                                <td className="p-3 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                <td className="p-3">{accountComparison.Checking[key as keyof typeof accountComparison.Checking]}</td>
                                <td className="p-3">{accountComparison.Savings[key as keyof typeof accountComparison.Savings]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Select an account type to continue
                    </div>
                    <Button 
                      onClick={() => {
                        const tabsEl = document.querySelector('[data-state="active"][role="tabpanel"]')?.parentElement;
                        if (tabsEl) {
                          const tabsList = tabsEl.querySelector('[role="tablist"]');
                          const secondTab = tabsList?.querySelector('[role="tab"]:nth-child(2)');
                          if (secondTab instanceof HTMLElement) {
                            secondTab.click();
                          }
                        }
                      }}
                      disabled={!accountType}
                    >
                      Continue Setup
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Your {accountType} Account Setup</CardTitle>
                    <CardDescription>
                      Provide your initial deposit to complete the account creation process
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5">
                      {error && (
                        <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-800 border border-red-100">
                          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                          <p>{error}</p>
                        </div>
                      )}

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="initial-deposit">Initial Deposit (minimum $25)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="initial-deposit"
                              value={initialDeposit}
                              onChange={(e) => setInitialDeposit(e.target.value.replace(/[^0-9.]/g, ''))}
                              className="pl-7"
                              placeholder="0.00"
                              type="text"
                              inputMode="decimal"
                              min={accountType === "Savings" ? "500" : "25"}
                              required
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {accountType === "Savings" && "A minimum balance of $500 is required for Savings accounts."}
                            {accountType === "Checking" && "A minimum initial deposit of $25 is required for Checking accounts."}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Separator className="my-4" />
                        <div className="rounded-lg bg-muted p-4">
                          <div className="font-medium">Account Benefits Summary</div>
                          <ul className="mt-2 space-y-2">
                            {accountType !== "" && accountFeatures[accountType as AccountType]?.slice(0, 2).map((feature, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                                {feature.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          const tabsEl = document.querySelector('[data-state="active"][role="tabpanel"]')?.parentElement;
                          if (tabsEl) {
                            const tabsList = tabsEl.querySelector('[role="tablist"]');
                            const firstTab = tabsList?.querySelector('[role="tab"]:first-child');
                            if (firstTab instanceof HTMLElement) {
                              firstTab.click();
                            }
                          }
                        }}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={
                          isSubmitting || 
                          !accountType || 
                          !initialDeposit || 
                          parseFloat(initialDeposit) <= 0 ||
                          (accountType === "Savings" && parseFloat(initialDeposit) < 500) ||
                          (accountType === "Checking" && parseFloat(initialDeposit) < 25)
                        }
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreateAccountPage;
