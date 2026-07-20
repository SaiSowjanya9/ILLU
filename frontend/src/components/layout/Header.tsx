import { useState } from 'react'
import type { JourneyStage } from '../../types'

type HeaderProps = {
  stage?: JourneyStage
  onLogoClick?: () => void
  onBack?: () => void
  showBackButton?: boolean
}

const stageLabels: Record<JourneyStage, string> = {
  greeting: 'Welcome',
  discovery: 'Learning About You',
  'team-working': 'Team Assembly',
  'design-review': 'Design Review',
  'financial-review': 'Financial Review',
  'proposal-ready': 'Your Proposal',
}

export function Header({ stage, onLogoClick, onBack, showBackButton = true }: HeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleBackClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmRestart = () => {
    setShowConfirm(false)
    onBack?.()
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-xl">
        <div className="flex h-20 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            {showBackButton && onBack && (
              <button
                type="button"
                onClick={handleBackClick}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={onLogoClick}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/logo.png" 
                alt="ILLU" 
                className="h-10 w-auto sm:h-12 lg:h-14 drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]" 
              />
            </button>
          </div>

          {stage && (
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              <span className="text-sm font-medium text-white/50">{stageLabels[stage]}</span>
            </div>
          )}
        </div>
      </header>

      {/* Restart Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Start Over?</h3>
            <p className="mt-3 text-sm text-white/50">
              Are you sure you want to restart? All your conversation progress will be lost.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestart}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] px-4 py-3 text-sm font-semibold text-black transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
