import { useState } from 'react'
import Header from './components/Header.jsx'
import HeroSection from './components/HeroSection.jsx'
import FoldersSection from './components/FoldersSection.jsx'
import ProjectsSection from './components/ProjectsSection.jsx'
import ContactSection from './components/ContactSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  const [heroColor, setHeroColor] = useState('purple')

  const accentColorMap = {
    purple: '#6A22FF',
    red: '#F62F60',
    green: '#8DFD19',
  }

  const accentColor = accentColorMap[heroColor] ?? accentColorMap.purple

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header heroColor={heroColor} onHeroColorChange={setHeroColor} />
      <main>
        <HeroSection heroColor={heroColor} />

        {/* Projects band + connected grid background down through About */}
        <div className="grid-bg">
          {/* Projects tab: scrolls with page, then sticks under nav */}
          <div className="sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div
                className="h-8 w-full flex items-center"
                style={{
                  backgroundColor: accentColor,
                  clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
                }}
                aria-hidden
              >
                <div className="pl-[10%] flex items-center h-full">
                  <span className="font-bangers text-white tracking-widest text-sm">
                    PROJECTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <FoldersSection />
          <ProjectsSection />
        </div>

        <ContactSection />
        <Footer accentColor={accentColor} />
      </main>
    </div>
  )
}

export default App
