import { useState, useEffect, useCallback } from 'react'
import { supabase, Message } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [botTyping, setBotTyping] = useState(false)
  const { user } = useAuth()

  // Polling mechanism to ensure messages appear
  const pollForNewMessages = useCallback(async () => {
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
  }, [user, chatId])

  useEffect(() => {
    if (!user || !chatId) {
      setMessages([])
      setLoading(false)
      return
    }

    console.log('Setting up messages for chat:', chatId)
    fetchMessages()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages_${chatId}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('Real-time message update:', payload)
          // Immediately poll for latest messages
          pollForNewMessages()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, chatId, pollForNewMessages])

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
      // Insert user message and show immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        chat_id: chatId,
        content,
        is_bot: false,
        user_id: user.id,
        created_at: new Date().toISOString(),
      }

      // Add user message to UI immediately
      setMessages(prev => [...prev, userMessage])

      // Save to database
      const { data: savedUserMessage, error: userError } = await supabase
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
        console.error('Error saving user message:', userError)
        return null
      }

      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? savedUserMessage : msg
        )
      )

      // Start bot typing
      setBotTyping(true)

      // Call chatbot function
      const response = await supabase.functions.invoke('chatbot', {
        body: {
          chat_id: chatId,
          message: content,
          user_id: user.id,
        },
      })

      if (response.error) {
        console.error('Chatbot function error:', response.error)
        setBotTyping(false)
        
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          chat_id: chatId,
          content: 'Sorry, I encountered an error. Please try again.',
          is_bot: true,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }
        
        setMessages(prev => [...prev, errorMessage])
        return null
      }

      // Poll for bot response every 500ms for up to 15 seconds
      let attempts = 0
      const maxAttempts = 30
      
      const pollForBotResponse = async () => {
        attempts++
        
        const { data: latestMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (latestMessages) {
          const botMessage = latestMessages.find(msg => 
            msg.is_bot && 
            new Date(msg.created_at) > new Date(savedUserMessage.created_at)
          )

          if (botMessage) {
            console.log('Bot response found via polling!')
            setMessages(latestMessages)
            setBotTyping(false)
            return
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(pollForBotResponse, 500)
        } else {
          console.log('Polling timeout - no bot response received')
          setBotTyping(false)
          
          const timeoutMessage: Message = {
            id: `timeout-${Date.now()}`,
            chat_id: chatId,
            content: 'Sorry, the response is taking longer than expected. Please try again.',
            is_bot: true,
            user_id: user.id,
            created_at: new Date().toISOString(),
          }
          
          setMessages(prev => [...prev, timeoutMessage])
        }
      }

      // Start polling after a short delay
      setTimeout(pollForBotResponse, 1000)

      return savedUserMessage
    } catch (error) {
      console.error('Error in sendMessage:', error)
      setBotTyping(false)
      
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