export interface Message {
  id: string
  name: string
  text: string
  timestamp: number
}

export interface ScheduledMessage {
  id: string
  name: string
  text: string
  delay: number
}

export interface Chat {
  id: string
  name: string
  messages: ScheduledMessage[]
}

