import { useState, useEffect } from 'react'
import { supabase, Chat } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setChats([])
      setLoading(false)
      return
    }

    fetchChats()

    // Subscribe to chat changes
    const subscription = supabase
      .channel('chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchChats()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchChats = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (!error && data) {
      setChats(data)
    }
    setLoading(false)
  }

  const createChat = async (title: string) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('chats')
      .insert([
        {
          title,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating chat:', error)
      return null
    }

    return data
  }

  const deleteChat = async (chatId: string) => {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)

    if (error) {
      console.error('Error deleting chat:', error)
      return false
    }

    return true
  }

  return {
    chats,
    loading,
    createChat,
    deleteChat,
    refetch: fetchChats,
  }
}