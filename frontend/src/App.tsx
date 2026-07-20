import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Screen = 'welcome' | 'intro' | 'builder'
type BuilderMode = 'start' | 'chat' | 'selections'
type Stage = 'collecting' | 'mayaWorking' | 'designOptions' | 'designSelected' | 'ethanWorking' | 'estimateReady' | 'final'
type ChatSender = 'Illu' | 'You'

type ChatMessage = {
  sender: ChatSender
  text: string
}

type DesignOption = {
  name: string
  description: string
  floorPlan: string
  accent: string
}

type CustomerHomeProfile = {
  home_style: 'Modern' | 'Modern Farmhouse' | 'Traditional' | 'Other' | 'Not selected'
  number_of_floors: number | null
  bedrooms: number | null
  bathrooms: number | null
  garage: 'No Garage' | '1-Car' | '2-Car' | '3-Car+' | 'Not selected'
  home_office: 'Included' | 'Not Included' | 'Not selected'
  guest_suite: 'Included' | 'Not Included' | 'Not selected'
  covered_patio: 'Included' | 'Not Included' | 'Not selected'
  kitchen_type: 'Open Kitchen' | 'Closed Kitchen' | "Chef's Kitchen" | 'Not selected'
  material_package: 'Essential' | 'Premium' | 'Luxury' | 'Not selected'
}

type FieldSource = 'customer' | 'illu' | 'manual' | 'missing'

type FieldSources = {
  home_style: FieldSource
  number_of_floors: FieldSource
  bedrooms: FieldSource
  bathrooms: FieldSource
  garage: FieldSource
  home_office: FieldSource
  guest_suite: FieldSource
  covered_patio: FieldSource
  kitchen_type: FieldSource
  material_package: FieldSource
}

type IlluAnalyzeResponse = {
  illu_message: string
  profile: CustomerHomeProfile
  field_sources: FieldSources
  needs_follow_up: boolean
  follow_up_question: string | null
  confidence: number
}

const styleOptions = ['Modern', 'Modern Farmhouse', 'Traditional', 'Other'] as const
const floorOptions = ['1', '2', '3']
const bedroomOptions = ['2', '3', '4', '5+']
const bathroomOptions = ['2', '2.5', '3', '3.5+']
const garageOptions = ['No Garage', '1-Car', '2-Car', '3-Car+'] as const
const includedOptions = ['Included', 'Not Included'] as const
const kitchenOptions = ['Open Kitchen', 'Closed Kitchen', "Chef's Kitchen"] as const
const materialOptions = ['Essential', 'Premium', 'Luxury'] as const
const familyOptions = ['Couple', 'Couple + Kids', 'Multi-Generational']
const workspaceOptions = ['Home Office', 'Study', 'None']
const guestOptions = ['Guest Suite', 'Independent Suite', 'None']
const analysisStatuses = [
  'Reviewing your lifestyle...',
  "Understanding your family's needs...",
  'Building your initial home profile...',
]

const defaultCustomerHomeProfile: CustomerHomeProfile = {
  home_style: 'Not selected',
  number_of_floors: null,
  bedrooms: null,
  bathrooms: null,
  garage: 'Not selected',
  home_office: 'Not selected',
  guest_suite: 'Not selected',
  covered_patio: 'Not selected',
  kitchen_type: 'Not selected',
  material_package: 'Not selected',
}

const defaultFieldSources: FieldSources = {
  home_style: 'missing',
  number_of_floors: 'missing',
  bedrooms: 'missing',
  bathrooms: 'missing',
  garage: 'missing',
  home_office: 'missing',
  guest_suite: 'missing',
  covered_patio: 'missing',
  kitchen_type: 'missing',
  material_package: 'missing',
}

