import { useEffect, useRef } from 'react'

const MIN_DISTANCE_PX = 10
const TRAIL_OFFSET_PX = { x: 12, y: 14 }

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function readCssVarRgb(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const parts = raw.split(',').map((v) => Number.parseFloat(v.trim()))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return [255, 255, 255]
  return parts
}

export default function CursorTrail() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const pointsRef = useRef([])
  const lastRef = useRef({ x: null, y: null, t: 0 })
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion()
    if (reducedMotionRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const w = window.innerWidth
      const h = window.innerHeight
      sizeRef.current = { w, h, dpr }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove = (e) => {
      const x = e.clientX + TRAIL_OFFSET_PX.x
      const y = e.clientY + TRAIL_OFFSET_PX.y
      const now = performance.now()

      const last = lastRef.current
      const dx = last.x == null ? Infinity : x - last.x
      const dy = last.y == null ? Infinity : y - last.y
      const dist = Math.hypot(dx, dy)

      if (dist < MIN_DISTANCE_PX && now - last.t < 20) return

      lastRef.current = { x, y, t: now }
      pointsRef.current.push({ x, y, t: now })
      // Cap points to bound work; older points are faded out anyway.
      if (pointsRef.current.length > 64) pointsRef.current.splice(0, pointsRef.current.length - 64)
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    const draw = () => {
      const now = performance.now()
      const { w, h } = sizeRef.current
      ctx.clearRect(0, 0, w, h)

      const [r, g, b] = readCssVarRgb('--trail-rgb')

      const lifeMs = 420
      const baseRadius = 3
      const pts = pointsRef.current
      let writeIndex = 0

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        const age = now - p.t
        if (age >= lifeMs) continue

        // Keep point
        pts[writeIndex++] = p

        const k = 1 - age / lifeMs
        const alpha = 0.45 * k
        const radius = baseRadius * (0.35 + 0.65 * k)

        ctx.beginPath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      pts.length = writeIndex
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (prefersReducedMotion()) return null

  return <canvas ref={canvasRef} className="cursor-trail-canvas" aria-hidden />
}

