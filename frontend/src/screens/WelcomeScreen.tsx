import { Button } from '../components/ui'

type WelcomeScreenProps = {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#0D0D0D]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(201,162,39,0.06),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#0D0D0D)]" />
      
      <div className="relative flex flex-1 flex-col">
        <header className="px-6 py-8 sm:px-10 lg:px-16">
          <span className="text-xl font-semibold tracking-[0.4em] text-[#C9A227]">ILLU</span>
        </header>

        <section className="flex flex-1 items-center px-6 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#C9A227]/80">
                AI-Native Home Building
              </p>
              
              <h1 className="mt-8 text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Your home begins with a{' '}
                <span className="font-normal text-gold-gradient">conversation</span>
              </h1>
              
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/50">
                Meet Illu, your personal Home Advisor. Tell us about your life, and we'll 
                help design and build a home around it.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-5">
                <Button size="lg" onClick={onStart}>
                  Start Building My Home
                </Button>
                <span className="text-sm text-white/30">Takes about 5 minutes</span>
              </div>
            </div>

            <div className="mt-20 grid max-w-4xl gap-5 sm:grid-cols-3">
              <FeatureCard
                number="01"
                title="Tell Your Story"
                description="Share your lifestyle, family, and dreams. No forms, just conversation."
              />
              <FeatureCard
                number="02"
                title="Meet Your Team"
                description="Illu assembles AI specialists in design, finance, and construction."
              />
              <FeatureCard
                number="03"
                title="See Your Home"
                description="Receive a personalized proposal with pricing and timeline."
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function FeatureCard({ 
  number, 
  title, 
  description 
}: { 
  number: string
  title: string
  description: string 
}) {
  return (
    <div className="group rounded-2xl border border-[#C9A227]/15 bg-[#141414]/90 p-6 transition-all duration-300 hover:border-[#C9A227]/30 hover:bg-[#1A1A1A]">
      <span className="text-xs font-medium tracking-wider text-[#C9A227]/60">{number}</span>
      <h3 className="mt-3 text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/40">{description}</p>
    </div>
  )
}
