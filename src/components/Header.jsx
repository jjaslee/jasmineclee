import { useState } from 'react'

const colorOptions = [
  { id: 'purple', className: '', style: { backgroundColor: '#6A22FF' }, border: '#6A22FF' },
  { id: 'red', className: 'bg-pink-500', style: null, border: '#ec4899' },
  { id: 'green', className: 'bg-lime-400', style: null, border: '#a3e635' },
]

export default function Header({ heroColor, onHeroColorChange, theme = 'dark', onThemeChange }) {
  const active = colorOptions.find((c) => c.id === heroColor) ?? colorOptions[0]
  const [lang, setLang] = useState('EN')
  const [spinTurns, setSpinTurns] = useState(0)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] chrome-bg-90 backdrop-blur-sm border-b"
      style={{ borderBottomColor: active.border }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: name in Bangers */}
        <a
          href="#home"
          className="chrome-text tracking-wide font-bangers hover:opacity-90 transition-opacity"
          style={{ fontSize: 'clamp(1.1rem, 1rem + 0.8vw, 1.5rem)' }}
        >
          JCL
        </a>

        {/* Center: color boxes + nav links in a row */}
        <div className="flex items-center gap-5">
          <div className="flex gap-1">
            {colorOptions.map((opt) => {
              const isActive = heroColor === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onHeroColorChange && onHeroColorChange(opt.id)}
                  className={`w-4 h-4 ${opt.className} ${isActive ? 'border border-white flip-square' : ''}`}
                  style={opt.style || undefined}
                  aria-label={`Set hero color to ${opt.id}`}
                />
              )
            })}
          </div>
          <nav
            className="flex gap-4 font-poppins chrome-muted tracking-[0.12em]"
            style={{ fontSize: 'clamp(0.68rem, 0.64rem + 0.22vw, 0.875rem)' }}
          >
            <a
              href="#work"
              className="relative uppercase pb-0.5 hover:chrome-text transition-colors group"
            >
              <span>Projects</span>
              <span className="pointer-events-none absolute left-0 -bottom-0.5 h-[1px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </a>
            <a
              href="#about"
              className="relative uppercase pb-0.5 hover:chrome-text transition-colors group"
            >
              <span>About</span>
              <span className="pointer-events-none absolute left-0 -bottom-0.5 h-[1px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </a>
            <a
              href="#contact"
              className="relative uppercase pb-0.5 hover:chrome-text transition-colors group"
            >
              <span>Contact</span>
              <span className="pointer-events-none absolute left-0 -bottom-0.5 h-[1px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          </nav>
        </div>

        {/* Right: language + toggle */}
        <div className="flex items-center gap-4 font-poppins chrome-muted">
          <button
            type="button"
            onClick={() => {
              setLang((prev) => (prev === 'EN' ? 'ZH' : 'EN'))
              setSpinTurns((prev) => prev + 1)
            }}
            onMouseEnter={() => setSpinTurns((prev) => prev + 1)}
            className="flex items-center gap-1 group"
            style={{ fontSize: 'clamp(0.68rem, 0.64rem + 0.22vw, 0.875rem)' }}
          >
            <span
              className={`transition-transform duration-200 ease-out group-hover:-translate-x-1 ${
                lang === 'EN' ? 'chrome-text' : 'opacity-60'
              }`}
            >
              EN
            </span>
            <span
              className="inline-block origin-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${spinTurns * 360}deg)` }}
            >
              |
            </span>
            <span className={lang === 'ZH' ? 'chrome-text' : 'opacity-60'}>
              中文
            </span>
          </button>
          {/* Two-circle theme toggle (independent from language) */}
          <button
            type="button"
            onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-9 h-5 flex items-center justify-center"
          >
            {/* Left circle (outline) */}
            <span
              className="absolute w-4 h-4 rounded-full border chrome-outline chrome-solid-bg transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transform: theme === 'dark' ? 'translateX(-6px)' : 'translateX(6px)',
                zIndex: theme === 'dark' ? 0 : 1,
              }}
            />
            {/* Right circle (filled) */}
            <span
              className="absolute w-4 h-4 rounded-full chrome-invert-bg transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transform: theme === 'dark' ? 'translateX(6px)' : 'translateX(-6px)',
                zIndex: theme === 'dark' ? 1 : 0,
              }}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
