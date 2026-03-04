export default function Footer({ accentColor = '#6A22FF' }) {
  const isBrightGreen = accentColor.toLowerCase() === '#8dfd19'
  const primaryTextClass = isBrightGreen ? 'text-black' : 'text-white'
  const secondaryTextClass = isBrightGreen ? 'text-black/70' : 'text-gray-300'

  return (
    <footer className="py-16" style={{ backgroundColor: accentColor }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className={`${primaryTextClass} font-medium tracking-widest text-lg mb-4`}>
          THANKS FOR STOPPING BY!
        </p>
        <a
          href="#home"
          className={`${primaryTextClass} hover:underline text-sm font-light mb-8 inline-block`}
        >
          back to top
        </a>
        <p className={`${secondaryTextClass} text-xs`}>
          © 2026. jasmine lee. all rights reserved.
        </p>
      </div>
    </footer>
  )
}

