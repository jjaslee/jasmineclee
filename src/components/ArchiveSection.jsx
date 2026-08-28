import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import AquaSyncMediaPresentation from './project/AquaSyncMediaPresentation'
import MediaViewer, { MediaThumbnail } from './project/MediaViewer'
import ProjectCaption from './project/ProjectCaption'
import Folder from './ui/Folder'
import Window, { WINDOW_CASCADE_OFFSET_PX } from './ui/Window'
import {
  ARCHIVE_CATEGORIES,
  KNOWLEDGE_CAPSULE,
  getArchiveItemById,
  getArchiveItemsByCategory,
} from '../data/projects'
import './archive-section.css'

const MOBILE_QUERY = '(max-width: 767px)'
const MAX_ARCHIVE_MEDIA_ITEMS = 5
const ARCHIVE_WINDOW_TOP_MARGIN_PX = 32
const ARCHIVE_WINDOW_SHADOW_ALLOWANCE_PX = 48
const ARCHIVE_MAXIMIZED_CASCADE_X_PX = 12
const ARCHIVE_MAXIMIZED_CASCADE_Y_PX = 10
const MEDIA_PRESENTATIONS = {
  aquasync: AquaSyncMediaPresentation,
}

function categoryWindowId(categoryId) {
  return `archive-category-${categoryId}`
}

function itemWindowId(itemId) {
  return `archive-item-${itemId}`
}

function archiveMediaItems(item) {
  if (item.archiveItemType === 'group') {
    return item.projects.map((project) => ({
      type: 'doc',
      coverSrc: project.thumbnail,
      pages: project.media,
      title: project.title,
      desc: `${project.media.length} photographs`,
    }))
  }

  return (item.media || []).slice(0, MAX_ARCHIVE_MEDIA_ITEMS)
}

function ArchiveProjectPreview({ item, category, isMaximized, isMdUp }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const mediaItems = useMemo(() => archiveMediaItems(item), [item])
  const MediaPresentation = MEDIA_PRESENTATIONS[item.mediaPresentation]
  const hasCaseStudy = Boolean(item.caseStudyRoute)
  const isCaseStudyComingSoon =
    item.caseStudyStatus === 'coming-soon' || item.id === 'cal-hacks'

  useEffect(() => setLightboxIndex(null), [item.id])

  return (
    <div
      className={`archive-project-preview ${
        hasCaseStudy
          ? 'archive-project-preview--with-cta'
          : 'archive-project-preview--without-cta'
      }`}
    >
      <div className="archive-project-preview__copy">
        <h3 className="type-heading archive-project-preview__title">{item.title}</h3>
        <ProjectCaption
          caption={item.summary}
          fixedHeight={isMdUp && hasCaseStudy}
          fillHeight={isMdUp && !hasCaseStudy}
          maxLines={10}
          unbounded={!isMdUp}
          boldFirstLine={item.summaryLeadBold}
        />
        {hasCaseStudy && !isCaseStudyComingSoon ? (
          <a className="archive-project-preview__cta type-ui" href={item.caseStudyRoute}>
            VIEW CASE STUDY ↗
          </a>
        ) : isCaseStudyComingSoon ? (
          <p className="type-ui mt-auto w-fit font-semibold tracking-[0.08em] text-black/65">
            {item.caseStudyStatusLabel || 'CASE STUDY COMING SOON'}
          </p>
        ) : null}
      </div>

      <MediaViewer
        items={mediaItems}
        activeIndex={lightboxIndex}
        onActiveIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        borderColor={category.borderColor}
        isMaximized={isMaximized}
        isMdUp={isMdUp}
        inlineFlow={!isMdUp}
        documentMaxWidthClass={
          item.mediaViewer?.documentMaxWidthClass || 'max-w-[min(780px,100%)]'
        }
        presentation={MediaPresentation}
      />

      <div className="archive-project-preview__media" aria-label={`${item.title} media`}>
        {mediaItems.length ? (
          mediaItems.map((media, index) => (
            <MediaThumbnail
              key={`${item.id}-${index}`}
              item={media}
              index={index}
              count={mediaItems.length}
              onOpen={setLightboxIndex}
              ariaLabel={`Open ${item.title} item ${index + 1} of ${mediaItems.length}`}
              detailedHover={Boolean(MediaPresentation) || item.archiveItemType === 'group'}
            />
          ))
        ) : (
          <p className="type-body text-black/55">No media available.</p>
        )}
      </div>
    </div>
  )
}

