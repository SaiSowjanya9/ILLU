type AvatarProps = {
  name: string
  initial: string
  accentColor: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'idle' | 'working' | 'complete'
  showStatus?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

export function Avatar({ 
  name, 
  initial, 
  accentColor, 
  size = 'md', 
  status = 'idle',
  showStatus = false 
}: AvatarProps) {
  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full font-semibold`}
        style={{ 
          backgroundColor: `${accentColor}22`,
          color: accentColor,
          border: `2px solid ${accentColor}66`,
        }}
        title={name}
      >
        {initial}
      </div>
      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0d0b07] ${
            status === 'working' 
              ? 'animate-pulse bg-amber-400' 
              : status === 'complete' 
              ? 'bg-emerald-400' 
              : 'bg-white/30'
          }`}
        />
      )}
    </div>
  )
}
