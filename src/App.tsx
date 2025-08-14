import React from 'react'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/AuthForm'
import { ChatApp } from './components/ChatApp'
import { Loader2 } from 'lucide-react'

function App() {
  const { user, loading } = useAuth()

  // Debug logging
  console.log('App render - user:', user, 'loading:', loading)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <ChatApp /> : <AuthForm />
}

export default App