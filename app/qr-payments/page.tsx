"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Scan, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { QRPaymentGenerator } from "@/components/qr-payment/qr-generator"
import { QRPaymentScanner } from "@/components/qr-payment/qr-scanner"
import { getUser, getUserAccounts, makeTransaction } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function QRPaymentPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getUser()
        if (!userData) {
          router.push("/login")
          return
        }

        const userAccounts = await getUserAccounts(userData.id)
        setUser(userData)
        setAccounts(userAccounts)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load account data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, toast])

  const handlePaymentScanned = async (paymentData: any) => {
    try {
      // Find the user's primary account (first checking account or any account)
      const primaryAccount = accounts.find(acc => acc.accountType === "Checking") || accounts[0]
      
      if (!primaryAccount) {
        toast({
          title: "No Account Available",
          description: "Please create an account first",
          variant: "destructive"
        })
        return
      }

      if (primaryAccount.balance < paymentData.amount) {
        toast({
          title: "Insufficient Funds",
          description: "Not enough balance for this payment",
          variant: "destructive"
        })
        return
      }

      // Process the payment
      const transaction = await makeTransaction(
        primaryAccount.id,
        "withdrawal",
        paymentData.amount,
        `QR Payment to ${paymentData.recipient} - ${paymentData.description || "Payment"}`
      )

      if (transaction.success) {
        toast({
          title: "Payment Successful",
          description: `$${paymentData.amount} sent to ${paymentData.recipient}`,
        })
        
        // Refresh accounts data
        const updatedAccounts = await getUserAccounts(user.id)
        setAccounts(updatedAccounts)
      } else {
        throw new Error(transaction.error || "Payment failed")
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast({
        title: "Payment Failed",
        description: "Could not process payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const primaryAccount = accounts.find(acc => acc.accountType === "Checking") || accounts[0]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="QR Payments" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">QR Code Payments</h1>
          <p className="text-muted-foreground">
            Send and receive payments instantly using QR codes
          </p>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-4 text-foreground">No Accounts Found</h2>
              <p className="text-muted-foreground mb-6">
                You need at least one account to use QR payments.
              </p>
              <Link href="/accounts/create">
                <Button>Create Account</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="flex items-center">
                <QrCode className="h-4 w-4 mr-2" />
                Request Payment
              </TabsTrigger>
              <TabsTrigger value="scan" className="flex items-center">
                <Scan className="h-4 w-4 mr-2" />
                Pay with QR
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {primaryAccount && (
                    <QRPaymentGenerator
                      accountId={primaryAccount.id}
                      accountNumber={primaryAccount.accountNumber}
                      accountType={primaryAccount.accountType}
                      userFullName={`${user.firstName} ${user.lastName}`}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">How it Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                          <span className="text-primary font-bold text-xs">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Enter Amount</h4>
                          <p className="text-muted-foreground">
                            Specify the amount you want to receive
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                          <span className="text-primary font-bold text-xs">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Generate QR</h4>
                          <p className="text-muted-foreground">
                            Create a secure QR code for the payment
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                          <span className="text-primary font-bold text-xs">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Share & Receive</h4>
                          <p className="text-muted-foreground">
                            Share the QR code and receive payment instantly
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Account Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {primaryAccount && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Type</span>
                            <span className="text-foreground font-medium">
                              {primaryAccount.accountType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Number</span>
                            <span className="text-foreground font-medium">
                              •••• {primaryAccount.accountNumber.slice(-4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Available Balance</span>
                            <span className="text-foreground font-medium">
                              ${primaryAccount.balance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scan">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <QRPaymentScanner
                    onPaymentScanned={handlePaymentScanned}
                    userAccounts={accounts}
                  />
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground">
                        <Smartphone className="h-5 w-5 mr-2" />
                        Quick Scan Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                        <p className="text-muted-foreground">
                          Ensure good lighting for best results
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                        <p className="text-muted-foreground">
                          Hold your device steady when scanning
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                        <p className="text-muted-foreground">
                          You can also upload an image of the QR code
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Payment Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {primaryAccount && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Default Account</span>
                            <span className="text-foreground font-medium">
                              {primaryAccount.accountType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Available Balance</span>
                            <span className="text-green-600 font-medium">
                              ${primaryAccount.balance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
