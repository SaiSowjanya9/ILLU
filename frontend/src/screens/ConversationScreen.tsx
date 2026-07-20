import { useRef, useEffect } from 'react'
import { Header } from '../components/layout'
import { ChatMessage, ChatInput } from '../components/chat'
import { ProfileCard } from '../components/profile'
import { TeamGrid } from '../components/team'
import { Button } from '../components/ui'
import { teamMembers } from '../data/team'
import type { ChatMessage as ChatMessageType, CustomerHomeProfile, FieldSources, TeamMember } from '../types'

type ConversationScreenProps = {
  messages: ChatMessageType[]
  profile: CustomerHomeProfile
  fieldSources: FieldSources
  activeTeamMembers: TeamMember[]
  isProcessing: boolean
  profileProgress: number
  onSendMessage: (message: string) => Promise<void>
  onProceedToDesign: () => void
  onLogoClick: () => void
}

export function ConversationScreen({
  messages,
  profile,
  fieldSources,
  activeTeamMembers,
  isProcessing,
  profileProgress,
  onSendMessage,
  onProceedToDesign,
  onLogoClick,
}: ConversationScreenProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const isProfileComplete = profileProgress === 100

  return (
    <div className="flex h-screen flex-col bg-[#0D0D0D]">
      <Header stage="discovery" onLogoClick={onLogoClick} />

      <main className="flex flex-1 overflow-hidden">
        <section className="flex w-full flex-col border-r border-[#C9A227]/10 bg-[#141414] lg:w-[480px]">
          <div className="border-b border-[#C9A227]/10 px-5 py-4">
            <h2 className="text-lg font-medium text-white">Conversation with Illu</h2>
            <p className="mt-1 text-sm text-white/40">
              Continue sharing details about your dream home
            </p>
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isProcessing && (
              <ChatMessage 
                message={{
                  id: 'typing',
                  sender: 'Illu',
                  text: '',
                  timestamp: new Date(),
                  isTyping: true,
                }}
              />
            )}
          </div>

          <ChatInput 
            onSend={onSendMessage}
            disabled={isProcessing}
            placeholder="Tell me more about your home..."
          />
        </section>

        <section className="hidden flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.05),transparent_50%)] px-8 py-6 lg:block">
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
                Building Your Profile
              </p>
              <h2 className="mt-3 text-2xl font-medium text-white">
                Your Home Is Taking Shape
              </h2>
              <p className="mt-2 text-sm text-white/40">
                As we talk, I'm capturing your preferences and assembling your team.
              </p>
            </div>

            <ProfileCard profile={profile} fieldSources={fieldSources} />

            {activeTeamMembers.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
                  Your Team
                </h3>
                <TeamGrid members={activeTeamMembers} compact />
              </div>
            )}

            {activeTeamMembers.length === 0 && (
              <div className="rounded-2xl border border-[#C9A227]/15 bg-[#141414] p-5">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
                  Available Specialists
                </h3>
                <p className="mt-3 text-sm text-white/35">
                  As I learn more about your needs, I'll bring in the right experts.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {teamMembers.slice(0, 4).map((member) => (
                    <span 
                      key={member.id}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40"
                    >
                      {member.name} · {member.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isProfileComplete && (
              <div className="rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-5">
                <h3 className="text-lg font-medium text-white">Profile Complete</h3>
                <p className="mt-2 text-sm text-white/50">
                  I've gathered enough to show you design options. Ready to continue?
                </p>
                <Button className="mt-4" onClick={onProceedToDesign}>
                  Review Design Options
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
