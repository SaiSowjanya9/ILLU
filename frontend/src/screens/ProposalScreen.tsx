import { useState, useEffect } from 'react'
import { Header } from '../components/layout'
import { ProposalSummary } from '../components/design'
import { Avatar } from '../components/ui'
import { teamMembers } from '../data/team'
import type { CustomerHomeProfile, DesignOption, HomeProposal } from '../types'

type ProposalScreenProps = {
  profile: CustomerHomeProfile
  selectedDesign: DesignOption | null
  onLogoClick: () => void
  onContinue: () => void
}

function calculateProposal(profile: CustomerHomeProfile, design: DesignOption | null): HomeProposal {
  let basePrice = 480000

  if (profile.home_style === 'Modern') basePrice += 35000
  if (profile.home_style === 'Contemporary') basePrice += 45000
  if (profile.bedrooms && profile.bedrooms >= 4) basePrice += 65000
  if (profile.bedrooms && profile.bedrooms >= 5) basePrice += 55000
  if (profile.home_office === 'Included') basePrice += 42000
  if (profile.guest_suite === 'Included') basePrice += 86000
  if (profile.material_package === 'Premium') basePrice += 65000
  if (profile.material_package === 'Luxury') basePrice += 145000
  if (design?.id === 'contemporary-living') basePrice += 40000

  let months = 10
  if (profile.bedrooms && profile.bedrooms >= 5) months += 2
  if (profile.guest_suite === 'Included') months += 1
  if (profile.material_package === 'Luxury') months += 2

  const breakdown = [
    { label: 'Foundation & Structure', amount: Math.round(basePrice * 0.25) },
    { label: 'Interior Finishes', amount: Math.round(basePrice * 0.20) },
    { label: 'Systems (HVAC, Electric, Plumbing)', amount: Math.round(basePrice * 0.18) },
    { label: 'Kitchen & Bathrooms', amount: Math.round(basePrice * 0.15) },
    { label: 'Exterior & Landscaping', amount: Math.round(basePrice * 0.12) },
    { label: 'Design & Permits', amount: Math.round(basePrice * 0.10) },
  ]

  return {
    designOption: design,
    estimatedPrice: basePrice,
    estimatedTimeline: `${months}-${months + 2} months`,
    breakdown,
    nextSteps: [
      'Schedule a detailed consultation with our team',
      'Finalize your design selections with Maya',
      'Review financing options with Ethan',
      'Visit our model homes and material showroom',
      'Begin the permitting process',
    ],
  }
}

export function ProposalScreen({ 
  profile, 
  selectedDesign, 
  onLogoClick,
  onContinue,
}: ProposalScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [proposal, setProposal] = useState<HomeProposal | null>(null)
  
  const ethan = teamMembers.find(m => m.id === 'ethan')!

  useEffect(() => {
    const timer = setTimeout(() => {
      setProposal(calculateProposal(profile, selectedDesign))
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [profile, selectedDesign])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0D0D0D]">
        <Header stage="financial-review" onLogoClick={onLogoClick} />

        <main className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-lg text-center">
            <Avatar 
              name={ethan.name}
              initial={ethan.avatar}
              accentColor={ethan.accentColor}
              size="xl"
              status="working"
              showStatus
            />
            <h1 className="mt-8 text-2xl font-medium text-white">
              Ethan is preparing your estimate
            </h1>
            <p className="mt-3 text-white/40">
              Calculating costs based on your design, materials, and requirements...
            </p>

            <div className="mx-auto mt-10 h-1.5 max-w-sm overflow-hidden rounded-full bg-white/10">
              <div 
                className="h-full bg-gradient-to-r from-[#9A7B1A] via-[#C9A227] to-[#E5C158]"
                style={{ animation: 'loadingBar 2.5s ease-in-out forwards' }}
              />
            </div>

            <div className="mt-10 space-y-3 text-sm text-white/35">
              <p className="animate-pulse">Analyzing design requirements...</p>
              <p className="animate-pulse [animation-delay:0.5s]">Calculating material costs...</p>
              <p className="animate-pulse [animation-delay:1s]">Estimating timeline...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0D0D]">
      <Header stage="proposal-ready" onLogoClick={onLogoClick} />

      <main className="flex-1 px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <section className="mb-10 rounded-2xl border border-[#C9A227]/15 bg-[#141414] p-7">
            <div className="flex items-start gap-4">
              <Avatar 
                name={ethan.name}
                initial={ethan.avatar}
                accentColor={ethan.accentColor}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  {ethan.name}
                </h1>
                <p className="mt-1 text-lg" style={{ color: ethan.accentColor }}>
                  {ethan.title}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4 text-base leading-relaxed text-white/60">
              <p>
                I've reviewed Maya's design and your material selections. Here's a 
                comprehensive estimate for your new home, including a cost breakdown 
                and realistic timeline.
              </p>
              <p className="text-white/40">
                These numbers are based on current market rates and our experience 
                with similar projects. We'll refine them as we move forward.
              </p>
            </div>
          </section>

          {proposal && (
            <ProposalSummary 
              proposal={proposal} 
              profile={profile}
              onContinue={onContinue}
            />
          )}
        </div>
      </main>
    </div>
  )
}
