import React from 'react'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/AuthForm'
import { ChatApp } from './components/ChatApp'
import { Loader2, AlertCircle } from 'lucide-react'

function App() {
  const { user, loading, error } = useAuth()

  console.log('App render state:', { user: !!user, loading, error })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please click "Connect to Supabase" in the top right to configure your database connection.
          </p>
        </div>
      </div>
    )
  }

  return user ? <ChatApp /> : <AuthForm />
}

export default App