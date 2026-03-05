import { useState } from 'react'

const ABOUT_CARDS = [
  {
    title: 'IDENTITY',
    image: '/about-me-book.JPEG',
    alt: 'About me',
    paragraphs: [
      "I grew up inthe East Bay of SF. Shaped by immigrant parents, I've developed a connection with HK culture, like Canto, cinema, and cafes.",
      "My passion lies in blending creative design with digital technology. Growing up with Erb's palsy showed me how design can include or exclude you. Thus, I'm drawn to accessible designs backed by data to translate real needs into intuitive experiences.",
    ],
  },
  {
    title: 'HOBBIES',
    image: '/about-me-archery.jpg',
    alt: 'About me — 2',
    paragraphs: [
      "Art and creativity have been with me all my life. I grew up learning traditional art before pivoting to digital media and design. I love storytelling through experimental, landscape, and street photography. From weekly piano lessons to becoming a self-taught guitarist and (hopefully) future drummer, music is another creative outlet that I enjoy.",
      "In my free time, I also shoot compound archery with my school’s collegiate team.",
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
    <section id="about" className="relative pt-2">
      {/* Sticky tab bar for ABOUT ME with translucent backing outside the tab */}
      <div className="sticky top-14 z-[60]">
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

      {/* Grid section content below the sticky tab (red grid) - layer above Projects (purple) grid */}
      <div className="relative z-20 grid-bg-red min-h-screen pt-16 pb-20">
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
                  <div className="relative w-full h-full bg-white rounded-none border-2 border-pink-400 overflow-hidden shadow-xl flex flex-row">
                    <div className="flex-[0_0_50%] min-w-0 flex items-center justify-center p-[clamp(0.75rem,3vw,1.5rem)] bg-white overflow-hidden">
                      <div className="w-full h-full max-w-full max-h-full rounded-none bg-white overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.alt}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-pink-400/60 -translate-x-px" aria-hidden />
                    <div className="flex-[0_0_50%] min-w-0 p-4 md:p-8 flex flex-col relative flex-1 min-h-0">
                      <div className="w-3 h-3 absolute top-4 right-4 md:top-6 md:right-6 z-10" style={{ backgroundColor: '#F62F60' }} />
                      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
                        {card.title && (
                          <h3
                            className="font-bangers tracking-wide mb-2 md:mb-3"
                            style={{ color: '#F62F60', fontSize: 'clamp(1.125rem, 2.8vw, 1.75rem)' }}
                          >
                            {card.title}
                          </h3>
                        )}
                        {card.paragraphs.map((text, j) => (
                          <p
                            key={j}
                            className="font-nanum leading-relaxed mt-1.5 md:mt-2 first:mt-0"
                            style={{ color: '#F62F60', fontSize: 'clamp(0.875rem, 1.9vw, 1.0625rem)' }}
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                      {isFront && (
                        <button
                          type="button"
                          onClick={goToNext}
                          className="font-nanum absolute bottom-2 right-4 md:bottom-3 md:right-3 w-3 h-3 flex items-center justify-center rounded-none transition-colors font-light bg-pink-200/40 hover:bg-pink-200/70"
                          style={{ color: '#F62F60', fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}
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
