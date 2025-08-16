import React from 'react'
import { AIIcon } from './AIIcon'

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-600 dark:to-pink-600 shadow-lg animate-pulse">
        <AIIcon className="text-white" size="sm" />
      </div>

      <div className="flex flex-col max-w-xs lg:max-w-md xl:max-w-lg items-start">
        <div className="px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 rounded-bl-sm relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient-x"></div>
          
          <div className="relative flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI is thinking</span>
            
            {/* Modern pulsing dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-pink-500 rounded-full animate-bounce-slow" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-pink-500 dark:to-blue-500 rounded-full animate-bounce-slow" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 dark:from-blue-500 dark:to-purple-500 rounded-full animate-bounce-slow" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent animate-shimmer"></div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-2 animate-pulse">
          Processing your request...
        </p>
      </div>
    </div>
  )
}