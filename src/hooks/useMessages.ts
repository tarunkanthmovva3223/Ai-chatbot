import { useState, useEffect } from 'react'
import { supabase, Message } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [botTyping, setBotTyping] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !chatId) {
      setMessages([])
      setLoading(false)
      return
    }

    console.log('Setting up messages for chat:', chatId)
    fetchMessages()

    // Subscribe to ALL message changes for this chat
    const subscription = supabase
      .channel(`chat-messages-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('New message received via subscription:', payload)
          const newMessage = payload.new as Message
          
          // Only add if it belongs to the current user and chat
          if (newMessage.user_id === user.id && newMessage.chat_id === chatId) {
            setMessages(prev => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some(msg => msg.id === newMessage.id)
              if (exists) {
                console.log('Message already exists, skipping')
                return prev
              }
              
              console.log('Adding new message to state:', newMessage.id, newMessage.is_bot ? 'bot' : 'user')
              const updated = [...prev, newMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              )
              
              // If it's a bot message, stop the typing indicator
              if (newMessage.is_bot) {
                setBotTyping(false)
              }
              
              return updated
            })
          }
        }
      )
      .subscribe((status) => {
        console.log('Messages subscription status:', status)
      })

    return () => {
      console.log('Cleaning up subscription for chat:', chatId)
      subscription.unsubscribe()
    }
  }, [user, chatId])

  const fetchMessages = async () => {
    if (!user || !chatId) return

    console.log('Fetching messages for chat:', chatId)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      console.log('Fetched messages:', data?.length)
      setMessages(data || [])
    }
    setLoading(false)
  }

  const sendMessage = async (content: string) => {
    if (!user || !chatId) return null

    console.log('Sending message:', content.substring(0, 50))

    try {
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

      console.log('User message saved:', userMessage.id)

      // Immediately add user message to local state
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === userMessage.id)
        if (exists) return prev
        return [...prev, userMessage].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })

      // Show bot typing indicator
      setBotTyping(true)

      // Call the chatbot function
      console.log('Calling chatbot function...')
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
        setBotTyping(false)
        
        // Add error message to chat
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          chat_id: chatId,
          content: 'Sorry, I encountered an error. Please try again.',
          is_bot: true,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMessage])
      } else {
        console.log('Chatbot function response:', botResponse)
        // Don't stop typing here - let the subscription handle it when the bot message arrives
      }

      return userMessage
    } catch (error) {
      console.error('Error with message sending:', error)
      setBotTyping(false)
      return null
    }
  }

  return {
    messages,
    loading,
    botTyping,
    sendMessage,
    refetch: fetchMessages,
  }
}