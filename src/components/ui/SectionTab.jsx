const TAB_CLIP_PATH = 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)'

const HERO_TAB_CLIP_PATHS = {
  left: 'polygon(0 0, calc(100% - var(--hero-tab-slant)) 0, 100% 100%, 0 100%)',
  middle:
    'polygon(var(--hero-tab-slant) 0, calc(100% - var(--hero-tab-slant)) 0, 100% 100%, 0 100%)',
  right: 'polygon(var(--hero-tab-slant) 0, 100% 0, 100% 100%, 0 100%)',
}

export default function SectionTab({
  label,
  backgroundColor,
  textColor = 'white',
  backingClassName = 'chrome-bg-60',
  zIndexClassName = 'z-[70]',
  variant = 'section',
  href,
  position = 'middle',
  isActive = false,
  onClick,
  shortLabel,
}) {
  if (variant === 'hero-folder') {
    return (
      <a
        href={href}
        onClick={onClick}
        aria-label={label}
        aria-current={isActive ? 'location' : undefined}
        className={`hero-folder-tab hero-folder-tab--${position} ${isActive ? 'is-active' : ''}`}
        style={{
          backgroundColor,
          color: textColor,
          clipPath: HERO_TAB_CLIP_PATHS[position] ?? HERO_TAB_CLIP_PATHS.middle,
        }}
      >
        <span className="hero-folder-tab__label hero-folder-tab__label--full">{label}</span>
        <span className="hero-folder-tab__label hero-folder-tab__label--short" aria-hidden>
          {shortLabel ?? label}
        </span>
      </a>
    )
  }

  return (
    <div className={`sticky ${zIndexClassName}`} style={{ top: 'var(--app-header-height, 56px)' }}>
      <div className={`relative h-8 ${backingClassName} backdrop-blur-sm`}>
        <div
          className="absolute inset-0 flex items-center"
          style={{ backgroundColor, clipPath: TAB_CLIP_PATH }}
          aria-hidden
        >
          <div className="pl-[10%] flex items-center h-full">
            <span className="type-ui tracking-widest" style={{ color: textColor }}>
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
