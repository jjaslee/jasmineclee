import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FoldersSection from './components/FoldersSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

function App() {
  const [heroColor, setHeroColor] = useState('purple')
  const [showProjectsWindow, setShowProjectsWindow] = useState(true)
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
        <FoldersSection
          showWindow={showProjectsWindow}
          onCloseWindow={() => setShowProjectsWindow(false)}
          onOpenWindow={() => setShowProjectsWindow(true)}
        />
        <ProjectsSection />
        <ContactSection />
        <Footer accentColor={footerColor} />
      </main>
    </div>
  )
}

export default App
