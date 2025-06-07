"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/actions"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { 
  Shield, Lock, Unlock, LockKeyhole, Smartphone, 
  CheckCircle2, AlertTriangle, Info, ChevronRight, 
  Fingerprint, KeyRound, History, Eye, EyeOff, LogOut,
  CircleCheck, CircleAlert, ArrowRight, Bell, Mail,
  ShieldCheck, ShieldAlert, ShieldQuestion, Laptop
} from "lucide-react"

export default function SecurityPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [securityScore, setSecurityScore] = useState(0)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
    transactionAlerts: true,
    deviceManagement: true,
    biometricLogin: false,
    passwordStrength: "medium", // low, medium, high
    lastPasswordChange: "2025-02-15",
  })
  
  // Login history (example data)
  const loginHistory = [
    { 
      device: "Windows PC",
      browser: "Chrome",
      location: "New York, USA",
      ip: "192.168.1.xx",
      dateTime: "May 30, 2025 - 10:35 AM",
      status: "success",
      current: true
    },
    { 
      device: "iPhone 15",
      browser: "Safari",
      location: "New York, USA",
      ip: "192.168.1.xx",
      dateTime: "May 29, 2025 - 8:22 PM",
      status: "success",
      current: false
    },
    { 
      device: "MacBook Air",
      browser: "Firefox",
      location: "Boston, USA",
      ip: "172.16.254.xx",
      dateTime: "May 28, 2025 - 3:45 PM",
      status: "success",
      current: false
    },
    { 
      device: "Unknown Device",
      browser: "Chrome",
      location: "Seattle, USA",
      ip: "10.0.0.xx",
      dateTime: "May 27, 2025 - 11:17 AM",
      status: "failed",
      current: false
    },
  ]
  
  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)
        const userData = await getUser()
        
        if (!userData) {
          router.push("/login")
          return
        }
        
        setUser(userData)
        calculateSecurityScore()
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [router])
  
  const calculateSecurityScore = () => {
    // Calculate security score based on security settings
    let score = 0
    
    // Base score
    score += 40
    
    // Add points for various security measures
    if (securitySettings.twoFactorAuth) score += 20
    if (securitySettings.loginNotifications) score += 10
    if (securitySettings.transactionAlerts) score += 10
    if (securitySettings.deviceManagement) score += 5
    if (securitySettings.biometricLogin) score += 5
    
    // Add points based on password strength
    if (securitySettings.passwordStrength === "high") {
      score += 10
    } else if (securitySettings.passwordStrength === "medium") {
      score += 5
    }
    
    // Limit score to 100
    score = Math.min(score, 100)
    
    setSecurityScore(score)
  }
  
  // Example function for password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    })
    
    // Update last password change date
    setSecuritySettings({
      ...securitySettings,
      lastPasswordChange: new Date().toISOString().split('T')[0],
      passwordStrength: "high"
    })
    
    setTimeout(() => {
      calculateSecurityScore()
    }, 500)
  }
  
  // Toggle 2FA
  const handleToggle2FA = (checked: boolean) => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorAuth: checked
    })
    
    if (checked) {
      toast({
        title: "Two-Factor Authentication Enabled",
        description: "Your account is now more secure.",
      })
    } else {
      toast({
        title: "Two-Factor Authentication Disabled",
        description: "Your account security has been reduced.",
        variant: "destructive"
      })
    }
    
    setTimeout(() => {
      calculateSecurityScore()
    }, 500)
  }
  
  // Toggle other security settings
  const handleToggleSetting = (setting: string, checked: boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: checked
    })
    
    toast({
      title: "Setting Updated",
      description: `Your security preferences have been saved.`,
    })
    
    setTimeout(() => {
      calculateSecurityScore()
    }, 500)
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null
  }
  
  const getScoreColor = () => {
    if (securityScore >= 80) return "text-green-600"
    if (securityScore >= 60) return "text-amber-500"
    return "text-red-600"
  }
  
  const getScoreText = () => {
    if (securityScore >= 80) return "Excellent"
    if (securityScore >= 60) return "Good"
    return "Needs Improvement"
  }
  
  const getLastPasswordChangeText = () => {
    const lastChange = new Date(securitySettings.lastPasswordChange)
    const today = new Date()
    const diffTime = today.getTime() - lastChange.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 90) {
      return {
        text: `${diffDays} days ago (We recommend changing your password every 90 days)`,
        alert: true
      }
    }
    
    return {
      text: `${diffDays} days ago`,
      alert: false
    }
  }
  
  const passwordChangeInfo = getLastPasswordChangeText()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">      <AppHeader user={user} title="Security Center" />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground hover:text-foreground flex items-center group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-12">
          {/* Security Overview */}
          <Card className="col-span-12 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Security Center</h1>
                    <p className="text-blue-100">Protect your account with advanced security features</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Security Score</p>
                    <p className={`text-2xl font-bold`}>{securityScore}/100</p>
                  </div>
                  
                  <div className="h-16 w-16 relative">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" 
                              className="stroke-blue-200/50" 
                              strokeWidth="3" />
                              
                      <circle cx="18" cy="18" r="16" fill="none" 
                              className={`${securityScore >= 80 ? 'stroke-green-400' : securityScore >= 60 ? 'stroke-amber-400' : 'stroke-red-400'}`}
                              strokeWidth="3" 
                              strokeDasharray={`${securityScore} 100`} />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {securityScore >= 80 ? (
                        <ShieldCheck className="h-7 w-7 text-green-400" />
                      ) : securityScore >= 60 ? (
                        <ShieldQuestion className="h-7 w-7 text-amber-400" />
                      ) : (
                        <ShieldAlert className="h-7 w-7 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="py-6">
              <div className="grid gap-6 md:grid-cols-3">
                <SecurityStatusCard 
                  title="Account Protection" 
                  status={securitySettings.twoFactorAuth ? "PROTECTED" : "AT RISK"}
                  icon={securitySettings.twoFactorAuth ? CheckCircle2 : AlertTriangle}
                  iconColor={securitySettings.twoFactorAuth ? "text-green-600" : "text-amber-500"}
                  bgColor={securitySettings.twoFactorAuth ? "bg-green-50" : "bg-amber-50"}
                  description={securitySettings.twoFactorAuth ? 
                    "Two-factor authentication is enabled" : 
                    "Enable two-factor authentication to protect your account"}
                  action={securitySettings.twoFactorAuth ? "Manage" : "Enable Now"}
                  onClick={() => {}}
                />
                
                <SecurityStatusCard 
                  title="Password Strength" 
                  status={securitySettings.passwordStrength.toUpperCase()}
                  icon={securitySettings.passwordStrength === "high" ? CheckCircle2 : Info}
                  iconColor={securitySettings.passwordStrength === "high" ? "text-green-600" : 
                             securitySettings.passwordStrength === "medium" ? "text-amber-500" : "text-red-500"}
                  bgColor={securitySettings.passwordStrength === "high" ? "bg-green-50" : 
                           securitySettings.passwordStrength === "medium" ? "bg-amber-50" : "bg-red-50"}
                  description={securitySettings.passwordStrength === "high" ? 
                    "Your password is strong and secure" : 
                    "Consider updating to a stronger password"}
                  action="Change Password"
                  onClick={() => {}}
                />
                
                <SecurityStatusCard 
                  title="Login Alerts" 
                  status={securitySettings.loginNotifications ? "ENABLED" : "DISABLED"}
                  icon={securitySettings.loginNotifications ? Bell : AlertTriangle}
                  iconColor={securitySettings.loginNotifications ? "text-green-600" : "text-amber-500"}
                  bgColor={securitySettings.loginNotifications ? "bg-green-50" : "bg-amber-50"}
                  description={securitySettings.loginNotifications ? 
                    "You'll be notified of any login attempts" : 
                    "Enable notifications for suspicious logins"}
                  action={securitySettings.loginNotifications ? "Configure" : "Enable"}
                  onClick={() => {}}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            <Tabs defaultValue="twoFactor" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="twoFactor">
                  <Smartphone className="h-4 w-4 mr-2 md:mr-3" />
                  <span className="hidden md:inline">Two-Factor</span>
                  <span className="md:hidden">2FA</span>
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Lock className="h-4 w-4 mr-2 md:mr-3" />
                  <span className="hidden md:inline">Password</span>
                  <span className="md:hidden">Pass</span>
                </TabsTrigger>
                <TabsTrigger value="devices">
                  <Laptop className="h-4 w-4 mr-2 md:mr-3" />
                  <span className="hidden md:inline">Devices</span>
                  <span className="md:hidden">Devices</span>
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2 md:mr-3" />
                  <span className="hidden md:inline">Login History</span>
                  <span className="md:hidden">History</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Two-Factor Authentication Tab */}
              <TabsContent value="twoFactor">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                      Add an extra layer of security to protect your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center py-4 px-6 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className={`rounded-full p-2 ${securitySettings.twoFactorAuth ? 'bg-green-100' : 'bg-gray-200'}`}>
                          {securitySettings.twoFactorAuth ? (
                            <LockKeyhole className="h-5 w-5 text-green-600" />
                          ) : (
                            <Unlock className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">
                            {securitySettings.twoFactorAuth 
                              ? "Your account is protected with 2FA" 
                              : "Enable 2FA for additional protection"}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={securitySettings.twoFactorAuth} 
                        onCheckedChange={handleToggle2FA}
                      />
                    </div>
                    
                    {securitySettings.twoFactorAuth ? (
                      <div className="space-y-6">
                        <div className="rounded-md border p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-full p-1.5">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                Two-Factor Authentication is Active
                              </h4>
                              <p className="text-sm text-gray-500">
                                Your account has an additional layer of security
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Verification Method</h4>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="border rounded-lg p-4 flex flex-col">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 rounded-full p-1.5">
                                    <Smartphone className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <span className="font-medium">Authenticator App</span>
                                </div>
                                <div className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-600 bg-white">
                                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-4">
                                Use an authenticator app to generate verification codes
                              </p>
                            </div>
                            
                            <div className="border rounded-lg border-dashed p-4 flex flex-col">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="bg-gray-100 rounded-full p-1.5">
                                    <Mail className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <span className="font-medium text-gray-600">Email Verification</span>
                                </div>
                                <div className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-400">
                                  <div className="h-2 w-2 rounded-full bg-transparent"></div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-4">
                                Get verification codes sent to your email address
                              </p>
                              <Button variant="outline" className="mt-4" size="sm">
                                Set Up
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Backup Codes</h4>
                            <Button variant="outline" size="sm">
                              Generate New Codes
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Backup codes are used when you don't have access to your two-factor authentication device
                          </p>
                          <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                              {Array(5).fill(0).map((_, i) => (
                                <div key={i} className="bg-gray-200 p-2 rounded text-center font-mono text-gray-700 text-sm">
                                  •••••••••
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-3">
                              These are one-time use codes for account recovery
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (                      <div className="space-y-6">
                        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Your account is at risk</AlertTitle>
                          <AlertDescription>
                            Without two-factor authentication, your account is vulnerable to unauthorized access.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-4">
                          <h3 className="font-medium">Benefits of Two-Factor Authentication</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                              <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium mb-1 text-blue-800">Enhanced Security</h4>
                                <p className="text-sm text-blue-700">Prevents unauthorized access even if your password is compromised</p>
                              </div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
                              <Fingerprint className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium mb-1 text-green-800">Identity Verification</h4>
                                <p className="text-sm text-green-700">Adds an extra step to verify it's really you logging in</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center pt-4">
                          <Button onClick={() => handleToggle2FA(true)}>
                            Enable Two-Factor Authentication
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            You'll need an authenticator app like Google Authenticator or Authy
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Password Management Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Password Management
                    </CardTitle>
                    <CardDescription>
                      Update and manage your account password
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Password Last Changed</h4>
                        <p className={`text-sm ${passwordChangeInfo.alert ? 'text-amber-600' : 'text-gray-600'}`}>
                          {passwordChangeInfo.text}
                        </p>
                      </div>
                      {passwordChangeInfo.alert && (
                        <div className="flex items-center text-amber-600 text-sm font-medium">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Update Recommended
                        </div>
                      )}
                    </div>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Change Your Password</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter your current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements</h4>
                        <ul className="space-y-1">
                          <PasswordRequirement text="Minimum 8 characters" met={true} />
                          <PasswordRequirement text="At least one uppercase letter" met={true} />
                          <PasswordRequirement text="At least one lowercase letter" met={true} />
                          <PasswordRequirement text="At least one number" met={true} />
                          <PasswordRequirement text="At least one special character" met={false} />
                        </ul>
                      </div>
                      
                      <Button type="submit">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Device Management Tab */}
              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Laptop className="h-5 w-5" />
                      Device Management
                    </CardTitle>
                    <CardDescription>
                      Manage devices that have access to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h4 className="font-medium">Device Management</h4>
                        <p className="text-sm text-gray-500">
                          Keep track of where you're signed in
                        </p>
                      </div>
                      <Switch 
                        checked={securitySettings.deviceManagement} 
                        onCheckedChange={(checked) => 
                          handleToggleSetting("deviceManagement", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Currently Active Devices</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-100">
                          <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-green-100 p-2">
                              <Laptop className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">Windows PC (Current Device)</p>
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  Active
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                                <span>Chrome Browser</span>
                                <span className="hidden sm:inline">•</span>
                                <span>New York, USA</span>
                                <span className="hidden sm:inline">•</span>
                                <span>IP: 192.168.1.xx</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="shrink-0">
                            This Device
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-gray-100 p-2">
                              <Smartphone className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">iPhone 15</p>
                              <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                                <span>iOS App</span>
                                <span className="hidden sm:inline">•</span>
                                <span>New York, USA</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Last active: 1 day ago</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0">
                            Sign Out
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-gray-100 p-2">
                              <Laptop className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">MacBook Air</p>
                              <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-2">
                                <span>Firefox Browser</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Boston, USA</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Last active: 2 days ago</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0">
                            Sign Out
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" size="sm">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out All Other Devices
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Login Notifications</h4>
                        <Switch 
                          checked={securitySettings.loginNotifications} 
                          onCheckedChange={(checked) => 
                            handleToggleSetting("loginNotifications", checked)
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Get notified when someone logs into your account from a new device or location
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Biometric Login</h4>
                        <Switch 
                          checked={securitySettings.biometricLogin} 
                          onCheckedChange={(checked) => 
                            handleToggleSetting("biometricLogin", checked)
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Use your fingerprint or face recognition for faster and more secure login
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Login History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Login Activity
                    </CardTitle>
                    <CardDescription>
                      Review your recent account access history
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-md border">
                      <div className="bg-gray-50 px-6 py-3">
                        <div className="grid grid-cols-12 text-sm font-medium text-gray-600">
                          <div className="col-span-5 md:col-span-3">Time</div>
                          <div className="col-span-4 md:col-span-3">Device</div>
                          <div className="hidden md:block md:col-span-3">Location</div>
                          <div className="col-span-3 md:col-span-3 text-right">Status</div>
                        </div>
                      </div>
                      <div className="divide-y">
                        {loginHistory.map((login, index) => (
                          <div 
                            key={index} 
                            className={`px-6 py-4 ${login.current ? 'bg-blue-50' : login.status === 'failed' ? 'bg-red-50' : ''}`}
                          >
                            <div className="grid grid-cols-12 gap-1">
                              <div className="col-span-5 md:col-span-3">
                                <p className="font-medium">{login.dateTime.split(" - ")[0]}</p>
                                <p className="text-xs text-gray-500">{login.dateTime.split(" - ")[1]}</p>
                              </div>
                              <div className="col-span-4 md:col-span-3">
                                <p className="font-medium">{login.device}</p>
                                <p className="text-xs text-gray-500">{login.browser}</p>
                              </div>
                              <div className="hidden md:block md:col-span-3">
                                <p className="font-medium">{login.location}</p>
                                <p className="text-xs text-gray-500">IP: {login.ip}</p>
                              </div>
                              <div className="col-span-3 md:col-span-3 text-right">
                                {login.status === 'success' ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CircleCheck className="mr-1 h-3 w-3" />
                                    Success
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <CircleAlert className="mr-1 h-3 w-3" />
                                    Failed
                                  </span>
                                )}
                                {login.current && (
                                  <p className="text-xs text-blue-600 mt-1">Current Session</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Full History
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4 space-y-6">
            <Card>
              <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Security Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <SecurityRecommendation 
                    title="Enable Two-Factor Authentication" 
                    description="Add an extra layer of security to your account"
                    status={securitySettings.twoFactorAuth ? "complete" : "pending"}
                    onClick={() => {}}
                  />
                  
                  <SecurityRecommendation 
                    title="Use a Strong Password" 
                    description="Create a unique, complex password"
                    status={securitySettings.passwordStrength === "high" ? "complete" : "pending"}
                    onClick={() => {}}
                  />
                  
                  <SecurityRecommendation 
                    title="Set Up Login Alerts" 
                    description="Get notified of suspicious login attempts"
                    status={securitySettings.loginNotifications ? "complete" : "pending"}
                    onClick={() => {}}
                  />
                  
                  <SecurityRecommendation 
                    title="Verify Recovery Options" 
                    description="Keep your recovery methods up to date"
                    status="pending"
                    onClick={() => {}}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Important Security Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="rounded-full bg-blue-100 p-1.5 h-min">
                    <KeyRound className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Use Unique Passwords</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Don't reuse passwords across different websites or services
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="rounded-full bg-amber-100 p-1.5 h-min">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Watch for Phishing Attempts</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Be cautious of emails or messages asking for your account information
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="rounded-full bg-green-100 p-1.5 h-min">
                    <Smartphone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Keep Your Devices Secure</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Always lock your devices and keep software updated
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Need Help?</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">
                  If you notice any suspicious activity on your account, contact our security team immediately.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Contact Support
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper Components
function SecurityStatusCard({ 
  title, 
  status, 
  icon: Icon, 
  iconColor, 
  bgColor,
  description, 
  action, 
  onClick 
}: { 
  title: string; 
  status: string; 
  icon: any; 
  iconColor: string;
  bgColor: string;
  description: string; 
  action: string; 
  onClick: () => void 
}) {
  return (
    <div className={`rounded-lg p-4 ${bgColor} border`}>
      <div className="flex justify-between items-start">
        <div className={`rounded-full p-2 ${iconColor.replace('text', 'bg')}/20`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className={`text-xs font-medium ${iconColor} px-2 py-0.5 rounded-full ${iconColor.replace('text', 'bg')}/20`}>
          {status}
        </div>
      </div>
      <h4 className="font-medium text-gray-900 mt-3">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">
        {description}
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4 w-full"
        onClick={onClick}
      >
        {action}
      </Button>
    </div>
  )
}

function PasswordRequirement({ text, met }: { text: string; met: boolean }) {
  return (
    <li className="flex items-center text-sm">
      {met ? (
        <CircleCheck className="h-4 w-4 text-green-600 mr-2 shrink-0" />
      ) : (
        <CircleAlert className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
      )}
      <span className={met ? "text-green-700" : "text-amber-700"}>
        {text}
      </span>
    </li>
  )
}

function SecurityRecommendation({ 
  title, 
  description, 
  status, 
  onClick 
}: { 
  title: string; 
  description: string; 
  status: "complete" | "pending" | "attention"; 
  onClick: () => void 
}) {
  return (
    <div className="p-4 hover:bg-gray-50 cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === "complete" ? (
            <div className="rounded-full bg-green-100 p-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          ) : status === "attention" ? (
            <div className="rounded-full bg-amber-100 p-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
          ) : (
            <div className="rounded-full bg-indigo-100 p-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        {status === "complete" ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
        ) : (
          <ArrowRight className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
