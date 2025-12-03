'use client'

import { useState, useRef, useEffect } from 'react'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const suggestions = [
  'What are the best for learning programming?',
  "What's the difference between upvotes and awards?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Seno Bot, your Senopost assistant.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage.content }],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const reply = data?.data?.reply ?? 'No reply from server.'

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            'Sorry, there was an error connecting to the server. Please try again.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col w-full">
        {/* Chat Header */}
        <div className="sticky top-12 z-40 bg-card border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Seno Bot</h1>
              <p className="text-xs text-muted-foreground">
                Your Senopost Assistant
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 pb-32 lg:pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse',
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={cn(
                    message.role === 'assistant'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary',
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5',
                  message.role === 'assistant'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-primary text-primary-foreground',
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="bg-secondary rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></span>
                  <span
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Try asking:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-sm px-3 py-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-14 lg:bottom-0 bg-card border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Seno Bot anything..."
              className="flex-1 rounded-full bg-secondary border-none"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
