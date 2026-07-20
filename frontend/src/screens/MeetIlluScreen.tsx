import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui'

type MeetIlluScreenProps = {
  onSubmit: (description: string) => Promise<void>
  isProcessing: boolean
  processingStatus?: string
}

export function MeetIlluScreen({ onSubmit, isProcessing, processingStatus }: MeetIlluScreenProps) {
  const [description, setDescription] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = description.trim()
    if (trimmed && !isProcessing) {
      await onSubmit(trimmed)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303]">
      {/* Background effects */}
      <div className="gradient-bg absolute inset-0" />
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="glow-orb absolute -right-40 top-0 h-[500px] w-[500px] bg-[#D4AF37]/15" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <header className="mb-16">
          <img 
            src="/logo.png" 
            alt="ILLU" 
            className="h-14 w-auto sm:h-16 drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]" 
          />
        </header>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <section className="lg:sticky lg:top-10">
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

          <section className="glass-card p-8">
            <h2 className="text-2xl font-light text-white">
              Tell me about the home you're imagining.
            </h2>
            <p className="mt-3 text-sm text-white/35">
              Don't worry about being complete—we'll refine everything together.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
                placeholder="My wife and I have two kids. I work from home a few days a week, and my parents often stay with us during holidays. We'd love a modern home with plenty of natural light and a quiet office..."
                className="min-h-[240px] w-full resize-none rounded-2xl border border-white/10 bg-[#030303] px-6 py-5 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/40 focus:shadow-[0_0_30px_rgba(212,175,55,0.1)] disabled:opacity-50"
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
                className="mt-8 w-full"
                disabled={isProcessing || !description.trim()}
                loading={isProcessing}
              >
                {isProcessing ? 'Understanding Your Vision...' : 'Continue'}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
