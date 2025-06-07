"use client"

import { Bell, Banknote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/logout-button"
import { ThemeToggleSimple } from "@/components/theme-toggle"

type AppHeaderProps = {
  user: {
    firstName?: string;
    lastName?: string;
  };
  title?: string;
}

export function AppHeader({ user, title }: AppHeaderProps) {
  return (
    <header className="bg-background border-b border-border shadow-sm dark:shadow-none">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="md:hidden">
            <Banknote className="h-6 w-6 text-primary" />
          </div>
          {title && <h2 className="text-xl font-semibold text-primary hidden md:block">{title}</h2>}
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggleSimple />
          
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-3 w-3 border border-background"></span>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center bg-muted/50 rounded-full pr-1 pl-1 hover:bg-muted transition-colors">
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium mx-2 hidden sm:inline text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <div className="ml-1">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
