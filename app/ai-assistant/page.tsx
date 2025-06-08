"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { FinancialChatbot } from '@/components/ai-chatbot/financial-chatbot';
import { getUser, getUserAccounts, getTransactionHistory } from "@/lib/actions"

export default function AIAssistantPage() {
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
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
        
        const userAccounts = await getUserAccounts(userData.id)
        const userTransactions = await getTransactionHistory(userData.id)
        
        setUser(userData)
        setAccounts(userAccounts)
        setTransactions(userTransactions)
      } catch (error) {
        console.error("Error loading data:", error)
        router.push("/login")
      } finally {
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
  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="AI Financial Assistant" />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer hover:text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">AI Financial Assistant</h1>
            <p className="text-muted-foreground">
              Get personalized financial insights and expert advice powered by AI
            </p>
          </div>
        </div>        <FinancialChatbot 
          userAccounts={accounts}
          recentTransactions={transactions}
          userName={`${user.firstName} ${user.lastName}`}
        />
      </div>
    </div>
  );
}
