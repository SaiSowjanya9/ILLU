import { useState } from 'react'
import type { FormEvent } from 'react'
import { Avatar, Button } from '../components/ui'
import { illu } from '../data/team'

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
    <main className="relative min-h-screen bg-[#0D0D0D]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.08),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <header className="mb-14">
          <span className="text-xl font-semibold tracking-[0.4em] text-[#C9A227]">ILLU</span>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <section className="lg:sticky lg:top-10">
            <div className="flex items-start gap-5">
              <Avatar 
                name={illu.name}
                initial={illu.avatar}
                accentColor={illu.accentColor}
                size="xl"
              />
              <div>
                <h1 className="text-4xl font-light text-white sm:text-5xl">Illu</h1>
                <p className="mt-2 text-lg font-medium text-[#C9A227]">Your Home Advisor</p>
              </div>
            </div>

            <div className="mt-10 space-y-5 text-base leading-relaxed text-white/60">
              <p>
                Hello. I'm Illu, and I'll be guiding you through your home building journey.
              </p>
              <p>
                I'm here to understand your lifestyle, your family's needs, and your vision 
                for home. Behind me is a team of specialists who I'll coordinate to bring 
                your home to life.
              </p>
              <p className="text-white/40">
                Let's start with a simple conversation. Tell me about the life you want 
                to build, and I'll help shape the home around it.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-[#C9A227]/15 bg-[#141414] p-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
                Things to share
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/45">
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#C9A227]/50" /> Your family and how you live together</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#C9A227]/50" /> Work-from-home or special space needs</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#C9A227]/50" /> Guests, extended family, or caregiving</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#C9A227]/50" /> Style preferences and materials</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#C9A227]/50" /> Anything else that matters to you</li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-[#C9A227]/20 bg-[#141414] p-7 shadow-2xl shadow-black/50">
            <h2 className="text-xl font-medium text-white">
              Tell me about the home you're imagining.
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Don't worry about being complete—we'll refine everything together.
            </p>

            <form onSubmit={handleSubmit} className="mt-7">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
                placeholder="My wife and I have two kids. I work from home a few days a week, and my parents often stay with us during holidays. We'd love a modern home with plenty of natural light and a quiet office..."
                className="min-h-[220px] w-full resize-none rounded-xl border border-[#C9A227]/15 bg-[#0D0D0D] px-5 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A227]/40 disabled:opacity-50"
              />

              {isProcessing && processingStatus && (
                <div className="mt-5 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#C9A227] border-t-transparent" />
                    <span className="text-sm text-[#C9A227]">{processingStatus}</span>
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
    </main>
  )
}
