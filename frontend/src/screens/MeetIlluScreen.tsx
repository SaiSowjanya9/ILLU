import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui'

type MeetIlluScreenProps = {
  onSubmit: (description: string) => Promise<void>
  isProcessing: boolean
  processingStatus?: string
  onBack?: () => void
}

export function MeetIlluScreen({ onSubmit, isProcessing, processingStatus, onBack }: MeetIlluScreenProps) {
  const [description, setDescription] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = description.trim()
    if (trimmed && !isProcessing) {
      await onSubmit(trimmed)
    }
  }

  const handleBackClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmRestart = () => {
    setShowConfirm(false)
    onBack?.()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303]">
      {/* Background effects */}
      <div className="gradient-bg absolute inset-0" />
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="glow-orb absolute -right-40 top-0 h-[500px] w-[500px] bg-[#D4AF37]/15" />
      
      {/* Back button - far left in black space */}
      {onBack && (
        <button
          type="button"
          onClick={handleBackClick}
          className="fixed left-4 top-10 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white sm:left-6 lg:left-8"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <header className="mb-16">
          <img 
            src="/logo.png" 
            alt="ILLU" 
            className="h-14 w-auto sm:h-16 lg:h-20 drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]" 
          />
        </header>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
          <section className="flex flex-col">
            <div>
              <h1 className="text-4xl font-extralight text-white sm:text-5xl">Illu</h1>
              <p className="mt-2 text-lg font-medium text-[#D4AF37]">Your Home Advisor</p>
            </div>

            <div className="mt-12 space-y-5 text-base leading-relaxed text-white/50">
              <p>
                Hello. I'm Illu, and I'll be guiding you through your home building journey.
              </p>
              <p>
                I'm here to understand your lifestyle, your family's needs, and your vision 
                for home. Behind me is a team of specialists who I'll coordinate to bring 
                your home to life.
              </p>
              <p className="text-white/35">
                Let's start with a simple conversation. Tell me about the life you want 
                to build, and I'll help shape the home around it.
              </p>
            </div>

            <div className="glass-card mt-12 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Things to share
              </p>
              <ul className="mt-5 space-y-3 text-sm text-white/40">
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/60" /> Your family and how you live together</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/60" /> Work-from-home or special space needs</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/60" /> Guests, extended family, or caregiving</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/60" /> Style preferences and materials</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]/60" /> Anything else that matters to you</li>
              </ul>
            </div>
          </section>

          <section className="glass-card flex flex-col p-8">
            <h2 className="text-2xl font-light text-white">
              Tell me about the home you're imagining.
            </h2>
            <p className="mt-3 text-sm text-white/35">
              Don't worry about being complete—we'll refine everything together.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
                placeholder="My wife and I have two kids. I work from home a few days a week, and my parents often stay with us during holidays. We'd love a modern home with plenty of natural light and a quiet office..."
                className="min-h-[180px] flex-1 w-full resize-none rounded-2xl border border-white/10 bg-[#030303] px-6 py-5 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/40 focus:shadow-[0_0_30px_rgba(212,175,55,0.1)] disabled:opacity-50"
              />

              {isProcessing && processingStatus && (
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
                    <span className="text-sm font-medium text-[#D4AF37]">{processingStatus}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-6 w-full"
                disabled={isProcessing || !description.trim()}
                loading={isProcessing}
              >
                {isProcessing ? 'Understanding Your Vision...' : 'Continue'}
              </Button>
            </form>
          </section>
        </div>
      </div>

      {/* Restart Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Start Over?</h3>
            <p className="mt-3 text-sm text-white/50">
              Are you sure you want to restart? Your current input will be lost.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestart}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] px-4 py-3 text-sm font-semibold text-black transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
