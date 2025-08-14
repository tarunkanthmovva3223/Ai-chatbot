import { useState, useEffect } from 'react'
import { supabase, Message } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !chatId) {
      setMessages([])
      setLoading(false)
      return
    }

    fetchMessages()

    // Subscribe to message changes
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, chatId])

  const fetchMessages = async () => {
    if (!user || !chatId) return

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const sendMessage = async (content: string) => {
    if (!user || !chatId) return null

    // Insert user message
    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          content,
          is_bot: false,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (userError) {
      console.error('Error sending message:', userError)
      return null
    }

    // Call the chatbot function
    try {
      const { data: botResponse, error: functionError } = await supabase.functions.invoke(
        'chatbot',
        {
          body: {
            chat_id: chatId,
            message: content,
            user_id: user.id,
          },
        }
      )

      if (functionError) {
        console.error('Error calling chatbot function:', functionError)
        return userMessage
      }

      return userMessage
    } catch (error) {
      console.error('Error with chatbot:', error)
      return userMessage
    }
  }

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
  }
}