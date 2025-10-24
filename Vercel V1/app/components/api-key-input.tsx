"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LockIcon } from "lucide-react"

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [key, setKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(key)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4 bg-gray-800 rounded-md p-2">
        <LockIcon className="text-red-500 mr-2" />
        <Input
          type="password"
          placeholder="AIzaSyDgEGDbhyOk_xTYwex2p_UtP9Mz5cWHLdY"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
        />
      </div>
      <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
        Activate Mio AI
      </Button>
    </motion.form>
  )
}
