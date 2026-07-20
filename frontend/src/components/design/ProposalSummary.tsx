import type { HomeProposal, CustomerHomeProfile } from '../../types'
import { Button, Card } from '../ui'
import { Avatar } from '../ui'
import { illu, teamMembers } from '../../data/team'

type ProposalSummaryProps = {
  proposal: HomeProposal
  profile: CustomerHomeProfile
  onContinue?: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ProposalSummary({ proposal, profile, onContinue }: ProposalSummaryProps) {
  const activeTeam = [illu, ...teamMembers.filter(m => 
    ['maya', 'ethan', 'olivia'].includes(m.id)
  )]

  return (
    <div className="space-y-6">
      <Card variant="elevated" className="overflow-hidden">
        <div className="border-b border-[#C9A227]/15 bg-gradient-to-r from-[#C9A227]/10 to-transparent p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]">
            Your Home Proposal
          </p>
          <h2 className="mt-3 text-3xl font-medium text-white">
            {proposal.designOption?.name || 'Custom Home'}
          </h2>
          <p className="mt-2 text-white/50">
            Based on your lifestyle, family, and preferences
          </p>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#C9A227]/25 bg-[#C9A227]/5 p-5">
            <p className="text-sm text-white/45">Estimated Investment</p>
            <p className="mt-2 text-4xl font-semibold text-[#C9A227]">
              {formatCurrency(proposal.estimatedPrice)}
            </p>
            <p className="mt-3 text-xs text-white/35">
              Based on current material costs and labor rates
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-5">
            <p className="text-sm text-white/45">Estimated Timeline</p>
            <p className="mt-2 text-3xl font-medium text-white">
              {proposal.estimatedTimeline}
            </p>
            <p className="mt-3 text-xs text-white/35">
              From ground-breaking to move-in ready
            </p>
          </div>
        </div>

        {proposal.breakdown.length > 0 && (
          <div className="border-t border-[#C9A227]/15 p-6">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              Cost Breakdown
            </h3>
            <div className="space-y-3">
              {proposal.breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{item.label}</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
          Your Home Details
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Style" value={profile.home_style} />
          <DetailItem label="Bedrooms" value={profile.bedrooms ? `${profile.bedrooms}` : 'TBD'} />
          <DetailItem label="Bathrooms" value={profile.bathrooms ? `${profile.bathrooms}` : 'TBD'} />
          <DetailItem label="Home Office" value={profile.home_office} />
          <DetailItem label="Guest Suite" value={profile.guest_suite} />
          <DetailItem label="Kitchen" value={profile.kitchen_type} />
          <DetailItem label="Materials" value={profile.material_package} />
          <DetailItem label="Garage" value={profile.garage} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
          Your Team
        </h3>
        <div className="flex flex-wrap gap-3">
          {activeTeam.map((member) => (
            <div 
              key={member.id}
              className="flex items-center gap-2.5 rounded-full border border-[#C9A227]/15 bg-[#0D0D0D] py-2 pl-2 pr-4"
            >
              <Avatar 
                name={member.name} 
                initial={member.avatar} 
                accentColor={member.accentColor}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="text-xs text-white/35">{member.title}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {proposal.nextSteps.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
            Next Steps
          </h3>
          <div className="space-y-4">
            {proposal.nextSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A227]/10 text-xs font-medium text-[#C9A227]">
                  {index + 1}
                </span>
                <p className="text-sm text-white/60">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {onContinue && (
        <Button size="lg" onClick={onContinue} className="w-full sm:w-auto">
          Continue Building My Home
        </Button>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string | number | null }) {
  const displayValue = value === null || value === 'Not selected' ? 'TBD' : String(value)
  const isSet = value !== null && value !== 'Not selected'

  return (
    <div className="rounded-xl border border-white/10 bg-[#0D0D0D] px-3 py-2.5">
      <p className="text-xs text-white/35">{label}</p>
      <p className={`mt-0.5 text-sm ${isSet ? 'text-white' : 'text-white/25'}`}>
        {displayValue}
      </p>
    </div>
  )
}
