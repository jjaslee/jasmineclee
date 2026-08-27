import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import {
  JASCIELLE_PHOTOGRAPHY_URL,
  PROJECT_CATEGORIES,
  getProjectByLegacyCategoryAndSlug,
  getProjectByLegacyCategoryAndTitle,
  getProjectsByLegacyCategory,
} from '../data/projects'
import {
  SECTION_NAV_PATHS,
  buildProjectPath,
  legacyProjectPathFromHash,
  normalizePath,
  parseProjectPath,
  scrollPageToPath,
} from '../utils/routes'

const folders = PROJECT_CATEGORIES
const photoProjects = getProjectsByLegacyCategory('photos')
const designProjects = getProjectsByLegacyCategory('design')
const technicalProjects = getProjectsByLegacyCategory('technicals')
const photoCategory = PROJECT_CATEGORIES.find((category) => category.id === 'photos')
const designCategory = PROJECT_CATEGORIES.find((category) => category.id === 'design')
const technicalCategory = PROJECT_CATEGORIES.find((category) => category.id === 'technicals')
const photoFolderNames = photoProjects.map((project) => project.title)
const designFolderNames = designProjects.map((project) => project.title)
const technicalFolderNames = technicalProjects.map((project) => project.title)

const PAST_NOTES_FOLDER = {
  label: 'PAST NOTES',
  bodyColor: '#FF8A00',
  tabColor: '#E66500',
}

function migrateLegacyHashUrl() {
  if (typeof window === 'undefined') return null
  const legacyPath = legacyProjectPathFromHash(window.location.hash)
  if (!legacyPath) return null
  window.history.replaceState(null, '', legacyPath)
  return legacyPath
}

const MINIMIZE_DURATION_MS = 350

const CAPTION_MAX_LINES = 12
const CAPTION_LINE_HEIGHT_EM = 1.625 // tailwind `leading-relaxed`
const CAPTION_MAX_HEIGHT_EM = CAPTION_MAX_LINES * CAPTION_LINE_HEIGHT_EM

