import type { DesignOption } from '../../types'
import { Button } from '../ui'

type DesignCardProps = {
  design: DesignOption
  isSelected?: boolean
  onSelect: (design: DesignOption) => void
}

export function DesignCard({ design, isSelected = false, onSelect }: DesignCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected 
          ? 'border-[#C9A227] shadow-lg shadow-[#C9A227]/15' 
          : 'border-[#C9A227]/15 hover:border-[#C9A227]/40'
      }`}
    >
      <div className={`h-44 bg-gradient-to-br ${design.accent}`} />
      
      <div className="bg-[#141414] p-5">
        <h3 className="text-2xl font-medium text-white">{design.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50">{design.description}</p>
        
        <div className="mt-4 rounded-xl border border-[#C9A227]/15 bg-[#0D0D0D] p-3">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#C9A227]/60">Includes</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {design.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#0D0D0D] px-3 py-2.5">
            <p className="text-xs text-white/35">Floor Plan</p>
            <p className="mt-0.5 text-sm text-white/70">{design.floorPlan}</p>
          </div>
          <div className="rounded-xl bg-[#0D0D0D] px-3 py-2.5">
            <p className="text-xs text-white/35">Est. Size</p>
            <p className="mt-0.5 text-sm text-white/70">{design.estimatedSqFt}</p>
          </div>
        </div>

        <Button
          variant={isSelected ? 'primary' : 'secondary'}
          className="mt-5 w-full"
          onClick={() => onSelect(design)}
        >
          {isSelected ? 'Selected' : 'Select This Design'}
        </Button>
      </div>
    </article>
  )
}
