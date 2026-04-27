export default function Footer({ accentColor = '#6A22FF' }) {
  const isBrightGreen = accentColor.toLowerCase() === '#8dfd19'
  const primaryTextClass = isBrightGreen ? 'text-black' : 'text-white'
  const secondaryTextClass = isBrightGreen ? 'text-black/70' : 'text-gray-300'

  return (
    <footer className="relative overflow-visible py-10" style={{ backgroundColor: accentColor }}>
      {/* Top strip behind tab (like folder) */}
      <div
        className="absolute left-0 top-0 w-full h-4 rounded-t-[4px]"
        style={{
          backgroundColor: accentColor,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          filter: 'brightness(0.85)',
        }}
      />
      {/* Trapezoid tab sitting on the strip
      <div
        className="absolute left-0 -top-10 h-10 w-80"
        style={{
          backgroundColor: accentColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '4px',
          filter: 'brightness(0.85)',
        }}
      /> */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className={`${primaryTextClass} font-nanum text-lg mb-3`}>
          THANKS FOR STOPPING BY!
        </p>
        <a href="#home" className={`${primaryTextClass} text-sm font-light inline-block footer-back-to-top group`}>
          back to top
          <span className="footer-back-to-top-line" />
        </a>
        <p className={`${secondaryTextClass} text-xs`}>© 2026 Jasmine C. Lee. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