function FolderCaption({
  caption,
  fixedHeight = false,
  maxLines = CAPTION_MAX_LINES,
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

    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => computeFade())
      ro.observe(el)
    }

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (ro) ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lines = String(caption || '').split('\n')
  const maxHeightEm = maxLines * CAPTION_LINE_HEIGHT_EM
  const subtitleRe = /^[A-Z][A-Za-z]*(?:\s[A-Z][A-Za-z]*)*$/
  const bulletedSections = new Set(['Principles', 'Approach', 'APPROACH', 'DESIGN PROCESS'])
  const SUBTITLE_INDENT_CLASS = 'pl-4'
  const isUrlLine = (t) => /^https?:\/\/\S+$/i.test(t.trim())
  const stripUrlHash = (url) => url.trim().split('#')[0]

  const isAllCapsLine = (t) => {
    const s = t.trim()
    if (!s) return false
    if (!/[A-Z]/.test(s)) return false
    if (!/^[A-Z0-9][A-Z0-9\s&/-]*$/.test(s)) return false
    return true
  }

  const isSubtitleLine = (t) => {
    const s = t.trim()
    if (!s) return false
    if (s.length > 28) return false
    if (!subtitleRe.test(s)) return false
    if (/[.!?]$/.test(s)) return false
    return true
  }

  const nodes = (() => {
    const out = []
    let indentActive = false
    for (let i = 0; i < lines.length; i++) {
      const line = String(lines[i] ?? '').replace(/\r/g, '')
      const trimmed = line.trim()

      if (!trimmed) {
        out.push(<div key={`sp-${i}`} className="h-3" aria-hidden />)
        indentActive = false
        continue
      }

      const allCaps = isAllCapsLine(trimmed)
      const subtitle = isSubtitleLine(trimmed) && !allCaps

      if (allCaps) indentActive = false
      if (subtitle) indentActive = true

      const isSystemSensePredictActuate =
        trimmed === 'SYSTEM (SENSE → PREDICT → ACTUATE)'
      const shouldBold =
        allCaps || subtitle || (boldFirstLine && i === 0) || isSystemSensePredictActuate
      const lineClass = [
        shouldBold ? 'font-semibold text-black/80' : undefined,
        indentActive && !allCaps ? SUBTITLE_INDENT_CLASS : undefined,
      ]
        .filter(Boolean)
        .join(' ')

      out.push(
        <div key={`ln-${i}`} className={lineClass || undefined}>
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
        let j = i + 1
        // Allow an empty line after the section header (common in copy).
        for (; j < lines.length; j++) {
          const peek = String(lines[j] ?? '').replace(/\r/g, '').trim()
          if (peek) break
        }
        for (; j < lines.length; j++) {
          const next = String(lines[j] ?? '').replace(/\r/g, '').trim()
          if (!next) break
          items.push(next)
        }

        if (items.length) {
          out.push(
            <div
              key={`ulwrap-${i}`}
              className={indentActive ? SUBTITLE_INDENT_CLASS : undefined}
            >
              <ul className="list-disc pl-5 space-y-0.5">
                {items.map((t, k) => (
                  <li key={`li-${i}-${k}`}>{t}</li>
                ))}
              </ul>
            </div>,
          )
        }

        i = j - 1
      }
    }
    return out
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

function FolderIcon({ bodyColor, tabColor }) {
  return (
    <div className="relative w-40 h-28">
      {/* Top strip behind tab (slight band across the top) */}
      <div
        className="absolute left-0 top-3 w-full h-4 rounded-t-[4px]"
        style={{
          backgroundColor: tabColor,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      />

      {/* Trapezoid tab sitting on the strip */}
      <div
        className="absolute left-0 top-0 h-6 w-16"
        style={{
          backgroundColor: tabColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '4px',
        }}
      />

      {/* Folder body */}
      <div
        className="absolute left-0 top-5 w-full h-[calc(100%-20px)] rounded-b-[6px] shadow-lg"
        style={{
          backgroundColor: bodyColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
    </div>
  )
}

function SmallFolderIcon({ bodyColor = '#C96AED', tabColor = '#A825D9' }) {
  return (
    <div className="relative w-20 h-16">
      <div
        className="absolute left-0 top-2 w-full h-3 rounded-t-[3px]"
        style={{
          backgroundColor: tabColor,
          borderTopLeftRadius: '3px',
          borderTopRightRadius: '3px',
        }}
      />
      <div
        className="absolute left-0 top-0 h-4 w-12"
        style={{
          backgroundColor: tabColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '3px',
        }}
      />
      <div
        className="absolute left-0 top-3 w-full h-[calc(100%-14px)] rounded-b-[4px] shadow-md"
        style={{
          backgroundColor: bodyColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
    </div>
  )
}

function TitleBarIcon({ type }) {
  if (type === 'notes') {
    return (
      <div className="w-5 h-4 bg-black rounded-[1px] flex flex-col justify-center gap-[2px] px-[3px]">
        <span className="block h-[1px] w-full bg-white" />
        <span className="block h-[1px] w-full bg-white" />
        <span className="block h-[1px] w-3/5 bg-white" />
      </div>
    )
  }
  if (type === 'camera') {
    return (
      <div className="relative w-6 h-3 bg-black">
        <div
          className="absolute -top-0.5 left-0.5 bg-black"
          style={{ width: '10px', height: '4px' }}
        />
        <div className="absolute inset-y-0.5 right-1.5 w-2 h-2 rounded-full paper-bg" />
      </div>
    )
  }
  if (type === 'pen') {
    return (
      <div className="relative w-6 h-5 flex items-center justify-center">
        <svg
          viewBox="0 0 35 35"
          stroke="currentColor"
          strokeWidth="1"
          
          className="w-5 h-5 text-black"
        >
          <rect
            x="6.36"
            y="21.21"
            width="30"
            height="10"
            transform="rotate(-45 6.36 21.21)"
          />
          <path d="M3.68 31.25L13.44 28.28L6.36 21.21Z" />
        </svg>
      </div>
    )
  
  }
  if (type === 'monitor') {
    return (
      <div className="relative w-6 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-black">
          <rect x="0" y="4" width="24" height="13" rx="0" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      </div>
    )
  }
  return null
}

const CASCADE_OFFSET_PX = 20 //28
const CASCADE_RANDOM_X = 38
const CASCADE_RANDOM_Y = 18 //22

// Lightbox: one set of chrome classes for Photos / Design / Technicals (same FolderWindow).
const LIGHTBOX_OVERLAY_CLASS =
  'absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center cursor-default p-3 sm:p-5 overflow-hidden select-none'

const LIGHTBOX_NAV_ARROW_CLASS =
  'text-3xl sm:text-4xl font-light leading-none select-none hover:opacity-80 transition drop-shadow px-2 py-2 cursor-pointer'

// Close control (placed inside the right rail, above the next arrow).
const LIGHTBOX_CLOSE_BTN_CLASS =
  'inline-flex size-12 shrink-0 items-center justify-center sm:size-14 rounded-md text-2xl sm:text-3xl font-light leading-none select-none hover:opacity-80 transition drop-shadow cursor-pointer'

// Upper-right rail: × at top, same column as `>` with `>` vertically centered under it.
const LIGHTBOX_RIGHT_RAIL_CLASS =
  'absolute top-0 right-0 bottom-0 z-[60] flex w-10 min-w-0 flex-col items-center pr-0.5 sm:w-14 sm:pr-1 pt-2 sm:pt-3'

function FolderWindow({
  show,
  onClose,
  folderRef,
  title,
  iconType,
  borderColor,
  bodyColor,
  tabColor,
  innerFolderNames,
  stackIndex = 0,
  cascadeSlot = 0,
  windowId,
  onBringToFront,
  isFrontWindow = false,
  project = null,
  subfolderName = null,
  contentFiles = [],
  onOpenSubfolder,
  onBack,
  onMaximizeChange,
  onMetricsChange,
  cta = null,
}) {
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [minimizeOrigin, setMinimizeOrigin] = useState(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [randomOffset, setRandomOffset] = useState({ x: 0, y: 0 })
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [thumbViewportHeightPx, setThumbViewportHeightPx] = useState(null)
  const [thumbTilePx, setThumbTilePx] = useState(null)
  const [showThumbsGridBottomFade, setShowThumbsGridBottomFade] = useState(false)
  const [docViewportHeightPx, setDocViewportHeightPx] = useState(null)
  const [docPageMaxHeightPx, setDocPageMaxHeightPx] = useState(null)
  const [isMdUp, setIsMdUp] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 768px)').matches
  })
  const windowRef = useRef(null)
  const thumbsGridRef = useRef(null)
  const captionWrapRef = useRef(null)
  const aquaScrollRef = useRef(null)
  const aquaPhoneOuterRef = useRef(null)
  const aquaPhoneBorderRef = useRef(null)
  const aquaPhoneScreenRef = useRef(null)
  const lightboxMediaRef = useRef(null)
  const firstDocPageRef = useRef(null)

  const displayTitle = subfolderName ? `${title} > ${subfolderName}` : title
  const isInsideSubfolder = Boolean(subfolderName)

  const ctaLink = cta ? (
    <a
      href={cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/15 bg-white/70 px-3 py-1 text-[11px] font-medium tracking-wide text-black/75 transition hover:border-black/25 hover:bg-white hover:text-black"
    >
      {cta.label}
      <span aria-hidden className="text-black/45">
        ↗
      </span>
    </a>
  ) : null
  const ctaFooter = ctaLink ? (
    <div className="flex w-full shrink-0 justify-center pt-4">{ctaLink}</div>
  ) : null

  const isAquaSync = project?.mediaPresentation === 'aquasync'
  const aquaItems = isAquaSync ? project.media : null
  const aquaSelectedItem =
    isAquaSync && aquaItems && typeof lightboxIndex === 'number' ? aquaItems[lightboxIndex] : null
  const aquaSelectedIsDoc = isAquaSync && aquaSelectedItem?.type === 'doc'
  const aquaSelectedPages = aquaSelectedIsDoc ? aquaSelectedItem.pages || [] : []
  const aquaSelectedImageSrc =
    isAquaSync && aquaSelectedItem?.type === 'image' ? aquaSelectedItem.src : null
  const aquaSelectedIsPhoneScroll = isAquaSync && aquaSelectedItem?.type === 'phoneScrollImage'
  const aquaSelectedPhoneFrameSrc = aquaSelectedIsPhoneScroll ? aquaSelectedItem.frameSrc : null
  const aquaSelectedPhoneScreenSrc = aquaSelectedIsPhoneScroll ? aquaSelectedItem.screenSrc : null

  const selectedNonAquaItem =
    !isAquaSync && typeof lightboxIndex === 'number' ? contentFiles?.[lightboxIndex] : null
  const selectedNonAquaIsObj = Boolean(selectedNonAquaItem && typeof selectedNonAquaItem === 'object')
  const selectedNonAquaType = selectedNonAquaIsObj ? selectedNonAquaItem.type : 'image'
  const selectedNonAquaDocPages =
    selectedNonAquaIsObj && selectedNonAquaType === 'doc' ? selectedNonAquaItem.pages || [] : []
  const selectedNonAquaImageSrc =
    selectedNonAquaIsObj && selectedNonAquaType === 'image'
      ? selectedNonAquaItem.src
      : typeof selectedNonAquaItem === 'string'
        ? selectedNonAquaItem
        : null
  const selectedNonAquaPdfHref =
    selectedNonAquaIsObj && selectedNonAquaType === 'image' ? selectedNonAquaItem.pdfHref : null
  const selectedNonAquaVideoSrc =
    selectedNonAquaIsObj && selectedNonAquaType === 'video' ? selectedNonAquaItem.src : null
  const selectedNonAquaScrollImageSrc =
    selectedNonAquaIsObj && selectedNonAquaType === 'scrollImage' ? selectedNonAquaItem.src : null
  const selectedNonAquaDocMaxWidthClass =
    project?.id === 'lazy-day-lines'
      ? 'max-w-[min(620px,100%)]'
      : project?.id === 'cal-hacks'
        ? 'max-w-[min(560px,100%)]'
      : 'max-w-[min(780px,100%)]'

  const DOC_VIEWPORT_SCALE = 1.0 // let viewport reach lightbox bottom for page peek
  const DOC_PAGE_MAX_SCALE = 0.86 // pages slightly smaller than viewport (breathing room)
  const DOC_PEEK_PX = isMdUp ? 52 : 40

  const lightboxOpen = isAquaSync
    ? lightboxIndex != null && (aquaItems?.length || 0) > 0
    : lightboxIndex != null && (contentFiles?.length || 0) > 0
  const folderCaption = project?.summary || null
  const folderCaptionLineCount = folderCaption
    ? String(folderCaption)
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean).length
    : 0
  const useSideBySideCaptionLayout = folderCaptionLineCount > 3
  const isStackedCaptionLayout = useSideBySideCaptionLayout && !isMdUp
  const shortCaptionMaxLines = Math.max(4, Math.min(8, folderCaptionLineCount + 2))
  const captionMaxLines = isStackedCaptionLayout ? 12 : useSideBySideCaptionLayout ? 20 : shortCaptionMaxLines
  const isCaptionActuallySideBySide = useSideBySideCaptionLayout && isMdUp
  const captionShouldScroll = isCaptionActuallySideBySide || isStackedCaptionLayout
  const captionIsUnbounded = !captionShouldScroll
  const captionBoxHeightEm = captionMaxLines * CAPTION_LINE_HEIGHT_EM
  const thumbsGridColsClass = useSideBySideCaptionLayout ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
  const thumbGridGapPx = isMdUp ? 16 : 12
  const thumbGridVisibleHeightPx = thumbTilePx
    ? useSideBySideCaptionLayout && isMdUp
      ? thumbViewportHeightPx
      : thumbTilePx * 1.5 + thumbGridGapPx
    : null

  const computeThumbsGridFade = () => {
    const el = thumbsGridRef.current
    if (!el) return
    const overflowing = el.scrollHeight > el.clientHeight + 1
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
    const next = overflowing && !atBottom
    setShowThumbsGridBottomFade((prev) => (prev === next ? prev : next))
  }

  const closeLightbox = () => setLightboxIndex(null)
  const toggleMaximize = () => {
    setIsMaximized((prev) => {
      const next = !prev
      onMaximizeChange?.(windowId, next)
      return next
    })
  }

  const goPrev = () => {
    const count = isAquaSync ? aquaItems?.length || 0 : contentFiles?.length || 0
    if (!count) return
    setLightboxIndex((prev) => {
      const current = prev ?? 0
      return (current - 1 + count) % count
    })
  }

  const goNext = () => {
    const count = isAquaSync ? aquaItems?.length || 0 : contentFiles?.length || 0
    if (!count) return
    setLightboxIndex((prev) => {
      const current = prev ?? 0
      return (current + 1) % count
    })
  }

  useEffect(() => {
    if (show && randomOffset.x === 0 && randomOffset.y === 0) {
      setRandomOffset({
        x: (Math.random() - 0.5) * 2 * CASCADE_RANDOM_X,
        y: (Math.random() - 0.5) * 2 * CASCADE_RANDOM_Y,
      })
    }
  }, [show])

  useEffect(() => {
    // Reset lightbox when leaving a folder view or closing window
    if (!show || !isInsideSubfolder) setLightboxIndex(null)
  }, [show, isInsideSubfolder])

  useEffect(() => {
    if (!show && isMaximized) {
      setIsMaximized(false)
      onMaximizeChange?.(windowId, false)
    }
  }, [show])

  useEffect(() => {
    if (!show) return
    const rect = windowRef.current?.getBoundingClientRect?.()
    onMetricsChange?.(windowId, rect, { lightboxOpen })
  }, [show, isMaximized, subfolderName, contentFiles?.length, lightboxOpen])

  useEffect(() => {
    if (!show) return
    const onResize = () => {
      const rect = windowRef.current?.getBoundingClientRect?.()
      onMetricsChange?.(windowId, rect, { lightboxOpen })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [show, windowId, lightboxOpen])

  useEffect(() => {
    if (!show || !windowRef.current || typeof ResizeObserver === 'undefined') return
    const el = windowRef.current
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      onMetricsChange?.(windowId, rect, { lightboxOpen })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [show, windowId, lightboxOpen, subfolderName])

  useEffect(() => {
    if (!show || !subfolderName) return

    const measure = () => {
      const gridEl = thumbsGridRef.current
      if (!gridEl) return
      const captionEl = captionWrapRef.current
      const buttons = Array.from(gridEl.querySelectorAll('button'))
      const firstThumb = buttons[0]
      if (!firstThumb) return
      const styles = window.getComputedStyle(gridEl)
      const rowGap = parseFloat(styles.rowGap || styles.gap || '0') || 0
      const colGap = parseFloat(styles.columnGap || styles.gap || '0') || 0
      const cols = (styles.gridTemplateColumns || '').split(' ').filter(Boolean).length || 1
      const gridW = gridEl.clientWidth
      const tilePx = Math.max(1, Math.round((gridW - colGap * (cols - 1)) / cols))
      setThumbTilePx((prev) => (prev === tilePx ? prev : tilePx))

      if (useSideBySideCaptionLayout && isMdUp && captionEl) {
        const captionH = Math.max(0, captionEl.getBoundingClientRect().height)
        const rowsFloat = Math.max(1, (captionH + rowGap) / (tilePx + rowGap))
        const fullRows = Math.floor(rowsFloat)
        const frac = rowsFloat - fullRows
        const baseH = fullRows * tilePx + Math.max(0, fullRows - 1) * rowGap
        const partialH = frac > 0 ? frac * tilePx + rowGap : 0
        const target = Math.round(baseH + partialH)
        setThumbViewportHeightPx((prev) => (prev === target ? prev : target))
      } else {
        const targetRows = 1.5
        const fullRows = Math.floor(targetRows)
        const fractionalRow = targetRows - fullRows
        const target = Math.round(
          tilePx * targetRows +
            rowGap * Math.max(0, fullRows - 1 + (fractionalRow > 0 ? 1 : 0)),
        )
        setThumbViewportHeightPx((prev) => (prev === target ? prev : target))
      }

      const gridRect = gridEl.getBoundingClientRect()
      const sample = buttons.slice(0, 6).map((b) => {
        const r = b.getBoundingClientRect()
        return { top: Math.round(r.top - gridRect.top), left: Math.round(r.left - gridRect.left) }
      })

      requestAnimationFrame(() => computeThumbsGridFade())
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [show, subfolderName, contentFiles?.length, aquaItems?.length, isMaximized, isAquaSync, isStackedCaptionLayout])

  useEffect(() => {
    if (!show || !subfolderName) {
      setShowThumbsGridBottomFade(false)
      return undefined
    }

    let cancelled = false
    let detach = () => {}

    const raf = requestAnimationFrame(() => {
      if (cancelled) return
      const el = thumbsGridRef.current
      if (!el) return

      const update = () => computeThumbsGridFade()
      update()
      el.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)

      let ro
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => update())
        ro.observe(el)
      }

      detach = () => {
        el.removeEventListener('scroll', update)
        window.removeEventListener('resize', update)
        if (ro) ro.disconnect()
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      detach()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    show,
    subfolderName,
    contentFiles?.length,
    aquaItems?.length,
    thumbViewportHeightPx,
    thumbTilePx,
    isMdUp,
    useSideBySideCaptionLayout,
    isStackedCaptionLayout,
  ])

  useEffect(() => {
    const onResize = () => {
      setIsMdUp(window.matchMedia('(min-width: 768px)').matches)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()

      // Lightbox-only: discourage casual copying/saving
      if ((e.metaKey || e.ctrlKey) && typeof e.key === 'string') {
        const k = e.key.toLowerCase()
        if (k === 's' || k === 'c' || k === 'x' || k === 'p' || k === 'u') {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, contentFiles?.length, aquaItems?.length, isAquaSync])

  const isDocLightboxOpen = lightboxOpen && (isAquaSync ? aquaSelectedIsDoc : selectedNonAquaType === 'doc')

  const computeDocLayout = () => {
    if (!isDocLightboxOpen) return
    const mediaEl = lightboxMediaRef.current
    const firstEl = firstDocPageRef.current
    if (!mediaEl || !firstEl) return

    const mediaRect = mediaEl.getBoundingClientRect()
    const availableH = Math.max(0, mediaRect.height)
    if (!availableH) return

    const pageMaxH = Math.floor(availableH * DOC_PAGE_MAX_SCALE)
    setDocPageMaxHeightPx((prev) => (prev === pageMaxH ? prev : pageMaxH))

    const firstRect = firstEl.getBoundingClientRect()
    const firstH = Math.max(0, firstRect.height)
    if (!firstH) return

    const maxViewportH = Math.floor(availableH * DOC_VIEWPORT_SCALE)
    const desired = Math.min(firstH + DOC_PEEK_PX, maxViewportH)
    const nextViewport = Math.max(firstH, Math.floor(desired))
    setDocViewportHeightPx((prev) => (prev === nextViewport ? prev : nextViewport))
  }

  useLayoutEffect(() => {
    if (!isDocLightboxOpen) {
      setDocViewportHeightPx(null)
      setDocPageMaxHeightPx(null)
      return
    }
    requestAnimationFrame(() => computeDocLayout())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDocLightboxOpen, lightboxIndex, isMaximized, isMdUp])

  useEffect(() => {
    if (!isDocLightboxOpen) return
    const onResize = () => requestAnimationFrame(() => computeDocLayout())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDocLightboxOpen, lightboxIndex, isMaximized, isMdUp])


  useEffect(() => {
    if (!lightboxOpen) return
    if (!isAquaSync) return
    if (!aquaSelectedIsDoc) return
    const el = aquaScrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [lightboxOpen, isAquaSync, aquaSelectedIsDoc, lightboxIndex])

  useEffect(() => {
    if (!lightboxOpen) return
    if (isAquaSync) return
    if (selectedNonAquaType !== 'doc') return
    const el = aquaScrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [lightboxOpen, isAquaSync, selectedNonAquaType, lightboxIndex])

  useLayoutEffect(() => {
    if (!lightboxOpen) return
    if (!isAquaSync) return
    if (!aquaSelectedIsPhoneScroll) return

    const PHONE_W = 9
    const PHONE_H = 19.5

    const applyFit = () => {
      const outer = aquaPhoneOuterRef.current
      const border = aquaPhoneBorderRef.current
      if (!outer || !border) return

      const r = outer.getBoundingClientRect()
      const availableW = r.width
      const availableH = r.height
      if (availableW <= 0 || availableH <= 0) return

      // Fit a portrait 9:19.5 rectangle fully inside the available box.
      // Start from height, then clamp width; if width overflows, recompute from width.
      let h = availableH
      let w = h * (PHONE_W / PHONE_H)
      if (w > availableW) {
        w = availableW
        h = w * (PHONE_H / PHONE_W)
      }

      border.style.width = `${Math.floor(w)}px`
      border.style.height = `${Math.floor(h)}px`
      border.style.maxWidth = '100%'
      border.style.maxHeight = '100%'
    }

    const outer = aquaPhoneOuterRef.current
    let ro
    if (outer && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => requestAnimationFrame(applyFit))
      ro.observe(outer)
    }
    requestAnimationFrame(applyFit)

    return () => {
      if (ro) ro.disconnect()
    }
  }, [lightboxOpen, isAquaSync, aquaSelectedIsPhoneScroll, lightboxIndex, isMaximized])

  const handleMinimize = () => {
    if (!windowRef.current || !folderRef?.current) return
    const windowRect = windowRef.current.getBoundingClientRect()
    const folderRect = folderRef.current.getBoundingClientRect()
    const folderCenterX = folderRect.left + folderRect.width / 2
    const folderCenterY = folderRect.top + folderRect.height / 2
    const originX = folderCenterX - windowRect.left
    const originY = folderCenterY - windowRect.top
    setMinimizeOrigin({ x: originX, y: originY })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsMinimizing(true))
    })
  }

  const handleMinimizeTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return
    if (isMinimizing) {
      onClose?.()
      setIsMinimizing(false)
      setMinimizeOrigin(null)
    }
  }

  if (!show) return null

  const layer = Math.max(0, stackIndex)
  const slot = Math.max(0, cascadeSlot)
  const baseOffset = slot * CASCADE_OFFSET_PX
  const offsetX = baseOffset + randomOffset.x
  const offsetY = baseOffset + randomOffset.y

  const handleWrapperClick = (e) => {
    const target = e.target
    const closestButtonLabel =
      target instanceof HTMLElement ? target.closest('button')?.getAttribute('aria-label') || null : null
    if (!closestButtonLabel) onBringToFront?.(windowId)
  }

  const handleInactiveWindowClick = () => {
    onBringToFront?.(windowId)
  }

  return (
    <div
      role="presentation"
      className="pointer-events-none absolute top-0 left-0 right-0 transition-all duration-300 ease-out cursor-default"
      style={{
        zIndex: 30 + layer,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
        <div
          className={`mx-auto mt-16 transition-all duration-300 ease-out ${
            isMaximized ? 'w-[min(78vw,920px)] max-w-none px-4' : 'w-[min(80vw,1400px)] max-w-none px-6'
          }`}
        >
          <div
            ref={windowRef}
            className="relative pointer-events-auto shadow-2xl bg"
            style={{
              transformOrigin: minimizeOrigin
                ? `${minimizeOrigin.x}px ${minimizeOrigin.y}px`
                : 'center center',
              transition: `transform ${MINIMIZE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${MINIMIZE_DURATION_MS}ms ease-out`,
              ...(isMinimizing && {
                transform: 'scale(0)',
                opacity: 0,
              }),
            }}
            onClick={handleWrapperClick}
            onTransitionEnd={handleMinimizeTransitionEnd}
          >
            {!isFrontWindow ? (
              <button
                type="button"
                className="absolute inset-0 z-[70] cursor-default bg-transparent"
                aria-label={`Bring ${title} window to front`}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  handleInactiveWindowClick()
                }}
              />
            ) : null}
            <div
              className={`paper-bg font-poppins border-[4px] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
                isMaximized ? 'min-h-[380px]' : ''
              }`}
              style={{
                borderColor,
                clipPath:
                  'polygon(0 0, 26% 0, 30% -14%, 62% -14%, 66% 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
          <div className="paper-bg px-5 py-3 flex items-center justify-between gap-4 border-b border-black/10 shrink-0">
            <div className="flex items-center gap-3">
              <TitleBarIcon type={iconType} />
              <span
                className="text-black font-medium text-sm"
                style={title === 'Past Notes' ? { opacity: 0.5 } : undefined}
              >
                {displayTitle}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110 transition"
                aria-label={`Minimize ${title} window`}
              />
              <button
                type="button"
                onClick={toggleMaximize}
                className="w-3 h-3 rounded-full bg-green-400 hover:brightness-110 transition"
                aria-label={isMaximized ? 'Restore window size' : 'Maximize window'}
              />
              <button
                type="button"
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition"
                aria-label={`Close ${title} window`}
              />
            </div>
          </div>
          <div
            className={`relative paper-bg-muted px-8 pb-8 pt-5 flex ${
              cta ? 'w-full min-h-0 flex-col' : isInsideSubfolder ? 'items-start' : 'items-center'
            } ${
              isMaximized
                ? isInsideSubfolder
                  ? 'flex-1 h-[min(66vh,560px)]'
                  : 'flex-1 h-[min(56vh,500px)]'
                : isInsideSubfolder
                  ? 'flex-1 h-[min(72vh,660px)]'
                  : 'flex-1 h-[min(56vh,520px)]'
            }`}
          >
            {isInsideSubfolder ? (
              <div className={`w-full flex min-h-0 flex-col gap-3 ${cta ? 'h-full' : ''}`}>
                <button
                  type="button"
                  onClick={onBack}
                  className="flex shrink-0 items-center gap-2 self-start text-black/70 hover:text-black text-sm font-medium"
                  aria-label="Back to folders"
                >
                  <span aria-hidden>← Back</span>
                </button>
                <div
                  className={`w-full min-h-0 ${cta ? 'flex-1' : ''} ${
                    useSideBySideCaptionLayout
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start'
                      : 'flex flex-col gap-4'
                  }`}
                >
                  {folderCaption ? (
                    <div ref={captionWrapRef} className={captionShouldScroll ? 'min-h-0' : undefined}>
                      <FolderCaption
                        caption={folderCaption}
                        fixedHeight={captionShouldScroll}
                        maxLines={captionMaxLines}
                        unbounded={captionIsUnbounded}
                        boldFirstLine={project?.summaryLeadBold}
                      />
                    </div>
                  ) : null}
                  <div
                    className={`relative w-full ${useSideBySideCaptionLayout ? 'min-h-0' : ''}`}
                    style={
                      folderCaption
                        ? thumbTilePx
                          ? {
                              height: thumbGridVisibleHeightPx
                                ? `${thumbGridVisibleHeightPx}px`
                                : `${captionBoxHeightEm}em`,
                            }
                          : { height: `${captionBoxHeightEm}em` }
                        : thumbViewportHeightPx && thumbTilePx
                          ? { height: `${thumbViewportHeightPx}px` }
                          : undefined
                    }
                  >
                    <div
                      ref={thumbsGridRef}
                      className={`grid h-full min-h-0 ${thumbsGridColsClass} gap-3 md:gap-4 w-full content-start overflow-auto`}
                      style={thumbTilePx ? { gridAutoRows: `${thumbTilePx}px` } : undefined}
                    >
                  {isAquaSync ? (
                    (aquaItems?.length || 0) > 0 ? (
                      aquaItems.map((item, i) => {
                        const coverSrc =
                          item?.type === 'doc'
                            ? item?.pages?.[0]
                            : item?.type === 'image'
                              ? item?.src
                              : item?.type === 'phoneScrollImage'
                                ? item?.coverSrc
                                : null
                        if (!coverSrc) return null
                        const hoverCopy = item.title || item.desc
                          ? { title: item.title, desc: item.desc }
                          : null
                        return (
                          <button
                            key={`${item.type}-${coverSrc}-${i}`}
                            type="button"
                            className="group relative w-full rounded-lg overflow-hidden bg-black/5 border border-black/10 group-hover:border-transparent cursor-pointer"
                            onClick={() => setLightboxIndex(i)}
                            aria-label={`Open ${project.title} item ${i + 1} of ${aquaItems.length}`}
                            onContextMenu={(e) => e.preventDefault()}
                            style={thumbTilePx ? { height: `${thumbTilePx}px` } : undefined}
                          >
                            <img
                              src={coverSrc}
                              alt=""
                              className="w-full h-full object-cover select-none transition-transform duration-200 ease-out group-hover:scale-[1.06] group-hover:blur-[2px] group-hover:brightness-[0.92]"
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              draggable={false}
                            />
                            {hoverCopy ? (
                              <div
                                className="absolute -inset-px flex items-center justify-center overflow-hidden rounded-[9px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                              >
                                <div
                                  className="absolute inset-0 overflow-hidden rounded-[9px] bg-white/55 backdrop-blur-[6px]"
                                />
                                <div className="relative px-3 text-center">
                                  <div className="text-black/90 font-semibold text-sm">
                                    {hoverCopy.title}
                                  </div>
                                  <div className="text-black/70 text-xs mt-1">
                                    {hoverCopy.desc}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </button>
                        )
                      })
                    ) : (
                      <p className="text-black/50 text-sm col-span-full">No photos in this folder yet.</p>
                    )
                  ) : contentFiles.length > 0 ? (
                    contentFiles.map((item, i) => {
                      const isObj = Boolean(item && typeof item === 'object')
                      const coverSrc = !isObj
                        ? item
                        : item.type === 'image'
                          ? item.src
                          : item.type === 'video'
                            ? item.src
                          : item.type === 'doc'
                            ? item.coverSrc || item.pages?.[0]
                            : item.type === 'scrollImage'
                              ? item.coverSrc || item.src
                            : null
                      if (!coverSrc) return null

                      const itemHoverCopy =
                        isObj && (item.title || item.desc)
                          ? { title: item.title, desc: item.desc }
                          : null
                      const hoverCopy = itemHoverCopy
                      const showHover = Boolean(hoverCopy)

                      return (
                        <button
                          key={`${coverSrc}-${i}`}
                          type="button"
                          className={`group relative w-full rounded-lg overflow-hidden bg-black/5 border border-black/10 hover:brightness-[0.96] cursor-pointer ${
                            showHover ? 'group-hover:border-transparent' : ''
                          }`}
                          onClick={() => setLightboxIndex(i)}
                          aria-label={`Open image ${i + 1} of ${contentFiles.length}`}
                          onContextMenu={(e) => e.preventDefault()}
                          style={thumbTilePx ? { height: `${thumbTilePx}px` } : undefined}
                        >
                          {isObj && item.type === 'video' ? (
                            <video
                              src={coverSrc}
                              className={`w-full h-full object-cover select-none transition-transform duration-200 ease-out ${
                                showHover
                                  ? 'group-hover:scale-[1.06] group-hover:blur-[2px] group-hover:brightness-[0.92]'
                                  : 'group-hover:scale-[1.08]'
                              }`}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              onMouseDown={(e) => e.stopPropagation()}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          ) : (
                            <img
                              src={coverSrc}
                              alt=""
                              className={`w-full h-full object-cover select-none transition-transform duration-200 ease-out ${
                                showHover
                                  ? 'group-hover:scale-[1.06] group-hover:blur-[2px] group-hover:brightness-[0.92]'
                                  : 'group-hover:scale-[1.08]'
                              }`}
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              draggable={false}
                            />
                          )}
                          {hoverCopy ? (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                              <div className="absolute -inset-px overflow-hidden rounded-[9px] bg-white/55 backdrop-blur-[6px]" />
                              <div className="relative px-3 text-center">
                                <div className="text-black/90 font-semibold text-sm">
                                  {hoverCopy.title}
                                </div>
                                <div className="text-black/70 text-xs mt-1">{hoverCopy.desc}</div>
                              </div>
                            </div>
                          ) : null}
                        </button>
                      )
                    })
                  ) : (
                    <p className="text-black/50 text-sm col-span-full">No photos in this folder yet.</p>
                  )}
                    </div>
                    {showThumbsGridBottomFade ? (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-xl bg-gradient-to-b from-transparent to-black/15" />
                    ) : null}
                  </div>
                </div>
                {ctaFooter}
              </div>
            ) : cta ? (
              <div className="flex h-full min-h-0 w-full flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 w-full content-start">
                    {innerFolderNames.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                        onClick={() => onOpenSubfolder?.(name)}
                      >
                        <SmallFolderIcon bodyColor={bodyColor} tabColor={tabColor} />
                        <span className="text-black text-xs font-medium text-center">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {ctaFooter}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 w-full content-start">
                {innerFolderNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={() => onOpenSubfolder?.(name)}
                  >
                    <SmallFolderIcon bodyColor={bodyColor} tabColor={tabColor} />
                    <span className="text-black text-xs font-medium text-center">{name}</span>
                  </button>
                ))}
              </div>
            )}

            {lightboxOpen ? (
              <div
                role="presentation"
                className={LIGHTBOX_OVERLAY_CLASS}
                onMouseDown={closeLightbox}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Image preview"
                  className="relative w-full h-full max-w-[min(1100px,100%)] max-h-full cursor-default"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {isAquaSync ? (
                    <div className="w-full h-full flex items-stretch justify-center gap-3 sm:gap-5">
                      {isAquaSync && (aquaItems?.length || 0) > 1 ? (
                        <div className="flex items-center justify-center w-10 sm:w-14 shrink-0">
                          <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous item"
                            className={LIGHTBOX_NAV_ARROW_CLASS}
                            style={{ color: borderColor }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {'<'}
                          </button>
                        </div>
                      ) : (
                        <div className="w-10 sm:w-14 shrink-0" aria-hidden />
                      )}

                      <div className="flex-1 min-w-0 flex items-stretch justify-center">
                        {aquaSelectedIsDoc ? (
                          <div ref={lightboxMediaRef} className="w-full h-full flex items-start justify-center">
                            <div
                              ref={aquaScrollRef}
                              className="relative w-full max-w-[min(780px,100%)] overflow-auto rounded-md cursor-default"
                              style={{ height: docViewportHeightPx ? `${docViewportHeightPx}px` : '100%' }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              <div className="mx-auto w-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4">
                                {aquaSelectedPages.map((src, idx) => (
                                  <div
                                    key={src}
                                    ref={idx === 0 ? firstDocPageRef : null}
                                    className="w-full flex justify-center"
                                  >
                                    <img
                                      src={src}
                                      alt=""
                                      className="block max-w-full w-auto h-auto rounded-md bg-white/5"
                                      style={docPageMaxHeightPx ? { maxHeight: `${docPageMaxHeightPx}px` } : undefined}
                                      onLoad={() => requestAnimationFrame(() => computeDocLayout())}
                                      onContextMenu={(e) => e.preventDefault()}
                                      onDragStart={(e) => e.preventDefault()}
                                      draggable={false}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : aquaSelectedIsPhoneScroll ? (
                          <div
                            className="relative w-full h-full min-h-0 flex items-center justify-center"
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            <div
                              ref={aquaPhoneOuterRef}
                              className="w-full h-full min-h-0 min-w-0 max-h-full flex items-center justify-center p-1"
                            >
                              <div
                                ref={aquaPhoneBorderRef}
                                className="border-[7px] sm:border-[9px] border-black rounded-[32px] shadow-xl bg-white overflow-hidden"
                              >
                                <div
                                  ref={aquaPhoneScreenRef}
                                  className="h-full w-full overflow-y-auto overflow-x-hidden"
                                >
                                  {aquaSelectedPhoneScreenSrc ? (
                                    <img
                                      src={aquaSelectedPhoneScreenSrc}
                                      alt=""
                                      className="block w-full h-auto select-none"
                                      draggable={false}
                                      onDragStart={(e) => e.preventDefault()}
                                      onContextMenu={(e) => e.preventDefault()}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : aquaSelectedImageSrc ? (
                          <div className="relative w-full h-full max-w-[min(720px,100%)] flex items-center justify-center px-6 py-6 sm:px-10 sm:py-8">
                            <img
                              src={aquaSelectedImageSrc}
                              alt=""
                              className="block object-contain rounded-md cursor-default"
                              style={{
                                maxHeight: '88%',
                                maxWidth: '88%',
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              draggable={false}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div
                        className="flex h-full min-h-0 w-10 shrink-0 flex-col items-center pr-0.5 pt-2 sm:w-14 sm:pr-1 sm:pt-3"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={closeLightbox}
                          aria-label="Close preview"
                          className={LIGHTBOX_CLOSE_BTN_CLASS}
                          style={{ color: borderColor }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          ×
                        </button>
                        {isAquaSync && (aquaItems?.length || 0) > 1 ? (
                          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <button
                              type="button"
                              onClick={goNext}
                              aria-label="Next item"
                              className={LIGHTBOX_NAV_ARROW_CLASS}
                              style={{ color: borderColor }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              {'>'}
                            </button>
                          </div>
                        ) : (
                          <div className="min-h-0 flex-1" aria-hidden />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {selectedNonAquaType === 'doc' ? (
                        <div ref={lightboxMediaRef} className="w-full h-full flex items-start justify-center">
                          <div
                            ref={aquaScrollRef}
                            className={`relative w-full ${selectedNonAquaDocMaxWidthClass} overflow-auto rounded-md cursor-default`}
                            style={{ height: docViewportHeightPx ? `${docViewportHeightPx}px` : '100%' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          >
                            <div className="mx-auto w-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4">
                              {selectedNonAquaDocPages.map((src, idx) => (
                                <div
                                  key={src}
                                  ref={idx === 0 ? firstDocPageRef : null}
                                  className="w-full flex justify-center"
                                >
                                  <img
                                    src={src}
                                    alt=""
                                    className="block max-w-full w-auto h-auto rounded-md bg-white/5"
                                    style={docPageMaxHeightPx ? { maxHeight: `${docPageMaxHeightPx}px` } : undefined}
                                    onLoad={() => requestAnimationFrame(() => computeDocLayout())}
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                    draggable={false}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : selectedNonAquaType === 'scrollImage' ? (
                        <div
                          className="h-full w-full flex items-center justify-center"
                          onMouseDown={(e) => e.stopPropagation()}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <div className="w-full max-w-[min(520px,100%)] h-full max-h-full border-[10px] border-black rounded-[28px] bg-white overflow-hidden shadow-xl">
                            <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                              {selectedNonAquaScrollImageSrc ? (
                                <img
                                  src={selectedNonAquaScrollImageSrc}
                                  alt=""
                                  className="block w-full h-auto select-none"
                                  draggable={false}
                                  onDragStart={(e) => e.preventDefault()}
                                  onContextMenu={(e) => e.preventDefault()}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : selectedNonAquaType === 'video' ? (
                        <div className="flex h-full w-full items-center justify-center px-4 py-4 sm:px-8 sm:py-6">
                          <video
                            src={selectedNonAquaVideoSrc || undefined}
                            className="block object-contain rounded-md cursor-default"
                            style={{
                              maxHeight: '100%',
                              maxWidth: 'calc(100% - 98px)', // leave room so arrows never overlap the media
                            }}
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                            preload="metadata"
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </div>
                      ) : (
                        <div
                          className={`relative flex h-full w-full items-center justify-center ${
                            selectedNonAquaPdfHref ? 'px-2 py-2 sm:px-4 sm:py-4' : 'px-6 py-6 sm:px-10 sm:py-8'
                          }`}
                        >
                          {selectedNonAquaPdfHref ? (
                            <a
                              href={selectedNonAquaPdfHref}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-black/80 backdrop-blur hover:bg-white/95"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              View as PDF
                            </a>
                          ) : null}
                          <img
                            src={selectedNonAquaImageSrc}
                            alt=""
                            className="block object-contain rounded-md cursor-default"
                            style={{
                              maxHeight: selectedNonAquaPdfHref ? '96%' : '88%',
                              maxWidth: selectedNonAquaPdfHref ? 'calc(96% - 98px)' : 'calc(88% - 98px)',
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                          />
                        </div>
                      )}

                      {contentFiles.length > 1 ? (
                        <button
                          type="button"
                          onClick={goPrev}
                          aria-label="Previous image"
                          className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 ${LIGHTBOX_NAV_ARROW_CLASS}`}
                          style={{ color: borderColor }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {'<'}
                        </button>
                      ) : null}

                      <div
                        className={LIGHTBOX_RIGHT_RAIL_CLASS}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={closeLightbox}
                          aria-label="Close preview"
                          className={LIGHTBOX_CLOSE_BTN_CLASS}
                          style={{ color: borderColor }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          ×
                        </button>
                        {contentFiles.length > 1 ? (
                          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                            <button
                              type="button"
                              onClick={goNext}
                              aria-label="Next image"
                              className={LIGHTBOX_NAV_ARROW_CLASS}
                              style={{ color: borderColor }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              {'>'}
                            </button>
                          </div>
                        ) : (
                          <div className="min-h-0 flex-1" aria-hidden />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default function FoldersSection({
  showPhotosWindow = false,
  onClosePhotosWindow,
  onOpenPhotosWindow,
  showDesignWindow = false,
  onCloseDesignWindow,
  onOpenDesignWindow,
  showTechnicalsWindow = true,
  onCloseTechnicalsWindow,
  onOpenTechnicalsWindow,
  anyFolderWindowOpen = true,
  openWindowStack = ['technicals'],
  cascadeOrder = ['technicals'],
  onBringWindowToFront,
}) {
  const photosFolderRef = useRef(null)
  const designFolderRef = useRef(null)
  const technicalsFolderRef = useRef(null)
  const pastNotesFolderRef = useRef(null)
  const foldersRowRef = useRef(null)
  const projectsBottomSentinelRef = useRef(null)
  const lastSyncedLocationPathRef = useRef(
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  )
  const [photosOpenFolder, setPhotosOpenFolder] = useState(null)
  const [designOpenFolder, setDesignOpenFolder] = useState(null)
  const [technicalsOpenFolder, setTechnicalsOpenFolder] = useState(null)
  const [showPastNotesFolder, setShowPastNotesFolder] = useState(false)
  const [showPastNotesWindow, setShowPastNotesWindow] = useState(false)
  const [maximizedByWindowId, setMaximizedByWindowId] = useState({})
  const anyProjectWindowMaximized = Object.values(maximizedByWindowId).some(Boolean)
  const [windowStateById, setWindowStateById] = useState({})
  const projectsWrapRef = useRef(null)
  const [projectsExtraPbPx, setProjectsExtraPbPx] = useState(0)
  const visibleFolders = showPastNotesFolder ? [...folders, PAST_NOTES_FOLDER] : folders
  const anyVisibleFolderWindowOpen = anyFolderWindowOpen || showPastNotesWindow

  const togglePastNotesFolder = () => {
    setShowPastNotesFolder((prev) => {
      const next = !prev
      if (!next) setShowPastNotesWindow(false)
      return next
    })
  }

  const updateProjectsExtraPadding = (nextWindowStateById) => {
    const sentinel = projectsBottomSentinelRef.current
    if (!sentinel) return

    // Base content bottom that is NOT affected by paddingBottom.
    const sentinelRect = sentinel.getBoundingClientRect()
    const baseContentBottom = sentinelRect.top + (window.scrollY || 0)

    const states = Object.values(nextWindowStateById || {}).filter(Boolean)
    const windowBottoms = states
      .map((s) => s?.bottom)
      .filter((v) => typeof v === 'number' && Number.isFinite(v))
    const maxWindowBottom = windowBottoms.length ? Math.max(...windowBottoms) : null

    const foldersRect = foldersRowRef.current?.getBoundingClientRect?.()
    const foldersBottom = foldersRect ? foldersRect.bottom + (window.scrollY || 0) : null

    const targetBottom = maxWindowBottom ?? foldersBottom ?? baseContentBottom
    const marginPx = 48
    const extraPbPx = Math.max(0, Math.round(targetBottom + marginPx - baseContentBottom))
    setProjectsExtraPbPx(extraPbPx)
  }

  const handleWindowMetrics = (id, rect, meta = {}) => {
    const pageBottom =
      rect && typeof rect.bottom === 'number' ? rect.bottom + (window.scrollY || 0) : null
    setWindowStateById((prev) => {
      const next = { ...prev }
      if (pageBottom == null) delete next[id]
      else next[id] = { bottom: pageBottom, lightboxOpen: Boolean(meta?.lightboxOpen) }
      updateProjectsExtraPadding(next)
      return next
    })
  }

  useEffect(() => {
    if (!anyVisibleFolderWindowOpen) {
      setWindowStateById({})
      setProjectsExtraPbPx(0)
      return
    }
    updateProjectsExtraPadding(windowStateById)
  }, [anyVisibleFolderWindowOpen])

  useEffect(() => {
    const onResizeOrScroll = () => updateProjectsExtraPadding(windowStateById)
    window.addEventListener('resize', onResizeOrScroll)
    window.addEventListener('scroll', onResizeOrScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResizeOrScroll)
      window.removeEventListener('scroll', onResizeOrScroll)
    }
  }, [windowStateById])

  useEffect(() => {
    if (!showPhotosWindow) handleWindowMetrics('photos', null)
  }, [showPhotosWindow])

  useEffect(() => {
    if (!showDesignWindow) handleWindowMetrics('design', null)
  }, [showDesignWindow])

  useEffect(() => {
    if (!showTechnicalsWindow) handleWindowMetrics('technicals', null)
  }, [showTechnicalsWindow])

  useEffect(() => {
    if (!showPastNotesWindow) handleWindowMetrics('past-notes', null)
  }, [showPastNotesWindow])

  // (debug logging removed)

  const photosOpenProject = getProjectByLegacyCategoryAndTitle('photos', photosOpenFolder)
  const designOpenProject = getProjectByLegacyCategoryAndTitle('design', designOpenFolder)
  const technicalsOpenProject = getProjectByLegacyCategoryAndTitle(
    'technicals',
    technicalsOpenFolder,
  )
  const photosContentFiles = photosOpenProject?.media || []
  const designContentFiles = designOpenProject?.media || []
  const technicalsContentFiles = technicalsOpenProject?.media || []

  useEffect(() => {
    if (!showPhotosWindow) setPhotosOpenFolder(null)
  }, [showPhotosWindow])

  useEffect(() => {
    if (!showDesignWindow) setDesignOpenFolder(null)
  }, [showDesignWindow])

  useEffect(() => {
    if (!showTechnicalsWindow) setTechnicalsOpenFolder(null)
  }, [showTechnicalsWindow])

  useLayoutEffect(() => {
    migrateLegacyHashUrl()

    const parsed = parseProjectPath(window.location.pathname)
    if (!parsed) return

    onClosePhotosWindow()
    onCloseDesignWindow()
    onCloseTechnicalsWindow()

    if (parsed.root === 'photos') {
      onOpenPhotosWindow()
      setPhotosOpenFolder(
        getProjectByLegacyCategoryAndSlug('photos', parsed.subSlug)?.title || null,
      )
      setDesignOpenFolder(null)
      setTechnicalsOpenFolder(null)
    } else if (parsed.root === 'design') {
      onOpenDesignWindow()
      setPhotosOpenFolder(null)
      setTechnicalsOpenFolder(null)
      setDesignOpenFolder(
        getProjectByLegacyCategoryAndSlug('design', parsed.subSlug)?.title || null,
      )
    } else if (parsed.root === 'technicals') {
      onOpenTechnicalsWindow()
      setPhotosOpenFolder(null)
      setDesignOpenFolder(null)
      setTechnicalsOpenFolder(
        getProjectByLegacyCategoryAndSlug('technicals', parsed.subSlug)?.title || null,
      )
    }

    scrollPageToPath(window.location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply initial URL once on mount
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      migrateLegacyHashUrl()

      const prev = lastSyncedLocationPathRef.current
      const next = normalizePath(window.location.pathname)
      const parsed = parseProjectPath(next)
      if (!parsed) {
        lastSyncedLocationPathRef.current = next
        return
      }

      onClosePhotosWindow()
      onCloseDesignWindow()
      onCloseTechnicalsWindow()

      if (parsed.root === 'photos') {
        onOpenPhotosWindow()
        setPhotosOpenFolder(
          getProjectByLegacyCategoryAndSlug('photos', parsed.subSlug)?.title || null,
        )
        setDesignOpenFolder(null)
        setTechnicalsOpenFolder(null)
      } else if (parsed.root === 'design') {
        onOpenDesignWindow()
        setPhotosOpenFolder(null)
        setTechnicalsOpenFolder(null)
        setDesignOpenFolder(
          getProjectByLegacyCategoryAndSlug('design', parsed.subSlug)?.title || null,
        )
      } else if (parsed.root === 'technicals') {
        onOpenTechnicalsWindow()
        setPhotosOpenFolder(null)
        setDesignOpenFolder(null)
        setTechnicalsOpenFolder(
          getProjectByLegacyCategoryAndSlug('technicals', parsed.subSlug)?.title || null,
        )
      }

      const bothDeepProjectRoutes =
        typeof prev === 'string' &&
        prev.startsWith('/projects/') &&
        next.startsWith('/projects/')
      if (!bothDeepProjectRoutes) {
        scrollPageToPath(next)
      }
      lastSyncedLocationPathRef.current = next
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [
    onClosePhotosWindow,
    onCloseDesignWindow,
    onCloseTechnicalsWindow,
    onOpenPhotosWindow,
    onOpenDesignWindow,
    onOpenTechnicalsWindow,
  ])

  useEffect(() => {
    let desiredPath = ''
    const front =
      openWindowStack.length > 0 ? openWindowStack[openWindowStack.length - 1] : null
    const rawPath = normalizePath(window.location.pathname)

    if (!front || front === 'past-notes') {
      if (rawPath.startsWith('/projects/')) {
        window.history.replaceState(null, '', '/')
        lastSyncedLocationPathRef.current = '/'
      }
      return
    }

    if (front === 'photos' && showPhotosWindow) {
      desiredPath = buildProjectPath('photos', photosOpenProject?.slug)
    } else if (front === 'design' && showDesignWindow) {
      desiredPath = buildProjectPath('design', designOpenProject?.slug)
    } else if (front === 'technicals' && showTechnicalsWindow) {
      desiredPath = buildProjectPath('technicals', technicalsOpenProject?.slug)
    } else {
      return
    }

    const atProjectFolderRoot =
      photosOpenFolder == null &&
      designOpenFolder == null &&
      technicalsOpenFolder == null
    const isDefaultIdleTechnicalsFront =
      openWindowStack.length === 1 &&
      openWindowStack[0] === 'technicals' &&
      showTechnicalsWindow &&
      !showPhotosWindow &&
      !showDesignWindow

    if (
      SECTION_NAV_PATHS.has(rawPath) &&
      atProjectFolderRoot &&
      isDefaultIdleTechnicalsFront &&
      desiredPath === buildProjectPath('technicals')
    ) {
      return
    }

    if (desiredPath !== rawPath) {
      window.history.replaceState(null, '', desiredPath)
      lastSyncedLocationPathRef.current = desiredPath
    }
  }, [
    openWindowStack,
    showPhotosWindow,
    photosOpenFolder,
    showDesignWindow,
    designOpenFolder,
    showTechnicalsWindow,
    technicalsOpenFolder,
  ])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Shift' || e.repeat) return
      togglePastNotesFolder()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <section id="projects" className="relative z-20">
      {/* Sticky tab bar for PROJECTS - higher z so windows slide below it */}
      <div className="sticky z-50" style={{ top: 'var(--app-header-height, 56px)' }}>
        <div className="relative h-8 chrome-bg-90 backdrop-blur-sm">
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: '#6A22FF',
              clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
            }}
            aria-hidden
          >
            <div className="pl-[10%] flex items-center h-full">
              <span className="font-bangers text-white tracking-widest text-sm">PROJECTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section content below the sticky tab (purple grid) - min-height transitions so About Me slides */}
      <div
        ref={projectsWrapRef}
        className={`relative z-10 section-bg pt-16 pb-16 transition-[min-height,padding-bottom] duration-500 ease-in-out ${
          anyVisibleFolderWindowOpen
            ? anyProjectWindowMaximized
              ? 'min-h-screen pb-44'
              : 'min-h-screen pb-20'
            : 'min-h-0'
        }`}
        style={{ paddingBottom: `${64 + projectsExtraPbPx}px` }}
      >
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-6">
          <button
            type="button"
            onClick={togglePastNotesFolder}
            className="block w-full text-center text-[11px] tracking-wide uppercase text-white/35"
            aria-label={showPastNotesFolder ? 'Hide hidden folder' : 'Reveal hidden folder'}
          >
            Hint: press Shift
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <div
            ref={foldersRowRef}
            className={`grid grid-cols-1 sm:grid-cols-[max-content_max-content] ${
              showPastNotesFolder ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            } justify-center justify-items-center gap-8 sm:gap-x-24 lg:gap-16`}
          >
            {visibleFolders.map((folder) => {
              const isPastNotes = !folder.id
              const onOpen =
                folder.id === 'photos'
                  ? onOpenPhotosWindow
                  : folder.id === 'design'
                    ? onOpenDesignWindow
                    : folder.id === 'technicals'
                      ? onOpenTechnicalsWindow
                      : () => {
                          setShowPastNotesWindow(true)
                          onBringWindowToFront?.('past-notes')
                        }
              const ref =
                folder.id === 'photos'
                  ? photosFolderRef
                  : folder.id === 'design'
                    ? designFolderRef
                    : folder.id === 'technicals'
                      ? technicalsFolderRef
                      : pastNotesFolderRef
              return (
                <button
                  key={folder.label}
                  ref={ref}
                  type="button"
                  className={`group flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer ${
                    isPastNotes ? 'opacity-50' : ''
                  }`}
                  onClick={onOpen}
                >
                  <FolderIcon bodyColor={folder.bodyColor} tabColor={folder.tabColor} />
                  <span className="app-text text-sm font-medium tracking-wide">
                    {folder.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`relative transition-[min-height] duration-500 ease-in-out ${anyVisibleFolderWindowOpen ? 'min-h-[min(75vh,640px)]' : 'min-h-0'}`}>
        <FolderWindow
          show={showPhotosWindow}
          onClose={onClosePhotosWindow}
          folderRef={photosFolderRef}
          title={photoCategory.title}
          iconType={photoCategory.iconType}
          borderColor={photoCategory.borderColor}
          bodyColor={photoCategory.bodyColor}
          tabColor={photoCategory.tabColor}
          innerFolderNames={photoFolderNames}
          stackIndex={openWindowStack.indexOf('photos')}
          cascadeSlot={cascadeOrder.indexOf('photos')}
          windowId="photos"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('photos') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
          project={photosOpenProject}
          subfolderName={photosOpenFolder}
          contentFiles={photosContentFiles}
          onOpenSubfolder={setPhotosOpenFolder}
          onBack={() => setPhotosOpenFolder(null)}
          cta={{ href: JASCIELLE_PHOTOGRAPHY_URL, label: photoCategory.externalLabel }}
        />
        <FolderWindow
          show={showDesignWindow}
          onClose={onCloseDesignWindow}
          folderRef={designFolderRef}
          title={designCategory.title}
          iconType={designCategory.iconType}
          borderColor={designCategory.borderColor}
          bodyColor={designCategory.bodyColor}
          tabColor={designCategory.tabColor}
          innerFolderNames={designFolderNames}
          stackIndex={openWindowStack.indexOf('design')}
          cascadeSlot={cascadeOrder.indexOf('design')}
          windowId="design"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('design') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
          project={designOpenProject}
          subfolderName={designOpenFolder}
          contentFiles={designContentFiles}
          onOpenSubfolder={setDesignOpenFolder}
          onBack={() => setDesignOpenFolder(null)}
        />
        <FolderWindow
          show={showTechnicalsWindow}
          onClose={onCloseTechnicalsWindow}
          folderRef={technicalsFolderRef}
          title={technicalCategory.title}
          iconType={technicalCategory.iconType}
          borderColor={technicalCategory.borderColor}
          bodyColor={technicalCategory.bodyColor}
          tabColor={technicalCategory.tabColor}
          innerFolderNames={technicalFolderNames}
          stackIndex={openWindowStack.indexOf('technicals')}
          cascadeSlot={cascadeOrder.indexOf('technicals')}
          windowId="technicals"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('technicals') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
          project={technicalsOpenProject}
          subfolderName={technicalsOpenFolder}
          contentFiles={technicalsContentFiles}
          onOpenSubfolder={setTechnicalsOpenFolder}
          onBack={() => setTechnicalsOpenFolder(null)}
        />
        <FolderWindow
          show={showPastNotesWindow}
          onClose={() => setShowPastNotesWindow(false)}
          folderRef={pastNotesFolderRef}
          title="Past Notes"
          iconType="notes"
          borderColor="#FF8A00"
          bodyColor="#FF8A00"
          tabColor="#E66500"
          innerFolderNames={[]}
          stackIndex={openWindowStack.indexOf('past-notes')}
          cascadeSlot={cascadeOrder.indexOf('past-notes')}
          windowId="past-notes"
          onBringToFront={onBringWindowToFront}
          isFrontWindow={openWindowStack.indexOf('past-notes') === openWindowStack.length - 1}
          onMaximizeChange={(id, isMax) =>
            setMaximizedByWindowId((prev) => ({ ...prev, [id]: isMax }))
          }
          onMetricsChange={handleWindowMetrics}
        />
        </div>
        <div ref={projectsBottomSentinelRef} style={{ height: 1 }} />
      </div>
    </section>
  )
}
