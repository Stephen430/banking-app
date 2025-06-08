"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { 
  Fingerprint, 
  Scan, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Shield,
  Eye,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BiometricAuthProps {
  onAuthSuccess: () => void
  onAuthFailure?: () => void
  authType?: "fingerprint" | "face" | "both"
  title?: string
  description?: string
}

type AuthState = "idle" | "scanning" | "processing" | "success" | "failure"

export function BiometricAuth({ 
  onAuthSuccess, 
  onAuthFailure,
  authType = "both",
  title = "Biometric Authentication",
  description = "Verify your identity to continue"
}: BiometricAuthProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [authState, setAuthState] = useState<AuthState>("idle")
  const [progress, setProgress] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState<"fingerprint" | "face">("fingerprint")
  const [attemptCount, setAttemptCount] = useState(0)
  const { toast } = useToast()

  const maxAttempts = 3

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (authState === "scanning") {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setAuthState("processing")
            return 100
          }
          return prev + 10
        })
      }, 100)
    } else if (authState === "processing") {
      // Simulate processing time
      const timeout = setTimeout(() => {
        // 85% success rate simulation
        const isSuccess = Math.random() > 0.15
        
        if (isSuccess) {
          setAuthState("success")
          setTimeout(() => {
            onAuthSuccess()
            setIsOpen(false)
            resetAuth()
          }, 1500)
        } else {
          setAuthState("failure")
          setAttemptCount(prev => prev + 1)
          setTimeout(() => {
            if (attemptCount + 1 >= maxAttempts) {
              onAuthFailure?.()
              setIsOpen(false)
              resetAuth()
            } else {
              setAuthState("idle")
              setProgress(0)
            }
          }, 2000)
        }
      }, 1500)
      
      return () => clearTimeout(timeout)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [authState, onAuthSuccess, onAuthFailure, attemptCount])

  const resetAuth = () => {
    setAuthState("idle")
    setProgress(0)
    setAttemptCount(0)
  }

  const startAuth = (method: "fingerprint" | "face") => {
    setSelectedMethod(method)
    setAuthState("scanning")
    setProgress(0)
  }

  const openDialog = () => {
    setIsOpen(true)
    resetAuth()
  }

  const closeDialog = () => {
    setIsOpen(false)
    resetAuth()
  }

  const getAuthIcon = () => {
    switch (selectedMethod) {
      case "fingerprint":
        return <Fingerprint className="w-16 h-16" />
      case "face":
        return <Scan className="w-16 h-16" />
      default:
        return <Shield className="w-16 h-16" />
    }
  }

  const getAuthMessage = () => {
    switch (authState) {
      case "idle":
        return selectedMethod === "fingerprint" 
          ? "Place your finger on the sensor"
          : "Position your face in the camera view"
      case "scanning":
        return selectedMethod === "fingerprint"
          ? "Keep your finger steady..."
          : "Scanning your face..."
      case "processing":
        return "Verifying identity..."
      case "success":
        return "Authentication successful!"
      case "failure":
        return `Authentication failed. ${maxAttempts - attemptCount - 1} attempts remaining.`
      default:
        return ""
    }
  }

  const getStateColor = () => {
    switch (authState) {
      case "scanning":
        return "text-blue-500"
      case "processing":
        return "text-yellow-500"
      case "success":
        return "text-green-500"
      case "failure":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <>
      <Button onClick={openDialog} className="flex items-center">
        <Shield className="h-4 w-4 mr-2" />
        {title}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {authState === "idle" && (
              <>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred authentication method:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {(authType === "fingerprint" || authType === "both") && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => startAuth("fingerprint")}
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                      >
                        <Fingerprint className="h-8 w-8" />
                        <span className="text-sm">Fingerprint</span>
                      </Button>
                    )}
                    
                    {(authType === "face" || authType === "both") && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => startAuth("face")}
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                      >
                        <Eye className="h-8 w-8" />
                        <span className="text-sm">Face ID</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                {attemptCount > 0 && (
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      {attemptCount} failed attempt{attemptCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </>
            )}

            {authState !== "idle" && (
              <div className="text-center space-y-6">
                <div className={`flex justify-center ${getStateColor()}`}>
                  {authState === "success" ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  ) : authState === "failure" ? (
                    <XCircle className="w-16 h-16 text-red-500" />
                  ) : (
                    <div className={`${authState === "scanning" ? "animate-pulse" : ""}`}>
                      {getAuthIcon()}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className={`text-sm font-medium ${getStateColor()}`}>
                    {getAuthMessage()}
                  </p>
                  
                  {(authState === "scanning" || authState === "processing") && (
                    <div className="space-y-2">
                      <Progress 
                        value={progress} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {authState === "scanning" ? "Capturing biometric data..." : "Verifying with secure servers..."}
                      </p>
                    </div>
                  )}
                </div>

                {authState === "success" && (
                  <Badge variant="default" className="bg-green-500">
                    <Unlock className="h-3 w-3 mr-1" />
                    Access Granted
                  </Badge>
                )}

                {authState === "failure" && (
                  <div className="space-y-3">
                    <Badge variant="destructive">
                      <Lock className="h-3 w-3 mr-1" />
                      Access Denied
                    </Badge>
                    
                    {attemptCount < maxAttempts - 1 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setAuthState("idle")
                          setProgress(0)
                        }}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Bank-grade security</span>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className="h-3 w-3" />
                <span>Encrypted locally</span>
              </div>
            </div>

            {authState === "idle" && (
              <div className="flex justify-end">
                <Button variant="ghost" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Biometric Setup Component
interface BiometricSetupProps {
  onSetupComplete: () => void
}

export function BiometricSetup({ onSetupComplete }: BiometricSetupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [setupProgress, setSetupProgress] = useState(0)
  const { toast } = useToast()

  const steps = [
    {
      title: "Choose Method",
      description: "Select your preferred biometric authentication method",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Enrollment",
      description: "We'll capture your biometric data securely",
      icon: <Scan className="h-6 w-6" />
    },
    {
      title: "Verification",
      description: "Verify the setup was successful",
      icon: <CheckCircle2 className="h-6 w-6" />
    }
  ]

  const handleMethodSelect = (method: "fingerprint" | "face") => {
    setCurrentStep(1)
    setTimeout(() => {
      setIsScanning(true)
      simulateEnrollment()
    }, 500)
  }

  const simulateEnrollment = () => {
    const interval = setInterval(() => {
      setSetupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setCurrentStep(2)
          setTimeout(() => {
            onSetupComplete()
            toast({
              title: "Biometric Setup Complete",
              description: "You can now use biometric authentication for secure access",
            })
          }, 1500)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Fingerprint className="h-5 w-5 mr-2 text-primary" />
          Biometric Authentication Setup
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Set up fingerprint or face recognition for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                ${index <= currentStep 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground text-muted-foreground"
                }
              `}>
                {index < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-xs mt-2 text-center text-muted-foreground">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`
                  w-full h-px mt-1 
                  ${index < currentStep ? "bg-primary" : "bg-muted"}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Choose your preferred biometric authentication method:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleMethodSelect("fingerprint")}
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <Fingerprint className="h-8 w-8" />
                <span>Fingerprint</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleMethodSelect("face")}
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <Eye className="h-8 w-8" />
                <span>Face ID</span>
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="text-center space-y-4">
            <div className={`flex justify-center ${isScanning ? "animate-pulse" : ""}`}>
              <Fingerprint className="w-16 h-16 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Enrolling your biometric data...</p>
              <p className="text-sm text-muted-foreground">
                Please keep your finger steady on the sensor
              </p>
              <Progress value={setupProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {setupProgress}% complete
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">Setup Complete!</p>
              <p className="text-sm text-muted-foreground">
                Your biometric authentication is now active and ready to use.
              </p>
            </div>
            <Badge variant="default" className="bg-green-500">
              <Shield className="h-3 w-3 mr-1" />
              Biometric Security Enabled
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
