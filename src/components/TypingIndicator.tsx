import React from 'react'
import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>

      <div className="flex flex-col max-w-xs lg:max-w-md xl:max-w-lg items-start">
        <div className="px-6 py-4 rounded-2xl bg-white shadow-md border border-gray-100 rounded-bl-sm relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 animate-gradient-x"></div>
          
          <div className="relative flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">AI is generating response</span>
            
            {/* Modern pulsing dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-scale" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse-scale" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-scale" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 px-2 animate-pulse">
          Processing your request...
        </p>
      </div>
    </div>
  )
}