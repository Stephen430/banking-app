"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Bot, 
  Send, 
  MessageCircle, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Target,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface FinancialChatbotProps {
  userAccounts: any[]
  recentTransactions: any[]
  userName: string
}

export function FinancialChatbot({ userAccounts, recentTransactions, userName }: FinancialChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Financial analysis data
  const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  const monthlySpending = recentTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0)
  const monthlyIncome = recentTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  // Predefined responses and financial insights
  const getFinancialInsight = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('balance') || lowerQuery.includes('money')) {
      return `Your current total balance across all accounts is $${totalBalance.toFixed(2)}. ${
        totalBalance > 10000 
          ? "You're in a strong financial position! Consider investing some of this in a high-yield savings account." 
          : totalBalance > 1000 
          ? "You have a decent emergency fund started. Try to build it up to 3-6 months of expenses." 
          : "Focus on building your emergency fund first. Aim for at least $1,000 as a starter emergency fund."
      }`
    }
    
    if (lowerQuery.includes('spending') || lowerQuery.includes('expenses')) {
      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0
      return `This month you've spent $${monthlySpending.toFixed(2)} and earned $${monthlyIncome.toFixed(2)}. Your savings rate is ${savingsRate.toFixed(1)}%. ${
        savingsRate >= 20 
          ? "Excellent savings rate! You're on track for strong financial health." 
          : savingsRate >= 10 
          ? "Good savings rate. Try to increase it to 20% if possible." 
          : "Consider reducing expenses or increasing income to improve your savings rate."
      }`
    }
    
    if (lowerQuery.includes('save') || lowerQuery.includes('savings')) {
      return `Here are some personalized savings tips: 1) Set up automatic transfers to savings right after payday. 2) Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. 3) Consider opening a high-yield savings account for better returns. 4) Track your spending to identify areas where you can cut back.`
    }
    
    if (lowerQuery.includes('budget') || lowerQuery.includes('plan')) {
      return `Based on your spending patterns, I recommend: 1) Categorize your expenses (housing, food, transport, etc.). 2) Set limits for each category. 3) Use the envelope method or budgeting apps. 4) Review and adjust monthly. Your current spending suggests you could benefit from tracking discretionary expenses more closely.`
    }
    
    if (lowerQuery.includes('invest') || lowerQuery.includes('investment')) {
      return `Before investing, ensure you have: 1) An emergency fund (3-6 months expenses). 2) No high-interest debt. 3) Clear financial goals. Consider starting with: index funds, ETFs, or a target-date fund. Always invest for the long term and don't try to time the market.`
    }
    
    if (lowerQuery.includes('debt') || lowerQuery.includes('loan')) {
      return `For debt management: 1) List all debts with balances and interest rates. 2) Pay minimums on all, extra on highest interest rate (avalanche method). 3) Consider debt consolidation if it lowers your rate. 4) Avoid taking on new debt while paying off existing debt.`
    }
    
    if (lowerQuery.includes('goal') || lowerQuery.includes('target')) {
      return `Financial goal setting tips: 1) Make goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound). 2) Break large goals into smaller milestones. 3) Automate savings toward each goal. 4) Track progress regularly. What specific financial goal would you like help planning?`
    }
    
    // Default response
    return `I'm here to help with your finances! I can provide insights about your spending, savings tips, budgeting advice, investment guidance, and help you set financial goals. What would you like to know more about?`
  }

  const quickSuggestions = [
    "How's my spending this month?",
    "Give me savings tips",
    "Help me budget better",
    "Should I invest my money?",
    "How to set financial goals?",
    "Analyze my account balance"
  ]

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content: `Hi ${userName}! I'm your AI financial assistant. I can help you understand your spending, provide savings tips, and guide you toward better financial health. How can I help you today?`,
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 3)
    }
    setMessages([welcomeMessage])
  }, [userName])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getFinancialInsight(content),
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? quickSuggestions.slice(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3) + 3) : undefined
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-foreground">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          AI Financial Assistant
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Get personalized financial insights and advice
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                      {message.type === "user" ? userName.charAt(0).toUpperCase() : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about your finances..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isTyping || !inputValue.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Smart Insights
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <PiggyBank className="h-3 w-3 mr-1" />
              Savings Tips
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Goal Planning
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
