import { TeamMemberCard } from './TeamMemberCard'
import type { TeamMember } from '../../types'

type TeamGridProps = {
  members: TeamMember[]
  compact?: boolean
}

export function TeamGrid({ members, compact = false }: TeamGridProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} compact />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}

type TeamAssemblyAnimationProps = {
  members: TeamMember[]
  currentIndex: number
  onComplete?: () => void
}

export function TeamAssemblyAnimation({ 
  members, 
  currentIndex,
}: TeamAssemblyAnimationProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div 
            className="h-full bg-[#f5c95e] transition-all duration-700"
            style={{ width: `${((currentIndex + 1) / members.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-white/50">
          {currentIndex + 1} of {members.length}
        </span>
      </div>

      <div className="space-y-3">
        {members.slice(0, currentIndex + 1).map((member, index) => (
          <div
            key={member.id}
            className="animate-[fadeIn_500ms_ease-out] opacity-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TeamMemberCard member={member} showDetails={index === currentIndex} />
          </div>
        ))}
      </div>
    </div>
  )
}
