"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/actions"
import { AppHeader } from "@/components/app-header"

export default function CreateAccountPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)
        const userData = await getUser()
        if (userData) {
          setUser(userData)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error loading user data", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader user={user} title="Create a New Account" />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Creation</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Account creation functionality will be restored shortly.</p>
            <Button onClick={() => router.push("/accounts")} className="mt-4">
              Back to Accounts
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
