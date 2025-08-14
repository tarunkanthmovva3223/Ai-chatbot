import React, { useState, useRef, useEffect } from 'react'
import { useMessages } from '../hooks/useMessages'
import { Chat } from '../lib/supabase'
import { MessageBubble } from './MessageBubble'
import { Send, Loader2 } from 'lucide-react'

interface ChatInterfaceProps {
  chat: Chat
}

export function ChatInterface({ chat }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { messages, loading, sendMessage } = useMessages(chat.id)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    try {
      await sendMessage(message.trim())
      setMessage('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{chat.title}</h2>
        <p className="text-sm text-gray-500">AI-powered conversation</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Start a conversation with the AI assistant!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center min-w-[100px]"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}