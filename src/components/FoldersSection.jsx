import { useState, useRef, useEffect, useLayoutEffect } from 'react'

const folders = [
  { label: 'DESIGN', bodyColor: '#50C0FA', tabColor: '#1688C4' },
  { label: 'TECHNICALS', bodyColor: '#C0F000', tabColor: '#8EAC12' },
  { label: 'PHOTOS', bodyColor: '#C96AED', tabColor: '#A825D9' },
]

const PAST_NOTES_FOLDER = {
  label: 'PAST NOTES',
  bodyColor: '#FF8A00',
  tabColor: '#E66500',
}

const PHOTOS_INNER_FOLDERS = ['Animals', 'Seclusion', 'Solitude', 'Warmth', 'Peace']

// Display name → path slug in public/photos; each slug folder holds image filenames
const PHOTOS_FOLDER_SLUGS = {
  Animals: 'animals',
  Seclusion: 'seclusion',
  Solitude: 'solitude',
  Warmth: 'warmth',
  Peace: 'peace',
}

const PHOTOS_FOLDER_FILES = {
  Animals: ['IMG_8861.jpg', 'IMG_4109.jpg', 'IMG_4020.jpg', 'IMG_4139.jpg', 'IMG_4086.jpg', 'IMG_4021.jpg'],
  Seclusion: ['IMG_9424.jpg', 'IMG_3916.jpg', 'IMG_3917.jpg', 'IMG_3908.jpg'],
  Solitude: ['IMG_9437.jpg', 'IMG_9443.jpg', 'IMG_9083.jpg', 'IMG_9095.jpg', 'IMG_9446.jpg', 'IMG_9451.jpg', 'IMG_9439.jpg', 'IMG_8930.jpg'],
  Warmth: ['IMG_4013.jpg','IMG_4164.jpg', 'IMG_4171.jpg', 'IMG_4173.jpg', 'IMG_4180.jpg'],
  Peace: [],
}
const DESIGN_INNER_FOLDERS = [
  'Cal Hacks',
  'AquaSync',
  'Astron',
  'Lazy Day Lines',
  'Digital Drawing',
  'CSSA',
]

const DESIGN_FOLDER_SLUGS = {
  'Digital Drawing': 'digital-drawing',
  Astron: 'astron',
  AquaSync: 'aquasync',
  'Cal Hacks': 'cal-hacks',
  'Lazy Day Lines': 'lazy-day-lines',
}

const DESIGN_FOLDER_FILES = {
  'Digital Drawing': ['magazine-cover.png', 'forest-elder.png', 'shattering.png'],
  Astron: [
    'astron-01.png',
    'astron-02.png',
    'astron-03.png',
    'astron-04.png',
    'astron-05.png',
    'astron-06.png',
  ],
  AquaSync: [
    'aquasync-01.jpg',
    'aquasync-02.jpg',
    'aquasync-03.jpg',
    'aquasync-04.jpg',
    'aquasync-05.jpg',
    'aquasync-06.jpg',
    'aquasync-07.jpg',
    'aquasync-08.jpg',
  ],
  'Cal Hacks': [],
  'Lazy Day Lines': ['lazy-day-lines-color-palette.png', 'lazy-day-lines-logo-exploration.png'],
}

const AQUASYNC_ITEMS = [
  {
    type: 'doc',
    pages: [
      '/design/aquasync/aquasync-01.jpg',
      '/design/aquasync/aquasync-02.jpg',
      '/design/aquasync/aquasync-03.jpg',
      '/design/aquasync/aquasync-04.jpg',
      '/design/aquasync/aquasync-05.jpg',
      '/design/aquasync/aquasync-06.jpg',
      '/design/aquasync/aquasync-07.jpg',
      '/design/aquasync/aquasync-08.jpg',
    ],
  },
  {
    type: 'doc',
    pages: [
      '/design/aquasync/aquasync-doc2-01.jpg',
      '/design/aquasync/aquasync-doc2-02.jpg',
      '/design/aquasync/aquasync-doc2-03.jpg',
      '/design/aquasync/aquasync-doc2-04.jpg',
      '/design/aquasync/aquasync-doc2-05.jpg',
      '/design/aquasync/aquasync-doc2-06.jpg',
      '/design/aquasync/aquasync-doc2-07.jpg',
      '/design/aquasync/aquasync-doc2-08.jpg',
      '/design/aquasync/aquasync-doc2-09.jpg',
      '/design/aquasync/aquasync-doc2-10.jpg',
      '/design/aquasync/aquasync-doc2-11.jpg',
      '/design/aquasync/aquasync-doc2-12.jpg',
      '/design/aquasync/aquasync-doc2-13.jpg',
      '/design/aquasync/aquasync-doc2-14.jpg',
      '/design/aquasync/aquasync-doc2-15.jpg',
      '/design/aquasync/aquasync-doc2-16.jpg',
      '/design/aquasync/aquasync-doc2-17.jpg',
    ],
  },
  {
    type: 'doc',
    pages: ['/design/aquasync/aquasync-doc3-02.jpg', '/design/aquasync/aquasync-doc3-01.jpg'],
  },
  {
    type: 'phoneScrollImage',
    coverSrc: '/design/aquasync/aquasync-figma-cover.jpg',
    frameSrc: '/design/aquasync/aquasync-phone-frame.svg',
    screenSrc: '/design/aquasync/aquasync-gui-scroll.png',
  },
  {
    type: 'image',
    src: '/design/aquasync/aquasync-dashboard-ui.png',
  },
]

const DESIGN_FOLDER_CAPTIONS = {
  Astron:
    'An astronomy magazine that presents the eight planets through an approachable, illustrative style, using hand-drawn elements and annotated layouts to make complex information more engaging and accessible.',
  AquaSync:
    `AquaSync is a universal hydration tracking system that turns any cup into a connected experience. By combining passive sensing with a companion interface, it makes water intake visible, effortless, and consistent over time.
    
    DESIGN FOUNDATION
Insight
Users struggle to track hydration across different containers and lack awareness of total daily intake.

Principles
Make hydration visible in real time
Remove dependency on a single bottle
Fit seamlessly into daily routines
Provide clear, intuitive feedback

System Decision
A smart sensing base with wireless syncing and a companion interface that enables real-time tracking across any cup.

PRODUCT OVERVIEW
Overview
A universal hydration tracking system that pairs a smart sensing base with a companion app to monitor water intake across any cup.

Problem
Hydration is inconsistent due to fragmented tracking and lack of immediate feedback.

Approach
Measure intake through a sensing base
Sync data from cup to phone
Support universal cup usage
Reinforce habits through real-time feedback

Outcome
Transforms any cup into a connected system, making hydration visible, trackable, and consistent.
`,
  'Lazy Day Lines': `A brand concept exploring color, line, and form through cozy, slow-paced visuals that reframe rest and productivity as part of the same rhythm.

DESIGN FOUNDATION

Insight
Young adults associate rest and productivity with conflicting aesthetics, often lacking visual language that normalizes slow, cozy routines.

Principles

Embrace softness without losing structure
Use muted, warm tones to evoke calm and familiarity
Keep forms simple, fluid, and approachable
Balance stillness with subtle visual movement

Creative Direction
A visual identity built on layered shapes, hand-drawn lines, and a warm, desaturated palette to capture a “cozy productivity” aesthetic.

PRODUCT OVERVIEW

Overview
A brand concept exploring how color, form, and line can shape a calm, cozy visual language around rest, study, and self-care.

Problem
Existing productivity visuals feel rigid or high-energy, while rest-focused visuals lack structure—leaving a gap in representing balanced, everyday routines.

Approach

Experiment with color palettes that evoke warmth and calm
Iterate on logo forms using loose, hand-drawn linework
Layer soft geometric shapes to create depth and rhythm
Explore compositions that reflect relaxed, everyday moments

Outcome
A cohesive visual system that communicates comfort, softness, and quiet productivity, resonating with a younger audience seeking balance in their routines.`,
  'Cal Hacks': `Led the visual direction and design execution for Cal Hacks, shaping themes, branding systems, and deliverables across recruitment, events, and hackathons.

DESIGN FOUNDATION

Insight
Students are drawn to hackathons through strong visual identity and clear messaging, but engagement drops when branding feels inconsistent or disconnected across platforms.

Principles

Create a cohesive identity across all touchpoints
Design for clarity and fast communication
Balance innovation with accessibility
Maintain consistency across a large team

Creative Direction
Developed adaptable visual themes that translate across digital and physical formats, guiding a team of designers to produce cohesive assets for recruitment campaigns, event materials, and hackathon experiences.

APPROACH
Defined seasonal themes and visual systems for each event cycle
Directed and collaborated with a team of designers on asset creation
Designed materials for recruitment, social media, and event branding
Ensured consistency across platforms, timelines, and teams

OUTCOME
Delivered a cohesive visual identity across large-scale events, supporting engagement for thousands of participants and enabling clear, consistent communication throughout the hackathon experience.

https://ai.hackberkeley.org/`,
}
const TECHNICALS_INNER_FOLDERS = [
  'Find the Flower',
  'Ngordnet',
  'Fabrication and Prototyping',
  'Mechatronic Goniometer',
  'Kinetic Origamic',
]

