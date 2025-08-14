import React, { useState } from 'react'
import { useChats } from '../hooks/useChats'
import { useAuth } from '../hooks/useAuth'
import { Chat } from '../lib/supabase'
import { Plus, MessageCircle, Trash2, LogOut, User } from 'lucide-react'

interface ChatSidebarProps {
  selectedChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onCreateChat: () => void
}

export function ChatSidebar({ selectedChat, onSelectChat, onCreateChat }: ChatSidebarProps) {
  const { chats, loading, deleteChat } = useChats()
  const { user, signOut } = useAuth()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleting(chatId)
    
    try {
      await deleteChat(chatId)
    } finally {
      setDeleting(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
          </div>
          <button
            onClick={onCreateChat}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* User Info */}
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span className="truncate">{user?.email}</span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id
                    ? 'bg-blue-100 border-l-4 border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  disabled={deleting === chat.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                  title="Delete Chat"
                >
                  {deleting === chat.id ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
            
            {chats.length === 0 && (
              <div className="text-center py-12 px-4">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  No chats yet. Create your first chat to get started!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  )
}