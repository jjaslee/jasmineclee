import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import AquaSyncMediaPresentation from './project/AquaSyncMediaPresentation'
import MediaViewer, { MediaThumbnail } from './project/MediaViewer'
import ProjectCaption, { CAPTION_LINE_HEIGHT_EM } from './project/ProjectCaption'
import Folder from './ui/Folder'
import SectionTab from './ui/SectionTab'
import Window from './ui/Window'
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

const CASCADE_RANDOM_X = 38
const CASCADE_RANDOM_Y = 18 //22
const MEDIA_PRESENTATIONS = {
  aquasync: AquaSyncMediaPresentation,
}

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
  const [isMdUp, setIsMdUp] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 768px)').matches
  })
  const windowRef = useRef(null)
  const thumbsGridRef = useRef(null)
  const captionWrapRef = useRef(null)

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

  const MediaPresentation = MEDIA_PRESENTATIONS[project?.mediaPresentation]
  const usesDetailedMediaHover = Boolean(MediaPresentation)
  const mediaItems = project?.media || contentFiles
  const documentMaxWidthClass =
    project?.mediaViewer?.documentMaxWidthClass || 'max-w-[min(780px,100%)]'
  const lightboxOpen = lightboxIndex != null && mediaItems.length > 0
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
  }, [show, subfolderName, mediaItems.length, isMaximized, MediaPresentation, isStackedCaptionLayout])

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
    mediaItems.length,
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

  return (
    <Window
      windowRef={windowRef}
      title={title}
      displayTitle={displayTitle}
      titleMuted={title === 'Past Notes'}
      iconType={iconType}
      borderColor={borderColor}
      stackIndex={stackIndex}
      cascadeSlot={cascadeSlot}
      randomOffset={randomOffset}
      isFrontWindow={isFrontWindow}
      isMaximized={isMaximized}
      isMinimizing={isMinimizing}
      minimizeOrigin={minimizeOrigin}
      isInsideSubfolder={isInsideSubfolder}
      hasFooter={Boolean(cta)}
      onBringToFront={() => onBringToFront?.(windowId)}
      onMinimize={handleMinimize}
      onMaximize={toggleMaximize}
      onClose={onClose}
      onMinimizeTransitionEnd={handleMinimizeTransitionEnd}
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
                      <ProjectCaption
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
                  {mediaItems.length > 0 ? (
                    mediaItems.map((item, index) => (
                      <MediaThumbnail
                        key={`${typeof item === 'string' ? item : item?.src || item?.coverSrc || item?.pages?.[0]}-${index}`}
                        item={item}
                        index={index}
                        count={mediaItems.length}
                        height={thumbTilePx}
                        onOpen={setLightboxIndex}
                        ariaLabel={
                          usesDetailedMediaHover
                            ? `Open ${project.title} item ${index + 1} of ${mediaItems.length}`
                            : `Open image ${index + 1} of ${mediaItems.length}`
                        }
                        detailedHover={usesDetailedMediaHover}
                      />
                    ))
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
                      <Folder
                        key={name}
                        label={name}
                        size="small"
                        bodyColor={bodyColor}
                        tabColor={tabColor}
                        onClick={() => onOpenSubfolder?.(name)}
                      />
                    ))}
                  </div>
                </div>
                {ctaFooter}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 w-full content-start">
                {innerFolderNames.map((name) => (
                  <Folder
                    key={name}
                    label={name}
                    size="small"
                    bodyColor={bodyColor}
                    tabColor={tabColor}
                    onClick={() => onOpenSubfolder?.(name)}
                  />
                ))}
              </div>
            )}

            <MediaViewer
              items={mediaItems}
              activeIndex={lightboxIndex}
              onActiveIndexChange={setLightboxIndex}
              onClose={closeLightbox}
              borderColor={borderColor}
              isMaximized={isMaximized}
              isMdUp={isMdUp}
              documentMaxWidthClass={documentMaxWidthClass}
              presentation={MediaPresentation}
            />
    </Window>
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
      <SectionTab
        label="PROJECTS"
        backgroundColor="#6A22FF"
        textColor="white"
        backingClassName="chrome-bg-90"
        zIndexClassName="z-50"
      />

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
                <Folder
                  key={folder.label}
                  ref={ref}
                  label={folder.label}
                  bodyColor={folder.bodyColor}
                  tabColor={folder.tabColor}
                  className={isPastNotes ? 'opacity-50' : ''}
                  onClick={onOpen}
                />
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
