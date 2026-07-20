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
    <form onSubmit={handleSubmit} className="border-t border-[#C9A227]/10 bg-[#141414] p-4">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="w-full resize-none rounded-xl border border-[#C9A227]/15 bg-[#0D0D0D] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#C9A227]/40 disabled:opacity-50"
            style={{ maxHeight: '150px' }}
          />
          <span className="absolute bottom-3 right-3 text-xs text-white/25">
            {message.length > 0 && 'Enter to send'}
          </span>
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A227] to-[#9A7B1A] text-[#0D0D0D] transition hover:from-[#E5C158] hover:to-[#C9A227] disabled:opacity-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  )
}
