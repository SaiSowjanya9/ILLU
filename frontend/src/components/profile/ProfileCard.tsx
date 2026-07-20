import { useState } from 'react'
import type { CustomerHomeProfile, FieldSource } from '../../types'

type ProfileCardProps = {
  profile: CustomerHomeProfile
  fieldSources?: Record<string, FieldSource>
  onFieldUpdate?: (field: string, value: string) => void
  isEditable?: boolean
}

const fieldOptions: Record<string, string[]> = {
  home_style: ['Modern', 'Contemporary', 'Transitional', 'Traditional', 'Mediterranean', 'Craftsman'],
  number_of_floors: ['1', '2'],
  bedrooms: ['3', '4', '5'],
  bathrooms: ['3', '4', '5'],
  garage: ['2 Car Garage', '3 Car Garage'],
  home_office: ['Yes', 'No', 'Optional'],
  guest_suite: ['Yes', 'No', 'Optional'],
  covered_patio: ['Covered Patio', 'Open Patio', 'Pool Ready', 'Full Outdoor Kitchen'],
  kitchen_type: ['Open Kitchen', "Butler's Pantry", 'Island Kitchen'],
  material_package: ['Standard', 'Premium', 'Luxury', 'Custom'],
}

const profileFields: {
  key: keyof CustomerHomeProfile
  label: string
}[] = [
  { key: 'home_style', label: 'Style' },
  { key: 'number_of_floors', label: 'Floors' },
  { key: 'bedrooms', label: 'Bedrooms' },
  { key: 'bathrooms', label: 'Bathrooms' },
  { key: 'garage', label: 'Garage' },
  { key: 'home_office', label: 'Home Office' },
  { key: 'guest_suite', label: 'Guest Suite' },
  { key: 'covered_patio', label: 'Outdoor Space' },
  { key: 'kitchen_type', label: 'Kitchen' },
  { key: 'material_package', label: 'Materials' },
]

export function ProfileCard({ profile, onFieldUpdate }: ProfileCardProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const completedFields = profileFields.filter(f => {
    const value = profile[f.key]
    return value !== null && value !== 'Not selected'
  })

  const progress = Math.round((completedFields.length / profileFields.length) * 100)

  const handleSelect = (field: string, value: string) => {
    // Convert numeric strings to numbers for numeric fields
    const numericFields = ['number_of_floors', 'bedrooms', 'bathrooms']
    const finalValue = numericFields.includes(field) ? parseInt(value, 10) : value
    onFieldUpdate?.(field, finalValue as unknown as string)
    setOpenDropdown(null)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          Home Profile
        </h3>
        <span className="text-sm text-white/40">{progress}% complete</span>
      </div>

      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-[#AA8C2C] via-[#D4AF37] to-[#E5C158] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {profileFields.map((field) => {
          const rawValue = profile[field.key]
          const value = rawValue && rawValue !== 'Not selected' ? String(rawValue) : null
          const isSet = !!value
          const isOpen = openDropdown === field.key
          const options = fieldOptions[field.key] || []

          return (
            <div key={field.key} className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : field.key)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  isSet 
                    ? 'border-[#D4AF37]/30 bg-[#111]' 
                    : 'border-white/10 bg-[#050505] hover:border-white/20'
                } ${isOpen ? 'border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/40">{field.label}</p>
                    <p className={`mt-1 text-sm ${isSet ? 'text-white' : 'text-white/30'}`}>
                      {value || 'Select...'}
                    </p>
                  </div>
                  <svg 
                    className={`h-4 w-4 text-white/30 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50">
                  <div className="max-h-48 overflow-y-auto py-1">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelect(field.key, option)}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#D4AF37]/10 ${
                          value === option ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-white/70'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
