'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ScheduledMessage } from '@/types/chat'

interface MessageSchedulerProps {
  chatId: string
}

export default function MessageScheduler({ chatId }: MessageSchedulerProps) {
  const router = useRouter()
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [delay, setDelay] = useState('')

  useEffect(() => {
    const storedMessages = localStorage.getItem(`scheduledMessages_${chatId}`)
    if (storedMessages) {
      setScheduledMessages(JSON.parse(storedMessages))
    }
  }, [chatId])

  useEffect(() => {
    localStorage.setItem(`scheduledMessages_${chatId}`, JSON.stringify(scheduledMessages))
  }, [chatId, scheduledMessages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || !delay.trim()) return

    const newMessage: ScheduledMessage = {
      name,
      text: message,
      delay: parseInt(delay),
    }

    setScheduledMessages((prev) => [...prev, newMessage])
    setName('')
    setMessage('')
    setDelay('')
  }

  const handleDeleteMessage = (index: number) => {
    setScheduledMessages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleStartSimulation = () => {
    router.push(`/chat/${chatId}`)
  }

  const generateHtml = () => {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat ao Vivo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        #chat-container { max-width: 600px; margin: 20px auto; border: 1px solid #ccc; border-radius: 5px; }
        #chat-messages { height: 400px; overflow-y: auto; padding: 10px; }
        #chat-form { display: flex; padding: 10px; }
        #chat-input { flex-grow: 1; padding: 5px; }
        #chat-submit { padding: 5px 10px; background-color: #007bff; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <div id="chat-container">
        <div id="chat-messages"></div>
        <form id="chat-form">
            <input type="text" id="chat-input" placeholder="Digite sua mensagem...">
            <button type="submit" id="chat-submit">Enviar</button>
        </form>
    </div>
    <script>
        const chatMessages = document.getElementById('chat-messages');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const scheduledMessages = ${JSON.stringify(scheduledMessages)};

        function addMessage(name, text) {
            const messageElement = document.createElement('p');
            messageElement.textContent = `${name}: ${text}`;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                addMessage('Você', message);
                chatInput.value = '';
            }
        });

        scheduledMessages.forEach((msg) => {
            setTimeout(() => {
                addMessage(msg.name, msg.text);
            }, msg.delay * 1000);
        });
    </script>
</body>
</html>
    `.trim()

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat_${chatId}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Programar Mensagens</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome do usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Tempo em segundos"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Adicionar Mensagem
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Mensagens Programadas</h3>
          {scheduledMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma mensagem programada.
            </p>
          ) : (
            <div className="space-y-2">
              {scheduledMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{msg.name}</p>
                    <p className="text-sm text-muted-foreground">{msg.text}</p>
                    <p className="text-sm text-muted-foreground">
                      Tempo: {msg.delay}s
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMessage(index)}
                  >
                    Excluir
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            onClick={handleStartSimulation}
            disabled={scheduledMessages.length === 0}
          >
            Iniciar Simulação
          </Button>
          <Button onClick={generateHtml} variant="outline">
            Gerar HTML
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

