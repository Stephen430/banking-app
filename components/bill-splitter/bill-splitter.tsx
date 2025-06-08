"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  Plus, 
  Minus, 
  DollarSign, 
  Calculator, 
  Send, 
  Check,
  Clock,
  Receipt,
  Split,
  UserPlus,
  X
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Participant {
  id: string
  name: string
  email: string
  share: number
  paid: boolean
}

interface Expense {
  id: string
  title: string
  amount: number
  paidBy: string
  participants: Participant[]
  date: Date
  status: "pending" | "completed"
  category: string
}

interface BillSplitterProps {
  currentUser: {
    id: string
    name: string
    email: string
  }
}

export function BillSplitter({ currentUser }: BillSplitterProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState("current")
  const { toast } = useToast()

  // Mock data
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: "1",
        title: "Dinner at Italian Restaurant",
        amount: 156.80,
        paidBy: currentUser.id,
        participants: [
          { id: currentUser.id, name: currentUser.name, email: currentUser.email, share: 52.27, paid: true },
          { id: "2", name: "Sarah Johnson", email: "sarah@example.com", share: 52.27, paid: false },
          { id: "3", name: "Mike Chen", email: "mike@example.com", share: 52.26, paid: true }
        ],
        date: new Date("2025-06-07"),
        status: "pending",
        category: "Dining"
      },
      {
        id: "2",
        title: "Weekend Airbnb",
        amount: 320.00,
        paidBy: "2",
        participants: [
          { id: currentUser.id, name: currentUser.name, email: currentUser.email, share: 80.00, paid: true },
          { id: "2", name: "Sarah Johnson", email: "sarah@example.com", share: 80.00, paid: true },
          { id: "3", name: "Mike Chen", email: "mike@example.com", share: 80.00, paid: true },
          { id: "4", name: "Emma Davis", email: "emma@example.com", share: 80.00, paid: false }
        ],
        date: new Date("2025-06-05"),
        status: "pending",
        category: "Travel"
      }
    ]
    setExpenses(mockExpenses)
  }, [currentUser])

  const calculateBalance = () => {
    let youOwe = 0
    let youAreOwed = 0

    expenses.forEach(expense => {
      if (expense.paidBy === currentUser.id) {
        // You paid, calculate what others owe you
        expense.participants.forEach(participant => {
          if (participant.id !== currentUser.id && !participant.paid) {
            youAreOwed += participant.share
          }
        })
      } else {
        // Someone else paid, check if you owe them
        const yourShare = expense.participants.find(p => p.id === currentUser.id)
        if (yourShare && !yourShare.paid) {
          youOwe += yourShare.share
        }
      }
    })

    return { youOwe, youAreOwed, balance: youAreOwed - youOwe }
  }

  const markAsPaid = (expenseId: string, participantId: string) => {
    setExpenses(prev => prev.map(expense => {
      if (expense.id === expenseId) {
        return {
          ...expense,
          participants: expense.participants.map(participant => {
            if (participant.id === participantId) {
              return { ...participant, paid: true }
            }
            return participant
          })
        }
      }
      return expense
    }))

    toast({
      title: "Payment Recorded",
      description: "The payment has been marked as received",
    })
  }

  const sendReminder = (expenseId: string, participantId: string) => {
    // Mock sending reminder
    toast({
      title: "Reminder Sent",
      description: "Payment reminder sent successfully",
    })
  }

  const { youOwe, youAreOwed, balance } = calculateBalance()

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              ${youOwe.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">You owe</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              ${youAreOwed.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">You are owed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className={`text-2xl font-bold mb-1 ${
              balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              ${Math.abs(balance).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {balance >= 0 ? "Net owed to you" : "Net you owe"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-foreground">
                <Split className="h-5 w-5 mr-2 text-primary" />
                Bill Splitter
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Split expenses and track payments with friends
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Expenses</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              {expenses.filter(e => e.status === "pending").map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  currentUser={currentUser}
                  onMarkPaid={markAsPaid}
                  onSendReminder={sendReminder}
                />
              ))}
              
              {expenses.filter(e => e.status === "pending").length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No pending expenses</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by adding an expense to split with friends
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Expense
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {expenses.filter(e => e.status === "completed").map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  currentUser={currentUser}
                  onMarkPaid={markAsPaid}
                  onSendReminder={sendReminder}
                  showActions={false}
                />
              ))}
              
              {expenses.filter(e => e.status === "completed").length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No completed expenses</h3>
                  <p className="text-muted-foreground">
                    Completed expenses will appear here
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Expense Dialog */}
      <CreateExpenseDialog
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        currentUser={currentUser}
        onExpenseCreated={(expense) => {
          setExpenses(prev => [...prev, expense])
          toast({
            title: "Expense Added",
            description: "The expense has been split among participants",
          })
        }}
      />
    </div>
  )
}

// Expense Card Component
interface ExpenseCardProps {
  expense: Expense
  currentUser: { id: string; name: string; email: string }
  onMarkPaid: (expenseId: string, participantId: string) => void
  onSendReminder: (expenseId: string, participantId: string) => void
  showActions?: boolean
}

function ExpenseCard({ 
  expense, 
  currentUser, 
  onMarkPaid, 
  onSendReminder, 
  showActions = true 
}: ExpenseCardProps) {
  const paidByYou = expense.paidBy === currentUser.id
  const yourShare = expense.participants.find(p => p.id === currentUser.id)
  
  return (
    <Card className="border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{expense.title}</h3>
            <p className="text-sm text-muted-foreground">
              {expense.date.toLocaleDateString()} • {expense.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${expense.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              Paid by {paidByYou ? "You" : expense.participants.find(p => p.id === expense.paidBy)?.name}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Participants:</h4>
          {expense.participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {participant.name ? participant.name.split(' ').map(n => n[0]).join('') : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {participant.id === currentUser.id ? "You" : participant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">${participant.share.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {participant.paid ? (
                  <Badge variant="default" className="bg-green-500">
                    <Check className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
                
                {showActions && paidByYou && !participant.paid && participant.id !== currentUser.id && (
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkPaid(expense.id, participant.id)}
                    >
                      Mark Paid
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSendReminder(expense.id, participant.id)}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {yourShare && !yourShare.paid && !paidByYou && showActions && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You owe ${yourShare.share.toFixed(2)} for this expense
            </p>
            <Button size="sm" className="mt-2">
              <Send className="h-3 w-3 mr-2" />
              Pay Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Create Expense Dialog Component
interface CreateExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser: { id: string; name: string; email: string }
  onExpenseCreated: (expense: Expense) => void
}

function CreateExpenseDialog({ 
  open, 
  onOpenChange, 
  currentUser, 
  onExpenseCreated 
}: CreateExpenseDialogProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Dining")
  const [participants, setParticipants] = useState<Participant[]>([
    { id: currentUser.id, name: currentUser.name, email: currentUser.email, share: 0, paid: true }
  ])
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal")
  const [newParticipantEmail, setNewParticipantEmail] = useState("")

  const addParticipant = () => {
    if (newParticipantEmail) {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: newParticipantEmail.split('@')[0],
        email: newParticipantEmail,
        share: 0,
        paid: false
      }
      setParticipants(prev => [...prev, newParticipant])
      setNewParticipantEmail("")
    }
  }

  const removeParticipant = (id: string) => {
    if (id !== currentUser.id) {
      setParticipants(prev => prev.filter(p => p.id !== id))
    }
  }

  const calculateShares = () => {
    const totalAmount = parseFloat(amount) || 0
    if (splitMethod === "equal" && participants.length > 0) {
      const sharePerPerson = totalAmount / participants.length
      return participants.map(p => ({ ...p, share: sharePerPerson }))
    }
    return participants
  }

  const createExpense = () => {
    const totalAmount = parseFloat(amount) || 0
    if (!title || totalAmount <= 0 || participants.length < 2) return

    const calculatedParticipants = calculateShares()
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount: totalAmount,
      paidBy: currentUser.id,
      participants: calculatedParticipants,
      date: new Date(),
      status: "pending",
      category
    }

    onExpenseCreated(newExpense)
    onOpenChange(false)
    
    // Reset form
    setTitle("")
    setAmount("")
    setParticipants([
      { id: currentUser.id, name: currentUser.name, email: currentUser.email, share: 0, paid: true }
    ])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Split New Expense
          </DialogTitle>
          <DialogDescription>
            Add an expense and split it among participants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Expense Title</Label>
            <Input
              id="title"
              placeholder="e.g., Dinner at restaurant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="Dining">Dining</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Participants</Label>
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex items-center space-x-2">                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {participant.name ? participant.name.split(' ').map(n => n[0]).join('') : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {participant.id === currentUser.id ? "You" : participant.name}
                  </span>
                </div>
                {participant.id !== currentUser.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeParticipant(participant.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email address"
                value={newParticipantEmail}
                onChange={(e) => setNewParticipantEmail(e.target.value)}
              />
              <Button onClick={addParticipant} size="sm">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={createExpense}>
              Split Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
