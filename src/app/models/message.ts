export interface Message {

  message_id?: number,
  text: string,
  url: string,
  type: string,
  created_at: Date,
  chats_chat_id: number,
  users_user_id: number
  
}
