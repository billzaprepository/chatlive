'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Message, ScheduledMessage, Chat } from '@/types/chat'

interface LiveChatProps {
  chatId: string
}

export default function LiveChat({ chatId }: LiveChatProps) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const storedChats = localStorage.getItem('chats')
    if (storedChats) {
      const chats: Chat[] = JSON.parse(storedChats)
      const currentChat = chats.find(c => c.id === chatId)
      if (currentChat) {
        setChat(currentChat)
        startSimulation(currentChat.messages)
      }
    }
  }, [chatId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      name,
      text: message,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage('')
  }

  const startSimulation = (scheduledMessages: ScheduledMessage[]) => {
    setIsSimulating(true)
    setMessages([])

    scheduledMessages.forEach((scheduledMessage) => {
      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          name: scheduledMessage.name,
          text: scheduledMessage.text,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, newMessage])
      }, scheduledMessage.delay * 1000)
    })
  }

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto">
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="bg-blue-500 text-white p-4 text-center font-medium">
          {chat ? chat.name : 'Chat ao vivo'}
        </div>
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="break-words">
                <span className="font-semibold">{msg.name}: </span>
                <span>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 space-y-4">
          <Input
            placeholder="Digite seu nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Envie uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px]"
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Enviar
          </Button>
        </form>
      </div>
    </div>
  )
}

