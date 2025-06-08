import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'

const BILL_SPLITS_FILE = path.join(process.cwd(), 'data', 'bill-splits.json')

async function readBillSplits() {
  try {
    const data = await fs.readFile(BILL_SPLITS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeBillSplits(billSplits: any[]) {
  await fs.writeFile(BILL_SPLITS_FILE, JSON.stringify(billSplits, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('currentUser')
    
    if (!userCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = JSON.parse(userCookie.value)
    const billSplits = await readBillSplits()
    const userBillSplits = billSplits.filter((split: any) => 
      split.participants.some((p: any) => p.id === currentUser.id) || split.createdBy === currentUser.id
    )
    
    return NextResponse.json(userBillSplits)
  } catch (error) {
    console.error('Error fetching bill splits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('currentUser')
    
    if (!userCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = JSON.parse(userCookie.value)
    const body = await request.json()
    
    const newBillSplit = {
      id: Date.now().toString(),
      createdBy: currentUser.id,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const billSplits = await readBillSplits()
    billSplits.push(newBillSplit)
    await writeBillSplits(billSplits)

    return NextResponse.json(newBillSplit, { status: 201 })
  } catch (error) {
    console.error('Error creating bill split:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('currentUser')
    
    if (!userCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = JSON.parse(userCookie.value)
    const body = await request.json()
    const { id, ...updateData } = body

    const billSplits = await readBillSplits()
    const index = billSplits.findIndex((split: any) => 
      split.id === id && (split.createdBy === currentUser.id || 
      split.participants.some((p: any) => p.id === currentUser.id))
    )
    
    if (index === -1) {
      return NextResponse.json({ error: 'Bill split not found' }, { status: 404 })
    }

    billSplits[index] = {
      ...billSplits[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    await writeBillSplits(billSplits)
    return NextResponse.json(billSplits[index])
  } catch (error) {
    console.error('Error updating bill split:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
