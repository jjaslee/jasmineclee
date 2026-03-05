export default function ContactSection() {
  return (
    <section id="contact" className="relative -mt-8">
      {/* Sticky tab bar for CONTACT with translucent backing outside the tab */}
      <div className="sticky top-14 z-[70]">
        <div className="relative h-8 bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: '#8DFD19',
              clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
            }}
            aria-hidden
          >
            <div className="pl-[10%] flex items-center h-full">
              <span className="font-bangers text-black tracking-widest text-sm">CONTACT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section content below the sticky tab (green grid) */}
      <div className="grid-bg-green min-h-screen pt-16 pb-20">
        <div className="mx-auto px-6" style={{ maxWidth: 740 }}>
          <div
            className="bg-gray-200 border-2 border-green-400 overflow-hidden relative"
            style={{ aspectRatio: '800 / 540' }}
          >
            <div className="grid grid-cols-2 gap-0 h-full">
              <div className="p-6 flex flex-col">
                <div className="flex-1 min-h-0 bg-gray-400 overflow-hidden mb-6">
                  <img
                    src="/hero-1.png"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(1) contrast(0.72) brightness(1.08)' }}
                  />
                </div>
              </div>
              {/* Center line */}
              <div
                className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-px bg-green-400/60"
                aria-hidden
              />
              <div className="p-6 flex flex-col justify-between relative" style={{ color: '#2F5D00' }}>
                <div>
                  <div className="w-16 h-16 bg-gray-400 overflow-hidden mb-6">
                    <img
                      src="/hero-1.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name *"
                    className="contact-placeholder w-full px-4 py-3 bg-white border border-gray-300 mb-4 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    style={{ color: '#2F5D00' }}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="contact-placeholder w-full px-4 py-3 bg-white border border-gray-300 mb-4 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    style={{ color: '#2F5D00' }}
                  />
                  <textarea
                    placeholder="Your Message *"
                    rows={4}
                    className="contact-placeholder w-full px-4 py-3 bg-white border border-gray-300 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none"
                    style={{ color: '#2F5D00' }}
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 font-bangers text-lg tracking-wide hover:opacity-80 transition-opacity">
                    <span>SEND</span>
                    <span className="text-lg" aria-hidden>▶</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

