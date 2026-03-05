import { useState, useRef, useEffect } from 'react'

const folders = [
  { label: 'PHOTOS', bodyColor: '#C96AED', tabColor: '#A825D9' },
  { label: 'DESIGN', bodyColor: '#50C0FA', tabColor: '#1688C4' },
  { label: 'TECHNICALS', bodyColor: '#C0F000', tabColor: '#8EAC12' },
]

const PHOTOS_INNER_FOLDERS = ['animālis', 'sēcūdēre', 'sōlītūdō', 'havaia', 'pacificus']
const DESIGN_INNER_FOLDERS = [
  'Digital Drawing',
  'Cal Hacks',
  'Visual Communication',
  'CSSA',
  'Web',
  'Lazy Day Lines',
  'MISC Mediums',
]
const TECHNICALS_INNER_FOLDERS = [
  'Find the Flower',
  'Ngordnet',
  'Fabrication and Prototyping',
  'Mechatronic Goniometer',
]

const MINIMIZE_DURATION_MS = 350

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
  if (type === 'camera') {
    return (
      <div className="relative w-6 h-3 bg-black">
        <div
          className="absolute -top-0.5 left-0.5 bg-black"
          style={{ width: '10px', height: '4px' }}
        />
        <div className="absolute inset-y-0.5 right-1.5 w-2 h-2 rounded-full bg-white" />
      </div>
    )
  }
  if (type === 'pen') {
    return (
      <div className="relative w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-black">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 15L13 18l5-5z" />
        </svg>
      </div>
    )
  }
  if (type === 'monitor') {
    return (
      <div className="relative w-6 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-black">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      </div>
    )
  }
  return null
}

