export default function ContactSection() {
  return (
    <section id="contact" className="relative py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-200 rounded-lg border-2 border-green-400 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6">
              <div className="aspect-video bg-gray-400 rounded mb-6 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop"
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(1) contrast(0.72) brightness(1.08)' }}
                />
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-full bg-gray-400 overflow-hidden mb-6" />
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
    </section>
  )
}

