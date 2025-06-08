"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BiometricAuth } from '@/components/biometric/biometric-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function BiometricPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false)
  const [faceIdEnabled, setFaceIdEnabled] = useState(false)
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
        setUser(userData)
        // Load biometric settings from user preferences
        setBiometricEnabled(userData.biometricEnabled || false)
        setFingerprintEnabled(userData.fingerprintEnabled || false)
        setFaceIdEnabled(userData.faceIdEnabled || false)
      } catch (error) {
        console.error("Error loading user data:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  const handleBiometricSetup = () => {
    toast({
      title: "Biometric Setup Complete",
      description: "Your biometric authentication has been successfully configured.",
    })
    setBiometricEnabled(true)
  }

  const handleBiometricFailure = () => {
    toast({
      title: "Setup Failed",
      description: "Biometric authentication setup failed. Please try again.",
      variant: "destructive"
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="Biometric Security" />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer hover:text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Biometric Security</h1>
            <p className="text-muted-foreground">
              Secure your account with fingerprint and face recognition
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Biometric Authentication
              </CardTitle>
              <CardDescription>
                Use your fingerprint or face ID to securely access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Biometric Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow biometric authentication for faster, secure access
                  </p>
                </div>
                <Switch 
                  checked={biometricEnabled}
                  onCheckedChange={setBiometricEnabled}
                />
              </div>

              {biometricEnabled && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Fingerprint Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Use your fingerprint to authenticate
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fingerprintEnabled && <Badge variant="secondary">Active</Badge>}
                      <Switch 
                        checked={fingerprintEnabled}
                        onCheckedChange={setFingerprintEnabled}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Face ID Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Use facial recognition to authenticate
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {faceIdEnabled && <Badge variant="secondary">Active</Badge>}
                      <Switch 
                        checked={faceIdEnabled}
                        onCheckedChange={setFaceIdEnabled}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Biometric Authentication</CardTitle>
              <CardDescription>
                Try out your biometric authentication setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <BiometricAuth 
                  onAuthSuccess={handleBiometricSetup}
                  onAuthFailure={handleBiometricFailure}
                  authType="both"
                  title="Test Authentication"
                  description="Verify your biometric setup is working correctly"
                />
                {biometricEnabled && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Biometric authentication is active</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Biometric data is stored securely on your device and never shared with servers</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>You can disable biometric authentication at any time from these settings</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Always keep your traditional password as a backup authentication method</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
