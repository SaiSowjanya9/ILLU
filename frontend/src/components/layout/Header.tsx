import { Avatar } from '../ui'
import { illu } from '../../data/team'
import type { JourneyStage } from '../../types'

type HeaderProps = {
  stage?: JourneyStage
  onLogoClick?: () => void
  showIlluStatus?: boolean
}

const stageLabels: Record<JourneyStage, string> = {
  greeting: 'Welcome',
  discovery: 'Learning About You',
  'team-working': 'Team Assembly',
  'design-review': 'Design Review',
  'financial-review': 'Financial Review',
  'proposal-ready': 'Your Proposal',
}

export function Header({ stage, onLogoClick, showIlluStatus = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-10">
        <button
          type="button"
          onClick={onLogoClick}
          className="illu-logo text-xl"
        >
          ILLU
        </button>

        {stage && (
          <div className="hidden items-center gap-3 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <span className="text-sm font-medium text-white/50">{stageLabels[stage]}</span>
          </div>
        )}

        {showIlluStatus && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Illu</p>
              <p className="text-xs text-white/30">Your Home Advisor</p>
            </div>
            <Avatar 
              name={illu.name}
              initial={illu.avatar}
              accentColor={illu.accentColor}
              size="md"
              status="working"
              showStatus
            />
          </div>
        )}
      </div>
    </header>
  )
}
