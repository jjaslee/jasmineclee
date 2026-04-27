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
            className="bg-gray-200 border-[6px] border-[#8DFD19] relative rounded-xl overflow-hidden"
            style={{ minHeight: 499 }}
          >
            <div className="grid grid-cols-2 grid-rows-[auto,1fr] min-h-[499px] relative">
              {/* Top row: large image on the left, spacer on the right */}
              <div className="p-6 pb-3">
                <div className="bg-gray-400 overflow-hidden">
                  <img
                    src="/contact-sf.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(1) contrast(0.72) brightness(1.08)' }}
                  />
                </div>
              </div>
              <div
                className="p-6 pb-1 flex items-end"
                style={{ color: '#2F5D00', paddingTop: '1.85rem' }}
              >
                <h2 className="font-bangers text-2xl tracking-wide">
                  LET'S CONNECT
                </h2>
              </div>

              {/* Center line */}
              <div
                className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-px bg-green-400/60"
                aria-hidden
              />

              {/* Bottom row: message + icons */}
              <div className="p-6 pt-3 flex flex-col justify-between">
                <div>
                  <textarea
                    placeholder="Your message *"
                    rows={6}
                    className="contact-placeholder w-full px-4 py-3 bg-white border border-gray-300 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none"
                    style={{ color: '#2F5D00' }}
                  />
                </div>
                <div className="mt-6 flex items-center gap-3 flex-shrink-0 pl-1">
                  <a
                    href="https://www.linkedin.com/in/jasmineclee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: '#2F5D00', display: 'block' }}
                      aria-hidden
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:jas.lee@berkeley.edu"
                    className="flex items-center gap-2 text-xs flex-shrink-0"
                    style={{ color: '#2F5D00' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: '#2F5D00', flexShrink: 0 }}
                      aria-hidden
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    jas.lee@berkeley.edu
                  </a>
                </div>
              </div>

              {/* Bottom row: Let's Connect + form */}
              <div className="p-6 pt-3 pb-1 flex flex-col h-full" style={{ color: '#2F5D00' }}>
                <div>
                  <input
                    type="text"
                    placeholder="Your name *"
                    className="contact-placeholder w-full px-4 py-3 bg-white border border-gray-300 mb-4 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    style={{ color: '#2F5D00' }}
                  />
                  <input
                    type="email"
                    placeholder="Your email *"
                    className="contact-placeholder w-full px-4 py-3 bg-white border border-gray-300 mb-4 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    style={{ color: '#2F5D00' }}
                  />
                </div>
                <div className="flex justify-end mt-auto -mr-6 flex-shrink-0">
                  <button className="flex items-center gap-2 px-7 py-3 font-bangers text-xl tracking-wide hover:opacity-80 transition-opacity">
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

