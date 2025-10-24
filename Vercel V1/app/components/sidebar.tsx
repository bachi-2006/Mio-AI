"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Code, Mic, ImageIcon, History, Sun, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

interface SidebarProps {
  currentMode: string
  onModeChange: (mode: string) => void
}

export function Sidebar({ currentMode, onModeChange }: SidebarProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const menuItems = [
    { id: "chat", icon: MessageSquare, label: "Chat Mode" },
    { id: "code", icon: Code, label: "Code Mode" },
    { id: "voice", icon: Mic, label: "Voice Mode" },
    { id: "image", icon: ImageIcon, label: "Image Mode" },
    { id: "history", icon: History, label: "History" },
  ]

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col"
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold text-white">SATURDAY</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentMode === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentMode === item.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => onModeChange(item.id)}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <User className="mr-2 h-5 w-5" />
          Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white" onClick={toggleTheme}>
          <Sun className="mr-2 h-5 w-5" />
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </motion.div>
  )
}
