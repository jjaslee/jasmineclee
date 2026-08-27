export default function Footer({ accentColor = '#6A22FF', lang = 'EN' }) {
  const isBrightGreen = accentColor.toLowerCase() === '#8dfd19'
  const primaryTextClass = isBrightGreen ? 'text-black' : 'text-white'
  const secondaryTextClass = isBrightGreen ? 'text-black/70' : 'text-gray-300'

  return (
    <footer className="homepage-footer-reveal" style={{ backgroundColor: accentColor }}>
      <div className="homepage-footer-reveal__inner">
        <p className={`${primaryTextClass} type-ui font-semibold tracking-[0.08em]`}>
          {lang === 'ZH' ? '多謝你到訪！' : 'THANKS FOR STOPPING BY!'}
        </p>
        <div className="homepage-footer-reveal__meta type-meta">
          <p className={secondaryTextClass}>© 2026 Jasmine Lee</p>
          <a href="#home" className={`${primaryTextClass} footer-back-to-top group`}>
            ↑ Back to top
            <span className="footer-back-to-top-line" />
          </a>
        </div>
      </div>
    </footer>
  )
}
