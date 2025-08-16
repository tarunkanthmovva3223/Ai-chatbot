import React, { useState } from 'react'
import { useChats } from '../hooks/useChats'
import { Chat } from '../lib/supabase'
import { ChatSidebar } from './ChatSidebar'
import { ChatInterface } from './ChatInterface'
import { ThemeToggle } from './ThemeToggle'
import { MessageCircle } from 'lucide-react'

export function ChatApp() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const { createChat } = useChats()

  const handleCreateChat = async () => {
    const title = `Chat ${new Date().toLocaleString()}`
    const newChat = await createChat(title)
    
    if (newChat) {
      setSelectedChat(newChat)
    }
  }

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <ChatSidebar
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onCreateChat={handleCreateChat}
      />
      
      <div className="flex-1 flex">
        {selectedChat ? (
          <ChatInterface chat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Select a chat from the sidebar or create a new one to get started
              </p>
              <button
                onClick={handleCreateChat}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}