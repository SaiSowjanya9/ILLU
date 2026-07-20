import { Avatar } from '../ui'
import type { ChatMessage as ChatMessageType } from '../../types'
import { illu, teamMembers } from '../../data/team'

type ChatMessageProps = {
  message: ChatMessageType
}

function getMemberData(sender: string) {
  if (sender === 'Illu') return illu
  if (sender === 'You') return null
  return teamMembers.find(m => m.name === sender) || null
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'You'
  const member = getMemberData(message.sender)

  if (message.isTyping) {
    return (
      <div className="flex items-start gap-3">
        {member && (
          <Avatar 
            name={member.name} 
            initial={member.avatar} 
            accentColor={member.accentColor}
            size="md"
          />
        )}
        <div className="rounded-2xl rounded-tl-none border border-[#C9A227]/15 bg-[#1A1A1A] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#C9A227]/60 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#C9A227]/60 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#C9A227]/60" />
          </div>
        </div>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-gradient-to-r from-[#C9A227] to-[#9A7B1A] px-4 py-3 text-[#0D0D0D]">
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      {member && (
        <Avatar 
          name={member.name} 
          initial={member.avatar} 
          accentColor={member.accentColor}
          size="md"
        />
      )}
      <div className="max-w-[85%]">
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: member?.accentColor || '#C9A227' }}>
          {message.sender}
          {member && message.sender !== 'Illu' && (
            <span className="ml-2 font-normal normal-case text-white/35">{member.title}</span>
          )}
        </p>
        <div className="rounded-2xl rounded-tl-none border border-[#C9A227]/15 bg-[#1A1A1A] px-4 py-3 text-white/85">
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      </div>
    </div>
  )
}
