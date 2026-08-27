import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export const MEDIA_NAV_ARROW_CLASS =
  'text-3xl sm:text-4xl font-light leading-none select-none hover:opacity-80 transition drop-shadow px-2 py-2 cursor-pointer'

export const MEDIA_CLOSE_BUTTON_CLASS =
  'inline-flex size-12 shrink-0 items-center justify-center sm:size-14 rounded-md text-2xl sm:text-3xl font-light leading-none select-none hover:opacity-80 transition drop-shadow cursor-pointer'

const MEDIA_OVERLAY_CLASS =
  'absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center cursor-default p-3 sm:p-5 overflow-hidden select-none'

const MEDIA_RIGHT_RAIL_CLASS =
  'absolute top-0 right-0 bottom-0 z-[60] flex w-10 min-w-0 flex-col items-center pr-0.5 sm:w-14 sm:pr-1 pt-2 sm:pt-3'

function normalizeMediaItem(item) {
  return typeof item === 'string' ? { type: 'image', src: item } : item || {}
}

export function mediaCoverSource(item) {
  const media = normalizeMediaItem(item)
  if (media.type === 'doc') return media.coverSrc || media.pages?.[0] || null
  if (media.type === 'phoneScrollImage' || media.type === 'scrollImage') {
    return media.coverSrc || media.src || null
  }
  return media.src || null
}

