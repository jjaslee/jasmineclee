const TAB_CLIP_PATH = 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)'

export default function SectionTab({
  label,
  backgroundColor,
  textColor = 'white',
  backingClassName = 'chrome-bg-60',
  zIndexClassName = 'z-[70]',
}) {
  return (
    <div className={`sticky ${zIndexClassName}`} style={{ top: 'var(--app-header-height, 56px)' }}>
      <div className={`relative h-8 ${backingClassName} backdrop-blur-sm`}>
        <div
          className="absolute inset-0 flex items-center"
          style={{ backgroundColor, clipPath: TAB_CLIP_PATH }}
          aria-hidden
        >
          <div className="pl-[10%] flex items-center h-full">
            <span className="font-bangers tracking-widest text-sm" style={{ color: textColor }}>
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
