import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Simulador de Chat Múltiplo</h1>
      <div className="flex gap-4">
        <Link href="/chats">
          <Button size="lg">Gerenciar Chats</Button>
        </Link>
        <Link href="/painel-controle">
          <Button size="lg">Painel de Controle</Button>
        </Link>
      </div>
    </main>
  )
}

