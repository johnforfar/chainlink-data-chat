"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePriceFeed } from "@/hooks/chainlink/usePriceFeed"
import { useCommoditiesMetadata } from "@/hooks/chainlink/useCommoditiesMetadata"
import { commoditiesENS } from "@/components/chainlink/datafeed"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export function ChainlinkChatbot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    
    const metadata = useCommoditiesMetadata({ commoditiesENS })
    const { priceFeed, dataUpdatedAt } = usePriceFeed({ priceFeeds: metadata })
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      console.log("Form submitted with input:", input)
      
      // Add user message
      const userMessage: Message = {
        role: "user",
        content: input,
        timestamp: Date.now()
      }
      
      setMessages(prev => [...prev, userMessage])
      setInput("")
      
      try {
        console.log("Attempting to call AI backend...")
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        })
        
        console.log("Response received:", response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("AI response data:", data)
        
        // Add AI response to messages
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.response,
          timestamp: Date.now()
        }])
      } catch (error) {
        console.error("Error calling AI backend:", error)
        // Optionally add an error message to the chat
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
          timestamp: Date.now()
        }])
      }
    }

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.role === "user" 
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border p-2"
          placeholder="Ask about Chainlink price feeds..."
        />
      </form>
    </div>
  )
} 