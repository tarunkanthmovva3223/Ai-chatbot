import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase initialization:', { 
  hasUrl: !!supabaseUrl, 
  hasKey: !!supabaseKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing'
})

// Create client even if credentials are missing to avoid errors
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)

export type Chat = Database['public']['Tables']['chats']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type InsertChat = Database['public']['Tables']['chats']['Insert']
export type InsertMessage = Database['public']['Tables']['messages']['Insert']
