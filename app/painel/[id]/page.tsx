'use client'

import MessageScheduler from '@/components/message-scheduler'

export default function PainelPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Painel de Gerenciamento</h1>
      <MessageScheduler chatId={params.id} />
    </div>
  )
}

