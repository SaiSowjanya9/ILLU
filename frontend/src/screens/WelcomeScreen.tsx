import { useState, useEffect } from 'react'

type WelcomeScreenProps = {
  onStart: () => void
}

const processSteps = [
  { step: '01', title: 'Share Your Vision', description: 'Tell Illu about your family, lifestyle, and dream home' },
  { step: '02', title: 'AI Team Assembly', description: 'Specialists in design, finance & construction join your project' },
  { step: '03', title: 'Personalized Proposal', description: 'Receive detailed plans with pricing and timeline' },
]

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % processSteps.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303]">
      {/* Animated gradient background */}
      <div className="gradient-bg absolute inset-0" />
      
      {/* Grid pattern overlay */}
      <div className="grid-pattern absolute inset-0 opacity-40" />
      
      {/* Decorative glow orbs */}
      <div className="glow-orb absolute -left-40 top-20 h-96 w-96 bg-[#D4AF37]/20" />
      <div className="glow-orb absolute -right-20 bottom-40 h-80 w-80 bg-[#D4AF37]/15" style={{ animationDelay: '-5s' }} />
      
      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header with logo */}
        <header className="px-8 py-8 sm:px-12 lg:px-20">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <img 
              src="/logo.png" 
              alt="ILLU" 
              className="h-14 w-auto sm:h-16 lg:h-20 drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]" 
            />
            <nav className="hidden items-center gap-8 sm:flex">
              <a href="#" className="text-sm text-white/40 transition-colors hover:text-white/70">About</a>
              <a href="#" className="text-sm text-white/40 transition-colors hover:text-white/70">Process</a>
              <a href="#" className="text-sm text-white/40 transition-colors hover:text-white/70">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero section */}
        <section className="flex flex-1 flex-col justify-center px-8 pb-24 sm:px-12 lg:px-20">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Left: Hero content */}
              <div className="max-w-2xl">
                <div className="animate-fade-in opacity-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    AI-Powered Home Design
                  </span>
                </div>
                
                <h1 className="animate-fade-in-up opacity-0 delay-100 mt-10 text-5xl font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Build your dream home with{' '}
                  <span className="text-gold-shine font-light">conversation</span>
                </h1>
                
                <p className="animate-fade-in-up opacity-0 delay-200 mt-8 text-lg leading-relaxed text-white/45 sm:text-xl">
                  Meet Illu, your AI Home Advisor. Share your vision through natural conversation, 
                  and watch as our AI team designs a home tailored to your lifestyle.
                </p>

                <div className="animate-fade-in-up opacity-0 delay-300 mt-12 flex flex-wrap items-center gap-6">
                  <button 
                    onClick={onStart}
                    className="btn-gold group flex items-center gap-3"
                  >
                    <span>Start Your Journey</span>
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3 text-sm text-white/30">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-[#030303] bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C]" />
                      <div className="h-8 w-8 rounded-full border-2 border-[#030303] bg-gradient-to-br from-[#7A9E9F] to-[#5A7E7F]" />
                      <div className="h-8 w-8 rounded-full border-2 border-[#030303] bg-gradient-to-br from-[#8B7355] to-[#6B5335]" />
                    </div>
                    <span>5 min conversation</span>
                  </div>
                </div>
              </div>

              {/* Right: Auto-rotating Stacked Cards */}
              <div className="hidden lg:block">
                <div className="relative h-[280px]">
                  {processSteps.map((item, index) => {
                    const offset = index - activeIndex
                    const isActive = index === activeIndex
                    const isPast = index < activeIndex
                    
                    return (
                      <div
                        key={item.step}
                        onClick={() => setActiveIndex(index)}
                        className="absolute inset-x-0 cursor-pointer transition-all duration-500 ease-out"
                        style={{
                          transform: `translateY(${isPast ? -20 : offset * 85}px) scale(${isActive ? 1 : 0.95 - offset * 0.02})`,
                          opacity: isPast ? 0 : isActive ? 1 : 0.6 - offset * 0.15,
                          zIndex: 10 - offset,
                        }}
                      >
                        <div 
                          className={`rounded-2xl border p-5 backdrop-blur-xl transition-all duration-500 ${
                            isActive 
                              ? 'border-[#D4AF37]/40 bg-[#111]/90 shadow-[0_8px_40px_rgba(212,175,55,0.15)]' 
                              : 'border-white/10 bg-[#0a0a0a]/80'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-500 ${
                                isActive 
                                  ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] text-black shadow-[0_0_25px_rgba(212,175,55,0.5)]' 
                                  : 'border border-white/15 bg-white/5 text-white/40'
                              }`}
                            >
                              {item.step}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60'}`}>
                                {item.title}
                              </h3>
                              <p className={`mt-1 text-sm truncate transition-colors duration-300 ${isActive ? 'text-white/50' : 'text-white/30'}`}>
                                {item.description}
                              </p>
                            </div>
                            {isActive && (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                                <svg className="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Navigation dots */}
                  <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
                    {processSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === activeIndex 
                            ? 'w-6 bg-[#D4AF37]' 
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile feature cards */}
            <div className="mt-20 grid gap-4 sm:grid-cols-3 lg:hidden">
              <FeatureCard
                number="01"
                title="Tell Your Story"
                description="Share your lifestyle and dreams through conversation."
                delay={400}
              />
              <FeatureCard
                number="02"
                title="Meet Your Team"
                description="AI specialists in design, finance, and construction."
                delay={500}
              />
              <FeatureCard
                number="03"
                title="See Your Home"
                description="Personalized proposal with pricing and timeline."
                delay={600}
              />
            </div>
          </div>
        </section>

        {/* Bottom bar */}
        <footer className="border-t border-white/5 px-8 py-6 sm:px-12 lg:px-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <p className="text-xs text-white/25">© 2024 Illu. AI-native home building.</p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/25">Trusted by 500+ families</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({ 
  number, 
  title, 
  description,
  delay = 0
}: { 
  number: string
  title: string
  description: string
  delay?: number
}) {
  return (
    <div 
      className="glass-card shimmer animate-fade-in-up opacity-0 p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-gold-gradient text-xs font-bold tracking-wider">{number}</span>
      <h3 className="mt-3 text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/35">{description}</p>
    </div>
  )
}
