import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FoldersSection from './components/FoldersSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

function App() {
  const [heroColor, setHeroColor] = useState('purple')
  const accentColorMap = {
    purple: '#6A22FF',
    red: '#F62F60',
    green: '#8DFD19',
  }
  const footerColor = accentColorMap[heroColor] ?? accentColorMap.purple

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header heroColor={heroColor} onHeroColorChange={setHeroColor} />
      <main>
        <HeroSection heroColor={heroColor} />
        {/* Projects tab: scrolls normally, sticks once it hits the nav */}
        <div className="sticky top-14 z-40">
          <div
            className="h-8 w-full flex items-center"
            style={{
              backgroundColor: footerColor,
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
        <FoldersSection />
        <ProjectsSection />
        <ContactSection />
        <Footer accentColor={footerColor} />
      </main>
    </div>
  )
}

export default App