function PhotographySeriesPreview({ item, category, isMaximized, isMdUp }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const mediaItems = useMemo(() => item.media || [], [item.media])

  useEffect(() => setLightboxIndex(null), [item.id])

  return (
    <div className="archive-photography-preview">
      <h3 className="type-heading archive-photography-preview__title">{item.title}</h3>

      <div
        className="archive-photography-preview__grid"
        aria-label={`${item.title} photographs`}
      >
        {mediaItems.map((media, index) => (
          <div
            key={`${item.id}-${index}`}
            className="archive-photography-preview__tile"
          >
            <MediaThumbnail
              item={media}
              index={index}
              count={mediaItems.length}
              onOpen={setLightboxIndex}
              ariaLabel={`Open ${item.title} photograph ${index + 1} of ${mediaItems.length}`}
            />
          </div>
        ))}
      </div>

      <MediaViewer
        items={mediaItems}
        activeIndex={lightboxIndex}
        onActiveIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        borderColor={category.borderColor}
        isMaximized={isMaximized}
        isMdUp={isMdUp}
      />
    </div>
  )
}

function ArchiveFolderGrid({ items, category, folderRefs, onOpen }) {
  return (
    <div className="archive-category-window__grid">
      {items.map((archiveItem) => (
        <Folder
          key={archiveItem.id}
          ref={(node) => {
            if (node) folderRefs.current.set(archiveItem.id, node)
            else folderRefs.current.delete(archiveItem.id)
          }}
          label={archiveItem.title}
          size="small"
          bodyColor={archiveItem.bodyColor || category.bodyColor}
          tabColor={archiveItem.tabColor || category.tabColor}
          labelClassName="type-ui archive-project-folder-label"
          className="archive-project-folder focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          aria-label={`Open ${archiveItem.title} archive preview`}
          onClick={() => onOpen(archiveItem.id)}
        />
      ))}
    </div>
  )
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.matches('input, textarea, select') ||
      target.isContentEditable ||
      target.closest('[contenteditable]:not([contenteditable="false"])'),
  )
}

function KnowledgeCapsuleFile({ item }) {
  const label = item.className || item.label || item.title

  return (
    <a
      href={item.pdfUrl}
      target="_blank"
      rel="noreferrer"
      className="knowledge-capsule-file"
      aria-label={`${item.classCode} — ${item.className}, PDF (opens in a new tab)`}
      style={{
        '--capsule-file-body': KNOWLEDGE_CAPSULE.borderColor,
        '--capsule-file-fold': KNOWLEDGE_CAPSULE.tabColor,
      }}
    >
      <span className="knowledge-capsule-file__paper" aria-hidden="true">
        <svg
          className="knowledge-capsule-file__icon"
          viewBox="0 0 64 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="knowledge-capsule-file__page"
            d="M0 4Q0 0 4 0H46L64 22V76Q64 80 60 80H4Q0 80 0 76V4Z"
          />
          <path className="knowledge-capsule-file__fold" d="M46 0V18Q46 22 50 22H64Z" />
        </svg>
        <span className="knowledge-capsule-file__format type-meta">PDF</span>
      </span>
      <span className="knowledge-capsule-file__label type-ui archive-project-folder-label">
        {label}
      </span>
    </a>
  )
}

