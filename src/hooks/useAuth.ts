import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.VITE_SUPABASE_URL
    const supabaseKey = import.meta.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase configuration missing. Please connect to Supabase.')
      setLoading(false)
      return
    }

    console.log('Supabase configured, checking session...')

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error)
        setError(error.message)
      } else {
        console.log('Initial session:', !!session)
        setUser(session?.user || null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, !!session)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('Sign in result:', { success: !!data.user, error: error?.message })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    console.log('Attempting sign up for:', email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log('Sign up result:', { success: !!data.user, error: error?.message })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }
}
