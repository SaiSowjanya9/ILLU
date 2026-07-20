import { useState, useEffect } from 'react'
import { Header } from '../components/layout'
import { TeamMemberCard } from '../components/team'
import { Avatar } from '../components/ui'
import { illu, teamMembers } from '../data/team'
import type { TeamMember } from '../types'

type TeamAssemblyScreenProps = {
  onComplete: () => void
  onLogoClick: () => void
}

const assemblySequence: { memberId: string; task: string; duration: number }[] = [
  { memberId: 'maya', task: 'Reviewing lifestyle requirements...', duration: 2000 },
  { memberId: 'ethan', task: 'Preparing budget analysis...', duration: 1800 },
  { memberId: 'olivia', task: 'Selecting material options...', duration: 1600 },
]

export function TeamAssemblyScreen({ onComplete, onLogoClick }: TeamAssemblyScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assembledMembers, setAssembledMembers] = useState<TeamMember[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentStep >= assemblySequence.length) {
      setIsComplete(true)
      const completeTimer = setTimeout(onComplete, 1500)
      return () => clearTimeout(completeTimer)
    }

    const step = assemblySequence[currentStep]
    const member = teamMembers.find(m => m.id === step.memberId)
    
    if (member) {
      setAssembledMembers(prev => [
        ...prev, 
        { ...member, status: 'working', currentTask: step.task }
      ])
    }

    const timer = setTimeout(() => {
      setAssembledMembers(prev => 
        prev.map(m => m.id === step.memberId ? { ...m, status: 'complete', currentTask: undefined } : m)
      )
      setCurrentStep(s => s + 1)
    }, step.duration)

    return () => clearTimeout(timer)
  }, [currentStep, onComplete])

  const progress = Math.round((currentStep / assemblySequence.length) * 100)

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0D0D]">
      <Header stage="team-working" onLogoClick={onLogoClick} />

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-10 flex items-center gap-5">
            <Avatar 
              name={illu.name}
              initial={illu.avatar}
              accentColor={illu.accentColor}
              size="lg"
              status="working"
              showStatus
            />
            <div>
              <h1 className="text-2xl font-medium text-white">Assembling Your Team</h1>
              <p className="mt-1.5 text-white/40">
                I'm bringing in specialists based on your needs
              </p>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-1.5 bg-gradient-to-r from-[#9A7B1A] via-[#C9A227] to-[#E5C158] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-4">
            {assembledMembers.map((member) => (
              <div
                key={member.id}
                className="animate-[fadeIn_400ms_ease-out]"
              >
                <TeamMemberCard member={member} showDetails={false} />
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="mt-10 animate-[fadeIn_500ms_ease-out] rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-6 text-center">
              <p className="text-lg font-medium text-white">Team Assembled</p>
              <p className="mt-2 text-sm text-white/50">
                Your specialists are ready to present design options...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
