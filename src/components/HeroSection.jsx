import { useEffect, useState } from 'react'

const heroImages = ['/hero-purple.png', '/hero-1.png', '/hero-green.png']

const heroColorMap = {
  purple: '#6A22FF',
  red: '#F62F60',
  green: '#8DFD19',
}

const postcardContent = [
  {
    date: '6 / 14 / 2024',
    lines: [
      'On a long ride to visit my grandma, soft flashes of passing scenes flicker by as I drift to the rhythm of the bus.',
      "I'll visit you in Long Beach soon :D.",
    ],
    name: 'Neli',
    address: 'Lung Kwu Tan, Tuen Mun, Hong Kong',
  },
  {
    date: '6 / 7 / 2024',
    lines: [
      'Past the bamboos, I find a place of peace where waters are calm and trees are abundant.',
      'Thank you to my uncle for showing me around Japan.',
    ],
    name: 'Uncle Calvin',
    address: 'Saga Kamenoo-cho, Ukyo Ward, Kyoto, Japan',
  },
  {
    date: '4 / 27 / 2024',
    lines: [
      'To explore the intersection of behavior and technology, while growing not only as a leader but as a person. To step out of my shell, push my boundaries, and discover what truly excites and motivates me.',
    ],
    name: 'To my younger self',
    address: 'University of California, Berkeley',
  },
]

export default function HeroSection({ heroColor = 'purple' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const titleColor = heroColorMap[heroColor] ?? heroColorMap.purple
  const dotColors = ['#6A22FF', '#F62F60', '#8DFD19']
  const activeDotColor = dotColors[activeIndex] ?? dotColors[0]
  const postcardTextColor = activeIndex === 2 ? '#2F5D00' : activeDotColor

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const parallaxOffset = scrollY * 0.22

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-16 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Squiggly line background, tinted by current accent color */}
      <div
        className="wavy-lines"
        style={{
          backgroundColor: titleColor,
          transform: `translateY(${parallaxOffset}px)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full px-6 text-center max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-relaxed font-bangers"
            style={{ color: titleColor }}
          >
            Hi, I&apos;m Jasmine Lee.
          </h1>
          <p className="text-base md:text-lg font-poppins mb-10" style={{ color: titleColor }}>
            I like to collect postcards. Feel free to explore my page!
          </p>
        </div>

        <div className="relative mb-8 flex flex-col items-center">
          <div className="max-w-4xl w-full">
            <div
              className="flip-card"
              onClick={() => setShowBack((prev) => !prev)}
              aria-label="Flip postcard"
            >
              <div
                className={`flip-card-inner ${
                  showBack ? 'is-flipped' : ''
                } bg-black/80 border-2 border-neon-purple shadow-neon-purple`}
              >
                {/* Front of postcard */}
                <div className="flip-card-face">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative">
                      <img
                        src={heroImages[activeIndex]}
                        alt="Portfolio showcase"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-between bg-black">
                      <div className="text-left">
                        <p className="font-poppins text-xs text-gray-300 mb-2">CURRENT POSTCARD</p>
                        <p className="font-poppins text-sm text-white">
                          Three moments that shaped how I see the world, told as postcards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of postcard */}
                <div className="flip-card-face flip-card-back">
                  <div
                    className="border-2 w-full h-full"
                    style={{
                      borderColor: activeDotColor,
                      boxShadow: '0 0 30px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className="relative border-4 border-white bg-[#e5e5e5] w-full h-full">
                      <div className="absolute inset-y-6 left-1/2 w-px bg-[#c4c4c4]" />

                      <div className="grid w-full h-full grid-cols-2 grid-rows-[auto,1fr]">
                        {/* Top-left: grayscale photo */}
                        <div className="p-6">
                          <div
                            className="w-full overflow-hidden bg-black/5"
                            style={{ aspectRatio: '4 / 2' }}
                          >
                            <img
                              src={heroImages[activeIndex]}
                              alt="Postcard front preview"
                              className="w-full h-full object-cover"
                              style={{
                                filter:
                                  'grayscale(1) contrast(0.72) brightness(1.08)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Top-right: stamp */}
                        <div className="p-6 flex justify-end items-start">
                          <div
                            className="relative inline-block"
                            style={{
                              width: '33%',
                              maxWidth: 180,
                              aspectRatio: '1 / 1',
                              overflow: 'visible',
                            }}
                          >
                            <div
                              className="absolute rounded-none"
                              style={{
                                left: '0%',
                                top: '-10%',
                                width: '98%',
                                height: '115%',
                                backgroundColor: activeDotColor,
                              }}
                            />
                            <img
                              src={
                                activeIndex === 1
                                  ? '/stamp-red.png'
                                  : activeIndex === 2
                                    ? '/stamp-green.png'
                                    : '/stamp.png'
                              }
                              alt="Postage stamp"
                              className="relative w-full h-full object-contain z-10"
                              style={{
                                transform: 'scale(1.2)',
                                transformOrigin: 'center',
                              }}
                            />
                          </div>
                        </div>

                        {/* Bottom-left: date + message */}
                        <div className="px-6 pb-6 flex flex-col gap-1 items-start">
                          <p
                            className="font-nanum postcard-text text-left leading-snug"
                            style={{ color: postcardTextColor }}
                          >
                            {postcardContent[activeIndex].date}
                          </p>
                          {postcardContent[activeIndex].lines.map((line, i) => (
                            <p
                              key={i}
                              className="font-nanum postcard-text text-left leading-snug"
                              style={{ color: postcardTextColor }}
                            >
                              {line}
                            </p>
                          ))}
                        </div>

                        {/* Bottom-right: address */}
                        <div className="px-6 pb-6 flex flex-col justify-start">
                          <div
                            className="font-nanum postcard-text text-left space-y-1 leading-snug"
                            style={{ color: postcardTextColor }}
                          >
                            <p>{postcardContent[activeIndex].name}</p>
                            <p>{postcardContent[activeIndex].address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {heroImages.map((_, i) => {
              const color = dotColors[i] ?? dotColors[0]
              const isActive = i === activeIndex
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="w-2.5 h-2.5 rounded-full border transition-transform"
                  style={{
                    borderColor: color,
                    backgroundColor: isActive ? color : 'transparent',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

