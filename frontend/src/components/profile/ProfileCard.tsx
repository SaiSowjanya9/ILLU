import type { CustomerHomeProfile, FieldSource } from '../../types'

type ProfileCardProps = {
  profile: CustomerHomeProfile
  fieldSources?: Record<string, FieldSource>
  onFieldUpdate?: (field: string, value: string) => void
  isEditable?: boolean
}

const profileFields: {
  key: keyof CustomerHomeProfile
  label: string
  format?: (value: unknown) => string
}[] = [
  { key: 'home_style', label: 'Style' },
  { key: 'number_of_floors', label: 'Floors', format: (v) => v ? `${v} floor${Number(v) > 1 ? 's' : ''}` : 'Not selected' },
  { key: 'bedrooms', label: 'Bedrooms', format: (v) => v ? `${v} bedroom${Number(v) > 1 ? 's' : ''}` : 'Not selected' },
  { key: 'bathrooms', label: 'Bathrooms', format: (v) => v ? `${v} bathroom${Number(v) > 1 ? 's' : ''}` : 'Not selected' },
  { key: 'garage', label: 'Garage' },
  { key: 'home_office', label: 'Home Office' },
  { key: 'guest_suite', label: 'Guest Suite' },
  { key: 'covered_patio', label: 'Outdoor Space' },
  { key: 'kitchen_type', label: 'Kitchen' },
  { key: 'material_package', label: 'Materials' },
]

function getSourceBadge(source?: FieldSource) {
  if (!source || source === 'missing') return null
  
  const badges: Record<FieldSource, { label: string; color: string }> = {
    customer: { label: 'You mentioned', color: '#C9A227' },
    illu: { label: 'Suggested', color: '#7A9E9F' },
    manual: { label: 'Selected', color: '#8FAE8B' },
    missing: { label: '', color: '' },
  }
  
  return badges[source]
}

export function ProfileCard({ profile, fieldSources = {} }: ProfileCardProps) {
  const completedFields = profileFields.filter(f => {
    const value = profile[f.key]
    return value !== null && value !== 'Not selected'
  })

  const progress = Math.round((completedFields.length / profileFields.length) * 100)

  return (
    <div className="rounded-2xl border border-[#C9A227]/15 bg-[#141414] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]/70">
          Home Profile
        </h3>
        <span className="text-sm text-white/40">{progress}% complete</span>
      </div>

      <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-[#9A7B1A] via-[#C9A227] to-[#E5C158] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {profileFields.map((field) => {
          const rawValue = profile[field.key]
          const value = field.format ? field.format(rawValue) : String(rawValue ?? 'Not selected')
          const isSet = rawValue !== null && rawValue !== 'Not selected'
          const source = fieldSources[field.key]
          const badge = getSourceBadge(source)

          return (
            <div
              key={field.key}
              className={`rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                isSet 
                  ? 'border-[#C9A227]/25 bg-[#1A1A1A]' 
                  : 'border-white/5 bg-[#0D0D0D]'
              }`}
            >
              <p className="text-xs text-white/35">{field.label}</p>
              <p className={`mt-0.5 text-sm ${isSet ? 'text-white' : 'text-white/25'}`}>
                {value}
              </p>
              {badge && isSet && (
                <p 
                  className="mt-1 text-[10px] uppercase tracking-wider"
                  style={{ color: badge.color }}
                >
                  {badge.label}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
