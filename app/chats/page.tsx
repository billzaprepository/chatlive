import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function ChatsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gerenciar Chats</h1>
      <div className="flex justify-center">
        <Link href="/painel-controle">
          <Button size="lg">Ir para o Painel de Controle</Button>
        </Link>
      </div>
    </div>
  )
}

