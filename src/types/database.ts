export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          title: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          content: string
          is_bot: boolean
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          content: string
          is_bot?: boolean
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          content?: string
          is_bot?: boolean
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}