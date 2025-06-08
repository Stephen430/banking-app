"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import NotificationsCenter from '@/components/notifications/notifications-center';
import { getUser } from "@/lib/actions"

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
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
      } catch (error) {
        console.error("Error loading user data:", error)
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
      <AppHeader user={user} title="Notifications Center" />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer hover:text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Notifications Center</h1>
            <p className="text-muted-foreground">
              Stay updated with real-time alerts and important account activities
            </p>
          </div>
        </div>
        <NotificationsCenter />
      </div>
    </div>
  );
}
