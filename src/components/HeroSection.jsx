import { useState, useEffect, useRef } from 'react'

const heroImages = [
  '/hero-purple.png',
  '/hero-1.png',
  '/hero-green.png',
]

const heroColorMap = {
  purple: '#6A22FF',
  red: '#F62F60',
  green: '#8DFD19',
}

const postcardContentEn = [
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
      'Thank you for showing me around Japan.',
    ],
    name: 'Uncle Calvin',
    address: 'Saga Kamenoo-cho, Ukyo Ward, Kyoto, Japan',
  },
  {
    date: '4 / 27 / 2024',
    lines: [
      'To explore the intersection of behavior and technology, while growing not only as a leader but as a person.',
      'To step out of my shell, push my boundaries, and discover what truly excites and motivates me.',
    ],
    name: 'To my younger self',
    address: 'University of California, Berkeley',
  },
]

const postcardContentZh = [
  {
    date: '6 / 14 / 2024',
    lines: [
      '喺去探婆婆嘅長途車程上，窗外景色一幕幕掠過，我隨住巴士嘅節奏慢慢放空。',
      ['我好快會去 ', { type: 'latin', key: 'longBeach', text: 'Long Beach' }, ' 探你啦 :D'],
    ],
    name: [{ type: 'latin', key: 'neli', text: 'Neli' }],
    address: '香港屯門龍鼓灘',
  },
  {
    date: '6 / 7 / 2024',
    lines: [
      '穿過竹林之後，我搵到一個寧靜嘅地方，水面平靜，林木茂密。',
      '多謝你帶我去日本玩。',
    ],
    name: ['表舅父（', { type: 'latin', key: 'calvin', text: 'Calvin' }, '）'],
    address: '日本京都市右京區嵯峨龜尾町',
  },
  {
    date: '4 / 27 / 2024',
    lines: [
      '希望可以探索人類行為同科技之間嘅交匯點，同時喺領導能力同個人成長兩方面都有所提升。',
      '走出自己嘅舒適圈，突破界限，搵到真正令我有熱誠同動力嘅方向。',
    ],
    name: '寫俾以前嘅自己',
    address: ['加州大學伯克利分校（', { type: 'latin', key: 'ucb', text: 'University of California, Berkeley' }, '）'],
  },
]

