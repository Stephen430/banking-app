"use client"

import React, { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Copy, Check, QrCode, Banknote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRPaymentGeneratorProps {
  accountId: string
  accountNumber: string
  accountType: string
  userFullName: string
}

export function QRPaymentGenerator({ 
  accountId, 
  accountNumber, 
  accountType, 
  userFullName 
}: QRPaymentGeneratorProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generateQRCode = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than $0",
        variant: "destructive"
      })
      return
    }

    const paymentData = {
      type: "payment_request",
      accountId,
      accountNumber,
      accountType,
      recipient: userFullName,
      amount: parseFloat(amount),
      description: description || "Payment Request",
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }

    try {
      const qrString = await QRCode.toDataURL(JSON.stringify(paymentData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      setQrCodeUrl(qrString)
      
      toast({
        title: "QR Code Generated",
        description: "Your payment QR code is ready to share!",
      })
    } catch (error) {
      console.error('QR Code generation failed:', error)
      toast({
        title: "Generation Failed",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive"
      })
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = `payment-request-${amount}.png`
    link.href = qrCodeUrl
    link.click()

    toast({
      title: "Downloaded",
      description: "QR code saved to your device!",
    })
  }

  const copyPaymentLink = async () => {
    const paymentData = {
      type: "payment_request",
      accountId,
      accountNumber,
      accountType,
      recipient: userFullName,
      amount: parseFloat(amount || "0"),
      description: description || "Payment Request"
    }

    const paymentLink = `securebank://pay?data=${encodeURIComponent(JSON.stringify(paymentData))}`
    
    try {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      toast({
        title: "Link Copied",
        description: "Payment link copied to clipboard!",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy payment link",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <QrCode className="h-5 w-5 mr-2 text-primary" />
            Generate Payment QR Code
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create a QR code for others to scan and send you money
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="What's this payment for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={generateQRCode} className="w-full md:w-auto">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </div>

          {qrCodeUrl && (
            <div className="border-t pt-6">
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm border">
                  <img src={qrCodeUrl} alt="Payment QR Code" className="max-w-full h-auto" />
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="text-primary">
                    <Banknote className="h-3 w-3 mr-1" />
                    ${amount} - {description || "Payment Request"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Scan with any SecureBank app to send payment
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={downloadQRCode}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyPaymentLink}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
