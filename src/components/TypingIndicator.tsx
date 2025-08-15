import React from 'react'
import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
        <Bot className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex flex-col max-w-xs lg:max-w-md xl:max-w-lg items-start">
        <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1 px-2">
          AI is thinking...
        </p>
      </div>
    </div>
  )
}