'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Chat, ScheduledMessage } from '@/types/chat'

export default function ControlPanel() {
  const [chats, setChats] = useState<Chat[]>([])
  const [newChatName, setNewChatName] = useState('')
  const [editingChat, setEditingChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState<ScheduledMessage>({ id: '', name: '', text: '', delay: 0 })

  useEffect(() => {
    const storedChats = localStorage.getItem('chats')
    if (storedChats) {
      setChats(JSON.parse(storedChats))
    }
  }, [])

  const saveChats = (updatedChats: Chat[]) => {
    setChats(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats))
  }

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatName.trim()) return

    const newChat: Chat = {
      id: Date.now().toString(),
      name: newChatName.trim(),
      messages: []
    }

    saveChats([...chats, newChat])
    setNewChatName('')
  }

  const handleEditChat = (chat: Chat) => {
    setEditingChat({ ...chat, messages: [...chat.messages] })
  }

  const handleUpdateChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingChat || !editingChat.name.trim()) return

    const updatedChats = chats.map(chat => 
      chat.id === editingChat.id ? editingChat : chat
    )

    saveChats(updatedChats)
    setEditingChat(null)
  }

  const handleDeleteChat = (id: string) => {
    const updatedChats = chats.filter(chat => chat.id !== id)
    saveChats(updatedChats)
  }

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingChat || !newMessage.name.trim() || !newMessage.text.trim()) return

    const updatedMessages = [...editingChat.messages, { ...newMessage, id: Date.now().toString() }]
    setEditingChat({ ...editingChat, messages: updatedMessages })
    setNewMessage({ id: '', name: '', text: '', delay: 0 })
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!editingChat) return

    const updatedMessages = editingChat.messages.filter(msg => msg.id !== messageId)
    setEditingChat({ ...editingChat, messages: updatedMessages })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Painel de Controle</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Criar Novo Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateChat} className="flex space-x-2">
            <Input
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="Nome do novo chat"
            />
            <Button type="submit">Criar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chats Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Mensagens Programadas</TableHead>
                <TableHead>Link do Chat</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell>{chat.name}</TableCell>
                  <TableCell>{chat.messages.length}</TableCell>
                  <TableCell>
                    <Link href={`/chat/${chat.id}`} className="text-blue-500 hover:underline">
                      Acessar Chat
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEditChat(chat)}>Editar</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Editar Chat</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdateChat} className="space-y-4">
                            <div>
                              <Label htmlFor="chatName">Nome do Chat</Label>
                              <Input
                                id="chatName"
                                value={editingChat?.name || ''}
                                onChange={(e) => setEditingChat(prev => prev ? {...prev, name: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label>Mensagens Programadas</Label>
                              <ScrollArea className="h-[200px] border rounded-md p-4">
                                {editingChat?.messages.map((msg) => (
                                  <div key={msg.id} className="flex items-center space-x-2 mb-2">
                                    <span>{msg.name}: {msg.text} ({msg.delay}s)</span>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(msg.id)}>Remover</Button>
                                  </div>
                                ))}
                              </ScrollArea>
                            </div>
                            <div>
                              <Label>Adicionar Nova Mensagem</Label>
                              <div className="space-y-2">
                                <Input
                                  placeholder="Nome do Usuário"
                                  value={newMessage.name}
                                  onChange={(e) => setNewMessage({...newMessage, name: e.target.value})}
                                />
                                <Textarea
                                  placeholder="Mensagem"
                                  value={newMessage.text}
                                  onChange={(e) => setNewMessage({...newMessage, text: e.target.value})}
                                />
                                <Input
                                  type="number"
                                  placeholder="Tempo após início (segundos)"
                                  value={newMessage.delay}
                                  onChange={(e) => setNewMessage({...newMessage, delay: parseInt(e.target.value)})}
                                />
                                <Button onClick={handleAddMessage}>Adicionar Mensagem</Button>
                              </div>
                            </div>
                            <Button type="submit">Salvar Alterações</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteChat(chat.id)}>Excluir</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

