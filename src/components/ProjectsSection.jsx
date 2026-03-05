import { useState } from 'react'

const ABOUT_CARDS = [
  {
    title: 'IDENTITY',
    image: '/about-me-book.JPEG',
    alt: 'About me',
    paragraphs: [
      "I was born and raised in the East Bay, SF Bay Area. Shaped by immigrant parents, I've developed a deep connection with Hong Kong culture — including Canto, cinema, and cafes.",
      "My passion lies in blending creative design in the age of digital technology. Growing up with Erb's palsy meant I learned early how design can include you or shut you out. That's why I'm drawn to accessible designs that use data-driven models to translate real needs into intuitive experiences.",
    ],
  },
  {
    title: 'PRACTICE',
    image: '/about-me-archery.jpg',
    alt: 'About me — 2',
    paragraphs: [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    title: 'GOALS',
    image: '/about-me-goals.JPEG',
    alt: 'About me — 3',
    paragraphs: [
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    ],
  },
]

const STAGGER_PX = 16
const SLOT_STYLES = [
  { x: -STAGGER_PX, y: STAGGER_PX, rotate: -2, zIndex: 0 },
  { x: STAGGER_PX, y: STAGGER_PX * 2, rotate: 2, zIndex: 1 },
  { x: 0, y: 0, rotate: 0, zIndex: 2 },
]

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % ABOUT_CARDS.length)
  }

  return (
    <section id="about" className="relative -mt-8">
      {/* Sticky tab bar for ABOUT ME with translucent backing outside the tab */}
      <div className="sticky top-14 z-40">
        <div className="relative h-8 bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: '#F62F60',
              clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
            }}
            aria-hidden
          >
            <div className="pl-[10%] flex items-center h-full">
              <span className="font-bangers text-white tracking-widest text-sm">ABOUT ME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section content below the sticky tab (red grid) */}
      <div className="grid-bg-red bg-black min-h-screen pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Deck container: postcard aspect, scales with viewport */}
          <div
            className="relative mx-auto w-full max-w-[min(740px,92vw)]"
            style={{
              aspectRatio: '800 / 540',
            }}
          >
            {ABOUT_CARDS.map((card, i) => {
              const slot = (i - activeIndex + ABOUT_CARDS.length) % ABOUT_CARDS.length
              const s = SLOT_STYLES[slot]
              const isFront = slot === 2

              return (
                <div
                  key={i}
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg)`,
                    zIndex: s.zIndex,
                  }}
                >
                  <div className="relative w-full h-full bg-white rounded-lg border-2 border-pink-400 overflow-hidden shadow-xl flex flex-col md:flex-row">
                    <div className="md:flex-[0_0_50%] md:min-w-0 aspect-square md:aspect-auto flex-1 flex items-center justify-center p-[clamp(0.75rem,3vw,1.5rem)] md:p-[clamp(1rem,4vw,1.5rem)] bg-white overflow-hidden">
                      <div className="w-full h-full max-w-full max-h-full rounded border-2 border-pink-400/60 bg-white overflow-hidden shadow-inner">
                        <img
                          src={card.image}
                          alt={card.alt}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-pink-400/60 -translate-x-px" aria-hidden />
                    <div className="md:flex-[0_0_50%] md:min-w-0 p-6 md:p-8 flex flex-col justify-center relative flex-1 min-h-0">
                      <div className="w-3 h-3 absolute top-4 right-4 md:top-6 md:right-6" style={{ backgroundColor: '#F62F60' }} />
                      {card.title && (
                        <h3 className="font-bangers text-xl md:text-2xl tracking-wide mb-3" style={{ color: '#F62F60' }}>
                          {card.title}
                        </h3>
                      )}
                      {card.paragraphs.map((text, j) => (
                        <p key={j} className="font-nanum text-sm leading-relaxed mt-2 first:mt-0" style={{ color: '#F62F60' }}>
                          {text}
                        </p>
                      ))}
                      {isFront && (
                        <button
                          type="button"
                          onClick={goToNext}
                          className="font-nanum absolute bottom-4 right-4 md:bottom-6 md:right-6 w-8 h-8 flex items-center justify-center hover:opacity-90 rounded transition-opacity text-lg font-light"
                          style={{ color: '#F62F60' }}
                          aria-label="Next card"
                        >
                          &gt;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
