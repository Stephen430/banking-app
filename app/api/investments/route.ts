import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'

const INVESTMENTS_FILE = path.join(process.cwd(), 'data', 'investments.json')

async function readInvestments() {
  try {
    const data = await fs.readFile(INVESTMENTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeInvestments(investments: any[]) {
  await fs.writeFile(INVESTMENTS_FILE, JSON.stringify(investments, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('currentUser')
    
    if (!userCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = JSON.parse(userCookie.value)
    const investments = await readInvestments()
    const userInvestments = investments.filter((inv: any) => inv.userId === currentUser.id)
    
    return NextResponse.json(userInvestments)
  } catch (error) {
    console.error('Error fetching investments:', error)
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
    
    const newInvestment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const investments = await readInvestments()
    investments.push(newInvestment)
    await writeInvestments(investments)

    return NextResponse.json(newInvestment, { status: 201 })
  } catch (error) {
    console.error('Error creating investment:', error)
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

    const investments = await readInvestments()
    const index = investments.findIndex((inv: any) => inv.id === id && inv.userId === currentUser.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 })
    }

    investments[index] = {
      ...investments[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    await writeInvestments(investments)
    return NextResponse.json(investments[index])
  } catch (error) {
    console.error('Error updating investment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
