"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import fs from 'fs'
import path from 'path'

// File paths for our mock database
const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json')
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper functions to read/write data
function readData(filePath: string, defaultValue: any[] = []) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue))
    return defaultValue
  }
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return defaultValue
  }
}

function writeData(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// Read initial data
const users: any[] = readData(USERS_FILE)
const accounts: any[] = readData(ACCOUNTS_FILE)
const transactions: any[] = readData(TRANSACTIONS_FILE)

// Helper function to generate account numbers
function generateAccountNumber(): string {
  return Math.random().toString().slice(2, 12)
}

// Helper function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (users.find((user) => user.email === email)) {
    return { success: false, error: "Email already exists" }
  }

  // Create user
  const user = {
    id: generateId(),
    firstName,
    lastName,
    email,
    phone,
    password, // In a real app, hash this password
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  writeData(USERS_FILE, users)
  return { success: true }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Force reload users data from file to make sure we have the latest
  const freshUsers = readData(USERS_FILE)
  
  console.log('Attempting login with:', email);
  console.log('Users available:', freshUsers.length);
  
  const user = freshUsers.find((u: any) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
  redirect("/")
}

export async function getUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) return null

  return users.find((user) => user.id === userId) || null
}

export async function updateUser(userData: any) {
  const currentUser = await getUser()
  
  if (!currentUser) {
    return { success: false, error: "Not authenticated" }
  }
  
  try {
    // Read the most recent data
    const allUsers = readData(USERS_FILE)
    
    // Find the user index
    const userIndex = allUsers.findIndex((user: any) => user.id === currentUser.id)
    
    if (userIndex === -1) {
      return { success: false, error: "User not found" }
    }
    
    // Update user data while preserving essential fields
    const updatedUser = {
      ...allUsers[userIndex],
      ...userData,
      id: currentUser.id, // Ensure ID isn't changed
      createdAt: currentUser.createdAt // Ensure creation date isn't changed
    }
    
    // Update the user in the array
    allUsers[userIndex] = updatedUser
    
    // Write back to file
    writeData(USERS_FILE, allUsers)
    
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function createAccount(formData: FormData) {
  const user = await getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const accountType = formData.get("accountType") as string
  const initialDeposit = Number.parseFloat(formData.get("initialDeposit") as string)

  if (!accountType || !["Checking", "Savings"].includes(accountType)) {
    return { success: false, error: "Please select a valid account type" }
  }

  if (isNaN(initialDeposit) || initialDeposit < 0) {
    return { success: false, error: "Initial deposit must be a positive number" }
  }
  
  if (accountType === "Savings" && initialDeposit < 500) {
    return { success: false, error: "Savings accounts require a minimum deposit of $500" }
  }
  
  if (accountType === "Checking" && initialDeposit < 25) {
    return { success: false, error: "Checking accounts require a minimum deposit of $25" }
  }

  const account = {
    id: generateId(),
    userId: user.id,
    accountNumber: generateAccountNumber(),
    accountType,
    balance: initialDeposit,
    createdAt: new Date().toISOString(),
  }

  accounts.push(account)
  writeData(ACCOUNTS_FILE, accounts)

  // Create initial deposit transaction if amount > 0
  if (initialDeposit > 0) {
    const transaction = {
      id: generateId(),
      accountId: account.id,
      userId: user.id,
      type: "deposit",
      amount: initialDeposit,
      description: "Initial deposit",
      createdAt: new Date().toISOString(),
    }
    transactions.push(transaction)
    writeData(TRANSACTIONS_FILE, transactions)
  }

  return { success: true }
}

export async function getUserAccounts(userId?: string) {
  const user = await getUser()
  if (!user) return []

  const targetUserId = userId || user.id
  return accounts.filter((account) => account.userId === targetUserId)
}

export async function makeTransaction(formData: FormData) {
  const user = await getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const accountId = formData.get("accountId") as string
  const transactionType = formData.get("transactionType") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  const account = accounts.find((acc) => acc.id === accountId && acc.userId === user.id)
  if (!account) {
    return { success: false, error: "Account not found" }
  }

  if (amount <= 0) {
    return { success: false, error: "Amount must be positive" }
  }

  if (transactionType === "withdrawal" && account.balance < amount) {
    return { success: false, error: "Insufficient funds" }
  }

  // Update account balance
  if (transactionType === "deposit") {
    account.balance += amount
  } else {
    account.balance -= amount
  }

  // Create transaction record
  const transaction = {
    id: generateId(),
    accountId,
    userId: user.id,
    type: transactionType,
    amount,
    description: description || `${transactionType} transaction`,
    createdAt: new Date().toISOString(),
  }

  transactions.push(transaction)
  writeData(TRANSACTIONS_FILE, transactions)
  return { success: true }
}

export async function getTransactionHistory(userId: string) {
  const userAccounts = accounts.filter((acc) => acc.userId === userId)
  const accountIds = userAccounts.map((acc) => acc.id)

  const userTransactions = transactions
    .filter((trans) => accountIds.includes(trans.accountId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Add account number to transactions
  return userTransactions.map((trans) => {
    const account = accounts.find((acc) => acc.id === trans.accountId)
    return {
      ...trans,
      accountNumber: account?.accountNumber || "Unknown",
    }
  })
}
