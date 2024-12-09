'use client'

import LiveChat from '@/components/live-chat'

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat ao Vivo</h1>
      <LiveChat chatId={params.id} />
    </div>
  )
}

