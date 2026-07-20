import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#C9A227] to-[#E5C158] text-[#0D0D0D] border-[#C9A227]/60 hover:from-[#E5C158] hover:to-[#C9A227] shadow-lg shadow-[#C9A227]/20',
  secondary: 'bg-transparent text-[#C9A227] border-[#C9A227]/40 hover:bg-[#C9A227]/10 hover:border-[#C9A227]/60',
  ghost: 'bg-transparent text-white/70 border-transparent hover:bg-white/5 hover:text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-xs',
  md: 'min-h-11 px-6 text-sm',
  lg: 'min-h-14 px-8 text-base',
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  loading = false,
  disabled,
  className = '',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg border font-semibold 
        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:ring-offset-2 focus:ring-offset-[#0D0D0D]
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
