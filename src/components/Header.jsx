import { useState } from 'react'

const colorOptions = [
  { id: 'purple', className: '', style: { backgroundColor: '#6A22FF' }, border: '#6A22FF' },
  { id: 'red', className: 'bg-pink-500', style: null, border: '#ec4899' },
  { id: 'green', className: 'bg-lime-400', style: null, border: '#a3e635' },
]

const navItems = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'archive', label: 'Archive', href: '/#archive' },
]

export default function Header({
  siteAccent,
  onSiteAccentChange,
  lang = 'EN',
  onLangChange,
  theme = 'dark',
  onThemeChange,
  activeSection = 'work',
  onSectionNavigate,
  resumeHref = null,
}) {
  const active = colorOptions.find((color) => color.id === siteAccent) ?? colorOptions[0]
  const [spinTurns, setSpinTurns] = useState(0)

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] chrome-bg-90 backdrop-blur-sm"
      style={{ boxShadow: `inset 0 -1px 0 0 ${active.border}` }}
    >
      <div className="relative mx-auto grid min-h-[60px] max-w-[var(--page-max-width)] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 px-4 py-2 sm:px-[var(--page-inline)] md:grid-cols-[auto_1fr_auto] md:gap-x-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <a
            href="/"
            className="type-wordmark chrome-text whitespace-nowrap tracking-[0.08em] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Jasmine Lee
          </a>
          <div className="flex shrink-0 gap-0.5" aria-label="Accent color">
            {colorOptions.map((option) => {
              const isActive = siteAccent === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSiteAccentChange?.(option.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
                  aria-label={`Set accent color to ${option.id}`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`h-4 w-4 rounded-full ${option.className} ${
                      isActive ? 'flip-square ring-1 ring-white' : ''
                    }`}
                    style={option.style || undefined}
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          className="type-ui col-span-2 row-start-2 flex items-center justify-center gap-5 tracking-[0.14em] chrome-muted sm:gap-8 md:absolute md:left-1/2 md:top-1/2 md:col-span-1 md:row-start-1 md:-translate-x-1/2 md:-translate-y-1/2"
          style={{ fontSize: '0.875rem' }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => onSectionNavigate?.(event, item.id)}
              aria-current={activeSection === item.id ? 'location' : undefined}
              className="group relative pb-0.5 uppercase transition-colors hover:chrome-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span>{item.label}</span>
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-300 ease-out group-hover:w-full group-focus-visible:w-full motion-reduce:transition-none" />
            </a>
          ))}
          {resumeHref ? (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative pb-0.5 uppercase transition-colors hover:chrome-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span>Resume ↗</span>
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-300 ease-out group-hover:w-full group-focus-visible:w-full motion-reduce:transition-none" />
            </a>
          ) : null}
        </nav>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 chrome-muted sm:gap-4 md:col-start-3">
          <button
            type="button"
            onClick={() => {
              onLangChange?.(lang === 'EN' ? 'ZH' : 'EN')
              setSpinTurns((previous) => previous + 1)
            }}
            onMouseEnter={() => setSpinTurns((previous) => previous + 1)}
            className="type-meta group flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label={lang === 'EN' ? 'Switch language to Chinese' : 'Switch language to English'}
          >
            <span
              className={`transition-transform duration-200 ease-out group-hover:-translate-x-1 motion-reduce:transition-none ${
                lang === 'EN' ? 'chrome-text' : 'opacity-60'
              }`}
            >
              EN
            </span>
            <span
              className="inline-block origin-center transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `rotate(${spinTurns * 360}deg)` }}
              aria-hidden
            >
              |
            </span>
            <span className={lang === 'ZH' ? 'chrome-text' : 'opacity-60'}>中文</span>
          </button>

          <button
            type="button"
            onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
            className="relative flex h-6 w-9 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span
              className="chrome-outline chrome-solid-bg absolute h-4 w-4 rounded-full border transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
              style={{
                transform: theme === 'dark' ? 'translateX(-6px)' : 'translateX(6px)',
                zIndex: theme === 'dark' ? 0 : 1,
              }}
              aria-hidden
            />
            <span
              className="chrome-invert-bg absolute h-4 w-4 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
              style={{
                transform: theme === 'dark' ? 'translateX(6px)' : 'translateX(-6px)',
                zIndex: theme === 'dark' ? 1 : 0,
              }}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </header>
  )
}
