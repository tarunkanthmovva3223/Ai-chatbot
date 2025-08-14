import React from 'react'
import { Message } from '../lib/supabase'
import { Bot, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.is_bot
  const timestamp = formatDistanceToNow(new Date(message.created_at), { addSuffix: true })

  return (
    <div className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-blue-100' : 'bg-green-100'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-blue-600" />
        ) : (
          <User className="w-5 h-5 text-green-600" />
        )}
      </div>

      <div className={`flex flex-col max-w-xs lg:max-w-md xl:max-w-lg ${
        isBot ? 'items-start' : 'items-end'
      }`}>
        <div className={`px-4 py-2 rounded-2xl ${
          isBot
            ? 'bg-gray-100 text-gray-900 rounded-bl-sm'
            : 'bg-blue-600 text-white rounded-br-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <p className="text-xs text-gray-500 mt-1 px-2">
          {timestamp}
        </p>
      </div>
    </div>
  )
}