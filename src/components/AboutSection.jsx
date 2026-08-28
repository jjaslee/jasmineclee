import { useEffect, useMemo, useRef, useState } from 'react'
import ContactForm from './contact/ContactForm'
import resumePdf from '../assets/Jasmine_Lee_Resume.pdf'
import './about-section.css'

const ABOUT_CARDS = [
  {
    id: 'about-me',
    title: 'ABOUT ME',
    activeTitle: 'About Me',
    image: '/about-me-book.jpg',
    imageAlt: 'Jasmine Lee reading an illuminated book with the Hong Kong skyline behind her',
    bullets: [
      'Berkeley grad, B.A. in Cognitive Science + Data Science',
      'Berkeley Certificate in Design Innovation',
      'Visual thinker AND systems person',
      <><em>I shoot a lot</em> of photography</>,
      '...and archery in my living room...',
      <>Probably working on one too <em>many</em> side projects</>,
    ],
  },
  {
    id: 'how-i-think',
    title: 'HOW I THINK',
    activeTitle: 'How I Think',
    bullets: [
      <>Good design is less design, <em>with spice</em> ✨</>,
      'I WILL notice the hover state',
      'Details matter, especially the ones nobody thinks about',
      'Make complicated things feel obvious',
      'Design around the expected to create something unexpected',
    ],
  },
  {
    id: 'how-i-build',
    title: 'HOW I BUILD',
    activeTitle: 'How I Build',
    bullets: [
      <>Iterate. Iterate. <em>Iterate</em>.</>,
      'Behavior, then looks.',
      'Pen + paper for ideation, Figma for rapid prototyping, and Cursor + Codex for building',
      <code className="font-mono">npm run dev -- --host</code>,
      "If something feels awkward, I'll keep poking at it",
      "I'm not afraid to get technical",
    ],
  },
  {
    id: 'lets-connect',
    title: "LET'S CONNECT",
    activeTitle: "Let's Connect",
    kind: 'connect',
  },
]

function BulletList({ bullets }) {
  return (
    <ul className="about-card-bullets type-body">
      {bullets.map((bullet, index) => (
        <li key={index}>{bullet}</li>
      ))}
    </ul>
  )
}

function ConnectContent({ lang }) {
  return (
    <div className="about-connect-content">
      <div className="about-connect-intro">
        <div className="about-connect-meta type-ui">
          <span>Interested in products, interfaces, and physical systems</span>
          <span>Open to interesting work + collaborations</span>
        </div>
        <div className="about-connect-links type-ui">
          <a href={resumePdf} target="_blank" rel="noopener noreferrer">
            Resume ↗
          </a>
          <a href="https://www.linkedin.com/in/jasmineclee" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>
      <ContactForm lang={lang} />
    </div>
  )
}

export default function AboutSection({ lang = 'EN' }) {
  const [activeCardId, setActiveCardId] = useState(ABOUT_CARDS[0].id)
  const activeHeadingRef = useRef(null)
  const focusAfterSelectionRef = useRef(null)
  const activeIndex = ABOUT_CARDS.findIndex((card) => card.id === activeCardId)
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex
  const activeCard = ABOUT_CARDS[safeActiveIndex]

  const stackedCards = useMemo(
    () =>
      Array.from({ length: ABOUT_CARDS.length }, (_, depth) => {
        const index = (safeActiveIndex + depth) % ABOUT_CARDS.length
        return { ...ABOUT_CARDS[index], depth }
      }),
    [safeActiveIndex],
  )

  useEffect(() => {
    const id = focusAfterSelectionRef.current
    if (!id) return
    focusAfterSelectionRef.current = null
    activeHeadingRef.current?.focus({ preventScroll: true })
  }, [activeCardId])

  const selectCard = (cardId) => {
    if (cardId === activeCardId) return
    focusAfterSelectionRef.current = cardId
    setActiveCardId(cardId)
  }

  return (
    <section id="about" aria-labelledby="about-heading" className="about-section relative z-30">
      <h2 id="about-heading" className="sr-only">
        About Me
      </h2>

      <div className="about-workspace section-bg">
        <div className="about-stack" data-active-card={activeCard.id} aria-label="About cards">
          {stackedCards.map((card) => {
            const isActive = card.depth === 0

            return (
              <article
                key={card.id}
                className={`about-stack-card ${isActive ? 'about-stack-card--active' : ''} ${
                  isActive && card.kind === 'connect' ? 'about-stack-card--connect' : ''
                }`}
                data-depth={card.depth}
                aria-labelledby={`about-card-title-${card.id}`}
              >
                {isActive ? (
                  <h3
                    ref={activeHeadingRef}
                    id={`about-card-title-${card.id}`}
                    className="about-card-title type-heading"
                    tabIndex={-1}
                  >
                    {card.activeTitle}
                  </h3>
                ) : (
                  <button
                    type="button"
                    className="about-card-activation"
                    aria-label={`Open ${card.activeTitle}`}
                    onClick={() => selectCard(card.id)}
                  >
                    <span id={`about-card-title-${card.id}`} className="about-card-title type-ui">
                      {card.title}
                    </span>
                  </button>
                )}

                {isActive ? (
                  <div
                    className="about-stack-card__content"
                    id={`about-panel-${card.id}`}
                    role="region"
                    aria-labelledby={`about-card-title-${card.id}`}
                  >
                    {card.kind === 'connect' ? (
                      <ConnectContent lang={lang} />
                    ) : card.image ? (
                      <div className="about-card-layout about-card-layout--media">
                        <figure className="about-card-image">
                          <img src={card.image} alt={card.imageAlt} />
                        </figure>
                        <BulletList bullets={card.bullets} />
                      </div>
                    ) : (
                      <div className="about-card-layout about-card-layout--text">
                        <BulletList bullets={card.bullets} />
                      </div>
                    )}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
