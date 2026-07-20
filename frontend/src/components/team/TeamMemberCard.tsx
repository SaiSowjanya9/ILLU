import { Avatar, Card } from '../ui'
import type { TeamMember } from '../../types'

type TeamMemberCardProps = {
  member: TeamMember
  showDetails?: boolean
  compact?: boolean
}

export function TeamMemberCard({ member, showDetails = true, compact = false }: TeamMemberCardProps) {
  if (compact) {
    return (
      <div 
        className="flex items-center gap-3 rounded-xl border border-[#C9A227]/15 bg-[#141414] px-4 py-3 transition-all duration-200 hover:border-[#C9A227]/30"
        style={{ borderColor: member.status === 'working' ? `${member.accentColor}50` : undefined }}
      >
        <Avatar 
          name={member.name} 
          initial={member.avatar} 
          accentColor={member.accentColor}
          size="sm"
          status={member.status}
          showStatus
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{member.name}</p>
          <p className="truncate text-xs text-white/50">{member.title}</p>
        </div>
        {member.status === 'working' && member.currentTask && (
          <span className="text-xs text-white/40">{member.currentTask}</span>
        )}
      </div>
    )
  }

  return (
    <Card variant="elevated" className="p-5">
      <div className="flex items-start gap-4">
        <Avatar 
          name={member.name} 
          initial={member.avatar} 
          accentColor={member.accentColor}
          size="lg"
          status={member.status}
          showStatus
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-white">{member.name}</h3>
          <p className="mt-0.5 text-sm" style={{ color: member.accentColor }}>{member.title}</p>
          
          {member.status === 'working' && member.currentTask && (
            <div className="mt-3 rounded-lg bg-[#C9A227]/10 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-wider text-[#C9A227]/70">Currently</p>
              <p className="mt-0.5 text-sm text-white/70">{member.currentTask}</p>
            </div>
          )}

          {showDetails && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Expertise</p>
              <div className="flex flex-wrap gap-1.5">
                {member.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-2 py-0.5 text-xs"
                    style={{ 
                      borderColor: `${member.accentColor}30`,
                      color: `${member.accentColor}cc`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
