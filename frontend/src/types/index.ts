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
  home_style: 'Modern' | 'Modern Farmhouse' | 'Traditional' | 'Contemporary' | 'Other' | 'Not selected'
  number_of_floors: number | null
  bedrooms: number | null
  bathrooms: number | null
  garage: 'No Garage' | '1-Car' | '2-Car' | '3-Car+' | 'Not selected'
  home_office: 'Included' | 'Not Included' | 'Not selected'
  guest_suite: 'Included' | 'Not Included' | 'Not selected'
  covered_patio: 'Included' | 'Not Included' | 'Not selected'
  kitchen_type: 'Open Kitchen' | 'Closed Kitchen' | "Chef's Kitchen" | 'Not selected'
  material_package: 'Essential' | 'Premium' | 'Luxury' | 'Not selected'
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