const designOptions: DesignOption[] = [
  {
    name: 'Modern Family',
    description: 'Open gathering spaces, flexible bedrooms, and a calm daily rhythm.',
    floorPlan: '4 beds · 3 baths · Open kitchen · Loft · Home office',
    accent: 'from-[#f5c95e] to-[#6c4c17]',
  },
  {
    name: 'Modern Farmhouse',
    description: 'Warm materials, soft contrast, and a refined indoor-outdoor feel.',
    floorPlan: '4 beds · 3.5 baths · Guest suite · Covered patio · Study',
    accent: 'from-[#ffe09a] to-[#5d4220]',
  },
  {
    name: 'Contemporary Living',
    description: 'Clean architecture, natural light, and a polished luxury finish.',
    floorPlan: '5 beds · 4 baths · Glass living room · Flex room · Private suite',
    accent: 'from-[#fff0bd] to-[#2f2a22]',
  },
]

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [builderMode, setBuilderMode] = useState<BuilderMode>('chat')
  const [stage, setStage] = useState<Stage>('collecting')
  const [introDescription, setIntroDescription] = useState('')
  const [hasSubmittedIntro, setHasSubmittedIntro] = useState(false)
  const [isOrganizingProfile, setIsOrganizingProfile] = useState(false)
  const [analysisStatusIndex, setAnalysisStatusIndex] = useState(0)
  const [isAnalysisStatusVisible, setIsAnalysisStatusVisible] = useState(true)
  const [introError, setIntroError] = useState('')
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'Illu',
      text: 'Tell me about the home you are imagining. You can describe your family, style, rooms, workspace, guests, materials, or any special needs.',
    },
  ])

  const [style, setStyle] = useState('')
  const [family, setFamily] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [workspace, setWorkspace] = useState('')
  const [guestLiving, setGuestLiving] = useState('')
  const [materials, setMaterials] = useState('')
  const [, setNotes] = useState<string[]>([])
  const [customerHomeProfile, setCustomerHomeProfile] = useState<CustomerHomeProfile>(defaultCustomerHomeProfile)
  const [fieldSources, setFieldSources] = useState<FieldSources>(defaultFieldSources)
  const [updatedFields, setUpdatedFields] = useState<string[]>([])
  const [selectedDesign, setSelectedDesign] = useState<DesignOption | null>(null)

  useEffect(() => {
    if (updatedFields.length === 0) return

    const timer = window.setTimeout(() => {
      setUpdatedFields([])
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [updatedFields])

  useEffect(() => {
    if (!isOrganizingProfile) return

    const fadeToSecondStatusTimer = window.setTimeout(() => {
      setIsAnalysisStatusVisible(false)
    }, 2700)
    const showSecondStatusTimer = window.setTimeout(() => {
      setAnalysisStatusIndex(1)
      setIsAnalysisStatusVisible(true)
    }, 3000)
    const fadeToThirdStatusTimer = window.setTimeout(() => {
      setIsAnalysisStatusVisible(false)
    }, 5700)
    const showThirdStatusTimer = window.setTimeout(() => {
      setAnalysisStatusIndex(2)
      setIsAnalysisStatusVisible(true)
    }, 6000)

    return () => {
      window.clearTimeout(fadeToSecondStatusTimer)
      window.clearTimeout(showSecondStatusTimer)
      window.clearTimeout(fadeToThirdStatusTimer)
      window.clearTimeout(showThirdStatusTimer)
    }
  }, [isOrganizingProfile])

  const discoveryProgress = useMemo(() => {
    const completed = [
      customerHomeProfile.home_style !== 'Not selected',
      customerHomeProfile.number_of_floors !== null,
      customerHomeProfile.bedrooms !== null,
      customerHomeProfile.bathrooms !== null,
      customerHomeProfile.garage !== 'Not selected',
      customerHomeProfile.home_office !== 'Not selected',
      customerHomeProfile.guest_suite !== 'Not selected',
      customerHomeProfile.covered_patio !== 'Not selected',
      customerHomeProfile.kitchen_type !== 'Not selected',
      customerHomeProfile.material_package !== 'Not selected',
    ].filter(Boolean).length

    return Math.round((completed / 10) * 100)
  }, [customerHomeProfile])

  const isProfileReady = discoveryProgress === 100

  const estimatedTimeline = useMemo(() => {
    let months = 8

    if (bedrooms === '4') months += 1
    if (bedrooms === '5') months += 2
    if (workspace === 'Home Office') months += 1
    if (guestLiving !== '' && guestLiving !== 'None') months += 1
    if (materials === 'Luxury') months += 2

    return `${months}-${months + 2} months`
  }, [bedrooms, guestLiving, materials, workspace])

  const estimatedPrice = useMemo(() => {
    let price = 520000

    if (style === 'Modern') price += 35000
    if (style === 'Modern Farmhouse') price += 28000
    if (bedrooms === '4') price += 62000
    if (bedrooms === '5') price += 118000
    if (workspace === 'Home Office') price += 42000
    if (workspace === 'Study') price += 22000
    if (guestLiving === 'Guest Suite') price += 86000
    if (guestLiving === 'Independent Suite') price += 135000
    if (materials === 'Essential') price -= 30000
    if (materials === 'Premium') price += 45000
    if (materials === 'Luxury') price += 125000
    if (selectedDesign?.name === 'Contemporary Living') price += 30000

    return price
  }, [bedrooms, guestLiving, materials, selectedDesign, style, workspace])

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function sourceLabel(source: FieldSource) {
    if (source === 'customer') return 'Selected from your description'
    if (source === 'illu') return 'Suggested by Illu'
    if (source === 'manual') return 'Updated by you'

    return 'Not selected'
  }

  function selectedBedroomOption() {
    if (customerHomeProfile.bedrooms === null) return ''
    if (customerHomeProfile.bedrooms >= 5) return '5+'

    return `${customerHomeProfile.bedrooms}`
  }

  function selectedBathroomOption() {
    if (customerHomeProfile.bathrooms === null) return ''
    return customerHomeProfile.bathrooms === 3.5 ? '3.5+' : String(customerHomeProfile.bathrooms)
  }

  function selectedGarageOption() {
    return customerHomeProfile.garage === 'Not selected' ? '' : customerHomeProfile.garage
  }

  function selectedIncludedOption(value: string) {
    return value === 'Not selected' ? '' : value
  }

  function selectedWorkspaceFromProfile() {
    return customerHomeProfile.home_office === 'Included' ? 'Home Office' : 'None'
  }

  function selectedGuestLivingFromProfile() {
    return customerHomeProfile.guest_suite === 'Included' ? 'Guest Suite' : 'None'
  }

  function startBuilding() {
    setScreen('intro')
  }

  function buildCurrentProfile() {
    return customerHomeProfile
  }

  function applyBackendProfile(profile: CustomerHomeProfile, sources: Partial<FieldSources>) {
    const changedFields: string[] = []
    const nextProfile = { ...defaultCustomerHomeProfile, ...customerHomeProfile, ...profile }
    const nextSources = { ...defaultFieldSources, ...sources }

    setCustomerHomeProfile(nextProfile)
    setFieldSources(nextSources)

    if (nextProfile.home_style !== 'Not selected') {
      setStyle(nextProfile.home_style)
      changedFields.push('Style')
    }

    if (typeof nextProfile.bedrooms === 'number') {
      setBedrooms(String(nextProfile.bedrooms))
      changedFields.push('Bedrooms')
    }

    if (nextProfile.home_office === 'Included') {
      setWorkspace('Home Office')
      changedFields.push('Workspace')
    } else if (nextProfile.home_office === 'Not Included') {
      setWorkspace('None')
      changedFields.push('Workspace')
    }

    if (nextProfile.guest_suite === 'Included') {
      setGuestLiving('Guest Suite')
      changedFields.push('Guest Living')
    } else if (nextProfile.guest_suite === 'Not Included') {
      setGuestLiving('None')
      changedFields.push('Guest Living')
    }

    if (nextProfile.material_package !== 'Not selected') {
      setMaterials(nextProfile.material_package)
      changedFields.push('Materials')
    }

    setUpdatedFields([...new Set(changedFields)])
  }

  async function analyzeWithIlluBackend(customerText: string) {
    const response = await fetch('/api/illu/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_message: customerText,
        current_profile: buildCurrentProfile(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null) as { detail?: string } | null
      throw new Error(errorData?.detail ?? 'Illu backend could not analyze the home description.')
    }

    return await response.json() as IlluAnalyzeResponse
  }

  async function handleIntroMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanMessage = introDescription.trim()
    if (!cleanMessage || isOrganizingProfile) return

    setIsOrganizingProfile(true)
    setAnalysisStatusIndex(0)
    setIsAnalysisStatusVisible(true)
    setIntroError('')
    try {
      const response = await analyzeWithIlluBackend(cleanMessage)
      const reply = response.needs_follow_up
        ? `${response.illu_message} ${response.follow_up_question ?? ''}`.trim()
        : response.illu_message

      applyBackendProfile(response.profile, response.field_sources)

      setChatMessages((currentMessages) => [
        ...currentMessages,
        { sender: 'You', text: cleanMessage },
        { sender: 'Illu', text: reply },
      ])
      setHasSubmittedIntro(true)
      setIsAnalysisStatusVisible(false)
      setBuilderMode('selections')
      setScreen('builder')
    } catch (error) {
      console.error('Unable to analyze the introductory description:', error)
      setIsAnalysisStatusVisible(false)
      setIntroError(error instanceof Error ? error.message : 'Illu could not analyze the description. Please try again.')
    } finally {
      setIsOrganizingProfile(false)
    }
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanMessage = message.trim()
    if (!cleanMessage) return

    const response = await analyzeWithIlluBackend(cleanMessage)
    applyBackendProfile(response.profile, response.field_sources)

    const reply = response.needs_follow_up
      ? `${response.illu_message} ${response.follow_up_question}`
      : `${response.illu_message} You can keep describing the home or adjust any card on the right.`

    setChatMessages((currentMessages) => [
      ...currentMessages,
      { sender: 'You', text: cleanMessage },
      { sender: 'Illu', text: isProfileReady ? 'I have enough to begin a design review.' : reply },
    ])

    setMessage('')
  }

  function updateFamily(value: string) {
    setFamily(value)
    setNotes((currentNotes) => [...currentNotes, `Family: ${value}`])
  }

  function updateStyle(value: CustomerHomeProfile['home_style']) {
    setStyle(value)
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      home_style: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, home_style: 'manual' }))
  }

  function updateBedrooms(value: string) {
    const bedroomValue = value === '5+' ? 5 : Number(value)

    setBedrooms(value)
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      bedrooms: bedroomValue,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, bedrooms: 'manual' }))
  }

  function updateFloors(value: string) {
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      number_of_floors: Number(value),
    }))
    setFieldSources((currentSources) => ({ ...currentSources, number_of_floors: 'manual' }))
  }

  function updateBathrooms(value: string) {
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      bathrooms: value === '3.5+' ? 3.5 : Number(value),
    }))
    setFieldSources((currentSources) => ({ ...currentSources, bathrooms: 'manual' }))
  }

  function updateGarage(value: CustomerHomeProfile['garage']) {
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      garage: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, garage: 'manual' }))
  }

  function updateHomeOffice(value: CustomerHomeProfile['home_office']) {
    setWorkspace(value === 'Included' ? 'Home Office' : 'None')
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      home_office: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, home_office: 'manual' }))
  }

  function updateWorkspace(value: string) {
    setWorkspace(value)
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      home_office: value === 'Home Office' ? 'Included' : 'Not Included',
    }))
  }

  function updateGuestSuite(value: CustomerHomeProfile['guest_suite']) {
    setGuestLiving(value === 'Included' ? 'Guest Suite' : 'None')
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      guest_suite: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, guest_suite: 'manual' }))
  }

  function updateGuestLiving(value: string) {
    setGuestLiving(value)
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      guest_suite: value === 'None' ? 'Not Included' : 'Included',
    }))
  }

  function updateCoveredPatio(value: CustomerHomeProfile['covered_patio']) {
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      covered_patio: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, covered_patio: 'manual' }))
  }

  function updateKitchenType(value: CustomerHomeProfile['kitchen_type']) {
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      kitchen_type: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, kitchen_type: 'manual' }))
  }

  function updateMaterials(value: CustomerHomeProfile['material_package']) {
    setMaterials(value)
    setCustomerHomeProfile((currentProfile) => ({
      ...currentProfile,
      material_package: value,
    }))
    setFieldSources((currentSources) => ({ ...currentSources, material_package: 'manual' }))
  }

  function reviewDesignOptions() {
    setStage('mayaWorking')
    setChatMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: 'Illu',
        text: "I've learned enough about your family. I'm inviting Maya, our Senior Design Consultant. She'll prepare designs based on everything we've discussed.",
      },
    ])

    window.setTimeout(() => {
      setStage('designOptions')
    }, 5000)
  }

  function selectDesign(design: DesignOption) {
    setSelectedDesign(design)
    setStage('designSelected')
    setChatMessages((currentMessages) => [
      ...currentMessages,
      { sender: 'Illu', text: `${design.name} is selected. Maya has completed the design review.` },
    ])
  }

  function prepareEstimate() {
    setStage('ethanWorking')
    setChatMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: 'Illu',
        text: "I'm asking Ethan, our Financial Advisor, to prepare an estimate.",
      },
    ])

    window.setTimeout(() => {
      setStage('estimateReady')
      setChatMessages((currentMessages) => [
        ...currentMessages,
        { sender: 'Illu', text: 'Your first home profile is ready.' },
      ])
    }, 1800)
  }

  if (screen === 'welcome') {
    return (
      <main className="h-screen overflow-hidden bg-[#060606] text-white">
        <section className="relative flex h-full items-center px-6 py-6 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(245,201,94,0.2),transparent_32%),linear-gradient(180deg,rgba(18,15,9,0.35),#060606_74%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-between gap-8">
            <nav className="flex items-center justify-between text-sm text-white/66">
              <span className="text-lg font-semibold tracking-[0.36em] text-[#f5c95e]">UH HOMES</span>
              <span>Design your future home</span>
            </nav>

            <div className="max-w-4xl py-8 sm:py-12">
              <h1 className="text-5xl font-medium leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Welcome to <span className="whitespace-nowrap">UH Homes</span>
              </h1>
              <p className="mt-5 max-w-2xl text-2xl font-light leading-tight text-white/84 sm:text-3xl">
                Your home begins with a conversation.
              </p>
              <button
                type="button"
                onClick={startBuilding}
                className="mt-9 inline-flex min-h-12 items-center justify-center rounded-md border border-[#f5c95e]/60 bg-[#f5c95e] px-7 text-sm font-semibold text-black shadow-xl shadow-[#f5c95e]/15 transition hover:bg-[#ffd978] focus:outline-none focus:ring-2 focus:ring-[#f5c95e]/70"
              >
                Start Building My Home
              </button>
            </div>

            <div />
          </div>
        </section>
      </main>
    )
  }

  if (screen === 'intro') {
    return (
      <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[#060606] px-6 text-white">
        <nav className="absolute left-6 right-6 top-6 flex items-center justify-between text-sm text-white/66 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
          <span className="text-lg font-semibold tracking-[0.36em] text-[#f5c95e]">UH HOMES</span>
        </nav>
        <section className="grid max-h-[calc(100vh-120px)] w-full max-w-6xl animate-[fadeIn_700ms_ease-out] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
          <h1 className="text-5xl font-medium tracking-normal text-white sm:text-7xl">Illu</h1>
          <p className="mt-6 max-w-2xl text-2xl font-light leading-tight text-white/82">
            Chief Home Building Officer
          </p>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/62">
            Tell me about the life you want to build, and I'll help shape the home around it.
          </p>
          </div>

          <section className="rounded-lg border border-[#f5c95e]/18 bg-[#0d0b07] text-left shadow-2xl shadow-black/30">
            <div className="border-b border-[#f5c95e]/16 px-5 py-4">
              <h2 className="mt-2 text-2xl font-medium text-white">Tell me about the home you're imagining.</h2>
            </div>

          <form onSubmit={handleIntroMessage} className="p-5">
            <label htmlFor="intro-description" className="sr-only">Describe your dream home</label>
              <textarea
                id="intro-description"
                value={introDescription}
                onChange={(event) => setIntroDescription(event.target.value)}
                readOnly={isOrganizingProfile}
                aria-busy={isOrganizingProfile}
                placeholder="My wife and I have two kids. I work from home a few days a week, and my parents often stay with us during holidays. We'd love a modern home with plenty of natural light and a quiet office."
                className="min-h-44 w-full resize-none rounded-md border border-[#f5c95e]/20 bg-black/35 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/38 focus:border-[#f5c95e]/60"
              />
            {!hasSubmittedIntro && (
              <div className="mt-4">
                {isOrganizingProfile && (
                  <section
                    aria-live="polite"
                    className="mb-4 translate-y-0 opacity-100 transition-all duration-500 ease-out"
                  >
                    <p className="text-center text-sm font-medium text-white/82">
                      Illu is understanding your vision...
                    </p>
                    <div className="mx-auto mt-3 flex min-h-6 max-w-sm items-center justify-center overflow-hidden text-sm">
                      <p
                        className={`text-center text-white/72 transition-all duration-300 ease-out ${
                          isAnalysisStatusVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-1.5 opacity-0'
                        }`}
                      >
                        {analysisStatuses[analysisStatusIndex]}
                      </p>
                    </div>
                  </section>
                )}
                {introError && (
                  <p role="alert" className="mb-3 text-center text-sm text-red-300">{introError}</p>
                )}
                <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isOrganizingProfile || !introDescription.trim()}
                  className="min-h-11 rounded-md bg-[#f5c95e] px-12 text-sm font-semibold text-black transition hover:bg-[#ffd978] focus:outline-none focus:ring-2 focus:ring-[#f5c95e]/70 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Continue
                </button>
                </div>
              </div>
            )}
            {hasSubmittedIntro && (
              <div className="mt-5 rounded-md border border-[#f5c95e]/16 bg-[#18140d] p-4 text-sm leading-6 text-white/70">
                <p className="text-white">Thank you. I think I have a good understanding of what matters most to you.</p>
                <p className="mt-2">I'm organizing everything into your Home Profile so the rest of our team can build around your lifestyle instead of asking you the same questions again.</p>
              </div>
            )}
          </form>
          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <header className="flex items-center justify-between border-b border-[#f5c95e]/18 bg-black px-5 py-4 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => setScreen('welcome')}
          className="text-lg font-semibold tracking-[0.36em] text-[#f5c95e]"
        >
          UH HOMES
        </button>
        <span className="text-sm text-white/60">Illu Assistant</span>
      </header>

      {(stage === 'mayaWorking' || stage === 'designOptions' || stage === 'designSelected') && (
        <MayaScreen
          stage={stage}
          selectedDesign={selectedDesign}
          onSelectDesign={selectDesign}
          onProceedToQuote={prepareEstimate}
        />
      )}

      {(stage === 'ethanWorking' || stage === 'estimateReady' || stage === 'final') && (
        <FinancialScreen
          stage={stage}
          price={formatCurrency(estimatedPrice)}
          timeline={estimatedTimeline}
          style={style || 'Not selected'}
          materials={materials || 'Not selected'}
          selectedDesign={selectedDesign?.name ?? 'Not selected'}
          bedrooms={bedrooms || 'Not selected'}
          workspace={workspace || 'Not selected'}
          guestLiving={guestLiving || 'Not selected'}
          onViewFinal={() => setStage('final')}
        />
      )}

      {stage === 'collecting' && builderMode === 'start' && (
        <section className="flex min-h-[calc(100vh-65px)] items-center bg-[radial-gradient(circle_at_78%_14%,rgba(245,201,94,0.11),transparent_30%),#060606] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#f5c95e]/72">Start your home profile</p>
              <h1 className="mt-4 text-4xl font-medium leading-tight tracking-normal text-white sm:text-6xl">
                Choose how you want to begin.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/62">
                Illu can capture your ideas from a natural description, or you can go directly to manual selections.
              </p>
            </div>

            <div className="grid gap-4">
              <button
                type="button"
                onClick={() => setBuilderMode('chat')}
                className="rounded-lg border border-[#f5c95e]/24 bg-[#14110c] p-6 text-left transition hover:border-[#f5c95e]/60 hover:bg-[#1b160e]"
              >
                <span className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/70">Option 1</span>
                <span className="mt-4 block text-3xl font-medium text-white">Describe my home to Illu</span>
                <span className="mt-3 block max-w-xl text-base leading-7 text-white/60">
                  Tell Illu about your family, style, workspace, guests, materials, and special needs. Illu will capture selections from your description.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBuilderMode('selections')}
                className="rounded-lg border border-[#f5c95e]/24 bg-[#11100d]/92 p-6 text-left transition hover:border-[#f5c95e]/60 hover:bg-[#1b160e]"
              >
                <span className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/70">Option 2</span>
                <span className="mt-4 block text-3xl font-medium text-white">Go to manual selections</span>
                <span className="mt-3 block max-w-xl text-base leading-7 text-white/60">
                  Skip the conversation and choose each home preference yourself.
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === 'collecting' && builderMode === 'chat' && (
        <section className="grid min-h-[calc(100vh-65px)] grid-cols-1 lg:h-[calc(100vh-65px)] lg:min-h-0 lg:grid-cols-[minmax(420px,0.9fr)_minmax(520px,1.1fr)] lg:overflow-hidden">
          <aside className="flex min-h-[520px] flex-col border-b border-[#f5c95e]/16 bg-[#0d0b07] lg:min-h-0 lg:border-b-0 lg:border-r lg:border-[#f5c95e]/16">
            <div className="border-b border-[#f5c95e]/16 px-5 py-5 sm:px-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/72">Illu Conversation</p>
              <h1 className="mt-2 text-2xl font-medium tracking-normal text-white">Describe the home you are thinking of.</h1>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-6">
              {chatMessages.map((chatMessage, index) => (
                <div
                  key={`${chatMessage.sender}-${index}`}
                  className={`max-w-[90%] rounded-lg px-4 py-3 text-sm leading-6 transition ${
                    chatMessage.sender === 'You'
                      ? 'ml-auto bg-[#f5c95e] text-black'
                      : 'bg-[#18140d] text-white/82 ring-1 ring-[#f5c95e]/18'
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] opacity-55">{chatMessage.sender}</p>
                  <p>{chatMessage.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-[#f5c95e]/16 p-5 sm:p-6">
              <label htmlFor="message" className="sr-only">Message Illu</label>
              <div className="flex gap-3">
                <input
                  id="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Example: modern home, two kids, office, parents visit, luxury finishes"
                  className="min-h-12 flex-1 rounded-md border border-[#f5c95e]/20 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/38 focus:border-[#f5c95e]/60"
                />
                <button
                  type="submit"
                  className="min-h-12 rounded-md bg-[#f5c95e] px-5 text-sm font-semibold text-black transition hover:bg-[#ffd978] focus:outline-none focus:ring-2 focus:ring-[#f5c95e]/70"
                >
                  Send
                </button>
              </div>
            </form>
          </aside>

          <section className="bg-[radial-gradient(circle_at_82%_12%,rgba(245,201,94,0.11),transparent_28%),#060606] px-5 py-6 sm:px-8 lg:overflow-y-auto lg:px-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <div>
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-[#f5c95e]/70">Selections captured by Illu</p>
                  <h2 className="mt-2 text-3xl font-medium tracking-normal text-white sm:text-4xl">Your Home Is Taking Shape</h2>
                </div>
              </div>

              <ProfileSection title="Family">
                {familyOptions.map((option) => (
                  <ChoiceCard key={option} label={option} isSelected={family === option} isUpdated={updatedFields.includes('Family')} onClick={() => updateFamily(option)} />
                ))}
              </ProfileSection>

              <ProfileSection title="Style">
                {styleOptions.map((option) => (
                  <ChoiceCard key={option} label={option} isSelected={customerHomeProfile.home_style === option} isUpdated={updatedFields.includes('Style')} onClick={() => updateStyle(option)} />
                ))}
              </ProfileSection>

              <ProfileSection title="Bedrooms">
                {bedroomOptions.map((option) => (
                  <ChoiceCard key={option} label={option} isSelected={`${customerHomeProfile.bedrooms}` === option} isUpdated={updatedFields.includes('Bedrooms')} onClick={() => updateBedrooms(option)} />
                ))}
              </ProfileSection>

              <ProfileSection title="Workspace">
                {workspaceOptions.map((option) => (
                  <ChoiceCard key={option} label={option} isSelected={selectedWorkspaceFromProfile() === option} isUpdated={updatedFields.includes('Workspace')} onClick={() => updateWorkspace(option)} />
                ))}
              </ProfileSection>

              <ProfileSection title="Guest Living">
                {guestOptions.map((option) => (
                  <ChoiceCard key={option} label={option} isSelected={selectedGuestLivingFromProfile() === option} isUpdated={updatedFields.includes('Guest Living')} onClick={() => updateGuestLiving(option)} />
                ))}
              </ProfileSection>

              <ProfileSection title="Materials">
                {materialOptions.map((option) => (
                  <ChoiceCard key={option} label={option} isSelected={customerHomeProfile.material_package === option} isUpdated={updatedFields.includes('Materials')} onClick={() => updateMaterials(option)} />
                ))}
              </ProfileSection>

              {isProfileReady && stage === 'collecting' && (
                <button
                  type="button"
                  onClick={reviewDesignOptions}
                  className="w-full rounded-md border border-[#f5c95e]/50 bg-[#f5c95e] px-6 py-4 text-sm font-semibold text-black shadow-xl shadow-[#f5c95e]/10 transition hover:bg-[#ffd978] sm:w-fit"
                >
                  Review Design Options
                </button>
              )}

            </div>
          </section>
        </section>
      )}

      {stage === 'collecting' && builderMode === 'selections' && (
        <section className="min-h-[calc(100vh-65px)] bg-[radial-gradient(circle_at_82%_12%,rgba(245,201,94,0.11),transparent_28%),#060606] px-5 py-6 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <div>
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-[#f5c95e]/70">Your Home Profile</p>
                <h2 className="mt-2 text-3xl font-medium tracking-normal text-white sm:text-4xl">Here's what I've understood so far.</h2>
                <p className="mt-3 text-base leading-7 text-white/60">You can review anything before we continue.</p>
              </div>
            </div>

            <ProfileSection title="Style">
              {styleOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={customerHomeProfile.home_style === option} sourceLabel={sourceLabel(fieldSources.home_style)} isUpdated={updatedFields.includes('Style')} onClick={() => updateStyle(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Floors">
              {floorOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={customerHomeProfile.number_of_floors === Number(option)} sourceLabel={sourceLabel(fieldSources.number_of_floors)} onClick={() => updateFloors(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Bedrooms">
              {bedroomOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={selectedBedroomOption() === option} sourceLabel={sourceLabel(fieldSources.bedrooms)} isUpdated={updatedFields.includes('Bedrooms')} onClick={() => updateBedrooms(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Bathrooms">
              {bathroomOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={selectedBathroomOption() === option} sourceLabel={sourceLabel(fieldSources.bathrooms)} onClick={() => updateBathrooms(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Garage">
              {garageOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={selectedGarageOption() === option} sourceLabel={sourceLabel(fieldSources.garage)} onClick={() => updateGarage(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Home Office">
              {includedOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={selectedIncludedOption(customerHomeProfile.home_office) === option} sourceLabel={sourceLabel(fieldSources.home_office)} isUpdated={updatedFields.includes('Workspace')} onClick={() => updateHomeOffice(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Guest Suite">
              {includedOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={selectedIncludedOption(customerHomeProfile.guest_suite) === option} sourceLabel={sourceLabel(fieldSources.guest_suite)} isUpdated={updatedFields.includes('Guest Living')} onClick={() => updateGuestSuite(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Covered Patio">
              {includedOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={selectedIncludedOption(customerHomeProfile.covered_patio) === option} sourceLabel={sourceLabel(fieldSources.covered_patio)} onClick={() => updateCoveredPatio(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Kitchen Type">
              {kitchenOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={customerHomeProfile.kitchen_type === option} sourceLabel={sourceLabel(fieldSources.kitchen_type)} onClick={() => updateKitchenType(option)} />
              ))}
            </ProfileSection>

            <ProfileSection title="Material Package">
              {materialOptions.map((option) => (
                <ChoiceCard key={option} label={option} isSelected={customerHomeProfile.material_package === option} sourceLabel={sourceLabel(fieldSources.material_package)} isUpdated={updatedFields.includes('Materials')} onClick={() => updateMaterials(option)} />
              ))}
            </ProfileSection>

            <button
              type="button"
              onClick={reviewDesignOptions}
              className="w-full rounded-md border border-[#f5c95e]/50 bg-[#f5c95e] px-6 py-4 text-sm font-semibold text-black shadow-xl shadow-[#f5c95e]/10 transition hover:bg-[#ffd978] sm:w-fit"
            >
              Review Design Options
            </button>

          </div>
        </section>
      )}
    </main>
  )
}

type ProfileSectionProps = {
  title: string
  children: React.ReactNode
}

type MayaScreenProps = {
  stage: Stage
  selectedDesign: DesignOption | null
  onSelectDesign: (design: DesignOption) => void
  onProceedToQuote: () => void
}

function MayaScreen({ stage, selectedDesign, onSelectDesign, onProceedToQuote }: MayaScreenProps) {
  const isLoading = stage === 'mayaWorking'

  return (
    <section className="min-h-[calc(100vh-65px)] bg-[radial-gradient(circle_at_80%_10%,rgba(245,201,94,0.12),transparent_28%),#060606] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {isLoading ? (
          <section className="flex min-h-[calc(100vh-140px)] items-center">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#f5c95e]/72">Illu</p>
              <h1 className="mt-4 text-4xl font-medium leading-tight text-white sm:text-6xl">
                I've completed your Home Profile.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
                I'm now sitting down with Maya, our Senior Home Design Consultant.
              </p>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-white/62">
                Together we'll explore design directions that best fit your lifestyle.
              </p>
              <LoadingBlock label="Maya is reviewing your lifestyle..." durationSeconds={5} />
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-lg border border-[#f5c95e]/18 bg-[#11100d]/92 p-6">
              <h1 className="text-5xl font-medium tracking-normal text-white sm:text-7xl">Maya</h1>
              <p className="mt-6 max-w-2xl text-2xl font-light leading-tight text-white/82">Senior Home Design Consultant</p>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/62">
                Illu and I work together, and Illu already helped me understand what matters most to you and your family. I've prepared three design directions that I think you'll enjoy exploring.
              </p>
            </section>

            <section className="rounded-lg border border-[#f5c95e]/16 bg-[#0f0d09] p-5">
              <h2 className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/70">Design Options + Floor Plans</h2>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {designOptions.map((design) => (
                  <article
                    key={design.name}
                    className={`rounded-lg border bg-[#14110c] p-4 transition ${
                      selectedDesign?.name === design.name ? 'border-[#f5c95e]' : 'border-[#f5c95e]/16'
                    }`}
                  >
                    <div className={`h-36 rounded-md bg-gradient-to-br ${design.accent}`} />
                    <h3 className="mt-4 text-2xl font-medium text-white">{design.name}</h3>
                    <p className="mt-2 min-h-20 text-sm leading-6 text-white/60">{design.description}</p>
                    <div className="mt-4 rounded-md border border-[#f5c95e]/14 bg-black/24 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#f5c95e]/62">Floor Plan</p>
                      <p className="mt-2 text-sm leading-6 text-white/70">{design.floorPlan}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectDesign(design)}
                      className="mt-4 w-full rounded-md border border-[#f5c95e]/40 px-4 py-3 text-sm font-semibold text-[#f5c95e] transition hover:bg-[#f5c95e] hover:text-black"
                    >
                      {selectedDesign?.name === design.name ? 'Selected' : 'Select Design'}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {selectedDesign && (
              <button
                type="button"
                onClick={onProceedToQuote}
                className="w-full rounded-md border border-[#f5c95e]/50 bg-[#f5c95e] px-6 py-4 text-sm font-semibold text-black shadow-xl shadow-[#f5c95e]/10 transition hover:bg-[#ffd978] sm:w-fit"
              >
                Proceed to Quote / Financial
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}

type FinancialScreenProps = {
  stage: Stage
  price: string
  timeline: string
  style: string
  materials: string
  selectedDesign: string
  bedrooms: string
  workspace: string
  guestLiving: string
  onViewFinal: () => void
}

function FinancialScreen({
  stage,
  price,
  timeline,
  style,
  materials,
  selectedDesign,
  bedrooms,
  workspace,
  guestLiving,
  onViewFinal,
}: FinancialScreenProps) {
  if (stage === 'final') {
    return (
      <section className="min-h-[calc(100vh-65px)] bg-[#060606] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <FinalSummary
            style={style}
            bedrooms={bedrooms}
            workspace={workspace}
            guestLiving={guestLiving}
            selectedDesign={selectedDesign}
            price={price}
            timeline={timeline}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[calc(100vh-65px)] bg-[radial-gradient(circle_at_80%_10%,rgba(245,201,94,0.12),transparent_28%),#060606] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-lg border border-[#f5c95e]/18 bg-[#11100d]/92 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[#f5c95e]/72">Ethan</p>
          <h1 className="mt-3 text-4xl font-medium text-white">I'm Ethan, your Financial Advisor.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/62">
            Maya has selected a design direction. I am preparing an early estimate and timeline from the design, materials, and lifestyle requirements.
          </p>
        </section>

        <EstimatePanel
          stage={stage}
          price={price}
          timeline={timeline}
          materials={materials}
          selectedDesign={selectedDesign}
          bedrooms={bedrooms}
          workspace={workspace}
          guestLiving={guestLiving}
        />

        {stage === 'estimateReady' && (
          <button
            type="button"
            onClick={onViewFinal}
            className="w-full rounded-md border border-[#f5c95e]/50 bg-[#f5c95e] px-6 py-4 text-sm font-semibold text-black shadow-xl shadow-[#f5c95e]/10 transition hover:bg-[#ffd978] sm:w-fit"
          >
            View Final Summary
          </button>
        )}
      </div>
    </section>
  )
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#f5c95e]/68">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{children}</div>
    </section>
  )
}

type ChoiceCardProps = {
  label: string
  isSelected: boolean
  isUpdated?: boolean
  sourceLabel?: string
  onClick: () => void
}

function ChoiceCard({ label, isSelected, isUpdated = false, sourceLabel, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-md border px-3 py-2 text-left transition duration-300 ${
        isSelected
          ? 'border-[#f5c95e] bg-[#f5c95e] text-black shadow-xl shadow-[#f5c95e]/10'
          : isUpdated
            ? 'border-[#f5c95e] bg-[#17130d] text-white shadow-xl shadow-[#f5c95e]/10'
            : 'border-[#f5c95e]/18 bg-[#14110c] text-white hover:border-[#f5c95e]/50 hover:bg-[#1b160e]'
      }`}
    >
      <span className="block text-sm font-medium tracking-normal">{label}</span>
      {isSelected && <span className="mt-1 block text-[11px] leading-4 text-black/62">{sourceLabel ?? 'Selected'}</span>}
    </button>
  )
}

type EstimatePanelProps = {
  stage: Stage
  price: string
  timeline: string
  materials: string
  selectedDesign: string
  bedrooms: string
  workspace: string
  guestLiving: string
}

function EstimatePanel({ stage, price, timeline, materials, selectedDesign, bedrooms, workspace, guestLiving }: EstimatePanelProps) {
  const isLoading = stage === 'ethanWorking'

  return (
    <section className="rounded-lg border border-[#f5c95e]/20 bg-[#11100d]/92 p-5">
      <h3 className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/70">Ethan Estimate</h3>
      {isLoading ? (
        <LoadingBlock label="Ethan is preparing estimate..." />
      ) : (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[#f5c95e]/16 bg-black/24 p-4">
              <p className="text-sm text-white/55">Estimated Price</p>
              <p className="mt-2 text-4xl font-medium text-[#f5c95e]">{price}</p>
            </div>
            <div className="rounded-lg border border-[#f5c95e]/16 bg-black/24 p-4">
              <p className="text-sm text-white/55">Estimated Timeline</p>
              <p className="mt-2 text-3xl font-medium text-white">{timeline}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Selected Materials" value={materials} />
            <SummaryCard label="Selected Design" value={selectedDesign} />
            <SummaryCard label="Bedrooms" value={bedrooms} />
            <SummaryCard label="Cost Drivers" value={`${workspace}, ${guestLiving}`} />
          </div>
        </>
      )}
    </section>
  )
}

function LoadingBlock({ label, durationSeconds = 1.8 }: { label: string; durationSeconds?: number }) {
  return (
    <div className="mt-5 rounded-lg border border-[#f5c95e]/16 bg-black/24 p-5">
      <p className="text-sm text-white/66">{label}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-[#f5c95e]"
          style={{ animation: `loadingBar ${durationSeconds}s ease-in-out forwards` }}
        />
      </div>
    </div>
  )
}

type SummaryCardProps = {
  label: string
  value: string
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-[#f5c95e]/16 bg-black/24 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#f5c95e]/62">{label}</p>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
    </div>
  )
}

type FinalSummaryProps = {
  style: string
  bedrooms: string
  workspace: string
  guestLiving: string
  selectedDesign: string
  price: string
  timeline: string
}

function FinalSummary({ style, bedrooms, workspace, guestLiving, selectedDesign, price, timeline }: FinalSummaryProps) {
  return (
    <section className="rounded-lg border border-[#f5c95e]/24 bg-[#14110c] p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/70">Your first home profile is ready.</p>
      <h3 className="mt-3 text-3xl font-medium text-white">Your Home</h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Style" value={style} />
        <SummaryCard label="Bedrooms" value={bedrooms} />
        <SummaryCard label="Home Office" value={workspace} />
        <SummaryCard label="Guest Suite" value={guestLiving} />
        <SummaryCard label="Selected Design" value={selectedDesign} />
        <SummaryCard label="Estimated Price" value={price} />
        <SummaryCard label="Estimated Timeline" value={timeline} />
        <SummaryCard label="Team" value="Illu, Maya, Ethan" />
      </div>

      <div className="mt-6 rounded-lg border border-[#f5c95e]/16 bg-black/24 p-4">
        <p className="text-sm uppercase tracking-[0.24em] text-[#f5c95e]/70">Your Team</p>
        <div className="mt-4 grid gap-2 text-sm text-white/72 sm:grid-cols-3">
          <span>Illu: Complete</span>
          <span>Maya: Complete</span>
          <span>Ethan: Complete</span>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-md border border-[#f5c95e]/50 bg-[#f5c95e] px-6 py-4 text-sm font-semibold text-black shadow-xl shadow-[#f5c95e]/10 transition hover:bg-[#ffd978] sm:w-fit"
      >
        Continue Building My Home
      </button>
    </section>
  )
}

export default App

