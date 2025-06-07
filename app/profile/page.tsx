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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { 
  User, Shield, Settings, Bell, CreditCard, Lock, Mail, 
  Phone, Calendar, MapPin, Building, Briefcase, CheckCircle2,
  AlertTriangle, BadgeCheck, Camera, PencilLine
} from "lucide-react"

type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  occupation?: string
  company?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedUser, setUpdatedUser] = useState<Partial<UserProfile>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Notification preferences (dummy data for UI)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    security: true,
    transactions: true
  })
  
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
        setUpdatedUser(userData)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [router])
  
  // This would be implemented in a real app to update user data
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic form validation
    const errors: Record<string, string> = {}
    
    if (!updatedUser.firstName) {
      errors.firstName = "First name is required"
    }
    
    if (!updatedUser.lastName) {
      errors.lastName = "Last name is required"
    }
    
    if (!updatedUser.email) {
      errors.email = "Email is required"
    } else {
      // Simple email format validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(updatedUser.email)) {
        errors.email = "Invalid email format"
      }
    }
    
    if (!updatedUser.phone) {
      errors.phone = "Phone number is required"
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    try {
      // In a real app, you would call an API to update the user profile
      // await updateUser(updatedUser)
      
      // For demo purposes, we'll just update the state
      setUser({...user, ...updatedUser} as UserProfile)
      setIsEditing(false)
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null // Will redirect in useEffect
  }
  
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
    return (
    <div className="flex flex-col min-h-screen bg-background"><AppHeader user={user} title="My Profile" />
      
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
        
        <div className="grid gap-8 md:grid-cols-12">          {/* Profile Header */}
          <Card className="col-span-12 border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 h-32 w-full relative">
              <div className="absolute -bottom-12 left-8">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src="/placeholder-user.jpg" alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-0 bg-primary rounded-full p-1.5 text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="absolute right-4 bottom-4">
                <Badge variant="premium" />
              </div>
            </div>
              <CardContent className="pt-16 pb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-foreground">{user.firstName} {user.lastName}</h2>
                  <p className="text-muted-foreground flex items-center text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Member since {memberSince}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>Cancel</>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={handleUpdateProfile}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>              <div className="mt-4 flex flex-wrap gap-2">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                  Verified Customer
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <CreditCard className="h-3.5 w-3.5 mr-1" />
                  3 Active Accounts
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  Enhanced Security
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Personal Info</span>
                  <span className="sm:hidden">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security</span>
                  <span className="sm:hidden">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Notifications</span>
                  <span className="sm:hidden">Alerts</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleUpdateProfile}>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={isEditing ? updatedUser.firstName : user.firstName}
                            onChange={(e) => setUpdatedUser({...updatedUser, firstName: e.target.value})}
                            disabled={!isEditing}
                          />
                          {formErrors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={isEditing ? updatedUser.lastName : user.lastName}
                            onChange={(e) => setUpdatedUser({...updatedUser, lastName: e.target.value})}
                            disabled={!isEditing}
                          />
                          {formErrors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                          )}
                        </div>
                          <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="email" 
                              className="pl-10" 
                              value={isEditing ? updatedUser.email : user.email}
                              onChange={(e) => setUpdatedUser({...updatedUser, email: e.target.value})}
                              disabled={!isEditing}
                            />
                          </div>
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="phone" 
                              className="pl-10" 
                              value={isEditing ? updatedUser.phone : user.phone}
                              onChange={(e) => setUpdatedUser({...updatedUser, phone: e.target.value})}
                              disabled={!isEditing}
                            />
                          </div>
                          {formErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="address" 
                              className="pl-10" 
                              value={isEditing ? updatedUser.address || '' : user.address || ''}
                              onChange={(e) => setUpdatedUser({...updatedUser, address: e.target.value})}
                              disabled={!isEditing}
                              placeholder="Your address"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="city" 
                              className="pl-10" 
                              value={isEditing ? updatedUser.city || '' : user.city || ''}
                              onChange={(e) => setUpdatedUser({...updatedUser, city: e.target.value})}
                              disabled={!isEditing}
                              placeholder="Your city"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            value={isEditing ? updatedUser.state || '' : user.state || ''}
                            onChange={(e) => setUpdatedUser({...updatedUser, state: e.target.value})}
                            disabled={!isEditing}
                            placeholder="Your state"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input 
                            id="zipCode" 
                            value={isEditing ? updatedUser.zipCode || '' : user.zipCode || ''}
                            onChange={(e) => setUpdatedUser({...updatedUser, zipCode: e.target.value})}
                            disabled={!isEditing}
                            placeholder="Your zip code"
                          />
                        </div>
                          <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="occupation" 
                              className="pl-10" 
                              value={isEditing ? updatedUser.occupation || '' : user.occupation || ''}
                              onChange={(e) => setUpdatedUser({...updatedUser, occupation: e.target.value})}
                              disabled={!isEditing}
                              placeholder="Your occupation"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input 
                            id="company" 
                            value={isEditing ? updatedUser.company || '' : user.company || ''}
                            onChange={(e) => setUpdatedUser({...updatedUser, company: e.target.value})}
                            disabled={!isEditing}
                            placeholder="Your company"
                          />
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="mt-6">
                          <Button type="submit">Save Changes</Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Password</h3>
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div className="space-y-0.5">
                          <div className="font-medium text-foreground">Change Password</div>
                          <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Lock className="mr-2 h-4 w-4" />
                          Update
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div className="space-y-0.5">
                          <div className="font-medium text-foreground">Two-Factor Authentication</div>
                          <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Set Up
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div className="space-y-0.5">
                          <div className="font-medium text-foreground">Recovery Options</div>
                          <div className="text-sm text-muted-foreground">Backup methods to access your account</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Login Sessions</h3>
                      <div className="rounded-md border">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-green-100 p-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-xs text-gray-500">Windows • Chrome • New York, USA</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Active now</p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-gray-100 p-1">
                              <div className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Mobile App</p>
                              <p className="text-xs text-gray-500">iOS • Banking App • New York, USA</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Log Out All Devices
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Customize how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-gray-500">Receive updates via email</div>
                        </div>
                        <Switch 
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Push Notifications</div>
                          <div className="text-sm text-gray-500">Receive notifications on your devices</div>
                        </div>
                        <Switch 
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                        />
                      </div>
                      
                      <Separator />
                      
                      <h3 className="text-lg font-medium pt-2">Notification Categories</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Security Alerts</div>
                          <div className="text-sm text-gray-500">Important alerts about your account security</div>
                        </div>
                        <Switch 
                          checked={notifications.security}
                          onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Transaction Updates</div>
                          <div className="text-sm text-gray-500">Get notified about account transactions</div>
                        </div>
                        <Switch 
                          checked={notifications.transactions}
                          onCheckedChange={(checked) => setNotifications({...notifications, transactions: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Marketing & Promotions</div>
                          <div className="text-sm text-gray-500">Special offers and product updates</div>
                        </div>
                        <Switch 
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between border-t bg-gray-50 px-6 py-4">
                    <p className="text-sm text-gray-600">
                      You can change these settings at any time
                    </p>
                    <Button size="sm">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Status</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600"></div>
                      Active
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer ID</span>
                    <span className="font-medium">{user.id}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">{memberSince}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">New debit card requested</p>
                    <p className="text-xs text-gray-500 truncate">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Password changed successfully</p>
                    <p className="text-xs text-gray-500 truncate">1 week ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Account settings updated</p>
                    <p className="text-xs text-gray-500 truncate">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-blue-900">
                  <Shield className="mr-2 h-5 w-5 text-blue-700" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-blue-800">Account Protection</span>
                      <span className="text-sm text-blue-800">65%</span>
                    </div>
                    <div className="h-2 w-full bg-blue-200 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full w-[65%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-blue-800 gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Password strength: Good
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-800 gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Two-factor authentication: Not enabled
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full bg-white">
                  Enhance Security
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Custom Badge Component for the premium status
function Badge({ variant }: { variant: 'premium' | 'standard' }) {
  if (variant === 'premium') {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3 h-3 mr-1"
        >
          <path
            fillRule="evenodd"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
            clipRule="evenodd"
          />
        </svg>
        Premium
      </div>
    )
  }
  
  return (
    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
      Standard
    </div>
  )
}
