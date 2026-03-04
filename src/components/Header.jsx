import { useState } from 'react'

const colorOptions = [
  { id: 'purple', className: '', style: { backgroundColor: '#6A22FF' }, border: '#6A22FF' },
  { id: 'red', className: 'bg-pink-500', style: null, border: '#ec4899' },
  { id: 'green', className: 'bg-lime-400', style: null, border: '#a3e635' },
]

export default function Header({ heroColor, onHeroColorChange }) {
  const active = colorOptions.find((c) => c.id === heroColor) ?? colorOptions[0]
  const [lang, setLang] = useState('EN')

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b"
      style={{ borderBottomColor: active.border }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href="#home"
          className="text-white text-xl md:text-2xl tracking-wide font-bangers hover:opacity-90 transition-opacity"
        >
          JASMINE LEE
        </a>

        <div className="flex items-center gap-5">
          <div className="flex gap-1">
            {colorOptions.map((opt) => {
              const isActive = heroColor === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onHeroColorChange && onHeroColorChange(opt.id)}
                  className={`w-4 h-4 ${opt.className} ${
                    isActive ? 'border border-white flip-square' : ''
                  }`}
                  style={opt.style || undefined}
                  aria-label={`Set hero color to ${opt.id}`}
                />
              )
            })}
          </div>

          <nav className="flex gap-4 text-[11px] md:text-xs lg:text-sm font-poppins text-gray-200 tracking-[0.12em]">
            <a href="#work" className="uppercase hover:text-white transition-colors">
              Projects
            </a>
            <a href="#about" className="uppercase hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="uppercase hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setLang((prev) => (prev === 'EN' ? 'ZH' : 'EN'))}
          className="font-poppins text-gray-200 text-xs"
        >
          {lang}
        </button>
      </div>
    </header>
  )
}

