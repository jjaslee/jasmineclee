export default function ProjectsSection() {
  return (
    <section id="about" className="relative grid-bg py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative">
          <div className="absolute -left-4 top-4 w-full h-full bg-gray-300 rounded-lg border-2 border-pink-400 transform -rotate-2 opacity-60" />
          <div className="absolute -right-4 top-8 w-full h-full bg-gray-400 rounded-lg border-2 border-pink-400 transform rotate-2 opacity-40" />
          <div className="relative bg-gray-200 rounded-lg border-2 border-pink-400 overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-square md:aspect-auto md:min-h-[320px] bg-gray-400">
                <img
                  src="/hero-1.png"
                  alt="About me"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center relative">
                <div className="w-3 h-3 bg-red-500 absolute top-6 right-6" />
                <p className="text-black text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-black text-sm leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 bg-green-400 flex items-center justify-center mt-20">
        <span className="text-white font-medium tracking-widest text-sm">CONTACT</span>
      </div>
    </section>
  )
}
