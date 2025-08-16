import React from 'react'
import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
        <Bot className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex flex-col max-w-xs lg:max-w-md xl:max-w-lg items-start">
        <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-sm">
          <div className="flex space-x-1 items-center">
            <span className="text-sm text-gray-600 mr-2">AI is thinking</span>
            <div className="flex space-x-1">
              <div 
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                style={{ animationDelay: '0ms', animationDuration: '1s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                style={{ animationDelay: '150ms', animationDuration: '1s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                style={{ animationDelay: '300ms', animationDuration: '1s' }}
              ></div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1 px-2">
          Generating response...
        </p>
      </div>
    </div>
  )
}