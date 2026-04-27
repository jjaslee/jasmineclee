import { useEffect, useRef, useState } from 'react'

const MAX_PARTICLES = 18
const MIN_DISTANCE_PX = 10

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export default function CursorTrail() {
  const [particles, setParticles] = useState([])
  const lastRef = useRef({ x: null, y: null, t: 0 })
  const rafRef = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion()
    if (reducedMotion.current) return

    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      const now = performance.now()

      const last = lastRef.current
      const dx = last.x == null ? Infinity : x - last.x
      const dy = last.y == null ? Infinity : y - last.y
      const dist = Math.hypot(dx, dy)

      if (dist < MIN_DISTANCE_PX && now - last.t < 24) return

      lastRef.current = { x, y, t: now }

      // Throttle React updates to the next animation frame
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setParticles((prev) => {
          const next = [
            ...prev,
            {
              id: `${now}-${Math.random().toString(16).slice(2)}`,
              x,
              y,
            },
          ]
          return next.length > MAX_PARTICLES ? next.slice(next.length - MAX_PARTICLES) : next
        })
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="cursor-trail-layer" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={p.id}
          className="cursor-trail-dot"
          style={{
            left: p.x,
            top: p.y,
            opacity: 0.45 * ((i + 1) / particles.length),
          }}
          onAnimationEnd={() => {
            setParticles((prev) => prev.filter((x) => x.id !== p.id))
          }}
        />
      ))}
    </div>
  )
}

