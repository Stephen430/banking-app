import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json')
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

    const notifications = readData(NOTIFICATIONS_FILE)
    const userNotifications = notifications
      .filter((notification: any) => notification.userId === user.id)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20) // Latest 20 notifications
    
    return NextResponse.json({ notifications: userNotifications })
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

    const { title, message, type, priority } = await request.json()
    
    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
    }

    const notifications = readData(NOTIFICATIONS_FILE)
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      title,
      message,
      type: type || 'info', // info, success, warning, error
      priority: priority || 'medium', // low, medium, high
      read: false,
      createdAt: new Date().toISOString(),
    }

    notifications.push(newNotification)
    writeData(NOTIFICATIONS_FILE, notifications)

    return NextResponse.json({ success: true, notification: newNotification })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId, read } = await request.json()
    
    const notifications = readData(NOTIFICATIONS_FILE)
    const notificationIndex = notifications.findIndex(
      (notification: any) => notification.id === notificationId && notification.userId === user.id
    )

    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    notifications[notificationIndex].read = read
    writeData(NOTIFICATIONS_FILE, notifications)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