function KnowledgeCapsulePreview() {
  const capsuleFiles = KNOWLEDGE_CAPSULE.items.filter(
    (item) => item.type === 'pdf' && item.pdfUrl,
  )

  return (
    <div className="archive-category-window">
      <h3 className="sr-only">{KNOWLEDGE_CAPSULE.title}</h3>
      {capsuleFiles.length ? (
        <>
          <p className="type-meta archive-category-window__meta">
            {String(capsuleFiles.length).padStart(2, '0')} ARCHIVED{' '}
            {capsuleFiles.length === 1 ? 'ITEM' : 'ITEMS'}
          </p>
          <div className="archive-category-window__grid knowledge-capsule-window__grid">
            {capsuleFiles.map((item) => (
              <KnowledgeCapsuleFile key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <p className="type-body knowledge-capsule-window__empty">
          No capsules indexed yet.
        </p>
      )}
    </div>
  )
}

export default function ArchiveSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isKnowledgeCapsuleRevealed, setIsKnowledgeCapsuleRevealed] = useState(false)
  const [openWindows, setOpenWindows] = useState([])
  const [windowStack, setWindowStack] = useState([])
  const [cascadeOrder, setCascadeOrder] = useState([])
  const [maximizedIds, setMaximizedIds] = useState([])
  const [minimizingIds, setMinimizingIds] = useState([])
  const [archiveWindowBoundsHeight, setArchiveWindowBoundsHeight] = useState(0)
  const categoryFolderRefs = useRef(new Map())
  const itemFolderRefs = useRef(new Map())
  const archiveWindowRefs = useRef(new Map())
  const knowledgeCapsuleFolderRef = useRef(null)
  const archiveRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const sync = () => setIsMobile(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const toggleKnowledgeCapsuleOnShift = (event) => {
      if (event.key !== 'Shift' || event.repeat || isEditableTarget(event.target)) return
      if (!archiveRef.current || archiveRef.current.closest('[hidden]')) return
      setIsKnowledgeCapsuleRevealed((isRevealed) => !isRevealed)
    }

    window.addEventListener('keydown', toggleKnowledgeCapsuleOnShift)
    return () => window.removeEventListener('keydown', toggleKnowledgeCapsuleOnShift)
  }, [])

  useEffect(() => {
    if (!isMobile || windowStack.length < 2) return
    const frontWindowId = windowStack[windowStack.length - 1]
    setOpenWindows((windows) => windows.filter((entry) => entry.windowId === frontWindowId))
    setWindowStack([frontWindowId])
    setCascadeOrder([frontWindowId])
    setMaximizedIds((ids) => ids.filter((id) => id === frontWindowId))
    setMinimizingIds((ids) => ids.filter((id) => id === frontWindowId))
  }, [isMobile, windowStack])

  const bringToFront = (windowId) => {
    setWindowStack((ids) => [...ids.filter((id) => id !== windowId), windowId])
  }

  const openWindow = (entry) => {
    setMinimizingIds((ids) => ids.filter((id) => id !== entry.windowId))
    if (isMobile) {
      setOpenWindows([entry])
      setWindowStack([entry.windowId])
      setCascadeOrder([entry.windowId])
      setMaximizedIds((ids) => ids.filter((id) => id === entry.windowId))
      return
    }

    setOpenWindows((windows) =>
      windows.some(({ windowId }) => windowId === entry.windowId)
        ? windows
        : [...windows, entry],
    )
    setCascadeOrder((ids) =>
      ids.includes(entry.windowId) ? ids : [...ids, entry.windowId],
    )
    bringToFront(entry.windowId)
  }

  const navigateWithinCategory = (windowId, itemId) => {
    setOpenWindows((windows) =>
      windows.map((entry) => {
        if (entry.windowId !== windowId || entry.kind !== 'category') return entry
        const navigation = entry.navigation?.length
          ? entry.navigation
          : [{ kind: 'category', entityId: entry.entityId }]
        return {
          ...entry,
          navigation: [...navigation, { kind: 'item', entityId: itemId }],
        }
      }),
    )
    bringToFront(windowId)
  }

  const navigateBackWithinCategory = (windowId) => {
    setOpenWindows((windows) =>
      windows.map((entry) => {
        if (
          entry.windowId !== windowId ||
          entry.kind !== 'category' ||
          !entry.navigation ||
          entry.navigation.length < 2
        ) {
          return entry
        }
        return { ...entry, navigation: entry.navigation.slice(0, -1) }
      }),
    )
    bringToFront(windowId)
  }

  const handleTopLevelFolderClick = (entry) => {
    const existingWindow = openWindows.find(
      (window) => window.windowId === entry.windowId,
    )
    if (!existingWindow) {
      openWindow(entry)
      return
    }

    const isFrontmost = windowStack[windowStack.length - 1] === entry.windowId
    if (!isFrontmost) {
      bringToFront(entry.windowId)
      return
    }

    if (existingWindow.kind === 'category' && existingWindow.navigation?.length > 1) {
      navigateBackWithinCategory(entry.windowId)
      return
    }

    bringToFront(entry.windowId)
  }

  const openCategory = (categoryId) => {
    handleTopLevelFolderClick({
      windowId: categoryWindowId(categoryId),
      kind: 'category',
      entityId: categoryId,
      navigation: [{ kind: 'category', entityId: categoryId }],
    })
  }

  const openKnowledgeCapsule = () => {
    handleTopLevelFolderClick({
      windowId: itemWindowId(KNOWLEDGE_CAPSULE.id),
      kind: 'capsule',
      entityId: KNOWLEDGE_CAPSULE.id,
    })
  }

  const cascadeSlotFor = (windowId) =>
    Math.max(0, cascadeOrder.indexOf(windowId)) % 4

  const maxCascadeSlot = openWindows.reduce(
    (maximum, entry) => Math.max(maximum, cascadeSlotFor(entry.windowId)),
    0,
  )
  const cascadeExtent = isMobile
    ? 0
    : maxCascadeSlot * WINDOW_CASCADE_OFFSET_PX

  useLayoutEffect(() => {
    if (isMobile || !openWindows.length) {
      setArchiveWindowBoundsHeight(0)
      return undefined
    }

    let animationFrame = 0
    const measureWindowBounds = () => {
      const nextHeight = openWindows.reduce((maximum, entry) => {
        const windowNode = archiveWindowRefs.current.get(entry.windowId)
        if (!windowNode) return maximum
        const cascadeOffset =
          cascadeSlotFor(entry.windowId) *
          (maximizedIds.includes(entry.windowId)
            ? ARCHIVE_MAXIMIZED_CASCADE_Y_PX
            : WINDOW_CASCADE_OFFSET_PX)
        const windowHeight = windowNode.getBoundingClientRect().height
        return Math.max(
          maximum,
          Math.ceil(
            ARCHIVE_WINDOW_TOP_MARGIN_PX +
              cascadeOffset +
              windowHeight +
              ARCHIVE_WINDOW_SHADOW_ALLOWANCE_PX,
          ),
        )
      }, 0)
      setArchiveWindowBoundsHeight((current) =>
        current === nextHeight ? current : nextHeight,
      )
    }

    const scheduleMeasurement = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(measureWindowBounds)
    }
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(scheduleMeasurement)

    openWindows.forEach((entry) => {
      const windowNode = archiveWindowRefs.current.get(entry.windowId)
      if (windowNode) resizeObserver?.observe(windowNode)
    })
    window.addEventListener('resize', scheduleMeasurement)
    scheduleMeasurement()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', scheduleMeasurement)
    }
  }, [cascadeOrder, isMobile, maximizedIds, openWindows])

  useLayoutEffect(() => {
    const archiveNode = archiveRef.current
    const workspaceNode = archiveNode?.closest('.homepage-footer-reveal-workspace')
    if (!archiveNode || !workspaceNode) return undefined

    let animationFrame = 0
    const measureWorkspaceHeight = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        if (archiveNode.closest('[hidden]')) return
        const workspaceHeight = workspaceNode.getBoundingClientRect().height
        if (workspaceHeight > 0) {
          workspaceNode.style.setProperty(
            '--archive-footer-workspace-height',
            `${workspaceHeight.toFixed(3)}px`,
          )
        }
      })
    }
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measureWorkspaceHeight)

    resizeObserver?.observe(workspaceNode)
    resizeObserver?.observe(archiveNode)
    window.addEventListener('resize', measureWorkspaceHeight)
    measureWorkspaceHeight()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', measureWorkspaceHeight)
      workspaceNode.style.removeProperty('--archive-footer-workspace-height')
    }
  }, [])

  const closeWindow = (entry) => {
    const { windowId } = entry
    setOpenWindows((windows) => windows.filter((window) => window.windowId !== windowId))
    setWindowStack((ids) => ids.filter((id) => id !== windowId))
    setCascadeOrder((ids) => ids.filter((id) => id !== windowId))
    setMaximizedIds((ids) => ids.filter((id) => id !== windowId))
    setMinimizingIds((ids) => ids.filter((id) => id !== windowId))

    const focusTarget =
      entry.kind === 'category'
        ? categoryFolderRefs.current.get(entry.entityId)
        : knowledgeCapsuleFolderRef.current
    focusTarget?.focus()
  }

  return (
    <section
      ref={archiveRef}
      id="archive"
      aria-labelledby="archive-heading"
      className="archive-section relative z-40"
    >
      <h2 id="archive-heading" className="sr-only">
        Archive
      </h2>

      <div className="archive-section__inner">
        <div className="archive-knowledge-capsule">
          <button
            type="button"
            className="archive-knowledge-capsule__hint type-meta"
            aria-label={
              isKnowledgeCapsuleRevealed
                ? 'Hide Knowledge Capsule'
                : 'Reveal Knowledge Capsule'
            }
            aria-controls="archive-knowledge-capsule-folder"
            aria-expanded={isKnowledgeCapsuleRevealed}
            onClick={() =>
              setIsKnowledgeCapsuleRevealed((isRevealed) => !isRevealed)
            }
          >
            hint: press shift
          </button>
        </div>

        <div
          className={`archive-category-grid ${
            isKnowledgeCapsuleRevealed ? 'archive-category-grid--with-capsule' : ''
          }`}
          aria-live="polite"
        >
          {ARCHIVE_CATEGORIES.map((category) => {
            const windowId = categoryWindowId(category.id)
            const isOpen = openWindows.some((entry) => entry.windowId === windowId)
            return (
              <Folder
                key={category.id}
                ref={(node) => {
                  if (node) categoryFolderRefs.current.set(category.id, node)
                  else categoryFolderRefs.current.delete(category.id)
                }}
                label={category.label}
                bodyColor={category.bodyColor}
                tabColor={category.tabColor}
                labelClassName="type-ui archive-folder-label"
                className="archive-folder focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
                aria-label={`Open ${category.title} archive category`}
                aria-expanded={isOpen}
                aria-controls={isOpen ? windowId : undefined}
                onClick={() => openCategory(category.id)}
              />
            )
          })}

          {isKnowledgeCapsuleRevealed ? (
            <Folder
              id="archive-knowledge-capsule-folder"
              ref={knowledgeCapsuleFolderRef}
              label={KNOWLEDGE_CAPSULE.label}
              bodyColor={KNOWLEDGE_CAPSULE.bodyColor}
              tabColor={KNOWLEDGE_CAPSULE.tabColor}
              labelClassName="type-ui archive-folder-label"
              className="archive-folder archive-knowledge-capsule__folder focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
            aria-label={`Open ${KNOWLEDGE_CAPSULE.title}`}
            aria-expanded={openWindows.some(
              (entry) => entry.windowId === itemWindowId(KNOWLEDGE_CAPSULE.id),
              )}
              aria-controls={
                openWindows.some(
                  (entry) => entry.windowId === itemWindowId(KNOWLEDGE_CAPSULE.id),
                )
                  ? itemWindowId(KNOWLEDGE_CAPSULE.id)
                  : undefined
              }
              onClick={openKnowledgeCapsule}
            />
          ) : null}
        </div>

        {openWindows.length ? (
          <div
            className={`archive-windows ${isMobile ? 'archive-windows--mobile' : ''}`}
            style={{
              '--archive-cascade-extent': `${cascadeExtent}px`,
              '--archive-window-bounds-height': `${archiveWindowBoundsHeight}px`,
            }}
            aria-live="polite"
          >
            {openWindows.map((entry) => {
              const isKnowledgeCapsule = entry.kind === 'capsule'
              const navigation =
                entry.kind === 'category' && entry.navigation?.length
                  ? entry.navigation
                  : [{ kind: 'category', entityId: entry.entityId }]
              const currentLocation = navigation[navigation.length - 1]
              const category = isKnowledgeCapsule
                ? KNOWLEDGE_CAPSULE
                : ARCHIVE_CATEGORIES.find(
                    (candidate) => candidate.id === entry.entityId,
                  )
              const item =
                !isKnowledgeCapsule && currentLocation.kind === 'item'
                  ? getArchiveItemById(currentLocation.entityId)
                  : null
              if (!category || (currentLocation.kind === 'item' && !item)) return null

              const categoryItems =
                !isKnowledgeCapsule && currentLocation.kind === 'category'
                  ? getArchiveItemsByCategory(category.id)
                  : []
              const stackIndex = windowStack.indexOf(entry.windowId)
              const isMaximized = maximizedIds.includes(entry.windowId)
              const isMinimizing = minimizingIds.includes(entry.windowId)
              const title = item?.title || category.title
              const cascadeSlot = cascadeSlotFor(entry.windowId)

              return (
                <div id={entry.windowId} key={entry.windowId}>
                  <Window
                    windowRef={(node) => {
                      if (node) archiveWindowRefs.current.set(entry.windowId, node)
                      else archiveWindowRefs.current.delete(entry.windowId)
                    }}
                    title={title}
                    displayTitle={title}
                    iconType={item?.iconType || category.iconType}
                    borderColor={category.borderColor}
                    stackIndex={stackIndex}
                    cascadeSlot={cascadeSlot}
                    cascadeOffsetX={
                      isMaximized
                        ? ARCHIVE_MAXIMIZED_CASCADE_X_PX
                        : WINDOW_CASCADE_OFFSET_PX
                    }
                    cascadeOffsetY={
                      isMaximized
                        ? ARCHIVE_MAXIMIZED_CASCADE_Y_PX
                        : WINDOW_CASCADE_OFFSET_PX
                    }
                    isFrontWindow={stackIndex === windowStack.length - 1}
                    isMaximized={isMaximized}
                    isMinimizing={isMinimizing}
                    variant="preview"
                    layoutMode={isMobile ? 'flow' : 'stacked'}
                    frameClassName="archive-window-frame"
                    lockInactiveContent
                    onBringToFront={() => bringToFront(entry.windowId)}
                    onMinimize={() =>
                      setMinimizingIds((ids) =>
                        ids.includes(entry.windowId) ? ids : [...ids, entry.windowId],
                      )
                    }
                    onMaximize={() =>
                      setMaximizedIds((ids) =>
                        ids.includes(entry.windowId)
                          ? ids.filter((id) => id !== entry.windowId)
                          : [...ids, entry.windowId],
                      )
                    }
                    onClose={() => closeWindow(entry)}
                    onMinimizeTransitionEnd={(event) => {
                      if (
                        event.target === event.currentTarget &&
                        event.propertyName === 'transform' &&
                        minimizingIds.includes(entry.windowId)
                      ) {
                        closeWindow(entry)
                      }
                    }}
                  >
                    {!isKnowledgeCapsule && currentLocation.kind === 'category' ? (
                      <div className="archive-category-window">
                        <h3 className="sr-only">{category.title}</h3>
                        <p className="type-meta archive-category-window__meta">
                          {String(categoryItems.length).padStart(2, '0')} ARCHIVED{' '}
                          {categoryItems.length === 1 ? 'ITEM' : 'ITEMS'}
                        </p>
                        <ArchiveFolderGrid
                          items={categoryItems}
                          category={category}
                          folderRefs={itemFolderRefs}
                          onOpen={(itemId) =>
                            navigateWithinCategory(entry.windowId, itemId)
                          }
                        />
                      </div>
                    ) : isKnowledgeCapsule ? (
                      <KnowledgeCapsulePreview />
                    ) : item.archiveItemType === 'group' ? (
                      <div className="archive-category-window">
                        <button
                          type="button"
                          className="archive-project-window__back type-ui"
                          onClick={() => navigateBackWithinCategory(entry.windowId)}
                        >
                          ← Back to {category.title}
                        </button>
                        <h3 className="sr-only">{item.title}</h3>
                        {!item.hideArchiveCount ? (
                          <p className="type-meta archive-category-window__meta">
                            {String(item.projects.length).padStart(2, '0')} ARCHIVED{' '}
                            {item.projects.length === 1 ? 'ITEM' : 'ITEMS'}
                          </p>
                        ) : null}
                        <ArchiveFolderGrid
                          items={item.projects}
                          category={category}
                          folderRefs={itemFolderRefs}
                          onOpen={(itemId) =>
                            navigateWithinCategory(entry.windowId, itemId)
                          }
                        />
                      </div>
                    ) : (
                      <div
                        className={`archive-project-window ${
                          item.archivePresentation === 'photography-series'
                            ? 'archive-project-window--photography'
                            : 'archive-project-window--standard'
                        }`}
                      >
                        <button
                          type="button"
                          className="archive-project-window__back type-ui"
                          onClick={() => navigateBackWithinCategory(entry.windowId)}
                        >
                          ← Back to{' '}
                          {navigation.length > 2
                            ? getArchiveItemById(
                                navigation[navigation.length - 2].entityId,
                              )?.title || category.title
                            : category.title}
                        </button>
                        {item.archivePresentation === 'photography-series' ? (
                          <PhotographySeriesPreview
                            item={item}
                            category={category}
                            isMaximized={isMaximized}
                            isMdUp={!isMobile}
                          />
                        ) : (
                          <ArchiveProjectPreview
                            item={item}
                            category={category}
                            isMaximized={isMaximized}
                            isMdUp={!isMobile}
                          />
                        )}
                      </div>
                    )}
                  </Window>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
