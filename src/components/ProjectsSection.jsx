import { useEffect, useMemo, useRef, useState } from 'react'

export default function ProjectsSection({ lang = 'EN' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const aboutBodyFontClass = lang === 'ZH' ? 'font-zh-handwritten' : 'font-nanum'
  const erbsRef = useRef(null)

  const ABOUT_CARDS = useMemo(() => {
    if (lang === 'ZH') {
      return [
        {
          title: 'HOBBIES',
          image: '/about-me-hobbies.png',
          alt: 'About me — 2',
          paragraphs: [
            '藝術同創作一直都係我生活中不可或缺嘅一部分。我由細學習傳統藝術，其後轉向數碼媒體同設計。我鍾意透過實驗性、風景同街頭攝影去講故事。音樂亦係我另一個創作出口，無論係彈鋼琴、對住結他哼歌，定係研究一首歌嘅鼓節奏。我最喜愛嘅地方係射箭場，我會一邊聽音樂一邊射箭。',
          ],
        },
        {
          title: 'GOALS',
          image: '/about-me-goals.jpg',
          alt: 'About me — 3',
          paragraphs: [
            '我希望做出真正好用、同時又有趣嘅產品。我好重視細節、無障礙設計，同埋為真實用戶而設計。長遠嚟講，我希望可以負責產品中更重要嘅部分，從用戶身上學習，並持續進步，將想法變成令人願意一再使用嘅作品。',
          ],
        },
        {
          title: 'IDENTITY',
          image: '/about-me-book.jpg',
          alt: 'About me',
          paragraphs: [
            [
              '我喺三藩市東灣長大。喺移民父母嘅影響下，我同香港文化建立咗好深嘅連結，例如廣東話、電影同香港茶餐廳。我熱衷於將創意設計同數碼科技結合。由細到大因為 ',
              { type: 'latin', key: 'erbs', text: 'Erb\u2019s palsy' },
              '，我更加體會到設計可以令人被包容，亦可以令人被忽略。所以我特別關注以數據支持嘅無障礙設計，希望將真實需要轉化成直覺、易用嘅體驗。',
            ],
          ],
        },
      ]
    }

    return [
      {
        title: 'HOBBIES',
        image: '/about-me-hobbies.png',
        alt: 'About me — 2',
        paragraphs: [
          'Art and creativity has been integral to my life. I grew up learning traditional art before pivoting to digital media and design. I love storytelling through experimental, landscape, and street photography. Music is another creative outlet that I enjoy, whether through playing piano, humming to my guitar, or picking out the drum pattern of a song. My happy place is the archery range, where I am shooting arrows with music playing in the background.',
        ],
      },
      {
        title: 'GOALS',
        image: '/about-me-goals.jpg',
        alt: 'About me — 3',
        paragraphs: [
          'I want to make things that are actually fun to use and still work really well. I care a lot about details, accessibility, and designing for real people. Long term, I would love to grow into a role where I can own bigger pieces of a product, learn from users, and keep getting better at turning ideas into something people want to come back to.',
        ],
      },
      {
        title: 'IDENTITY',
        image: '/about-me-book.jpg',
        alt: 'About me',
        paragraphs: [
          "I grew up in the East Bay of SF. Shaped by immigrant parents, I've developed a connection with HK culture, like Canto, cinema, and cafes. My passion lies in blending creative design with digital technology. Growing up with Erb's palsy showed me how design can include or exclude you. Thus, I'm drawn to accessible designs backed by data to translate real needs into intuitive experiences.",
        ],
      },
    ]
  }, [lang])

  const renderMixed = (value) => {
    if (typeof value === 'string') return value
    if (!Array.isArray(value)) return value
    return value.map((part, idx) => {
      if (typeof part === 'string') return part
      if (part?.type === 'latin') {
        const ref = part.key === 'erbs' ? erbsRef : null
        return (
          <span key={`${part.key}-${idx}`} ref={ref} className="font-nanum">
            {part.text}
          </span>
        )
      }
      return String(part ?? '')
    })
  }

  useEffect(() => {
    if (lang !== 'ZH') return
    if (activeIndex !== 2) return
    const el = erbsRef.current
    if (!el) return
    const s = window.getComputedStyle(el)
    // #region agent log
    fetch('http://127.0.0.1:7753/ingest/b67305a2-8703-4d0c-9907-e6f5fc96d49c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8d4cf9'},body:JSON.stringify({sessionId:'8d4cf9',runId:'pre-fix',hypothesisId:'E1',location:'ProjectsSection.jsx:erbs',message:'erbs_font',data:{fontFamily:s.fontFamily,fontWeight:s.fontWeight,text:el.textContent},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [lang, activeIndex])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsSmallScreen(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // More spread on larger screens; auto-tighten on small screens.
  const staggerPx = isSmallScreen ? 8 : 30
  const slotStyles = [
    { x: -staggerPx, y: staggerPx, rotate: -3, zIndex: 0 },
    { x: staggerPx, y: staggerPx * 2, rotate: 3, zIndex: 1 },
    { x: 0, y: 0, rotate: 0, zIndex: 2 },
  ]

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % ABOUT_CARDS.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + ABOUT_CARDS.length) % ABOUT_CARDS.length)
  }

  return (
    <section id="about" className="relative z-30 -mt-12 pt-2">
      {/* Sticky tab bar for ABOUT ME – high z so it overlaps Projects tab when scrolling */}
      <div className="sticky z-[70]" style={{ top: 'var(--app-header-height, 56px)' }}>
        <div className="relative h-8 chrome-bg-60 backdrop-blur-sm">
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

      {/* Section content below the sticky tab */}
      <div className="relative z-20 section-bg min-h-screen pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Deck container: postcard aspect, scales with viewport */}
          <div
            className={`relative mx-auto w-full ${
              isSmallScreen ? 'max-w-[min(520px,78vw)]' : 'max-w-[min(720px,90vw)]'
            }`}
            style={{
              aspectRatio: '800 / 540',
            }}
          >
            {/* Subtle navigation arrows (outside entire stack) */}
            <button
              type="button"
              aria-label="Previous About Me card"
              className="absolute -left-6 sm:-left-12 md:-left-20 lg:-left-28 top-1/2 -translate-y-1/2 z-20 select-none px-2 py-2 text-4xl md:text-5xl font-light leading-none transition-opacity hover:opacity-90"
              style={{
                color: '#F62F60',
                opacity: 1,
                textShadow: '0 0 12px rgba(0, 0, 0, 0.55)',
              }}
              onClick={goToPrev}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next About Me card"
              className="absolute -right-6 sm:-right-12 md:-right-20 lg:-right-28 top-1/2 -translate-y-1/2 z-20 select-none px-2 py-2 text-4xl md:text-5xl font-light leading-none transition-opacity hover:opacity-90"
              style={{
                color: '#F62F60',
                opacity: 0.8,
                textShadow: '0 0 12px rgba(0, 0, 0, 0.55)',
              }}
              onClick={goToNext}
            >
              ›
            </button>

            {ABOUT_CARDS.map((card, i) => {
              const slot = (i - activeIndex + ABOUT_CARDS.length) % ABOUT_CARDS.length
              const s = slotStyles[slot]
              const isFront = slot === 2

              return (
                <div
                  key={i}
                  className="absolute inset-0 transition-transform duration-700 ease-out"
                  style={{
                    transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg)`,
                    zIndex: s.zIndex,
                  }}
                >
                  <div
                    className="relative w-full h-full paper-bg rounded-xl border-[6px] overflow-hidden shadow-xl flex flex-row"
                    style={{ borderColor: '#F62F60' }}
                  >
                    <div className="flex-[0_0_50%] min-w-0 flex items-center justify-center p-[clamp(0.75rem,3vw,1.5rem)] paper-bg overflow-hidden">
                      <div className="w-full h-full max-w-full max-h-full rounded-lg bg-white overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.alt}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px" style={{ backgroundColor: 'rgba(246, 47, 96, 0.6)' }} aria-hidden />
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
                            className={`${aboutBodyFontClass} leading-relaxed mt-1.5 md:mt-2 first:mt-0`}
                            style={{ color: '#F62F60', fontSize: 'clamp(0.875rem, 1.9vw, 1.0625rem)' }}
                          >
                            {renderMixed(text)}
                          </p>
                        ))}
                      </div>
                      {isFront && (
                        <button
                          type="button"
                          onClick={goToNext}
                          className={`${aboutBodyFontClass} absolute bottom-2 right-4 md:bottom-3 md:right-3 w-3 h-3 flex items-center justify-center rounded-none transition-colors font-light bg-pink-200/40 hover:bg-pink-200/70`}
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
