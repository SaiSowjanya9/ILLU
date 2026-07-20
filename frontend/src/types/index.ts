export type Screen = 'welcome' | 'meet-illu' | 'conversation' | 'team-assembly' | 'design-review' | 'proposal'

export type JourneyStage = 
  | 'greeting'
  | 'discovery' 
  | 'team-working'
  | 'design-review'
  | 'financial-review'
  | 'proposal-ready'

export type ChatSender = 'Illu' | 'You' | 'Maya' | 'Ethan' | 'Olivia' | 'Noah' | 'Ava' | 'Mason'

export type ChatMessage = {
  id: string
  sender: ChatSender
  text: string
  timestamp: Date
  isTyping?: boolean
  avatar?: string
}

export type TeamMember = {
  id: string
  name: string
  role: string
  title: string
  expertise: string[]
  avatar: string
  accentColor: string
  status: 'idle' | 'working' | 'complete'
  currentTask?: string
}

export type CustomerHomeProfile = {
  home_style: 'Modern' | 'Contemporary' | 'Transitional' | 'Traditional' | 'Mediterranean' | 'Craftsman' | 'Not selected' | string
  number_of_floors: number | null
  bedrooms: number | null
  bathrooms: number | null
  garage: '2 Car Garage' | '3 Car Garage' | 'Not selected' | string
  home_office: 'Yes' | 'No' | 'Optional' | 'Not selected' | string
  guest_suite: 'Yes' | 'No' | 'Optional' | 'Not selected' | string
  covered_patio: 'Covered Patio' | 'Open Patio' | 'Pool Ready' | 'Full Outdoor Kitchen' | 'Not selected' | string
  kitchen_type: 'Open Kitchen' | "Butler's Pantry" | 'Island Kitchen' | 'Not selected' | string
  material_package: 'Standard' | 'Premium' | 'Luxury' | 'Custom' | 'Not selected' | string
  lot_size?: string
  budget_range?: string
  timeline_preference?: string
}

export type FieldSource = 'customer' | 'illu' | 'manual' | 'missing'

export type FieldSources = {
  [K in keyof CustomerHomeProfile]?: FieldSource
}

export type DesignOption = {
  id: string
  name: string
  description: string
  features: string[]
  floorPlan: string
  estimatedSqFt: string
  accent: string
  image?: string
}

export type HomeProposal = {
  designOption: DesignOption | null
  estimatedPrice: number
  estimatedTimeline: string
  breakdown: {
    label: string
    amount: number
  }[]
  nextSteps: string[]
}

export type IlluAnalyzeResponse = {
  illu_message: string
  profile: CustomerHomeProfile
  field_sources: FieldSources
  needs_follow_up: boolean
  follow_up_question: string | null
  confidence: number
}
