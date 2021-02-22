import { User } from "./user";

export interface Message {

  user: User
  text: string
  url: string
  type: string
  chats_chat_id: number
  created_at: Date
  
}