const TECHNICALS_FOLDER_CAPTIONS = {
  'Kinetic Origamic': `A kinetic installation combining physical design and embedded systems to explore how folded structures transform through controlled motion.

DESIGN FOUNDATION

Insight
Designing for motion requires both form exploration and precise control-balancing aesthetics with mechanical behavior.

Principles

Design for smooth, continuous motion
Balance structure with flexibility
Maintain clarity across movement states
Integrate form and mechanism as one system

System Design
A servo-driven mechanism controlled through Arduino sweep motion, enabling the origami structure to transition between states of expansion and contraction.

APPROACH
Prototyped folding behaviors through iterative paper models
Defined discrete motion states (resting, intermediate, lifted)
Implemented servo sweep control using Arduino
Integrated mechanical and structural components into a cohesive system

OUTCOME

A working kinetic system that demonstrates the integration of physical design and simple embedded control, highlighting both form exploration and technical execution.`,
}

const KINETIC_ORIGAMIC_ITEMS = [
  {
    type: 'image',
    src: '/technicals/kinetic-origamic/kinetic-origamic-motion-01.gif',
    title: 'Motion Study',
    desc: 'Servo-driven movement of transitions between states.',
  },
  {
    type: 'image',
    src: '/technicals/kinetic-origamic/kinetic-origamic-final-prototype-01.jpg',
    title: 'Final Prototype',
    desc: 'Integrated form and mechanism in the completed kinetic system.',
  },
  {
    type: 'doc',
    coverSrc: '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-01.jpg',
    title: 'Process & System',
    desc: 'Prototyping, mechanism design, and motion development.',
    pages: [
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-01.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-02.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-03.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-04.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-05.jpg',
    ],
  },
]

const MINIMIZE_DURATION_MS = 350

const CAPTION_MAX_LINES = 23
const CAPTION_LINE_HEIGHT_EM = 1.625 // tailwind `leading-relaxed`
const CAPTION_MAX_HEIGHT_EM = CAPTION_MAX_LINES * CAPTION_LINE_HEIGHT_EM

function FolderCaption({ caption, fixedHeight = false }) {
  const scrollRef = useRef(null)
  const [showBottomFade, setShowBottomFade] = useState(false)
  const [showTopFade, setShowTopFade] = useState(false)

  const computeFade = () => {
    const el = scrollRef.current
    if (!el) return
    const isOverflowing = el.scrollHeight > el.clientHeight + 1
    const isAtTop = el.scrollTop <= 1
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
    setShowTopFade(isOverflowing && !isAtTop)
    setShowBottomFade(isOverflowing && !isAtBottom)
  }

  useEffect(() => {
    computeFade()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caption])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => computeFade()
    el.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => computeFade()
    window.addEventListener('resize', onResize)

    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => computeFade())
      ro.observe(el)
    }

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (ro) ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lines = String(caption || '').split('\n')
  const subtitleRe = /^[A-Z][A-Za-z]*(?:\s[A-Z][A-Za-z]*)*$/
  const bulletedSections = new Set(['Principles', 'Approach', 'APPROACH'])
  const SUBTITLE_INDENT_CLASS = 'pl-4'
  const heroBoldLine =
    'AquaSync is a universal hydration tracking system that turns any cup into a connected experience. By combining passive sensing with a companion interface, it makes water intake visible, effortless, and consistent over time.'
  const isUrlLine = (t) => /^https?:\/\/\S+$/i.test(t.trim())

  const isAllCapsLine = (t) => {
    const s = t.trim()
    if (!s) return false
    if (!/[A-Z]/.test(s)) return false
    if (!/^[A-Z0-9][A-Z0-9\s&/-]*$/.test(s)) return false
    return true
  }

  const isSubtitleLine = (t) => {
    const s = t.trim()
    if (!s) return false
    if (s.length > 28) return false
    if (!subtitleRe.test(s)) return false
    if (/[.!?]$/.test(s)) return false
    return true
  }

  const nodes = (() => {
    const out = []
    let indentActive = false
    for (let i = 0; i < lines.length; i++) {
      const line = String(lines[i] ?? '').replace(/\r/g, '')
      const trimmed = line.trim()

      if (!trimmed) {
        out.push(<div key={`sp-${i}`} className="h-3" aria-hidden />)
        indentActive = false
        continue
      }

      const allCaps = isAllCapsLine(trimmed)
      const subtitle = isSubtitleLine(trimmed) && !allCaps

      if (allCaps) indentActive = false
      if (subtitle) indentActive = true

      const shouldBold = allCaps || subtitle || trimmed === heroBoldLine
      const lineClass = [
        shouldBold ? 'font-semibold text-black/80' : undefined,
        indentActive && !allCaps ? SUBTITLE_INDENT_CLASS : undefined,
      ]
        .filter(Boolean)
        .join(' ')

      out.push(
        <div key={`ln-${i}`} className={lineClass || undefined}>
          {isUrlLine(trimmed) ? (
            <a
              href={trimmed}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
            >
              {trimmed}
            </a>
          ) : (
            trimmed
          )}
        </div>,
      )

      if (bulletedSections.has(trimmed)) {
        const items = []
        let j = i + 1
        // Allow an empty line after the section header (common in copy).
        for (; j < lines.length; j++) {
          const peek = String(lines[j] ?? '').replace(/\r/g, '').trim()
          if (peek) break
        }
        for (; j < lines.length; j++) {
          const next = String(lines[j] ?? '').replace(/\r/g, '').trim()
          if (!next) break
          items.push(next)
        }

        if (items.length) {
          out.push(
            <div
              key={`ulwrap-${i}`}
              className={indentActive ? SUBTITLE_INDENT_CLASS : undefined}
            >
              <ul className="list-disc pl-5 space-y-0.5">
                {items.map((t, k) => (
                  <li key={`li-${i}-${k}`}>{t}</li>
                ))}
              </ul>
            </div>,
          )
        }

        i = j - 1
      }
    }
    return out
  })()

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="text-black/70 text-sm leading-relaxed w-full overflow-auto pr-2 rounded-xl bg-white/35 border border-black/10 px-4 py-3"
        style={fixedHeight ? { height: `${CAPTION_MAX_HEIGHT_EM}em` } : { maxHeight: `${CAPTION_MAX_HEIGHT_EM}em` }}
      >
        {nodes}
      </div>
      {showTopFade ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t-xl bg-gradient-to-t from-transparent to-black/15" />
      ) : null}
      {showBottomFade ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-xl bg-gradient-to-b from-transparent to-black/15" />
      ) : null}
    </div>
  )
}

