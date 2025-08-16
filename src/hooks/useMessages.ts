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

    // Subscribe to message changes with a simpler approach
    const subscription = supabase
      .channel(`messages_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('Message subscription triggered:', payload)
          const newMessage = payload.new as Message
          
          // Verify this message belongs to the current user and chat
          if (newMessage.user_id === user.id && newMessage.chat_id === chatId) {
            console.log('Adding message via subscription:', {
              id: newMessage.id,
              isBot: newMessage.is_bot,
              content: newMessage.content.substring(0, 50)
            })
            
            setMessages(prev => {
              // Check for duplicates
              const exists = prev.some(msg => msg.id === newMessage.id)
              if (exists) {
                console.log('Message already exists, skipping')
                return prev
              }
              
              // Add the new message and sort by timestamp
              const updated = [...prev, newMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              )
              
              // If it's a bot message, stop typing indicator
              if (newMessage.is_bot) {
                console.log('Bot message received, stopping typing indicator')
                setBotTyping(false)
              }
              
              return updated
            })
          } else {
            console.log('Message not for current user/chat, ignoring')
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
      // Insert user message first
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
        console.error('Error sending user message:', userError)
        return null
      }

      console.log('User message saved:', userMessage.id)

      // Add user message to state immediately (don't wait for subscription)
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === userMessage.id)
        if (exists) return prev
        return [...prev, userMessage].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })

      // Start bot typing indicator
      setBotTyping(true)
      console.log('Started bot typing indicator')

      // Call the chatbot function
      console.log('Calling chatbot Edge Function...')
      const response = await supabase.functions.invoke('chatbot', {
        body: {
          chat_id: chatId,
          message: content,
          user_id: user.id,
        },
      })

      console.log('Chatbot function response:', response)

      if (response.error) {
        console.error('Chatbot function error:', response.error)
        setBotTyping(false)
        
        // Add error message directly to state
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
        console.log('Chatbot function succeeded, waiting for bot message via subscription...')
        // The bot message will be added via the real-time subscription
        // If it doesn't arrive in 30 seconds, we'll stop the typing indicator
        setTimeout(() => {
          setBotTyping(false)
          console.log('Typing indicator timeout - stopped after 30 seconds')
        }, 30000)
      }

      return userMessage
    } catch (error) {
      console.error('Error in sendMessage:', error)
      setBotTyping(false)
      
      // Add error message to state
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        chat_id: chatId,
        content: 'Sorry, something went wrong. Please try again.',
        is_bot: true,
        user_id: user.id,
        created_at: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, errorMessage])
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