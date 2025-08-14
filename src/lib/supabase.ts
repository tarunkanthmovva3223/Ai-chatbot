import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase config:', { 
  url: supabaseUrl ? 'configured' : 'missing', 
  key: supabaseKey ? 'configured' : 'missing' 
})

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export type Chat = Database['public']['Tables']['chats']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type InsertChat = Database['public']['Tables']['chats']['Insert']
export type InsertMessage = Database['public']['Tables']['messages']['Insert']