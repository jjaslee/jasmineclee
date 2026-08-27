import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FoldersSection from './components/FoldersSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CursorTrail from './components/CursorTrail'
import { scrollPageToHash, scrollPageToPath } from './utils/routes'

function App() {
  const [heroColor, setHeroColor] = useState('purple')
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('EN')
  const [showPhotosWindow, setShowPhotosWindow] = useState(false)
  const [showDesignWindow, setShowDesignWindow] = useState(false)
  const [showTechnicalsWindow, setShowTechnicalsWindow] = useState(true)
  const [openWindowStack, setOpenWindowStack] = useState(['technicals'])
  const [cascadeOrder, setCascadeOrder] = useState(['technicals'])
  const anyFolderWindowOpen =
    showPhotosWindow || showDesignWindow || showTechnicalsWindow

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Browser won't scroll to `/about` / `/contact` / `/projects/…` on cold load: those nodes mount after first paint.
  useEffect(() => {
    const run = () => {
      if (scrollPageToHash(window.location.hash)) return
      scrollPageToPath(window.location.pathname)
    }
    run()
    const t = window.setTimeout(run, 0)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const syncHeaderHeightVar = () => {
      const header = document.querySelector('header')
      if (!header) return
      const headerRect = header.getBoundingClientRect()
      const headerBottomRaw = headerRect.bottom
      document.documentElement.style.setProperty('--app-header-height', `${headerBottomRaw.toFixed(3)}px`)
    }

    syncHeaderHeightVar()
    const onResize = () => syncHeaderHeightVar()
    const onScroll = () => syncHeaderHeightVar()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const bringToFront = useCallback((id) => {
    setOpenWindowStack((prev) => {
      const next = [...prev.filter((w) => w !== id), id]
      return next
    })
  }, [])
  const ensureInCascade = useCallback((id) => {
    setCascadeOrder((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])
  const openPhotos = useCallback(() => {
    setShowPhotosWindow(true)
    ensureInCascade('photos')
    bringToFront('photos')
  }, [bringToFront, ensureInCascade])
  const openDesign = useCallback(() => {
    setShowDesignWindow(true)
    ensureInCascade('design')
    bringToFront('design')
  }, [bringToFront, ensureInCascade])
  const openTechnicals = useCallback(() => {
    setShowTechnicalsWindow(true)
    ensureInCascade('technicals')
    bringToFront('technicals')
  }, [bringToFront, ensureInCascade])
  const closePhotos = useCallback(() => {
    setShowPhotosWindow(false)
    setOpenWindowStack((prev) => prev.filter((w) => w !== 'photos'))
    setCascadeOrder((prev) => prev.filter((w) => w !== 'photos'))
  }, [])
  const closeDesign = useCallback(() => {
    setShowDesignWindow(false)
    setOpenWindowStack((prev) => prev.filter((w) => w !== 'design'))
    setCascadeOrder((prev) => prev.filter((w) => w !== 'design'))
  }, [])
  const closeTechnicals = useCallback(() => {
    setShowTechnicalsWindow(false)
    setOpenWindowStack((prev) => prev.filter((w) => w !== 'technicals'))
    setCascadeOrder((prev) => prev.filter((w) => w !== 'technicals'))
  }, [])
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
