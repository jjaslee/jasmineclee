import { useEffect, useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FoldersSection from './components/FoldersSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CursorTrail from './components/CursorTrail'

function App() {
  const [heroColor, setHeroColor] = useState('purple')
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('EN')
  const [showPhotosWindow, setShowPhotosWindow] = useState(true)
  const [showDesignWindow, setShowDesignWindow] = useState(false)
  const [showTechnicalsWindow, setShowTechnicalsWindow] = useState(false)
  const [openWindowStack, setOpenWindowStack] = useState(['photos'])
  const [cascadeOrder, setCascadeOrder] = useState(['photos'])
  const anyFolderWindowOpen =
    showPhotosWindow || showDesignWindow || showTechnicalsWindow

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const bringToFront = (id) => {
    setOpenWindowStack((prev) => {
      const next = [...prev.filter((w) => w !== id), id]
      return next
    })
  }
  const ensureInCascade = (id) => {
    setCascadeOrder((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }
  const openPhotos = () => {
    setShowPhotosWindow(true)
    ensureInCascade('photos')
    bringToFront('photos')
  }
  const openDesign = () => {
    setShowDesignWindow(true)
    ensureInCascade('design')
    bringToFront('design')
  }
  const openTechnicals = () => {
    setShowTechnicalsWindow(true)
    ensureInCascade('technicals')
    bringToFront('technicals')
  }
  const closePhotos = () => {
    setShowPhotosWindow(false)
    setOpenWindowStack((prev) => prev.filter((w) => w !== 'photos'))
    setCascadeOrder((prev) => prev.filter((w) => w !== 'photos'))
  }
  const closeDesign = () => {
    setShowDesignWindow(false)
    setOpenWindowStack((prev) => prev.filter((w) => w !== 'design'))
    setCascadeOrder((prev) => prev.filter((w) => w !== 'design'))
  }
  const closeTechnicals = () => {
    setShowTechnicalsWindow(false)
    setOpenWindowStack((prev) => prev.filter((w) => w !== 'technicals'))
    setCascadeOrder((prev) => prev.filter((w) => w !== 'technicals'))
  }
  const accentColorMap = {
    purple: '#6A22FF',
    red: '#F62F60',
    green: '#8DFD19',
  }
  const footerColor = accentColorMap[heroColor] ?? accentColorMap.purple

  return (
    <div style={{ minHeight: '100vh' }}>
      <CursorTrail />
      <Header
        heroColor={heroColor}
        onHeroColorChange={setHeroColor}
        lang={lang}
        onLangChange={setLang}
        theme={theme}
        onThemeChange={setTheme}
      />
      <main>
        <HeroSection heroColor={heroColor} lang={lang} />
        <FoldersSection
          showPhotosWindow={showPhotosWindow}
          onClosePhotosWindow={closePhotos}
          onOpenPhotosWindow={openPhotos}
          showDesignWindow={showDesignWindow}
          onCloseDesignWindow={closeDesign}
          onOpenDesignWindow={openDesign}
          showTechnicalsWindow={showTechnicalsWindow}
          onCloseTechnicalsWindow={closeTechnicals}
          onOpenTechnicalsWindow={openTechnicals}
          anyFolderWindowOpen={anyFolderWindowOpen}
          openWindowStack={openWindowStack}
          cascadeOrder={cascadeOrder}
          onBringWindowToFront={bringToFront}
        />
        <ProjectsSection lang={lang} />
        <ContactSection lang={lang} />
        <Footer accentColor={footerColor} lang={lang} />
      </main>
    </div>
  )
}

export default App
