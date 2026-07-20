import { Header } from '../components/layout'
import { DesignCard } from '../components/design'
import { Avatar, Button } from '../components/ui'
import { teamMembers, designOptions } from '../data/team'
import type { DesignOption } from '../types'

type DesignReviewScreenProps = {
  selectedDesign: DesignOption | null
  onSelectDesign: (design: DesignOption) => void
  onProceedToFinancial: () => void
  onLogoClick: () => void
}

export function DesignReviewScreen({
  selectedDesign,
  onSelectDesign,
  onProceedToFinancial,
  onLogoClick,
}: DesignReviewScreenProps) {
  const maya = teamMembers.find(m => m.id === 'maya')!

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0D0D]">
      <Header stage="design-review" onLogoClick={onLogoClick} />

      <main className="flex-1 px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <section className="mb-10 rounded-2xl border border-[#C9A227]/15 bg-[#141414] p-7">
            <div className="flex items-start gap-4">
              <Avatar 
                name={maya.name}
                initial={maya.avatar}
                accentColor={maya.accentColor}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  {maya.name}
                </h1>
                <p className="mt-1 text-lg" style={{ color: maya.accentColor }}>
                  {maya.title}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4 text-base leading-relaxed text-white/60">
              <p>
                Illu shared everything about your family and lifestyle with me. Based on 
                what I learned, I've prepared three design directions that I think will 
                work beautifully for how you live.
              </p>
              <p className="text-white/40">
                Each option reflects your preferences while offering different approaches 
                to space and style. Take your time—this is the foundation of your home.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
              Design Options
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {designOptions.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  isSelected={selectedDesign?.id === design.id}
                  onSelect={onSelectDesign}
                />
              ))}
            </div>
          </section>

          {selectedDesign && (
            <section className="rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {selectedDesign.name} Selected
                  </h3>
                  <p className="mt-1.5 text-sm text-white/50">
                    Ready to see pricing and timeline from Ethan, our Financial Advisor?
                  </p>
                </div>
                <Button onClick={onProceedToFinancial}>
                  Continue to Financial Review
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
