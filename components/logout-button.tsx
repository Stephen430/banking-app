"use client"

import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/actions"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => logoutUser()} 
      className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
    >
      <LogOut className="h-4 w-4" />
      <span className="sr-only">Logout</span>
    </Button>
  )
}
