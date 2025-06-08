"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Scan, Camera, Upload, AlertCircle, CheckCircle2, X, Banknote, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRPaymentScannerProps {
  onPaymentScanned: (paymentData: any) => void
  userAccounts: any[]
}

export function QRPaymentScanner({ onPaymentScanned, userAccounts }: QRPaymentScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan QR codes",
        variant: "destructive"
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const processQRCode = async (imageData: string) => {
    try {
      // In a real implementation, you'd use a QR code library like jsQR
      // For demo purposes, we'll simulate QR code detection
      const mockPaymentData = {
        type: "payment_request",
        accountId: "demo_recipient",
        accountNumber: "1234567890",
        accountType: "Checking",
        recipient: "John Doe",
        amount: 25.50,
        description: "Coffee payment",
        timestamp: new Date().toISOString()
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setScanResult(mockPaymentData)
      setShowPreview(true)
      stopCamera()

      toast({
        title: "QR Code Detected",
        description: "Payment request found! Review the details.",
      })
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not read QR code. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      processQRCode(imageData)
    }
    reader.readAsDataURL(file)
  }

  const confirmPayment = () => {
    if (scanResult) {
      onPaymentScanned(scanResult)
      setScanResult(null)
      setShowPreview(false)
      
      toast({
        title: "Payment Initiated",
        description: "Processing your payment...",
      })
    }
  }

  const cancelPayment = () => {
    setScanResult(null)
    setShowPreview(false)
  }

  useEffect(() => {
    return () => {
      stopCamera() // Cleanup camera on unmount
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Scan className="h-5 w-5 mr-2 text-primary" />
            Scan QR Code to Pay
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Scan a payment QR code to send money instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning ? (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-8 border-2 border-dashed border-border">
                  <Scan className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Ready to Scan</h3>
                  <p className="text-muted-foreground mb-4">
                    Use your camera to scan a payment QR code
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <Button onClick={startCamera}>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Position the QR code within the frame
                </p>
                <Button variant="outline" onClick={stopCamera}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Scan
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

      {/* Payment Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Confirm Payment
            </DialogTitle>
            <DialogDescription>
              Review the payment details before proceeding
            </DialogDescription>
          </DialogHeader>

          {scanResult && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recipient</span>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium text-foreground">{scanResult.recipient}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <span className="font-medium text-foreground">
                    {scanResult.accountType} •••• {scanResult.accountNumber.slice(-4)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-lg font-bold text-green-600">${scanResult.amount}</span>
                  </div>
                </div>

                {scanResult.description && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <span className="font-medium text-foreground">{scanResult.description}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Payment will be sent from your default account
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={cancelPayment} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmPayment} className="flex-1">
                  Send Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
