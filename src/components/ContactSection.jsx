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
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-200 rounded-lg border-2 border-green-400 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-6">
                <div className="aspect-video bg-gray-400 rounded mb-6 overflow-hidden">
                  <img
                    src="/hero-1.png"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(1) contrast(0.72) brightness(1.08)' }}
                  />
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-full bg-gray-400 overflow-hidden mb-6">
                    <img
                      src="/hero-1.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name *"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded mb-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded mb-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  />
                  <textarea
                    placeholder="Your Message *"
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none"
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-green-400 text-black font-medium rounded hover:bg-green-300 transition-colors">
                    <span>SEND</span>
                    <span className="text-lg">→</span>
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

