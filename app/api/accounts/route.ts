import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function readData(filePath: string, defaultValue: any[] = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
    return defaultValue
  } catch (error) {
    console.error('Error reading data:', error)
    return defaultValue
  }
}

function writeData(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing data:', error)
    throw error
  }
}

async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  
  if (!userId) return null
  
  const users = readData(USERS_FILE)
  return users.find((user: any) => user.id === userId)
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accounts = readData(ACCOUNTS_FILE)
    const userAccounts = accounts.filter((account: any) => account.userId === user.id)
    
    return NextResponse.json({ accounts: userAccounts })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accountType, initialDeposit } = await request.json()
    
    if (!accountType || !initialDeposit || initialDeposit <= 0) {
      return NextResponse.json({ error: 'Invalid account data' }, { status: 400 })
    }

    const accounts = readData(ACCOUNTS_FILE)
    const newAccount = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      accountNumber: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      accountType,
      balance: parseFloat(initialDeposit),
      createdAt: new Date().toISOString(),
    }

    accounts.push(newAccount)
    writeData(ACCOUNTS_FILE, accounts)

    return NextResponse.json({ success: true, account: newAccount })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
