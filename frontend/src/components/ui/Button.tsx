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
  primary: 'bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-black border-transparent hover:shadow-[0_20px_40px_rgba(212,175,55,0.35)] hover:-translate-y-0.5',
  secondary: 'bg-white/5 text-white border-white/10 hover:border-[#D4AF37]/30 hover:bg-white/10 backdrop-blur-sm',
  ghost: 'bg-transparent text-white/60 border-transparent hover:bg-white/5 hover:text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-5 text-xs rounded-xl',
  md: 'min-h-12 px-7 text-sm rounded-2xl',
  lg: 'min-h-14 px-9 text-base rounded-2xl',
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
        inline-flex items-center justify-center gap-2 border font-semibold 
        transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2 focus:ring-offset-[#030303]
        disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-0
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
