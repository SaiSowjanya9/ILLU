import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  className?: string
  onClick?: () => void
  selected?: boolean
}

export function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  selected = false,
}: CardProps) {
  const baseClasses = 'rounded-2xl transition-all duration-300'
  
  const variantClasses = {
    default: 'border border-[#C9A227]/15 bg-[#141414]',
    elevated: 'border border-[#C9A227]/20 bg-[#1A1A1A] shadow-2xl shadow-black/50',
    outlined: 'border border-[#C9A227]/25 bg-transparent',
  }

  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:border-[#C9A227]/40 hover:bg-[#1A1A1A]' 
    : ''

  const selectedClasses = selected 
    ? 'border-[#C9A227] shadow-lg shadow-[#C9A227]/15' 
    : ''

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${selectedClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-[#C9A227]/15 px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

type CardContentProps = {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}
