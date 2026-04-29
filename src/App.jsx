import { useEffect, useRef, useState } from 'react'
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
  const layoutLogCountRef = useRef(0)
  const anyFolderWindowOpen =
    showPhotosWindow || showDesignWindow || showTechnicalsWindow

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const getNavLineCount = () => {
      const links = Array.from(document.querySelectorAll('header nav a'))
      const tops = new Set(
        links
          .map((el) => Number(el.getBoundingClientRect().top.toFixed(3)))
          .filter((v) => Number.isFinite(v)),
      )
      return tops.size
    }

    const getStickySample = () => {
      const ids = ['#work', '#about', '#contact']
      return ids
        .map((id) => {
          const section = document.querySelector(id)
          const sticky = section?.querySelector('.sticky')
          if (!section || !sticky) return null
          const stickyTop = sticky.getBoundingClientRect().top
          const stickyTopCss = parseFloat(window.getComputedStyle(sticky).top || '0') || 0
          const stickyStyles = window.getComputedStyle(sticky)
          return {
            id,
            stickyTopRawPx: stickyTop,
            stickyTopPx: Number(stickyTop.toFixed(3)),
            stickyTopCssPx: Number(stickyTopCss.toFixed(3)),
            sectionTopPx: Number(section.getBoundingClientRect().top.toFixed(3)),
            stickyBorderTopWidthPx: stickyStyles.borderTopWidth,
            stickyBorderTopColor: stickyStyles.borderTopColor,
            stickyBackgroundColor: stickyStyles.backgroundColor,
            stickyBackdropFilter: stickyStyles.backdropFilter,
            stickyBoxShadow: stickyStyles.boxShadow,
          }
        })
        .filter(Boolean)
    }

    const syncHeaderHeightVar = () => {
      if (layoutLogCountRef.current >= 80) return
      const header = document.querySelector('header')
      if (!header) return
      const headerRect = header.getBoundingClientRect()
      const headerBottomRaw = headerRect.bottom
      const headerBottom = Math.round(headerBottomRaw)
      const headerStyles = window.getComputedStyle(header)
      document.documentElement.style.setProperty('--app-header-height', `${headerBottomRaw.toFixed(3)}px`)
      const stickySamples = getStickySample().map((s) => ({
        ...s,
        gapFromHeaderRawPx: Number((s.stickyTopPx - headerBottomRaw).toFixed(3)),
      }))
      const maxAbsGapFromHeaderRawPx = stickySamples.length
        ? Math.max(...stickySamples.map((s) => Math.abs(s.gapFromHeaderRawPx)))
        : null
      const activeSticky =
        stickySamples.find((s) => Math.abs(s.gapFromHeaderRawPx) <= 4) || null

      // #region agent log
      fetch('http://127.0.0.1:7753/ingest/b67305a2-8703-4d0c-9907-e6f5fc96d49c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fdc73e'},body:JSON.stringify({sessionId:'fdc73e',runId:'pre-fix-4',hypothesisId:'H_VISUAL_SEAM',location:'App.jsx:syncHeaderHeightVar',message:'header_sticky_render_seam_diagnostics',data:{windowWidth:window.innerWidth,windowHeight:window.innerHeight,scrollY:Number(window.scrollY.toFixed(3)),headerHeightRawPx:Number(headerRect.height.toFixed(3)),headerBottomRawPx:Number(headerBottomRaw.toFixed(3)),headerBottomRoundedPx:headerBottom,headerBottomFloorPx:Math.floor(headerBottomRaw),headerBottomCeilPx:Math.ceil(headerBottomRaw),headerVarPx:document.documentElement.style.getPropertyValue('--app-header-height'),headerBorderBottomWidthPx:headerStyles.borderBottomWidth,headerBorderBottomColor:headerStyles.borderBottomColor,headerBackgroundColor:headerStyles.backgroundColor,headerBackdropFilter:headerStyles.backdropFilter,headerBoxShadow:headerStyles.boxShadow,navLineCount:getNavLineCount(),maxAbsGapFromHeaderRawPx,activeSticky,stickySamples},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      layoutLogCountRef.current += 1
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
