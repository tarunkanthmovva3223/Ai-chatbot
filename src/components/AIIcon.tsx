import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface AIIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AIIcon({ className = '', size = 'md' }: AIIconProps) {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (theme === 'dark') {
    // Futuristic AI icon for dark theme
    return (
      <svg 
        className={`${sizeClasses[size]} ${className}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="darkAI" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Neural network nodes */}
        <circle cx="6" cy="6" r="2" fill="url(#darkAI)" filter="url(#glow)" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="18" cy="6" r="2" fill="url(#darkAI)" filter="url(#glow)" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="6" cy="18" r="2" fill="url(#darkAI)" filter="url(#glow)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="18" cy="18" r="2" fill="url(#darkAI)" filter="url(#glow)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="12" cy="12" r="3" fill="url(#darkAI)" filter="url(#glow)">
          <animate attributeName="r" values="3;3.5;3" dur="1.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Connecting lines */}
        <line x1="6" y1="6" x2="12" y2="12" stroke="url(#darkAI)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="18" y1="6" x2="12" y2="12" stroke="url(#darkAI)" strokeWidth="1" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="6" y1="18" x2="12" y2="12" stroke="url(#darkAI)" strokeWidth="1" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="18" y1="18" x2="12" y2="12" stroke="url(#darkAI)" strokeWidth="1" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite" />
        </line>
      </svg>
    )
  }

  // Clean, professional AI icon for light theme
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lightAI" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      
      {/* Brain/chip design */}
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="url(#lightAI)" strokeWidth="2" />
      
      {/* Circuit patterns */}
      <path d="M8 8h2v2H8V8zM14 8h2v2h-2V8zM8 14h2v2H8v-2zM14 14h2v2h-2v-2z" fill="url(#lightAI)" opacity="0.7" />
      
      {/* Central processing unit */}
      <rect x="10" y="10" width="4" height="4" rx="1" fill="url(#lightAI)" />
      
      {/* Connection lines */}
      <path d="M10 8v2M14 8v2M8 10h2M14 10h2M10 14v2M14 14v2M8 14h2M14 14h2" 
            stroke="url(#lightAI)" strokeWidth="1" opacity="0.5" />
      
      {/* Animated pulse */}
      <circle cx="12" cy="12" r="1" fill="url(#lightAI)">
        <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}