import { useState, useRef, useEffect } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSend, 
  disabled = false,
  placeholder = "Tell me about your dream home..."
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [message])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = message.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setMessage('')
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event as unknown as FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/5 bg-[#0a0a0a] p-4">
      <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#030303] p-2 transition-all focus-within:border-[#D4AF37]/30 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="min-h-[44px] w-full flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-relaxed text-white outline-none placeholder:text-white/30 disabled:opacity-50"
          style={{ maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] text-black transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-40 disabled:hover:shadow-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </form>
  )
}