export function MediaThumbnail({
  item,
  index,
  count,
  height,
  onOpen,
  ariaLabel,
  detailedHover = false,
}) {
  const media = normalizeMediaItem(item)
  const coverSrc = mediaCoverSource(item)
  if (!coverSrc) return null

  const hoverCopy = media.title || media.desc ? { title: media.title, desc: media.desc } : null
  const showHover = Boolean(hoverCopy)
  const buttonClassName = detailedHover
    ? 'group relative w-full rounded-lg overflow-hidden bg-black/5 border border-black/10 group-hover:border-transparent cursor-pointer'
    : `group relative w-full rounded-lg overflow-hidden bg-black/5 border border-black/10 hover:brightness-[0.96] cursor-pointer ${
        showHover ? 'group-hover:border-transparent' : ''
      }`
  const hoverMediaClass =
    detailedHover || showHover
      ? 'group-hover:scale-[1.06] group-hover:blur-[2px] group-hover:brightness-[0.92]'
      : 'group-hover:scale-[1.08]'

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={() => onOpen?.(index)}
      aria-label={ariaLabel || `Open image ${index + 1} of ${count}`}
      onContextMenu={(event) => event.preventDefault()}
      style={height ? { height: `${height}px` } : undefined}
    >
      {media.type === 'video' ? (
        <video
          src={coverSrc}
          className={`w-full h-full object-cover select-none transition-transform duration-200 ease-out ${hoverMediaClass}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onMouseDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        />
      ) : (
        <img
          src={coverSrc}
          alt=""
          className={`w-full h-full object-cover select-none transition-transform duration-200 ease-out ${hoverMediaClass}`}
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
          draggable={false}
        />
      )}
      {hoverCopy ? (
        <div
          className={
            detailedHover
              ? 'absolute -inset-px flex items-center justify-center overflow-hidden rounded-[9px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100'
              : 'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100'
          }
        >
          <div
            className={
              detailedHover
                ? 'absolute inset-0 overflow-hidden rounded-[9px] bg-white/55 backdrop-blur-[6px]'
                : 'absolute -inset-px overflow-hidden rounded-[9px] bg-white/55 backdrop-blur-[6px]'
            }
          />
          <div className="relative px-3 text-center">
            <div className="text-black/90 font-semibold text-sm">{hoverCopy.title}</div>
            <div className="text-black/70 text-xs mt-1">{hoverCopy.desc}</div>
          </div>
        </div>
      ) : null}
    </button>
  )
}

export function DocumentMedia({
  pages = [],
  maxWidthClass = 'max-w-[min(780px,100%)]',
  isMaximized = false,
  isMdUp = true,
}) {
  const [viewportHeight, setViewportHeight] = useState(null)
  const [pageMaxHeight, setPageMaxHeight] = useState(null)
  const mediaRef = useRef(null)
  const scrollRef = useRef(null)
  const firstPageRef = useRef(null)
  const peekPx = isMdUp ? 52 : 40

  const computeLayout = () => {
    const mediaElement = mediaRef.current
    const firstElement = firstPageRef.current
    if (!mediaElement || !firstElement) return

    const availableHeight = Math.max(0, mediaElement.getBoundingClientRect().height)
    if (!availableHeight) return

    const nextPageMaxHeight = Math.floor(availableHeight * 0.86)
    setPageMaxHeight((previous) =>
      previous === nextPageMaxHeight ? previous : nextPageMaxHeight,
    )

    const firstHeight = Math.max(0, firstElement.getBoundingClientRect().height)
    if (!firstHeight) return

    const desired = Math.min(firstHeight + peekPx, Math.floor(availableHeight))
    const nextViewportHeight = Math.max(firstHeight, Math.floor(desired))
    setViewportHeight((previous) =>
      previous === nextViewportHeight ? previous : nextViewportHeight,
    )
  }

  useLayoutEffect(() => {
    setViewportHeight(null)
    setPageMaxHeight(null)
    requestAnimationFrame(() => computeLayout())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, isMaximized, isMdUp])

  useEffect(() => {
    const onResize = () => requestAnimationFrame(() => computeLayout())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, isMaximized, isMdUp])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    requestAnimationFrame(() => {
      element.scrollTop = 0
    })
  }, [pages])

  return (
    <div ref={mediaRef} className="w-full h-full flex items-start justify-center">
      <div
        ref={scrollRef}
        className={`relative w-full ${maxWidthClass} overflow-auto rounded-md cursor-default`}
        style={{ height: viewportHeight ? `${viewportHeight}px` : '100%' }}
        onMouseDown={(event) => event.stopPropagation()}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="mx-auto w-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4">
          {pages.map((src, index) => (
            <div
              key={src}
              ref={index === 0 ? firstPageRef : null}
              className="w-full flex justify-center"
            >
              <img
                src={src}
                alt=""
                className="block max-w-full w-auto h-auto rounded-md bg-white/5"
                style={pageMaxHeight ? { maxHeight: `${pageMaxHeight}px` } : undefined}
                onLoad={() => requestAnimationFrame(() => computeLayout())}
                onContextMenu={(event) => event.preventDefault()}
                onDragStart={(event) => event.preventDefault()}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PhoneScrollMedia({ screenSrc, isMaximized = false }) {
  const outerRef = useRef(null)
  const borderRef = useRef(null)

  useLayoutEffect(() => {
    const applyFit = () => {
      const outer = outerRef.current
      const border = borderRef.current
      if (!outer || !border) return

      const rect = outer.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      let height = rect.height
      let width = height * (9 / 19.5)
      if (width > rect.width) {
        width = rect.width
        height = width * (19.5 / 9)
      }

      border.style.width = `${Math.floor(width)}px`
      border.style.height = `${Math.floor(height)}px`
      border.style.maxWidth = '100%'
      border.style.maxHeight = '100%'
    }

    const outer = outerRef.current
    let resizeObserver
    if (outer && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => requestAnimationFrame(applyFit))
      resizeObserver.observe(outer)
    }
    requestAnimationFrame(applyFit)

    return () => resizeObserver?.disconnect()
  }, [screenSrc, isMaximized])

  return (
    <div
      className="relative w-full h-full min-h-0 flex items-center justify-center"
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        ref={outerRef}
        className="w-full h-full min-h-0 min-w-0 max-h-full flex items-center justify-center p-1"
      >
        <div
          ref={borderRef}
          className="border-[7px] sm:border-[9px] border-black rounded-[32px] shadow-xl bg-white overflow-hidden"
        >
          <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            {screenSrc ? (
              <img
                src={screenSrc}
                alt=""
                className="block w-full h-auto select-none"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onContextMenu={(event) => event.preventDefault()}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function DefaultMediaPresentation({
  item,
  count,
  borderColor,
  onClose,
  onPrevious,
  onNext,
  isMaximized,
  isMdUp,
  documentMaxWidthClass,
}) {
  const media = normalizeMediaItem(item)

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {media.type === 'doc' ? (
        <DocumentMedia
          pages={media.pages || []}
          maxWidthClass={documentMaxWidthClass}
          isMaximized={isMaximized}
          isMdUp={isMdUp}
        />
      ) : media.type === 'scrollImage' ? (
        <div
          className="h-full w-full flex items-center justify-center"
          onMouseDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
        >
          <div className="w-full max-w-[min(520px,100%)] h-full max-h-full border-[10px] border-black rounded-[28px] bg-white overflow-hidden shadow-xl">
            <div className="h-full w-full overflow-y-auto overflow-x-hidden">
              {media.src ? (
                <img
                  src={media.src}
                  alt=""
                  className="block w-full h-auto select-none"
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  onContextMenu={(event) => event.preventDefault()}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : media.type === 'phoneScrollImage' ? (
        <PhoneScrollMedia screenSrc={media.screenSrc} isMaximized={isMaximized} />
      ) : media.type === 'video' ? (
        <div className="flex h-full w-full items-center justify-center px-4 py-4 sm:px-8 sm:py-6">
          <video
            src={media.src || undefined}
            className="block object-contain rounded-md cursor-default"
            style={{ maxHeight: '100%', maxWidth: 'calc(100% - 98px)' }}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="metadata"
            onMouseDown={(event) => event.stopPropagation()}
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>
      ) : (
        <div
          className={`relative flex h-full w-full items-center justify-center ${
            media.pdfHref ? 'px-2 py-2 sm:px-4 sm:py-4' : 'px-6 py-6 sm:px-10 sm:py-8'
          }`}
        >
          {media.pdfHref ? (
            <a
              href={media.pdfHref}
              target="_blank"
              rel="noreferrer"
              className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-black/80 backdrop-blur hover:bg-white/95"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              View as PDF
            </a>
          ) : null}
          <img
            src={media.src}
            alt=""
            className="block object-contain rounded-md cursor-default"
            style={{
              maxHeight: media.pdfHref ? '96%' : '88%',
              maxWidth: media.pdfHref ? 'calc(96% - 98px)' : 'calc(88% - 98px)',
            }}
            onMouseDown={(event) => event.stopPropagation()}
            onContextMenu={(event) => event.preventDefault()}
            onDragStart={(event) => event.preventDefault()}
            draggable={false}
          />
        </div>
      )}

      {count > 1 ? (
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Previous image"
          className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 ${MEDIA_NAV_ARROW_CLASS}`}
          style={{ color: borderColor }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {'<'}
        </button>
      ) : null}

      <div className={MEDIA_RIGHT_RAIL_CLASS} onMouseDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className={MEDIA_CLOSE_BUTTON_CLASS}
          style={{ color: borderColor }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          ×
        </button>
        {count > 1 ? (
          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className={MEDIA_NAV_ARROW_CLASS}
              style={{ color: borderColor }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {'>'}
            </button>
          </div>
        ) : (
          <div className="min-h-0 flex-1" aria-hidden />
        )}
      </div>
    </div>
  )
}

export default function MediaViewer({
  items = [],
  activeIndex,
  onActiveIndexChange,
  onClose,
  borderColor,
  isMaximized = false,
  isMdUp = true,
  documentMaxWidthClass = 'max-w-[min(780px,100%)]',
  presentation: Presentation = DefaultMediaPresentation,
}) {
  const count = items.length
  const isOpen = activeIndex != null && count > 0

  const goPrevious = () => {
    if (!count) return
    onActiveIndexChange?.((activeIndex - 1 + count) % count)
  }

  const goNext = () => {
    if (!count) return
    onActiveIndexChange?.((activeIndex + 1) % count)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
      if (event.key === 'ArrowLeft') goPrevious()
      if (event.key === 'ArrowRight') goNext()

      if ((event.metaKey || event.ctrlKey) && typeof event.key === 'string') {
        const key = event.key.toLowerCase()
        if (key === 's' || key === 'c' || key === 'x' || key === 'p' || key === 'u') {
          event.preventDefault()
          event.stopPropagation()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex, count])

  if (!isOpen) return null

  return (
    <div role="presentation" className={MEDIA_OVERLAY_CLASS} onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
        className="relative w-full h-full max-w-[min(1100px,100%)] max-h-full cursor-default"
        onContextMenu={(event) => event.preventDefault()}
      >
        <Presentation
          item={items[activeIndex]}
          count={count}
          borderColor={borderColor}
          onClose={onClose}
          onPrevious={goPrevious}
          onNext={goNext}
          isMaximized={isMaximized}
          isMdUp={isMdUp}
          documentMaxWidthClass={documentMaxWidthClass}
        />
      </div>
    </div>
  )
}