const CASCADE_OFFSET_PX = 28
const CASCADE_RANDOM_X = 38
const CASCADE_RANDOM_Y = 22

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
}) {
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [minimizeOrigin, setMinimizeOrigin] = useState(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [randomOffset, setRandomOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  useEffect(() => {
    if (show && randomOffset.x === 0 && randomOffset.y === 0) {
      setRandomOffset({
        x: (Math.random() - 0.5) * 2 * CASCADE_RANDOM_X,
        y: (Math.random() - 0.5) * 2 * CASCADE_RANDOM_Y,
      })
    }
  }, [show])

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
    if (!e.target.closest('button')) onBringToFront?.(windowId)
  }

  return (
    <div
      role="presentation"
      className="absolute top-0 left-0 right-0 transition-all duration-300 ease-out cursor-default"
      style={{
        zIndex: 30 + layer,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
      onClick={handleWrapperClick}
    >
      <div
        className={`mx-auto mt-16 transition-all duration-300 ease-out ${
          isMaximized ? 'w-[calc(100%-5rem)] max-w-none px-4' : 'w-[min(80vw,1400px)] max-w-none px-6'
        }`}
      >
      <div
        ref={windowRef}
        className="relative shadow-2xl bg"
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
        onTransitionEnd={handleMinimizeTransitionEnd}
      >
        <div
          className={`bg-white border-2 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
            isMaximized ? 'min-h-[520px]' : ''
          }`}
          style={{
            borderColor,
            clipPath:
              'polygon(0 0, 26% 0, 30% -14%, 62% -14%, 66% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <div className="bg-white px-5 py-3 flex items-center justify-between gap-4 border-b border-black/10 shrink-0">
            <div className="flex items-center gap-3">
              <TitleBarIcon type={iconType} />
              <span className="text-black font-medium text-sm">{title}</span>
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
                onClick={() => setIsMaximized((prev) => !prev)}
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
            className={`bg-white/85 p-8 flex items-center ${
              isMaximized ? 'min-h-[14rem]' : 'flex-1 min-h-0 min-h-[300px]'
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 w-full content-start">
              {innerFolderNames.map((name) => (
                <button
                  key={name}
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <SmallFolderIcon bodyColor={bodyColor} tabColor={tabColor} />
                  <span className="text-black text-xs font-medium text-center">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default function FoldersSection({
  showPhotosWindow = true,
  onClosePhotosWindow,
  onOpenPhotosWindow,
  showDesignWindow = false,
  onCloseDesignWindow,
  onOpenDesignWindow,
  showTechnicalsWindow = false,
  onCloseTechnicalsWindow,
  onOpenTechnicalsWindow,
  anyFolderWindowOpen = true,
  openWindowStack = [],
  cascadeOrder = [],
  onBringWindowToFront,
}) {
  const photosFolderRef = useRef(null)
  const designFolderRef = useRef(null)
  const technicalsFolderRef = useRef(null)

  return (
    <section id="work" className="relative">
      {/* Sticky tab bar for PROJECTS - higher z so windows slide below it */}
      <div className="sticky top-14 z-50">
        <div className="relative h-8 bg-black/90 backdrop-blur-sm">
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
        className={`relative z-10 grid-bg-purple pt-16 pb-16 transition-[min-height] duration-500 ease-in-out ${
          anyFolderWindowOpen ? 'min-h-screen pb-20' : 'min-h-0'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {folders.map((folder) => {
              const onOpen =
                folder.label === 'PHOTOS'
                  ? onOpenPhotosWindow
                  : folder.label === 'DESIGN'
                    ? onOpenDesignWindow
                    : onOpenTechnicalsWindow
              const ref =
                folder.label === 'PHOTOS'
                  ? photosFolderRef
                  : folder.label === 'DESIGN'
                    ? designFolderRef
                    : technicalsFolderRef
              return (
                <button
                  key={folder.label}
                  ref={ref}
                  type="button"
                  className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
                  onDoubleClick={onOpen}
                >
                  <FolderIcon bodyColor={folder.bodyColor} tabColor={folder.tabColor} />
                  <span className="text-white text-sm font-medium tracking-wide">
                    {folder.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`relative transition-[min-height] duration-500 ease-in-out ${anyFolderWindowOpen ? 'min-h-[min(75vh,640px)]' : 'min-h-0'}`}>
        <FolderWindow
          show={showPhotosWindow}
          onClose={onClosePhotosWindow}
          folderRef={photosFolderRef}
          title="Photos"
          iconType="camera"
          borderColor="#C96AED"
          bodyColor="#C96AED"
          tabColor="#A825D9"
          innerFolderNames={PHOTOS_INNER_FOLDERS}
          stackIndex={openWindowStack.indexOf('photos')}
          cascadeSlot={cascadeOrder.indexOf('photos')}
          windowId="photos"
          onBringToFront={onBringWindowToFront}
        />
        <FolderWindow
          show={showDesignWindow}
          onClose={onCloseDesignWindow}
          folderRef={designFolderRef}
          title="Design"
          iconType="pen"
          borderColor="#29A1F4"
          bodyColor="#50C0FA"
          tabColor="#1688C4"
          innerFolderNames={DESIGN_INNER_FOLDERS}
          stackIndex={openWindowStack.indexOf('design')}
          cascadeSlot={cascadeOrder.indexOf('design')}
          windowId="design"
          onBringToFront={onBringWindowToFront}
        />
        <FolderWindow
          show={showTechnicalsWindow}
          onClose={onCloseTechnicalsWindow}
          folderRef={technicalsFolderRef}
          title="Technicals"
          iconType="monitor"
          borderColor="#8EAC12"
          bodyColor="#C0F000"
          tabColor="#8EAC12"
          innerFolderNames={TECHNICALS_INNER_FOLDERS}
          stackIndex={openWindowStack.indexOf('technicals')}
          cascadeSlot={cascadeOrder.indexOf('technicals')}
          windowId="technicals"
          onBringToFront={onBringWindowToFront}
        />
        </div>
      </div>
    </section>
  )
}
