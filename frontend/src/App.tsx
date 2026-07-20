import { useState, useMemo } from 'react'
import './App.css'
import type { 
  Screen, 
  ChatMessage, 
  CustomerHomeProfile, 
  FieldSources, 
  DesignOption, 
  TeamMember,
  IlluAnalyzeResponse,
} from './types'
import { defaultCustomerHomeProfile, teamMembers } from './data/team'
import {
  WelcomeScreen,
  MeetIlluScreen,
  ConversationScreen,
  TeamAssemblyScreen,
  DesignReviewScreen,
  ProposalScreen,
} from './screens'

const defaultFieldSources: FieldSources = {}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function createMessage(sender: ChatMessage['sender'], text: string): ChatMessage {
  return {
    id: generateId(),
    sender,
    text,
    timestamp: new Date(),
  }
}

async function analyzeWithBackend(
  customerMessage: string, 
  currentProfile: CustomerHomeProfile
): Promise<IlluAnalyzeResponse> {
  const response = await fetch('/api/illu/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_message: customerMessage,
      current_profile: currentProfile,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null) as { detail?: string } | null
    throw new Error(errorData?.detail ?? 'Could not analyze the home description.')
  }

  return await response.json() as IlluAnalyzeResponse
}

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    createMessage('Illu', 'Tell me about the home you are imagining. Share your family, lifestyle, style preferences, workspace needs, or anything else that matters to you.')
  ])
  
  const [customerProfile, setCustomerProfile] = useState<CustomerHomeProfile>(defaultCustomerHomeProfile)
  const [fieldSources, setFieldSources] = useState<FieldSources>(defaultFieldSources)
  const [selectedDesign, setSelectedDesign] = useState<DesignOption | null>(null)
  const [activeTeamMembers, setActiveTeamMembers] = useState<TeamMember[]>([])

  const profileProgress = useMemo(() => {
    const fields: (keyof CustomerHomeProfile)[] = [
      'home_style', 'number_of_floors', 'bedrooms', 'bathrooms', 
      'garage', 'home_office', 'guest_suite', 'covered_patio',
      'kitchen_type', 'material_package'
    ]
    
    const completed = fields.filter(key => {
      const value = customerProfile[key]
      return value !== null && value !== 'Not selected'
    }).length

    return Math.round((completed / fields.length) * 100)
  }, [customerProfile])

  function applyProfileFromResponse(response: IlluAnalyzeResponse) {
    setCustomerProfile(prev => ({ ...prev, ...response.profile }))
    setFieldSources(prev => ({ ...prev, ...response.field_sources }))

    if (response.profile.home_office === 'Included' || response.profile.guest_suite === 'Included') {
      const maya = teamMembers.find(m => m.id === 'maya')
      if (maya && !activeTeamMembers.find(m => m.id === 'maya')) {
        setActiveTeamMembers(prev => [...prev, { ...maya, status: 'idle' }])
      }
    }
  }

  async function handleInitialDescription(description: string) {
    setIsProcessing(true)
    setProcessingStatus('Understanding your vision...')

    try {
      setProcessingStatus("Reviewing your lifestyle...")
      await new Promise(r => setTimeout(r, 1000))
      
      setProcessingStatus("Understanding your family's needs...")
      const response = await analyzeWithBackend(description, customerProfile)
      
      setProcessingStatus('Building your initial home profile...')
      await new Promise(r => setTimeout(r, 500))

      applyProfileFromResponse(response)

      const reply = response.needs_follow_up && response.follow_up_question
        ? `${response.illu_message} ${response.follow_up_question}`
        : response.illu_message

      setChatMessages(prev => [
        ...prev,
        createMessage('You', description),
        createMessage('Illu', reply),
      ])

      setScreen('conversation')
    } catch (error) {
      console.error('Analysis error:', error)
      setChatMessages(prev => [
        ...prev,
        createMessage('You', description),
        createMessage('Illu', 'I had trouble understanding that. Could you tell me more about your home?'),
      ])
      setScreen('conversation')
    } finally {
      setIsProcessing(false)
      setProcessingStatus('')
    }
  }

  async function handleChatMessage(message: string) {
    setIsProcessing(true)
    
    setChatMessages(prev => [...prev, createMessage('You', message)])

    try {
      const response = await analyzeWithBackend(message, customerProfile)
      applyProfileFromResponse(response)

      const isComplete = profileProgress >= 80
      const reply = isComplete
        ? "I've learned enough about your family and lifestyle. I'm ready to assemble your team and show you some design options when you are."
        : response.needs_follow_up && response.follow_up_question
          ? `${response.illu_message} ${response.follow_up_question}`
          : `${response.illu_message} Feel free to share more details or adjust anything in your profile.`

      setChatMessages(prev => [...prev, createMessage('Illu', reply)])
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [
        ...prev, 
        createMessage('Illu', "I'm having trouble processing that. Could you rephrase?")
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  function handleProceedToDesign() {
    setScreen('team-assembly')
  }

  function handleFieldUpdate(field: string, value: string | number) {
    setCustomerProfile(prev => ({ ...prev, [field]: value }))
    setFieldSources(prev => ({ ...prev, [field]: 'manual' as const }))
  }

  function handleTeamAssemblyComplete() {
    setActiveTeamMembers(teamMembers.filter(m => 
      ['maya', 'ethan', 'olivia'].includes(m.id)
    ).map(m => ({ ...m, status: 'complete' as const })))
    
    setChatMessages(prev => [
      ...prev,
      createMessage('Illu', "Your team is ready. I've briefed Maya on everything we've discussed. She's prepared design options tailored to your lifestyle."),
    ])
  }

  function handleSelectDesign(design: DesignOption) {
    setSelectedDesign(design)
    setChatMessages(prev => [
      ...prev,
      createMessage('Illu', `${design.name} is a great choice. Maya has noted your selection.`),
    ])
  }

  function handleProceedToFinancial() {
    setScreen('proposal')
  }

  function handleProposalContinue() {
    setChatMessages(prev => [
      ...prev,
      createMessage('Illu', "Your initial proposal is complete. When you're ready, we can schedule a detailed consultation to move forward."),
    ])
  }

  function handleLogoClick() {
    setScreen('welcome')
  }

  switch (screen) {
    case 'welcome':
      return <WelcomeScreen onStart={() => setScreen('meet-illu')} />

    case 'meet-illu':
      return (
        <MeetIlluScreen 
          onSubmit={handleInitialDescription}
          isProcessing={isProcessing}
          processingStatus={processingStatus}
          onBack={() => setScreen('welcome')}
        />
      )

    case 'conversation':
      return (
        <ConversationScreen
          messages={chatMessages}
          profile={customerProfile}
          fieldSources={fieldSources}
          activeTeamMembers={activeTeamMembers}
          isProcessing={isProcessing}
          profileProgress={profileProgress}
          onSendMessage={handleChatMessage}
          onProceedToDesign={handleProceedToDesign}
          onLogoClick={handleLogoClick}
          onFieldUpdate={handleFieldUpdate}
        />
      )

    case 'team-assembly':
      return (
        <TeamAssemblyScreen 
          onComplete={() => {
            handleTeamAssemblyComplete()
            setTimeout(() => setScreen('design-review'), 500)
          }}
          onLogoClick={handleLogoClick}
        />
      )

    case 'design-review':
      return (
        <DesignReviewScreen
          selectedDesign={selectedDesign}
          onSelectDesign={handleSelectDesign}
          onProceedToFinancial={handleProceedToFinancial}
          onLogoClick={handleLogoClick}
        />
      )

    case 'proposal':
      return (
        <ProposalScreen
          profile={customerProfile}
          selectedDesign={selectedDesign}
          onLogoClick={handleLogoClick}
          onContinue={handleProposalContinue}
        />
      )

    default:
      return <WelcomeScreen onStart={() => setScreen('meet-illu')} />
  }
}

export default App
