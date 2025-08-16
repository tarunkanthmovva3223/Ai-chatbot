import React from 'react'
import { Message } from '../lib/supabase'
import { Bot, User, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.is_bot
  const timestamp = formatDistanceToNow(new Date(message.created_at), { addSuffix: true })

  return (
    <div className={`flex items-start space-x-3 animate-fade-in ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isBot 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 animate-glow' 
          : 'bg-gradient-to-r from-green-500 to-emerald-600'
      }`}>
        {isBot ? (
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`flex flex-col max-w-xs lg:max-w-md xl:max-w-lg ${
        isBot ? 'items-start' : 'items-end'
      }`}>
        <div className={`px-5 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${
          isBot
            ? 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm hover:border-blue-200'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm hover:from-blue-700 hover:to-blue-800'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 px-2 font-medium">
          {timestamp}
        </p>
      </div>
    </div>
  )
}