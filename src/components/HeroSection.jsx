import { useEffect, useRef, useState } from 'react'

const heroColorMap = {
  purple: '#6A22FF',
  red: '#F62F60',
  green: '#8DFD19',
}

const BURST_ANIMATION_MS = 390
const BURST_LIFETIME_MS = 440
const MAX_ACTIVE_BURSTS = 7
const TAP_MOVEMENT_TOLERANCE_PX = 10
const PARTICLE_SHAPES = ['dot', 'spark', 'line', 'dot', 'spark', 'dot', 'line']

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum)
}

function createBurst(id, x, y, color, blendsWithWords) {
  const particleCount = Math.floor(randomBetween(6, 11))
  const angleStep = (Math.PI * 2) / particleCount
  return {
    id,
    x,
    y,
    color,
    blendsWithWords,
    particles: Array.from({ length: particleCount }, (_, index) => {
      const angle = index * angleStep + randomBetween(-0.38, 0.38)
      const distance = randomBetween(18, 26)
      const travelX = Math.cos(angle) * distance
      const travelY = Math.sin(angle) * distance
      return {
        id: `${id}-${index}`,
        shape: PARTICLE_SHAPES[index % PARTICLE_SHAPES.length],
        x: travelX,
        y: travelY,
        midX: travelX * 0.72,
        midY: travelY * 0.72,
        overshootX: travelX * 1.08,
        overshootY: travelY * 1.08,
        size: randomBetween(4, 8),
        opacity: randomBetween(0.72, 1),
        rotation: randomBetween(-55, 55),
        delay: randomBetween(0, 28),
      }
    }),
  }
}

function isPointOverHeroWords(heroNode, x, y) {
  const range = document.createRange()
  const textElements = heroNode.querySelectorAll('[data-hero-content]')

  for (const element of textElements) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    let textNode = walker.nextNode()
    while (textNode) {
      if (textNode.textContent.trim()) {
        range.selectNodeContents(textNode)
        const isInsideTextLine = [...range.getClientRects()].some(
          (rect) =>
            x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
        )
        if (isInsideTextLine) return true
      }
      textNode = walker.nextNode()
    }
  }

  return false
}

function isHeroBurstTarget(target) {
  return (
    target instanceof Element &&
    !target.closest('a, button, input, select, textarea, [role="button"]')
  )
}

const heroCopy = {
  EN: {
    title: 'Designer & Builder',
    body: 'I design and build products, interfaces, and physical systems grounded in human behavior and data.',
    aside:
      'Mostly, I’m curious about everything, which keeps me on a quest for the wrinkliest brain possible.',
    education: 'Cognitive Science + Data Science',
    school: 'UC Berkeley · Design Innovation',
  },
}

export default function HeroSection({ heroColor = 'purple', lang = 'EN' }) {
  const accentColor = heroColorMap[heroColor] ?? heroColorMap.purple
  const copy = heroCopy[lang] ?? heroCopy.EN
  const [bursts, setBursts] = useState([])
  const nextBurstId = useRef(0)
  const activeBurstIds = useRef([])
  const cleanupTimers = useRef(new Map())
  const pointerStart = useRef(null)

  useEffect(
    () => () => {
      cleanupTimers.current.forEach((timer) => window.clearTimeout(timer))
      cleanupTimers.current.clear()
      activeBurstIds.current = []
    },
    [],
  )

  const addBurst = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const id = ++nextBurstId.current
    const burst = createBurst(
      id,
      event.clientX - bounds.left,
      event.clientY - bounds.top,
      accentColor,
      isPointOverHeroWords(event.currentTarget, event.clientX, event.clientY),
    )

    if (activeBurstIds.current.length >= MAX_ACTIVE_BURSTS) {
      const oldestId = activeBurstIds.current.shift()
      window.clearTimeout(cleanupTimers.current.get(oldestId))
      cleanupTimers.current.delete(oldestId)
      setBursts((current) => current.filter((item) => item.id !== oldestId))
    }

    activeBurstIds.current.push(id)
    setBursts((current) => [...current, burst])
    const timer = window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id))
      activeBurstIds.current = activeBurstIds.current.filter(
        (activeId) => activeId !== id,
      )
      cleanupTimers.current.delete(id)
    }, BURST_LIFETIME_MS)
    cleanupTimers.current.set(id, timer)
  }

  const handlePointerDown = (event) => {
    if (!event.isPrimary || event.button !== 0 || !isHeroBurstTarget(event.target)) {
      pointerStart.current = null
      return
    }

    pointerStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
  }

  const handlePointerUp = (event) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (
      !start ||
      start.pointerId !== event.pointerId ||
      !isHeroBurstTarget(event.target) ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) >
        TAP_MOVEMENT_TOLERANCE_PX
    ) {
      return
    }

    addBurst(event)
  }

  const handlePointerCancel = (event) => {
    if (pointerStart.current?.pointerId === event.pointerId) {
      pointerStart.current = null
    }
  }

  return (
    <section
      id="home"
      className="hero-shell relative isolate flex min-h-[100svh] overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className="hero-particle-effects" aria-hidden="true">
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className={`hero-particle-burst ${
              burst.blendsWithWords ? 'hero-particle-burst--over-words' : ''
            }`}
            style={{
              left: burst.x,
              top: burst.y,
              color: burst.color,
            }}
          >
            {burst.particles.map((particle) => (
              <span
                key={particle.id}
                className={`hero-particle-burst__particle hero-particle-burst__particle--${particle.shape}`}
                style={{
                  '--particle-x': `${particle.x}px`,
                  '--particle-y': `${particle.y}px`,
                  '--particle-mid-x': `${particle.midX}px`,
                  '--particle-mid-y': `${particle.midY}px`,
                  '--particle-overshoot-x': `${particle.overshootX}px`,
                  '--particle-overshoot-y': `${particle.overshootY}px`,
                  '--particle-size': `${particle.size}px`,
                  '--particle-opacity': particle.opacity,
                  '--particle-rotation': `${particle.rotation}deg`,
                  '--particle-delay': `${particle.delay}ms`,
                  '--particle-duration': `${BURST_ANIMATION_MS}ms`,
                }}
              />
            ))}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-1 items-center">
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 sm:px-[var(--page-inline)]">
          <div className="w-full max-w-[58rem] md:ml-[var(--header-accent-start)] md:w-[calc(100%_-_var(--header-accent-start))]">
            <h1
              data-hero-content
              className="type-display max-w-[12ch] tracking-[-0.04em]"
              style={{ color: accentColor }}
            >
              {copy.title}
            </h1>

            <div className="type-body mt-7 app-text sm:mt-8">
              <p data-hero-content className="max-w-[46rem] [text-wrap:balance]">
                {copy.body}
              </p>
              <p
                data-hero-content
                className="mt-2.5 max-w-[36rem] opacity-[0.68] [text-wrap:balance]"
              >
                {copy.aside}
              </p>
            </div>

            <div data-hero-content className="type-ui mt-7 app-text sm:mt-8">
              <p className="font-semibold">{copy.education}</p>
              <p className="mt-1 font-normal opacity-60">{copy.school}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[5.5rem] z-10 sm:bottom-28">
        <div className="type-meta flex items-center justify-between px-6 uppercase tracking-[0.2em] app-text opacity-45 sm:px-10 lg:px-[8vw]">
          <span data-hero-content>BAY AREA</span>
          <span data-hero-content>© 2026</span>
        </div>
      </div>
    </section>
  )
}
