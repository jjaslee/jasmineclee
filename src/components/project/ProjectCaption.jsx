import { useEffect, useRef, useState } from 'react'

export const CAPTION_LINE_HEIGHT_EM = 1.625

export default function ProjectCaption({
  caption,
  fixedHeight = false,
  maxLines = 12,
  unbounded = false,
  boldFirstLine = false,
}) {
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

    let resizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => computeFade())
      resizeObserver.observe(el)
    }

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      resizeObserver?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lines = String(caption || '').split('\n')
  const maxHeightEm = maxLines * CAPTION_LINE_HEIGHT_EM
  const subtitlePattern = /^[A-Z][A-Za-z]*(?:\s[A-Z][A-Za-z]*)*$/
  const bulletedSections = new Set(['Principles', 'Approach', 'APPROACH', 'DESIGN PROCESS'])
  const subtitleIndentClass = 'pl-4'
  const isUrlLine = (text) => /^https?:\/\/\S+$/i.test(text.trim())
  const stripUrlHash = (url) => url.trim().split('#')[0]

  const isAllCapsLine = (text) => {
    const value = text.trim()
    if (!value || !/[A-Z]/.test(value)) return false
    return /^[A-Z0-9][A-Z0-9\s&/-]*$/.test(value)
  }

  const isSubtitleLine = (text) => {
    const value = text.trim()
    if (!value || value.length > 28) return false
    if (!subtitlePattern.test(value) || /[.!?]$/.test(value)) return false
    return true
  }

  const nodes = (() => {
    const output = []
    let indentActive = false

    for (let index = 0; index < lines.length; index += 1) {
      const line = String(lines[index] ?? '').replace(/\r/g, '')
      const trimmed = line.trim()

      if (!trimmed) {
        output.push(<div key={`sp-${index}`} className="h-3" aria-hidden />)
        indentActive = false
        continue
      }

      const allCaps = isAllCapsLine(trimmed)
      const subtitle = isSubtitleLine(trimmed) && !allCaps

      if (allCaps) indentActive = false
      if (subtitle) indentActive = true

      const isSystemSensePredictActuate = trimmed === 'SYSTEM (SENSE → PREDICT → ACTUATE)'
      const shouldBold =
        allCaps || subtitle || (boldFirstLine && index === 0) || isSystemSensePredictActuate
      const lineClass = [
        shouldBold ? 'font-semibold text-black/80' : undefined,
        indentActive && !allCaps ? subtitleIndentClass : undefined,
      ]
        .filter(Boolean)
        .join(' ')

      output.push(
        <div key={`ln-${index}`} className={lineClass || undefined}>
          {isUrlLine(trimmed) ? (
            <a
              href={stripUrlHash(trimmed)}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
            >
              {stripUrlHash(trimmed)}
            </a>
          ) : (
            trimmed
          )}
        </div>,
      )

      if (bulletedSections.has(trimmed)) {
        const items = []
        let nextIndex = index + 1
        for (; nextIndex < lines.length; nextIndex += 1) {
          const peek = String(lines[nextIndex] ?? '').replace(/\r/g, '').trim()
          if (peek) break
        }
        for (; nextIndex < lines.length; nextIndex += 1) {
          const next = String(lines[nextIndex] ?? '').replace(/\r/g, '').trim()
          if (!next) break
          items.push(next)
        }

        if (items.length) {
          output.push(
            <div key={`ulwrap-${index}`} className={indentActive ? subtitleIndentClass : undefined}>
              <ul className="list-disc pl-5 space-y-0.5">
                {items.map((text, itemIndex) => (
                  <li key={`li-${index}-${itemIndex}`}>{text}</li>
                ))}
              </ul>
            </div>,
          )
        }

        index = nextIndex - 1
      }
    }

    return output
  })()

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className={`text-black/70 text-sm leading-relaxed w-full rounded-xl bg-white/35 border border-black/10 px-4 py-3 ${
          unbounded ? 'overflow-visible' : 'overflow-auto pr-2'
        }`}
        style={
          unbounded
            ? undefined
            : fixedHeight
              ? { height: `${maxHeightEm}em` }
              : { maxHeight: `${maxHeightEm}em` }
        }
      >
        {nodes}
      </div>
      {!unbounded && showTopFade ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t-xl bg-gradient-to-t from-transparent to-black/15" />
      ) : null}
      {!unbounded && showBottomFade ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-xl bg-gradient-to-b from-transparent to-black/15" />
      ) : null}
    </div>
  )
}
