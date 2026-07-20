import { useRef, useEffect, useState } from 'react'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const isProfileComplete = profileProgress === 100

  return (
    <div className="flex h-screen flex-col bg-[#030303]">
      <Header stage="discovery" onLogoClick={onLogoClick} onBack={onLogoClick} />

      <main className="relative flex flex-1 overflow-hidden">
        {/* Collapsible Chat Sidebar */}
        <section 
          className={`flex flex-col border-r border-white/5 bg-[#0a0a0a] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-full lg:w-[420px]' : 'w-0 lg:w-0 overflow-hidden'
          }`}
        >
          <div className="border-b border-white/5 px-5 py-4">
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

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 z-50 -translate-y-1/2 flex h-10 w-6 items-center justify-center rounded-r-lg border border-l-0 border-white/10 bg-[#0a0a0a] text-white/50 transition-all hover:bg-[#111] hover:text-white lg:hidden"
          style={{ left: isSidebarOpen ? '100%' : '0' }}
        >
          <svg className={`h-4 w-4 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a] text-white/50 shadow-lg transition-all hover:border-[#D4AF37]/30 hover:bg-[#111] hover:text-white lg:flex"
          style={{ 
            left: isSidebarOpen ? '400px' : '16px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <svg className={`h-5 w-5 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <section className="hidden flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.05),transparent_50%)] px-8 py-6 lg:block">
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]/70">
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
                <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]/70">
                  Your Team
                </h3>
                <TeamGrid members={activeTeamMembers} compact />
              </div>
            )}

            {activeTeamMembers.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]/70">
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
              <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">
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