function FolderIcon({ bodyColor, tabColor }) {
  return (
    <div className="relative w-40 h-28">
      {/* Top strip behind tab (slight band across the top) */}
      <div
        className="absolute left-0 top-3 w-full h-4 rounded-t-[4px]"
        style={{
          backgroundColor: tabColor,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      />

      {/* Trapezoid tab sitting on the strip */}
      <div
        className="absolute left-0 top-0 h-6 w-16"
        style={{
          backgroundColor: tabColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '4px',
        }}
      />

      {/* Folder body */}
      <div
        className="absolute left-0 top-5 w-full h-[calc(100%-20px)] rounded-b-[6px] shadow-lg"
        style={{
          backgroundColor: bodyColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
    </div>
  )
}

function SmallFolderIcon({ bodyColor = '#C96AED', tabColor = '#A825D9' }) {
  return (
    <div className="relative w-20 h-16">
      <div
        className="absolute left-0 top-2 w-full h-3 rounded-t-[3px]"
        style={{
          backgroundColor: tabColor,
          borderTopLeftRadius: '3px',
          borderTopRightRadius: '3px',
        }}
      />
      <div
        className="absolute left-0 top-0 h-4 w-12"
        style={{
          backgroundColor: tabColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '3px',
        }}
      />
      <div
        className="absolute left-0 top-3 w-full h-[calc(100%-14px)] rounded-b-[4px] shadow-md"
        style={{
          backgroundColor: bodyColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
    </div>
  )
}

function TitleBarIcon({ type }) {
  if (type === 'camera') {
    return (
      <div className="relative w-6 h-3 bg-black">
        <div
          className="absolute -top-0.5 left-0.5 bg-black"
          style={{ width: '10px', height: '4px' }}
        />
        <div className="absolute inset-y-0.5 right-1.5 w-2 h-2 rounded-full paper-bg" />
      </div>
    )
  }
  if (type === 'pen') {
    return (
      <div className="relative w-6 h-5 flex items-center justify-center">
        <svg
          viewBox="0 0 35 35"
          stroke="currentColor"
          strokeWidth="1"
          
          className="w-5 h-5 text-black"
        >
          <rect
            x="6.36"
            y="21.21"
            width="30"
            height="10"
            transform="rotate(-45 6.36 21.21)"
          />
          <path d="M3.68 31.25L13.44 28.28L6.36 21.21Z" />
        </svg>
      </div>
    )
  
  }
  if (type === 'monitor') {
    return (
      <div className="relative w-6 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-black">
          <rect x="0" y="4" width="24" height="13" rx="0" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      </div>
    )
  }
  return null
}

const CASCADE_OFFSET_PX = 20 //28
const CASCADE_RANDOM_X = 38
const CASCADE_RANDOM_Y = 18 //22

// Lightbox: one set of chrome classes for Photos / Design / Technicals (same FolderWindow).
const LIGHTBOX_OVERLAY_CLASS =
  'absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center cursor-default p-3 sm:p-5 overflow-hidden select-none'

const LIGHTBOX_NAV_ARROW_CLASS =
  'text-3xl sm:text-4xl font-light leading-none select-none hover:opacity-80 transition drop-shadow px-2 py-2 cursor-pointer'

// Close control (placed inside the right rail, above the next arrow).
const LIGHTBOX_CLOSE_BTN_CLASS =
  'inline-flex size-12 shrink-0 items-center justify-center sm:size-14 rounded-md text-2xl sm:text-3xl font-light leading-none select-none hover:opacity-80 transition drop-shadow cursor-pointer'

// Upper-right rail: × at top, same column as `>` with `>` vertically centered under it.
const LIGHTBOX_RIGHT_RAIL_CLASS =
  'absolute top-0 right-0 bottom-0 z-[60] flex w-10 min-w-0 flex-col items-center pr-0.5 sm:w-14 sm:pr-1 pt-2 sm:pt-3'

const AQUASYNC_GRID_HOVER = [
  { title: 'Product Overview', desc: 'How the system works end-to-end' },
  { title: 'Campaign', desc: 'Why hydration habits fail' },
  { title: 'Ideation', desc: 'Exploring low-friction interaction' },
  { title: 'Mobile UI', desc: 'Real-time intake + feedback' },
  { title: 'Desktop UI', desc: 'Long-term habit insights' },
]

const LAZY_DAY_LINES_GRID_HOVER = [
  { title: 'Color Palette', desc: 'Warm, muted tones for a calm, cozy feel' },
  { title: 'Logo Exploration', desc: 'Soft, minimal mark variations' },
  { title: 'Illustration Style', desc: 'Soft compositions exploring cozy, everyday scenes' },
  { title: 'Applications', desc: 'Playful applications across stickers and everyday items' },
]

const CAL_HACKS_GRID_HOVER = [
  { title: "Spring '26 Recruitment Campaign", desc: 'Multi-platform visuals for fast, clear engagement.' },
  {
    title: 'Cal Hacks 12.0 Event Branding',
    desc: 'Large-scale physical assets for clarity, navigation, and consistency',
  },
  {
    title: 'Mid-Cycle Activation',
    desc: 'Extends the recruitment system to sustain engagement leading up to the event',
  },
  { title: 'AI Hackathon', desc: 'Led cohesive visual direction across the event' },
]

const LAZY_DAY_LINES_ITEMS = [
  { type: 'image', src: '/design/lazy-day-lines/lazy-day-lines-color-palette.png' },
  { type: 'image', src: '/design/lazy-day-lines/lazy-day-lines-logo-exploration.png' },
  {
    type: 'doc',
    coverSrc: '/design/lazy-day-lines/lazy-day-lines-illustration-style-01.png',
    pages: [
      '/design/lazy-day-lines/lazy-day-lines-illustration-style-01.png',
      '/design/lazy-day-lines/lazy-day-lines-illustration-style-02.png',
      '/design/lazy-day-lines/lazy-day-lines-illustration-style-03.png',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/design/lazy-day-lines/lazy-day-lines-applications-01.jpg',
    pages: [
      '/design/lazy-day-lines/lazy-day-lines-applications-01.jpg',
      '/design/lazy-day-lines/lazy-day-lines-applications-02.jpg',
      '/design/lazy-day-lines/lazy-day-lines-applications-03.jpg',
    ],
  },
]

const CAL_HACKS_ITEMS = [
  {
    type: 'doc',
    coverSrc: '/design/cal-hacks/cal-hacks-spr26-recruitment-01.png',
    pages: [
      '/design/cal-hacks/cal-hacks-spr26-recruitment-01.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-02.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-03.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-04.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-05.png',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/design/cal-hacks/cal-hacks-12-event-branding-01.jpg',
    pages: [
      '/design/cal-hacks/cal-hacks-12-event-branding-01.jpg',
      '/design/cal-hacks/cal-hacks-12-event-branding-02.jpg',
      '/design/cal-hacks/cal-hacks-12-event-branding-03.jpg',
      '/design/cal-hacks/cal-hacks-12-event-branding-04.png',
      '/design/cal-hacks/cal-hacks-12-event-branding-05.png',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/design/cal-hacks/cal-hacks-mid-cycle-activation-01.png',
    pages: [
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-01.png',
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-02.png',
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-03.png',
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-04.jpg',
    ],
  },
  {
    type: 'scrollImage',
    coverSrc: '/design/cal-hacks/cal-hacks-ai-hackathon-scroll.png',
    src: '/design/cal-hacks/cal-hacks-ai-hackathon-scroll.png',
  },
]

function FolderWindow({
  show,
  onClose,
  folderRef,
  title,
  iconType,
  borderColor,
  bodyColor,
  tabColor,
  innerFolderNames,
  stackIndex = 0,
  cascadeSlot = 0,
  windowId,
  onBringToFront,
  isFrontWindow = false,
  subfolderName = null,
  contentFiles = [],
  onOpenSubfolder,
  onBack,
  onMaximizeChange,
  onMetricsChange,
}) {
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [minimizeOrigin, setMinimizeOrigin] = useState(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [randomOffset, setRandomOffset] = useState({ x: 0, y: 0 })
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [thumbViewportHeightPx, setThumbViewportHeightPx] = useState(null)
  const [thumbTilePx, setThumbTilePx] = useState(null)
  const windowRef = useRef(null)
  const thumbsGridRef = useRef(null)
  const aquaScrollRef = useRef(null)
  const aquaPhoneOuterRef = useRef(null)
  const aquaPhoneBorderRef = useRef(null)
  const aquaPhoneScreenRef = useRef(null)

  const displayTitle = subfolderName ? `${title} > ${subfolderName}` : title
  const isInsideSubfolder = Boolean(subfolderName)
  const isAquaSync = title === 'Design' && subfolderName === 'AquaSync'
  const aquaItems = isAquaSync ? AQUASYNC_ITEMS : null
  const aquaSelectedItem =
    isAquaSync && aquaItems && typeof lightboxIndex === 'number' ? aquaItems[lightboxIndex] : null
  const aquaSelectedIsDoc = isAquaSync && aquaSelectedItem?.type === 'doc'
  const aquaSelectedPages = aquaSelectedIsDoc ? aquaSelectedItem.pages || [] : []
  const aquaSelectedImageSrc =
    isAquaSync && aquaSelectedItem?.type === 'image' ? aquaSelectedItem.src : null
  const aquaSelectedIsPhoneScroll = isAquaSync && aquaSelectedItem?.type === 'phoneScrollImage'
  const aquaSelectedPhoneFrameSrc = aquaSelectedIsPhoneScroll ? aquaSelectedItem.frameSrc : null
  const aquaSelectedPhoneScreenSrc = aquaSelectedIsPhoneScroll ? aquaSelectedItem.screenSrc : null

  const selectedNonAquaItem =
    !isAquaSync && typeof lightboxIndex === 'number' ? contentFiles?.[lightboxIndex] : null
  const selectedNonAquaIsObj = Boolean(selectedNonAquaItem && typeof selectedNonAquaItem === 'object')
  const selectedNonAquaType = selectedNonAquaIsObj ? selectedNonAquaItem.type : 'image'
  const selectedNonAquaDocPages =
    selectedNonAquaIsObj && selectedNonAquaType === 'doc' ? selectedNonAquaItem.pages || [] : []
  const selectedNonAquaImageSrc =
    selectedNonAquaIsObj && selectedNonAquaType === 'image'
      ? selectedNonAquaItem.src
      : typeof selectedNonAquaItem === 'string'
        ? selectedNonAquaItem
        : null
  const selectedNonAquaScrollImageSrc =
    selectedNonAquaIsObj && selectedNonAquaType === 'scrollImage' ? selectedNonAquaItem.src : null
  const selectedNonAquaDocMaxWidthClass =
    title === 'Design' && subfolderName === 'Lazy Day Lines'
      ? 'max-w-[min(620px,100%)]'
      : title === 'Design' && subfolderName === 'Cal Hacks'
        ? 'max-w-[min(560px,100%)]'
      : 'max-w-[min(780px,100%)]'

  const lightboxOpen = isAquaSync
    ? lightboxIndex != null && (aquaItems?.length || 0) > 0
    : lightboxIndex != null && (contentFiles?.length || 0) > 0
  const folderCaption =
    title === 'Design' && subfolderName
      ? DESIGN_FOLDER_CAPTIONS[subfolderName]
      : title === 'Technicals' && subfolderName
        ? TECHNICALS_FOLDER_CAPTIONS[subfolderName]
        : null
  const folderCaptionLineCount = folderCaption
    ? String(folderCaption)
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean).length
    : 0
  const useSideBySideCaptionLayout = folderCaptionLineCount > 3
  const thumbsGridColsClass = useSideBySideCaptionLayout ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'

  const closeLightbox = () => setLightboxIndex(null)
  const toggleMaximize = () => {
    setIsMaximized((prev) => {
      const next = !prev
      onMaximizeChange?.(windowId, next)
      return next
    })
  }

  const goPrev = () => {
    const count = isAquaSync ? aquaItems?.length || 0 : contentFiles?.length || 0
    if (!count) return
    setLightboxIndex((prev) => {
      const current = prev ?? 0
      return (current - 1 + count) % count
    })
  }

  const goNext = () => {
    const count = isAquaSync ? aquaItems?.length || 0 : contentFiles?.length || 0
    if (!count) return
    setLightboxIndex((prev) => {
      const current = prev ?? 0
      return (current + 1) % count
    })
  }

  useEffect(() => {
    if (show && randomOffset.x === 0 && randomOffset.y === 0) {
      setRandomOffset({
        x: (Math.random() - 0.5) * 2 * CASCADE_RANDOM_X,
        y: (Math.random() - 0.5) * 2 * CASCADE_RANDOM_Y,
      })
    }
  }, [show])

  useEffect(() => {
    // Reset lightbox when leaving a folder view or closing window
    if (!show || !isInsideSubfolder) setLightboxIndex(null)
  }, [show, isInsideSubfolder])

  useEffect(() => {
    if (!show && isMaximized) {
      setIsMaximized(false)
      onMaximizeChange?.(windowId, false)
    }
  }, [show])

  useEffect(() => {
    if (!show) return
    const rect = windowRef.current?.getBoundingClientRect?.()
    onMetricsChange?.(windowId, rect, { lightboxOpen })
  }, [show, isMaximized, subfolderName, contentFiles?.length, lightboxOpen])

  useEffect(() => {
    if (!show) return
    const onResize = () => {
      const rect = windowRef.current?.getBoundingClientRect?.()
      onMetricsChange?.(windowId, rect, { lightboxOpen })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [show, windowId, lightboxOpen])

  useEffect(() => {
    if (!show || !windowRef.current || typeof ResizeObserver === 'undefined') return
    const el = windowRef.current
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      onMetricsChange?.(windowId, rect, { lightboxOpen })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [show, windowId, lightboxOpen, subfolderName])

  useEffect(() => {
    if (!show || !subfolderName) return

    const measure = () => {
      const gridEl = thumbsGridRef.current
      if (!gridEl) return
      const buttons = Array.from(gridEl.querySelectorAll('button'))
      const firstThumb = buttons[0]
      if (!firstThumb) return
      const styles = window.getComputedStyle(gridEl)
      const rowGap = parseFloat(styles.rowGap || styles.gap || '0') || 0
      const colGap = parseFloat(styles.columnGap || styles.gap || '0') || 0
      const cols = (styles.gridTemplateColumns || '').split(' ').filter(Boolean).length || 1
      const gridW = gridEl.clientWidth
      const tilePx = Math.max(1, Math.round((gridW - colGap * (cols - 1)) / cols))
      setThumbTilePx((prev) => (prev === tilePx ? prev : tilePx))

      const target = Math.round(tilePx * 1.5 + rowGap)
      setThumbViewportHeightPx((prev) => (prev === target ? prev : target))

      const gridRect = gridEl.getBoundingClientRect()
      const sample = buttons.slice(0, 6).map((b) => {
        const r = b.getBoundingClientRect()
        return { top: Math.round(r.top - gridRect.top), left: Math.round(r.left - gridRect.left) }
      })
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [show, subfolderName, contentFiles?.length, aquaItems?.length, isMaximized, isAquaSync])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()

      // Lightbox-only: discourage casual copying/saving
      if ((e.metaKey || e.ctrlKey) && typeof e.key === 'string') {
        const k = e.key.toLowerCase()
        if (k === 's' || k === 'c' || k === 'x' || k === 'p' || k === 'u') {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, contentFiles?.length, aquaItems?.length, isAquaSync])

  useEffect(() => {
    if (!lightboxOpen) return
    if (!isAquaSync) return
    if (!aquaSelectedIsDoc) return
    const el = aquaScrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [lightboxOpen, isAquaSync, aquaSelectedIsDoc, lightboxIndex])

  useEffect(() => {
    if (!lightboxOpen) return
    if (isAquaSync) return
    if (selectedNonAquaType !== 'doc') return
    const el = aquaScrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [lightboxOpen, isAquaSync, selectedNonAquaType, lightboxIndex])

  useLayoutEffect(() => {
    if (!lightboxOpen) return
    if (!isAquaSync) return
    if (!aquaSelectedIsPhoneScroll) return

    const PHONE_W = 9
    const PHONE_H = 19.5

    const applyFit = () => {
      const outer = aquaPhoneOuterRef.current
      const border = aquaPhoneBorderRef.current
      if (!outer || !border) return

      const r = outer.getBoundingClientRect()
      const availableW = r.width
      const availableH = r.height
      if (availableW <= 0 || availableH <= 0) return

      // Fit a portrait 9:19.5 rectangle fully inside the available box.
      // Start from height, then clamp width; if width overflows, recompute from width.
      let h = availableH
      let w = h * (PHONE_W / PHONE_H)
      if (w > availableW) {
        w = availableW
        h = w * (PHONE_H / PHONE_W)
      }

      border.style.width = `${Math.floor(w)}px`
      border.style.height = `${Math.floor(h)}px`
      border.style.maxWidth = '100%'
      border.style.maxHeight = '100%'
    }

    const outer = aquaPhoneOuterRef.current
    let ro
    if (outer && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => requestAnimationFrame(applyFit))
      ro.observe(outer)
    }
    requestAnimationFrame(applyFit)

    return () => {
      if (ro) ro.disconnect()
    }
  }, [lightboxOpen, isAquaSync, aquaSelectedIsPhoneScroll, lightboxIndex, isMaximized])

  const handleMinimize = () => {
    if (!windowRef.current || !folderRef?.current) return
    const windowRect = windowRef.current.getBoundingClientRect()
    const folderRect = folderRef.current.getBoundingClientRect()
    const folderCenterX = folderRect.left + folderRect.width / 2
    const folderCenterY = folderRect.top + folderRect.height / 2
    const originX = folderCenterX - windowRect.left
    const originY = folderCenterY - windowRect.top
    setMinimizeOrigin({ x: originX, y: originY })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsMinimizing(true))
    })
  }

  const handleMinimizeTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return
    if (isMinimizing) {
      onClose?.()
      setIsMinimizing(false)
      setMinimizeOrigin(null)
    }
  }

  if (!show) return null

  const layer = Math.max(0, stackIndex)
  const slot = Math.max(0, cascadeSlot)
  const baseOffset = slot * CASCADE_OFFSET_PX
  const offsetX = baseOffset + randomOffset.x
  const offsetY = baseOffset + randomOffset.y

  const handleWrapperClick = (e) => {
    const target = e.target
    const closestButtonLabel =
      target instanceof HTMLElement ? target.closest('button')?.getAttribute('aria-label') || null : null
    if (!closestButtonLabel) onBringToFront?.(windowId)
  }

  const handleInactiveWindowClick = () => {
    onBringToFront?.(windowId)
  }

  return (
    <div
      role="presentation"
      className="pointer-events-none absolute top-0 left-0 right-0 transition-all duration-300 ease-out cursor-default"
      style={{
        zIndex: 30 + layer,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
        <div
          className={`mx-auto mt-16 transition-all duration-300 ease-out ${
            isMaximized ? 'w-[min(90vw,1100px)] max-w-none px-4' : 'w-[min(80vw,1400px)] max-w-none px-6'
          }`}
        >
          <div
            ref={windowRef}
            className="relative pointer-events-auto shadow-2xl bg"
            style={{
              transformOrigin: minimizeOrigin
                ? `${minimizeOrigin.x}px ${minimizeOrigin.y}px`
                : 'center center',
              transition: `transform ${MINIMIZE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${MINIMIZE_DURATION_MS}ms ease-out`,
              ...(isMinimizing && {
                transform: 'scale(0)',
                opacity: 0,
              }),
            }}
            onClick={handleWrapperClick}
            onTransitionEnd={handleMinimizeTransitionEnd}
          >
            {!isFrontWindow ? (
              <button
                type="button"
                className="absolute inset-0 z-[70] cursor-default bg-transparent"
                aria-label={`Bring ${title} window to front`}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  handleInactiveWindowClick()
                }}
              />
            ) : null}
            <div
              className={`paper-bg font-poppins border-[4px] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
                isMaximized ? 'min-h-[380px]' : ''
              }`}
              style={{
                borderColor,
                clipPath:
                  'polygon(0 0, 26% 0, 30% -14%, 62% -14%, 66% 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
          <div className="paper-bg px-5 py-3 flex items-center justify-between gap-4 border-b border-black/10 shrink-0">
            <div className="flex items-center gap-3">
              <TitleBarIcon type={iconType} />
              <span className="text-black font-medium text-sm">{displayTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110 transition"
                aria-label={`Minimize ${title} window`}
              />
              <button
                type="button"
                onClick={toggleMaximize}
                className="w-3 h-3 rounded-full bg-green-400 hover:brightness-110 transition"
                aria-label={isMaximized ? 'Restore window size' : 'Maximize window'}
              />
              <button
                type="button"
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition"
                aria-label={`Close ${title} window`}
              />
            </div>
          </div>
          <div
            className={`relative paper-bg-muted px-8 pb-8 pt-5 flex ${
              isInsideSubfolder ? 'items-start' : 'items-center'
            } ${
              isMaximized
                ? isInsideSubfolder
                  ? 'flex-1 h-[min(80vh,740px)]'
                  : 'flex-1 h-[min(68vh,620px)]'
                : isInsideSubfolder
                  ? 'flex-1 h-[min(72vh,660px)]'
                  : 'flex-1 h-[min(56vh,520px)]'
            }`}
          >
            {isInsideSubfolder ? (
              <div className="w-full flex flex-col gap-3 min-h-0">
                <button
                  type="button"
                  onClick={onBack}
                  className="self-start flex items-center gap-2 text-black/70 hover:text-black text-sm font-medium"
                  aria-label="Back to folders"
                >
                  <span aria-hidden>← Back</span>
                </button>
                <div
                  className={`w-full min-h-0 ${
                    useSideBySideCaptionLayout
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start'
                      : 'flex flex-col gap-4'
                  }`}
                >
                  {folderCaption ? (
                    <div className={useSideBySideCaptionLayout ? 'min-h-0' : undefined}>
                      <FolderCaption caption={folderCaption} fixedHeight={useSideBySideCaptionLayout} />
                    </div>
                  ) : null}
                  <div
                    ref={thumbsGridRef}
                    className={`grid ${thumbsGridColsClass} gap-3 md:gap-4 w-full content-start overflow-auto ${
                      useSideBySideCaptionLayout ? 'min-h-0' : ''
                    }`}
                    style={
                      useSideBySideCaptionLayout
                        ? { height: `${CAPTION_MAX_HEIGHT_EM}em`, gridAutoRows: `${thumbTilePx}px` }
                        : thumbViewportHeightPx && thumbTilePx
                          ? { height: `${thumbViewportHeightPx}px`, gridAutoRows: `${thumbTilePx}px` }
                          : undefined
                    }
                  >
                  {isAquaSync ? (
                    (aquaItems?.length || 0) > 0 ? (
                      aquaItems.map((item, i) => {
                        const coverSrc =
                          item?.type === 'doc'
                            ? item?.pages?.[0]
                            : item?.type === 'image'
                              ? item?.src
                              : item?.type === 'phoneScrollImage'
                                ? item?.coverSrc
                                : null
                        if (!coverSrc) return null
                        const hoverCopy = AQUASYNC_GRID_HOVER[i]
                        return (
                          <button
                            key={`${item.type}-${coverSrc}-${i}`}
                            type="button"
                            className="group relative w-full rounded-lg overflow-hidden bg-black/5 border border-black/10 group-hover:border-transparent cursor-pointer"
                            onClick={() => setLightboxIndex(i)}
                            aria-label={`Open AquaSync item ${i + 1} of ${aquaItems.length}`}
                            onContextMenu={(e) => e.preventDefault()}
                            style={thumbTilePx ? { height: `${thumbTilePx}px` } : undefined}
                          >
                            <img
                              src={coverSrc}
                              alt=""
                              className="w-full h-full object-cover select-none transition-transform duration-200 ease-out group-hover:scale-[1.06] group-hover:blur-[2px] group-hover:brightness-[0.92]"
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              draggable={false}
                            />
                            {hoverCopy ? (
                              <div
                                className="absolute -inset-px flex items-center justify-center overflow-hidden rounded-[9px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                              >
                                <div
                                  className="absolute inset-0 overflow-hidden rounded-[9px] bg-white/55 backdrop-blur-[6px]"
                                />
                                <div className="relative px-3 text-center">
                                  <div className="text-black/90 font-semibold text-sm">
                                    {hoverCopy.title}
                                  </div>
                                  <div className="text-black/70 text-xs mt-1">
                                    {hoverCopy.desc}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </button>
                        )
                      })
                    ) : (
                      <p className="text-black/50 text-sm col-span-full">No photos in this folder yet.</p>
                    )
                  ) : contentFiles.length > 0 ? (
                    contentFiles.map((item, i) => {
                      const isObj = Boolean(item && typeof item === 'object')
                      const coverSrc = !isObj
                        ? item
                        : item.type === 'image'
                          ? item.src
                          : item.type === 'doc'
                            ? item.coverSrc || item.pages?.[0]
                            : item.type === 'scrollImage'
                              ? item.coverSrc || item.src
                            : null
                      if (!coverSrc) return null

                      const itemHoverCopy =
                        isObj && (item.title || item.desc)
                          ? { title: item.title, desc: item.desc }
                          : null
                      const hoverCopy = itemHoverCopy
                        ? itemHoverCopy
                        : title === 'Design' && subfolderName === 'Lazy Day Lines'
                          ? LAZY_DAY_LINES_GRID_HOVER[i] || null
                          : title === 'Design' && subfolderName === 'Cal Hacks'
                            ? CAL_HACKS_GRID_HOVER[i] || null
                            : null
                      const showHover = Boolean(hoverCopy)

                      return (
                        <button
                          key={`${coverSrc}-${i}`}
                          type="button"
                          className={`group relative w-full rounded-lg overflow-hidden bg-black/5 border border-black/10 hover:brightness-[0.96] cursor-pointer ${
                            showHover ? 'group-hover:border-transparent' : ''
                          }`}
                          onClick={() => setLightboxIndex(i)}
                          aria-label={`Open image ${i + 1} of ${contentFiles.length}`}
                          onContextMenu={(e) => e.preventDefault()}
                          style={thumbTilePx ? { height: `${thumbTilePx}px` } : undefined}
                        >
                          <img
                            src={coverSrc}
                            alt=""
                            className={`w-full h-full object-cover select-none transition-transform duration-200 ease-out ${
                              showHover
                                ? 'group-hover:scale-[1.06] group-hover:blur-[2px] group-hover:brightness-[0.92]'
                                : 'group-hover:scale-[1.08]'
                            }`}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                          />
                          {hoverCopy ? (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                              <div className="absolute -inset-px overflow-hidden rounded-[9px] bg-white/55 backdrop-blur-[6px]" />
                              <div className="relative px-3 text-center">
                                <div className="text-black/90 font-semibold text-sm">
                                  {hoverCopy.title}
                                </div>
                                <div className="text-black/70 text-xs mt-1">{hoverCopy.desc}</div>
                              </div>
                            </div>
                          ) : null}
                        </button>
                      )
                    })
                  ) : (
                    <p className="text-black/50 text-sm col-span-full">No photos in this folder yet.</p>
                  )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 w-full content-start">
                {innerFolderNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={() => onOpenSubfolder?.(name)}
                  >
                    <SmallFolderIcon bodyColor={bodyColor} tabColor={tabColor} />
                    <span className="text-black text-xs font-medium text-center">{name}</span>
                  </button>
                ))}
              </div>
            )}

            {lightboxOpen ? (
              <div
                role="presentation"
                className={LIGHTBOX_OVERLAY_CLASS}
                onMouseDown={closeLightbox}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Image preview"
                  className="relative w-full h-full max-w-[min(1100px,100%)] max-h-full cursor-default"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {isAquaSync ? (
                    <div className="w-full h-full flex items-stretch justify-center gap-3 sm:gap-5">
                      {isAquaSync && (aquaItems?.length || 0) > 1 ? (
                        <div className="flex items-center justify-center w-10 sm:w-14 shrink-0">
                          <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous item"
                            className={LIGHTBOX_NAV_ARROW_CLASS}
                            style={{ color: borderColor }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {'<'}
                          </button>
                        </div>
                      ) : (
                        <div className="w-10 sm:w-14 shrink-0" aria-hidden />
                      )}

                      <div className="flex-1 min-w-0 flex items-stretch justify-center">
                        {aquaSelectedIsDoc ? (
                          <div
                            ref={aquaScrollRef}
                            className="relative h-full w-full max-w-[min(780px,100%)] overflow-auto rounded-md cursor-default"
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            <div className="mx-auto w-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4">
                              {aquaSelectedPages.map((src) => (
                                <div key={src} className="w-full">
                                  <img
                                    src={src}
                                    alt=""
                                    className="block w-full h-auto rounded-md bg-white/5"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                    draggable={false}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : aquaSelectedIsPhoneScroll ? (
                          <div
                            className="relative w-full h-full min-h-0 flex items-center justify-center"
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            <div
                              ref={aquaPhoneOuterRef}
                              className="w-full h-full min-h-0 min-w-0 max-h-full flex items-center justify-center p-1"
                            >
                              <div
                                ref={aquaPhoneBorderRef}
                                className="border-[7px] sm:border-[9px] border-black rounded-[32px] shadow-xl bg-white overflow-hidden"
                              >
                                <div
                                  ref={aquaPhoneScreenRef}
                                  className="h-full w-full overflow-y-auto overflow-x-hidden"
                                >
                                  {aquaSelectedPhoneScreenSrc ? (
                                    <img
                                      src={aquaSelectedPhoneScreenSrc}
                                      alt=""
                                      className="block w-full h-auto select-none"
                                      draggable={false}
                                      onDragStart={(e) => e.preventDefault()}
                                      onContextMenu={(e) => e.preventDefault()}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : aquaSelectedImageSrc ? (
                          <div className="relative w-full h-full max-w-[min(780px,100%)] flex items-center justify-center px-4 py-4 sm:px-8 sm:py-6">
                            <img
                              src={aquaSelectedImageSrc}
                              alt=""
                              className="block object-contain rounded-md cursor-default"
                              style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              draggable={false}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div
                        className="flex h-full min-h-0 w-10 shrink-0 flex-col items-center pr-0.5 pt-2 sm:w-14 sm:pr-1 sm:pt-3"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={closeLightbox}
                          aria-label="Close preview"
                          className={LIGHTBOX_CLOSE_BTN_CLASS}
                          style={{ color: borderColor }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          ×
                        </button>
                        {isAquaSync && (aquaItems?.length || 0) > 1 ? (
                          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <button
                              type="button"
                              onClick={goNext}
                              aria-label="Next item"
                              className={LIGHTBOX_NAV_ARROW_CLASS}
                              style={{ color: borderColor }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              {'>'}
                            </button>
                          </div>
                        ) : (
                          <div className="min-h-0 flex-1" aria-hidden />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {selectedNonAquaType === 'doc' ? (
                        <div
                          ref={aquaScrollRef}
                          className={`relative h-full w-full ${selectedNonAquaDocMaxWidthClass} overflow-auto rounded-md cursor-default`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <div className="mx-auto w-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4">
                            {selectedNonAquaDocPages.map((src) => (
                              <div key={src} className="w-full">
                                <img
                                  src={src}
                                  alt=""
                                  className="block w-full h-auto rounded-md bg-white/5"
                                  onContextMenu={(e) => e.preventDefault()}
                                  onDragStart={(e) => e.preventDefault()}
                                  draggable={false}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : selectedNonAquaType === 'scrollImage' ? (
                        <div
                          className="h-full w-full flex items-center justify-center"
                          onMouseDown={(e) => e.stopPropagation()}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <div className="w-full max-w-[min(520px,100%)] h-full max-h-full border-[10px] border-black rounded-[28px] bg-white overflow-hidden shadow-xl">
                            <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                              {selectedNonAquaScrollImageSrc ? (
                                <img
                                  src={selectedNonAquaScrollImageSrc}
                                  alt=""
                                  className="block w-full h-auto select-none"
                                  draggable={false}
                                  onDragStart={(e) => e.preventDefault()}
                                  onContextMenu={(e) => e.preventDefault()}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-4 py-4 sm:px-8 sm:py-6">
                          <img
                            src={selectedNonAquaImageSrc}
                            alt=""
                            className="block object-contain rounded-md cursor-default"
                            style={{
                              maxHeight: '100%',
                              maxWidth: 'calc(100% - 98px)', // leave room so arrows never overlap the image
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                          />
                        </div>
                      )}

                      {contentFiles.length > 1 ? (
                        <button
                          type="button"
                          onClick={goPrev}
                          aria-label="Previous image"
                          className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 ${LIGHTBOX_NAV_ARROW_CLASS}`}
                          style={{ color: borderColor }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {'<'}
                        </button>
                      ) : null}

                      <div
                        className={LIGHTBOX_RIGHT_RAIL_CLASS}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={closeLightbox}
                          aria-label="Close preview"
                          className={LIGHTBOX_CLOSE_BTN_CLASS}
                          style={{ color: borderColor }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          ×
                        </button>
                        {contentFiles.length > 1 ? (
                          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <button
                              type="button"
                              onClick={goNext}
                              aria-label="Next image"
                              className={LIGHTBOX_NAV_ARROW_CLASS}
                              style={{ color: borderColor }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              {'>'}
                            </button>
                          </div>
                        ) : (
                          <div className="min-h-0 flex-1" aria-hidden />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default function FoldersSection({
  showPhotosWindow = true,
  onClosePhotosWindow,
  onOpenPhotosWindow,
  showDesignWindow = false,
  onCloseDesignWindow,
  onOpenDesignWindow,
  showTechnicalsWindow = false,
  onCloseTechnicalsWindow,
  onOpenTechnicalsWindow,
  anyFolderWindowOpen = true,
  openWindowStack = [],
  cascadeOrder = [],
  onBringWindowToFront,
}) {
  const photosFolderRef = useRef(null)
  const designFolderRef = useRef(null)
  const technicalsFolderRef = useRef(null)
  const pastNotesFolderRef = useRef(null)
  const foldersRowRef = useRef(null)
  const projectsBottomSentinelRef = useRef(null)
  const [photosOpenFolder, setPhotosOpenFolder] = useState(null)
  const [designOpenFolder, setDesignOpenFolder] = useState(null)
  const [technicalsOpenFolder, setTechnicalsOpenFolder] = useState(null)
  const [showPastNotesFolder, setShowPastNotesFolder] = useState(false)
  const [showPastNotesWindow, setShowPastNotesWindow] = useState(false)
  const [maximizedByWindowId, setMaximizedByWindowId] = useState({})
  const anyProjectWindowMaximized = Object.values(maximizedByWindowId).some(Boolean)
  const [windowStateById, setWindowStateById] = useState({})
  const projectsWrapRef = useRef(null)
  const [projectsExtraPbPx, setProjectsExtraPbPx] = useState(0)
  const visibleFolders = showPastNotesFolder ? [...folders, PAST_NOTES_FOLDER] : folders
  const anyVisibleFolderWindowOpen = anyFolderWindowOpen || showPastNotesWindow

  const togglePastNotesFolder = () => {
    setShowPastNotesFolder((prev) => {
      const next = !prev
      if (!next) setShowPastNotesWindow(false)
      return next
    })
  }

  const updateProjectsExtraPadding = (nextWindowStateById) => {
    const sentinel = projectsBottomSentinelRef.current
    if (!sentinel) return

    // Base content bottom that is NOT affected by paddingBottom.
    const sentinelRect = sentinel.getBoundingClientRect()
    const baseContentBottom = sentinelRect.top + (window.scrollY || 0)

    const states = Object.values(nextWindowStateById || {}).filter(Boolean)
    const windowBottoms = states
      .map((s) => s?.bottom)
      .filter((v) => typeof v === 'number' && Number.isFinite(v))
    const maxWindowBottom = windowBottoms.length ? Math.max(...windowBottoms) : null

    const foldersRect = foldersRowRef.current?.getBoundingClientRect?.()
    const foldersBottom = foldersRect ? foldersRect.bottom + (window.scrollY || 0) : null

    const targetBottom = maxWindowBottom ?? foldersBottom ?? baseContentBottom
    const marginPx = 48
    const extraPbPx = Math.max(0, Math.round(targetBottom + marginPx - baseContentBottom))
    setProjectsExtraPbPx(extraPbPx)
  }

  const handleWindowMetrics = (id, rect, meta = {}) => {
    const pageBottom =
      rect && typeof rect.bottom === 'number' ? rect.bottom + (window.scrollY || 0) : null
    setWindowStateById((prev) => {
      const next = { ...prev }
      if (pageBottom == null) delete next[id]
      else next[id] = { bottom: pageBottom, lightboxOpen: Boolean(meta?.lightboxOpen) }
      updateProjectsExtraPadding(next)
      return next
    })
  }

  useEffect(() => {
    if (!anyVisibleFolderWindowOpen) {
      setWindowStateById({})
      setProjectsExtraPbPx(0)
      return
    }
    updateProjectsExtraPadding(windowStateById)
  }, [anyVisibleFolderWindowOpen])

  useEffect(() => {
    const onResizeOrScroll = () => updateProjectsExtraPadding(windowStateById)
    window.addEventListener('resize', onResizeOrScroll)
    window.addEventListener('scroll', onResizeOrScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResizeOrScroll)
      window.removeEventListener('scroll', onResizeOrScroll)
    }
  }, [windowStateById])

  useEffect(() => {
    if (!showPhotosWindow) handleWindowMetrics('photos', null)
  }, [showPhotosWindow])

  useEffect(() => {
    if (!showDesignWindow) handleWindowMetrics('design', null)
  }, [showDesignWindow])

  useEffect(() => {
    if (!showTechnicalsWindow) handleWindowMetrics('technicals', null)
  }, [showTechnicalsWindow])

  useEffect(() => {
    if (!showPastNotesWindow) handleWindowMetrics('past-notes', null)
  }, [showPastNotesWindow])

  // (debug logging removed)

  const photosContentFiles =
    photosOpenFolder != null && PHOTOS_FOLDER_SLUGS[photosOpenFolder]
      ? (PHOTOS_FOLDER_FILES[photosOpenFolder] || []).map(
          (filename) => `/photos/${PHOTOS_FOLDER_SLUGS[photosOpenFolder]}/${filename}`
        )
      : []

  const designContentFiles =
    designOpenFolder === 'Lazy Day Lines'
      ? LAZY_DAY_LINES_ITEMS
      : designOpenFolder === 'Cal Hacks'
        ? CAL_HACKS_ITEMS
        : designOpenFolder != null && DESIGN_FOLDER_SLUGS[designOpenFolder]
          ? (DESIGN_FOLDER_FILES[designOpenFolder] || []).map(
              (filename) => `/design/${DESIGN_FOLDER_SLUGS[designOpenFolder]}/${filename}`
            )
          : []

  const technicalsContentFiles =
    technicalsOpenFolder === 'Kinetic Origamic' ? KINETIC_ORIGAMIC_ITEMS : []

  useEffect(() => {
    if (!showPhotosWindow) setPhotosOpenFolder(null)
  }, [showPhotosWindow])

  useEffect(() => {
    if (!showDesignWindow) setDesignOpenFolder(null)
  }, [showDesignWindow])

  useEffect(() => {
    if (!showTechnicalsWindow) setTechnicalsOpenFolder(null)
  }, [showTechnicalsWindow])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Shift' || e.repeat) return
      togglePastNotesFolder()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <section id="work" className="relative z-20">
      {/* Sticky tab bar for PROJECTS - higher z so windows slide below it */}
      <div className="sticky top-14 z-50">
        <div className="relative h-8 chrome-bg-90 backdrop-blur-sm">
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: '#6A22FF',
              clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
            }}
            aria-hidden
          >
            <div className="pl-[10%] flex items-center h-full">
              <span className="font-bangers text-white tracking-widest text-sm">PROJECTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section content below the sticky tab (purple grid) - min-height transitions so About Me slides */}
      <div
        ref={projectsWrapRef}
        className={`relative z-10 section-bg pt-16 pb-16 transition-[min-height,padding-bottom] duration-500 ease-in-out ${
          anyVisibleFolderWindowOpen
            ? anyProjectWindowMaximized
              ? 'min-h-screen pb-44'
              : 'min-h-screen pb-20'
            : 'min-h-0'
        }`}
        style={{ paddingBottom: `${64 + projectsExtraPbPx}px` }}
      >
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-6">
          <button
            type="button"
            onClick={togglePastNotesFolder}
            className="block w-full text-center text-[11px] tracking-wide uppercase text-white/35"
            aria-label={showPastNotesFolder ? 'Hide hidden folder' : 'Reveal hidden folder'}
          >
            Hint: press Shift
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <div
            ref={foldersRowRef}
            className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16"
          >
            {visibleFolders.map((folder) => {
              const onOpen =
                folder.label === 'PHOTOS'
                  ? onOpenPhotosWindow
                  : folder.label === 'DESIGN'
                    ? onOpenDesignWindow
                    : folder.label === 'TECHNICALS'
                      ? onOpenTechnicalsWindow
                      : () => setShowPastNotesWindow(true)
              const ref =
                folder.label === 'PHOTOS'
                  ? photosFolderRef
                  : folder.label === 'DESIGN'
                    ? designFolderRef
                    : folder.label === 'TECHNICALS'
                      ? technicalsFolderRef
                      : pastNotesFolderRef
              return (
                <button
                  key={folder.label}
                  ref={ref}
                  type="button"
                  className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
                  onClick={onOpen}
                >
                  <FolderIcon bodyColor={folder.bodyColor} tabColor={folder.tabColor} />
                  <span className="app-text text-sm font-medium tracking-wide">
                    {folder.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`relative transition-[min-height] duration-500 ease-in-out ${anyVisibleFolderWindowOpen ? 'min-h-[min(75vh,640px)]' : 'min-h-0'}`}>
        <FolderWindow
          show={showPhotosWindow}
          onClose={onClosePhotosWindow}
          folderRef={photosFolderRef}
          title="Photos"
          iconType="camera"
          borderColor="#C96AED"
          bodyColor="#C96AED"
          tabColor="#A825D9"
          innerFolderNames={PHOTOS_INNER_FOLDERS}
          stackIndex={openWindowStack.indexOf('photos')}
          cascadeSlot={cascadeOrder.indexOf('photos')}
          windowId="photos"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('photos') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
          subfolderName={photosOpenFolder}
          contentFiles={photosContentFiles}
          onOpenSubfolder={setPhotosOpenFolder}
          onBack={() => setPhotosOpenFolder(null)}
        />
        <FolderWindow
          show={showDesignWindow}
          onClose={onCloseDesignWindow}
          folderRef={designFolderRef}
          title="Design"
          iconType="pen"
          borderColor="#29A1F4"
          bodyColor="#50C0FA"
          tabColor="#1688C4"
          innerFolderNames={DESIGN_INNER_FOLDERS}
          stackIndex={openWindowStack.indexOf('design')}
          cascadeSlot={cascadeOrder.indexOf('design')}
          windowId="design"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('design') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
          subfolderName={designOpenFolder}
          contentFiles={designContentFiles}
          onOpenSubfolder={setDesignOpenFolder}
          onBack={() => setDesignOpenFolder(null)}
        />
        <FolderWindow
          show={showTechnicalsWindow}
          onClose={onCloseTechnicalsWindow}
          folderRef={technicalsFolderRef}
          title="Technicals"
          iconType="monitor"
          borderColor="#C0F000"
          bodyColor="#C0F000"
          tabColor="#8EAC12"
          innerFolderNames={TECHNICALS_INNER_FOLDERS}
          stackIndex={openWindowStack.indexOf('technicals')}
          cascadeSlot={cascadeOrder.indexOf('technicals')}
          windowId="technicals"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('technicals') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
          subfolderName={technicalsOpenFolder}
          contentFiles={technicalsContentFiles}
          onOpenSubfolder={setTechnicalsOpenFolder}
          onBack={() => setTechnicalsOpenFolder(null)}
        />
        <FolderWindow
          show={showPastNotesWindow}
          onClose={() => setShowPastNotesWindow(false)}
          folderRef={pastNotesFolderRef}
          title="Past Notes"
          iconType="pen"
          borderColor="#FF8A00"
          bodyColor="#FF8A00"
          tabColor="#E66500"
          innerFolderNames={[]}
          stackIndex={openWindowStack.indexOf('past-notes')}
          cascadeSlot={cascadeOrder.indexOf('past-notes')}
          windowId="past-notes"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('past-notes') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
        />
        </div>
        <div ref={projectsBottomSentinelRef} style={{ height: 1 }} />
      </div>
    </section>
  )
}