export default function HeroSection({ heroColor = 'purple', lang = 'EN' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const dateRef = useRef(null)
  const firstLineRef = useRef(null)
  const addressBlockRef = useRef(null)
  const longBeachRef = useRef(null)
  const neliRef = useRef(null)
  const calvinRef = useRef(null)
  const ucbRef = useRef(null)
  const fontLogRafRef = useRef(null)
  const pointerStartXRef = useRef(null)
  const pointerStartYRef = useRef(null)
  const didSwipeRef = useRef(false)
  const titleColor = heroColorMap[heroColor] ?? heroColorMap.purple
  const dotColors = ['#6A22FF', '#F62F60', '#8DFD19']
  const activeDotColor = dotColors[activeIndex] ?? dotColors[0]
  const postcardTextColor = activeIndex === 2 ? '#2F5D00' : activeDotColor
  const postcardContent = lang === 'ZH' ? postcardContentZh : postcardContentEn
  const postcardFontClass = lang === 'ZH' ? 'font-zh-handwritten' : 'font-nanum'
  const dateFontClass = 'font-nanum'
  const englishInlineClass = 'font-nanum'

  const renderMixed = (value) => {
    if (typeof value === 'string') return value
    if (!Array.isArray(value)) return value
    return value.map((part, idx) => {
      if (typeof part === 'string') return part
      if (part?.type === 'latin') {
        const ref =
          part.key === 'longBeach'
            ? longBeachRef
            : part.key === 'neli'
              ? neliRef
              : part.key === 'calvin'
                ? calvinRef
                : part.key === 'ucb'
                  ? ucbRef
                : null
        return (
          <span key={`${part.key}-${idx}`} ref={ref} className={englishInlineClass}>
            {part.text}
          </span>
        )
      }
      return String(part ?? '')
    })
  }

  useEffect(() => {
    // Only log when the back is visible (writing side)
    if (!showBack) return
    if (lang !== 'ZH') return

    const log = () => {
      fontLogRafRef.current = null
      const dateEl = dateRef.current
      const lineEl = firstLineRef.current
      const addrEl = addressBlockRef.current
      if (!dateEl || !lineEl || !addrEl) return

      const dateStyle = window.getComputedStyle(dateEl)
      const lineStyle = window.getComputedStyle(lineEl)
      const addrStyle = window.getComputedStyle(addrEl)
      const lbEl = longBeachRef.current
      const nEl = neliRef.current
      const cEl = calvinRef.current
      const uEl = ucbRef.current
      const lbStyle = lbEl ? window.getComputedStyle(lbEl) : null
      const nStyle = nEl ? window.getComputedStyle(nEl) : null
      const cStyle = cEl ? window.getComputedStyle(cEl) : null
      const uStyle = uEl ? window.getComputedStyle(uEl) : null

      // #region agent log
      fetch('http://127.0.0.1:7753/ingest/b67305a2-8703-4d0c-9907-e6f5fc96d49c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8d4cf9'},body:JSON.stringify({sessionId:'8d4cf9',runId:'pre-fix',hypothesisId:'F1',location:'HeroSection.jsx:font',message:'hero_postcard_fonts',data:{lang,activeIndex,showBack,date:{fontFamily:dateStyle.fontFamily,fontWeight:dateStyle.fontWeight,text:dateEl.textContent?.slice(0,32)},line:{fontFamily:lineStyle.fontFamily,fontWeight:lineStyle.fontWeight,text:lineEl.textContent?.slice(0,48)},address:{fontFamily:addrStyle.fontFamily,fontWeight:addrStyle.fontWeight,text:addrEl.textContent?.slice(0,48)}},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      // #region agent log
      fetch('http://127.0.0.1:7753/ingest/b67305a2-8703-4d0c-9907-e6f5fc96d49c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8d4cf9'},body:JSON.stringify({sessionId:'8d4cf9',runId:'pre-fix',hypothesisId:'F2',location:'HeroSection.jsx:fontLatin',message:'hero_postcard_latin_fonts',data:{lang,activeIndex,showBack,longBeach:lbStyle?{fontFamily:lbStyle.fontFamily,fontWeight:lbStyle.fontWeight,text:lbEl.textContent}:null,neli:nStyle?{fontFamily:nStyle.fontFamily,fontWeight:nStyle.fontWeight,text:nEl.textContent}:null,calvin:cStyle?{fontFamily:cStyle.fontFamily,fontWeight:cStyle.fontWeight,text:cEl.textContent}:null,ucb:uStyle?{fontFamily:uStyle.fontFamily,fontWeight:uStyle.fontWeight,text:uEl.textContent}:null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    if (fontLogRafRef.current) return
    fontLogRafRef.current = requestAnimationFrame(log)

    return () => {
      if (fontLogRafRef.current) cancelAnimationFrame(fontLogRafRef.current)
    }
  }, [lang, activeIndex, showBack])

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % heroImages.length)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const handleArrowNav = (direction) => {
    // Front side: arrows flip to the writing side (no index change)
    if (!showBack) {
      didSwipeRef.current = false
      setShowBack(true)
      return
    }

    // Writing side: arrows navigate and return to the front
    didSwipeRef.current = false
    setActiveIndex((prev) => {
      const delta = direction === 'prev' ? -1 : 1
      return (prev + delta + heroImages.length) % heroImages.length
    })
    setShowBack(false)
  }

  const handlePointerDown = (e) => {
    // Only track touch / pen interactions for swipe gestures
    if (e.pointerType === 'mouse') return
    pointerStartXRef.current = e.clientX
    pointerStartYRef.current = e.clientY
  }

  const handlePointerUp = (e) => {
    if (e.pointerType === 'mouse') return
    if (pointerStartXRef.current == null || pointerStartYRef.current == null) return

    const dx = e.clientX - pointerStartXRef.current
    const dy = e.clientY - pointerStartYRef.current

    const SWIPE_THRESHOLD = 40
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      didSwipeRef.current = true
      if (dx < 0) {
        goNext()
      } else {
        goPrev()
      }
    }

    pointerStartXRef.current = null
    pointerStartYRef.current = null
  }

  const handleCardClick = () => {
    // If the last interaction was a swipe, skip the flip to avoid accidental toggles
    if (didSwipeRef.current) {
      didSwipeRef.current = false
      return
    }
    setShowBack((prev) => !prev)
  }

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full px-6 text-center max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1
            className="mb-3 leading-relaxed font-bangers"
            style={{
              color: titleColor,
              fontSize: 'clamp(1.4rem, 1.1rem + 1.35vw, 2.25rem)',
            }}
          >
            {lang === 'ZH' ? '你好，我係 李靜文。' : 'Hi, I\u2019m Jasmine C. Lee.'}
          </h1>
          <p
            className="font-poppins mb-10"
            style={{
              color: titleColor,
              fontSize: 'clamp(0.95rem, 0.88rem + 0.35vw, 1.125rem)',
            }}
          >
            {lang === 'ZH'
              ? '我鍾意收集明信片，歡迎隨意瀏覽我嘅網站！'
              : 'I like to collect postcards. Feel free to explore my page!'}
          </p>
        </div>

        <div className="relative mb-8 flex flex-col items-center">
          <div
            className="flip-card relative w-full group"
            style={{ maxWidth: 740, aspectRatio: '800 / 540' }}
            onClick={handleCardClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Subtle navigation arrows (don’t trigger flip) */}
            <button
              type="button"
              aria-label="Previous postcard"
              className="absolute -left-7 md:-left-10 top-1/2 -translate-y-1/2 z-20 select-none px-2 py-2 text-4xl md:text-5xl font-light leading-none transition-opacity hover:opacity-90"
              style={{
                color: activeDotColor,
                opacity: 0.8,
                textShadow: '0 0 12px rgba(0, 0, 0, 0.55)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleArrowNav('prev')
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next postcard"
              className="absolute -right-7 md:-right-10 top-1/2 -translate-y-1/2 z-20 select-none px-2 py-2 text-4xl md:text-5xl font-light leading-none transition-opacity hover:opacity-90"
              style={{
                color: activeDotColor,
                opacity: 0.8,
                textShadow: '0 0 12px rgba(0, 0, 0, 0.55)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleArrowNav('next')
              }}
            >
              ›
            </button>

            <div className={`flip-card-inner ${showBack ? 'is-flipped' : ''}`}>
              {/* Front of postcard */}
              <div className="flip-card-face">
                <div
                  className="border-[8px] w-full h-full rounded-xl overflow-hidden"
                  style={{
                    borderColor: activeDotColor,
                    boxShadow: '0 22px 38px -22px rgba(0, 0, 0, 0.85)',
                  }}
                >
                  <div className="border-[12px] paper-border w-full h-full rounded-[4px] overflow-hidden">
                    <img
                      src={heroImages[activeIndex]}
                      alt="Portfolio showcase"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.04] group-hover:brightness-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
                    />
                  </div>
                </div>
              </div>

              {/* Back of postcard */}
              <div className="flip-card-face flip-card-back">
                <div
                  className="border-[8px] w-full h-full rounded-xl overflow-hidden"
                  style={{
                    borderColor: activeDotColor,
                    boxShadow: '0 22px 38px -22px rgba(0, 0, 0, 0.85)',
                  }}
                >
                  <div className="relative border-[12px] paper-border paper-bg w-full h-full rounded-[4px] overflow-hidden">
                    {/* Center divider line */}
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
                            style={{ filter: 'grayscale(1) contrast(0.72) brightness(1.08)' }}
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
                          {/* Solid purple box behind (smaller so stamp overhangs) */}
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
                          {/* Stamp on top, larger so it overhangs the purple box */}
                          <img
                            src={activeIndex === 1 ? '/stamp-red.png' : activeIndex === 2 ? '/stamp-green.png' : '/stamp.png'}
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
                      <div className="px-6 pb-6 flex flex-col gap-1 items-start overflow-hidden">
                        <div className="w-full max-h-[7.5rem] md:max-h-none overflow-y-auto md:overflow-visible pr-1">
                          <p className={`${dateFontClass} postcard-text text-left leading-snug`} style={{ color: postcardTextColor }}>
                            <span ref={dateRef}>{postcardContent[activeIndex].date}</span>
                          </p>
                          {postcardContent[activeIndex].lines.map((line, i) => (
                            <p key={i} className={`${postcardFontClass} postcard-text text-left leading-snug`} style={{ color: postcardTextColor }}>
                              {i === 0 ? <span ref={firstLineRef}>{renderMixed(line)}</span> : renderMixed(line)}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Bottom-right: address */}
                      <div className="px-6 pb-6 flex flex-col justify-start">
                        <div className={`${postcardFontClass} postcard-text text-left space-y-1 leading-snug`} style={{ color: postcardTextColor }}>
                          <div ref={addressBlockRef}>
                            <p>
                              {renderMixed(postcardContent[activeIndex].name)}
                            </p>
                            <p>{renderMixed(postcardContent[activeIndex].address)}</p>
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
