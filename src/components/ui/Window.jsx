const MINIMIZE_DURATION_MS = 350
export const WINDOW_CASCADE_OFFSET_PX = 20

export function TitleBarIcon({ type }) {
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
        <div className="absolute -top-0.5 left-0.5 bg-black" style={{ width: '10px', height: '4px' }} />
        <div className="absolute inset-y-0.5 right-1.5 w-2 h-2 rounded-full paper-bg" />
      </div>
    )
  }
  if (type === 'pen') {
    return (
      <div className="relative w-6 h-5 flex items-center justify-center">
        <svg viewBox="0 0 35 35" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-black">
          <rect x="6.36" y="21.21" width="30" height="10" transform="rotate(-45 6.36 21.21)" />
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

export default function Window({
  windowRef,
  title,
  displayTitle = title,
  titleMuted = false,
  iconType,
  borderColor,
  stackIndex = 0,
  cascadeSlot = 0,
  cascadeOffsetX = WINDOW_CASCADE_OFFSET_PX,
  cascadeOffsetY = WINDOW_CASCADE_OFFSET_PX,
  randomOffset = { x: 0, y: 0 },
  isFrontWindow = false,
  isMaximized = false,
  isMinimizing = false,
  minimizeOrigin = null,
  isInsideSubfolder = false,
  hasFooter = false,
  variant = 'default',
  layoutMode = 'stacked',
  frameClassName = '',
  lockInactiveContent = false,
  onBringToFront,
  onMinimize,
  onMaximize,
  onClose,
  onMinimizeTransitionEnd,
  children,
}) {
  const layer = Math.max(0, stackIndex)
  const slot = Math.max(0, cascadeSlot)
  const offsetX = slot * cascadeOffsetX + randomOffset.x
  const offsetY = slot * cascadeOffsetY + randomOffset.y
  const isPreview = variant === 'preview'
  const isFlowLayout = layoutMode === 'flow'

  const handleWrapperClick = (event) => {
    const target = event.target
    const closestButtonLabel =
      target instanceof HTMLElement ? target.closest('button')?.getAttribute('aria-label') || null : null
    if (!closestButtonLabel) onBringToFront?.()
  }

  return (
    <div
      role="presentation"
      className={`pointer-events-none transition-all duration-300 ease-out cursor-default ${
        isFlowLayout ? 'relative' : 'absolute top-0 left-0 right-0'
      }`}
      style={{
        zIndex: 30 + layer,
        transform: isFlowLayout ? undefined : `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      <div
        className={`mx-auto transition-all duration-300 ease-out ${frameClassName} ${
          isPreview
            ? isMaximized
              ? 'mt-8 w-[calc(100%-1rem)] sm:w-[min(94vw,1200px)]'
              : 'mt-8 w-[calc(100%-2rem)] sm:w-[min(88vw,1080px)]'
            : isMaximized
              ? 'mt-16 w-[min(78vw,920px)] max-w-none px-4'
              : 'mt-16 w-[min(80vw,1400px)] max-w-none px-6'
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
            ...(isMinimizing && { transform: 'scale(0)', opacity: 0 }),
          }}
          onClick={handleWrapperClick}
          onTransitionEnd={onMinimizeTransitionEnd}
        >
          {!isFrontWindow ? (
            <button
              type="button"
              className="absolute inset-0 z-[70] cursor-default bg-transparent"
              aria-label={`Bring ${title} window to front`}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                onBringToFront?.()
              }}
            />
          ) : null}
          <div
            className={`paper-bg font-poppins border-[4px] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
              isMaximized ? 'min-h-[380px]' : ''
            }`}
            inert={lockInactiveContent && !isFrontWindow ? '' : undefined}
            aria-hidden={lockInactiveContent && !isFrontWindow ? 'true' : undefined}
            style={{
              borderColor,
              clipPath: 'polygon(0 0, 26% 0, 30% -14%, 62% -14%, 66% 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            <div className="paper-bg px-5 py-3 flex items-center justify-between gap-4 border-b border-black/10 shrink-0">
              <div className="flex items-center gap-3">
                <TitleBarIcon type={iconType} />
                <span className="text-black font-medium text-sm" style={titleMuted ? { opacity: 0.5 } : undefined}>
                  {displayTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onMinimize}
                  className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110 transition"
                  aria-label={`Minimize ${title} window`}
                />
                <button
                  type="button"
                  onClick={onMaximize}
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
              className={
                isPreview
                  ? 'relative paper-bg-muted p-4 sm:p-6 md:p-8 flex min-h-0'
                  : `relative paper-bg-muted px-8 pb-8 pt-5 flex ${
                      hasFooter
                        ? 'w-full min-h-0 flex-col'
                        : isInsideSubfolder
                          ? 'items-start'
                          : 'items-center'
                    } ${
                      isMaximized
                        ? isInsideSubfolder
                          ? 'flex-1 h-[min(66vh,560px)]'
                          : 'flex-1 h-[min(56vh,500px)]'
                        : isInsideSubfolder
                          ? 'flex-1 h-[min(72vh,660px)]'
                          : 'flex-1 h-[min(56vh,520px)]'
                    }`
              }
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
