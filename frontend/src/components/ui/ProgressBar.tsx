type ProgressBarProps = {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  animate?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  animate = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-white/50">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-[#C9A227]">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full bg-gradient-to-r from-[#9A7B1A] via-[#C9A227] to-[#E5C158] transition-all duration-500 ${
            animate ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

type StepIndicatorProps = {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className = '' }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
              index < currentStep
                ? 'bg-gradient-to-br from-[#C9A227] to-[#9A7B1A] text-[#0D0D0D]'
                : index === currentStep
                ? 'border-2 border-[#C9A227] text-[#C9A227]'
                : 'border border-white/15 text-white/30'
            }`}
          >
            {index < currentStep ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 transition-all duration-300 ${
                index < currentStep ? 'bg-[#C9A227]' : 'bg-white/15'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
