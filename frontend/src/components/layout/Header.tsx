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
    <header className="sticky top-0 z-50 border-b border-[#C9A227]/10 bg-[#0D0D0D]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          type="button"
          onClick={onLogoClick}
          className="text-lg font-semibold tracking-[0.35em] text-[#C9A227] transition hover:text-[#E5C158]"
        >
          ILLU
        </button>

        {stage && (
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" />
            <span className="text-sm text-white/50">{stageLabels[stage]}</span>
          </div>
        )}

        {showIlluStatus && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Illu</p>
              <p className="text-xs text-white/35">Your Home Advisor</p>
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
