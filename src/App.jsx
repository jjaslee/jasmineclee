import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import MajorSectionTabs from './components/MajorSectionTabs'
import FoldersSection from './components/FoldersSection'
import SelectedWorkSection from './components/SelectedWorkSection'
import ProjectsSection from './components/ProjectsSection'
import ArchiveSection from './components/ArchiveSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CursorTrail from './components/CursorTrail'
import CaseStudyPage from './components/case-study/CaseStudyPage'
import { getProjectByCaseStudyRoute } from './data/projects'
import {
  normalizePath,
  parseProjectPath,
  parseWorkPath,
  scrollPageToHash,
  scrollPageToPath,
} from './utils/routes'

const initialLegacyProjectRoot = parseProjectPath(window.location.pathname)?.root || 'technicals'
const homepageSections = new Set(['work', 'about', 'archive'])

function homepageSectionFromHash(hash = window.location.hash) {
  const section = String(hash || '').replace(/^#/, '')
  return homepageSections.has(section) ? section : 'work'
}

function App() {
  const pathname = normalizePath(window.location.pathname)
  const workPath = parseWorkPath(pathname)
  const caseStudyProject = workPath?.isExact
    ? getProjectByCaseStudyRoute(pathname)
    : null
  const isWorkRoute = Boolean(workPath)
  const [heroColor, setHeroColor] = useState('purple')
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('EN')
  const [showPhotosWindow, setShowPhotosWindow] = useState(
    initialLegacyProjectRoot === 'photos',
  )
  const [showDesignWindow, setShowDesignWindow] = useState(
    initialLegacyProjectRoot === 'design',
  )
  const [showTechnicalsWindow, setShowTechnicalsWindow] = useState(
    initialLegacyProjectRoot === 'technicals',
  )
  const [openWindowStack, setOpenWindowStack] = useState([initialLegacyProjectRoot])
  const [cascadeOrder, setCascadeOrder] = useState([initialLegacyProjectRoot])
  const [showLegacyProjects, setShowLegacyProjects] = useState(() =>
    normalizePath(window.location.pathname).startsWith('/projects'),
  )
  const [activeHomepageSection, setActiveHomepageSection] = useState(() =>
    homepageSectionFromHash(),
  )
  const anyFolderWindowOpen =
    showPhotosWindow || showDesignWindow || showTechnicalsWindow

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang === 'ZH' ? 'zh-Hans' : 'en'
  }, [lang])

  useEffect(() => {
    if (!isWorkRoute) document.title = 'Jasmine Lee — Portfolio'
  }, [isWorkRoute])

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
    const syncHomepageSection = () => {
      setActiveHomepageSection(homepageSectionFromHash())
    }
    window.addEventListener('hashchange', syncHomepageSection)
    window.addEventListener('popstate', syncHomepageSection)
    return () => {
      window.removeEventListener('hashchange', syncHomepageSection)
      window.removeEventListener('popstate', syncHomepageSection)
    }
  }, [])

  useEffect(() => {
    const syncProjectExperience = () => {
      const pathname = normalizePath(window.location.pathname)
      const projectPath = parseProjectPath(pathname)
      const isLegacyPath = pathname.startsWith('/projects')

      if (projectPath) {
        setShowPhotosWindow(projectPath.root === 'photos')
        setShowDesignWindow(projectPath.root === 'design')
        setShowTechnicalsWindow(projectPath.root === 'technicals')
        setOpenWindowStack([projectPath.root])
        setCascadeOrder([projectPath.root])
      }
      setShowLegacyProjects(isLegacyPath)
    }
    window.addEventListener('popstate', syncProjectExperience)
    return () => window.removeEventListener('popstate', syncProjectExperience)
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
  const navigateHomepageSection = useCallback(
    (event, section) => {
      if (showLegacyProjects || !homepageSections.has(section)) return

      event?.preventDefault()
      const tabs = document.getElementById('major-section-tabs')
      const headerHeight = Number.parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--app-header-height'),
      ) || 0
      const tabsBoundary = tabs
        ? tabs.getBoundingClientRect().top + window.scrollY
        : window.scrollY
      const isAtOrBelowTabs = window.scrollY + headerHeight >= tabsBoundary - 1
      const nextHash = `#${section}`

      if (window.location.pathname !== '/' || window.location.hash !== nextHash) {
        window.history.pushState(null, '', `/${nextHash}`)
      }
      setActiveHomepageSection(section)

      if (!isAtOrBelowTabs) {
        window.requestAnimationFrame(() => {
          tabs?.scrollIntoView({ behavior: 'auto', block: 'start' })
        })
      }
    },
    [showLegacyProjects],
  )
  const accentColorMap = {
    purple: '#6A22FF',
    red: '#F62F60',
    green: '#8DFD19',
  }
  const footerColor = accentColorMap[heroColor] ?? accentColorMap.purple

  if (isWorkRoute) {
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
          activeSection="work"
        />
        {caseStudyProject ? (
          <CaseStudyPage project={caseStudyProject} accentColor={footerColor} />
        ) : (
          <main
            className="flex min-h-screen items-center justify-center px-4 text-center"
            style={{ paddingTop: 'var(--app-header-height, 60px)' }}
          >
            <div>
              <p className="type-meta mb-4 uppercase tracking-[0.12em] opacity-60">
                Work
              </p>
              <h1 className="type-heading mb-6">Case study not found</h1>
              <a
                className="type-ui border-b border-current pb-1 font-semibold uppercase tracking-[0.08em]"
                href="/#work"
              >
                ← Back to Work
              </a>
            </div>
          </main>
        )}
      </div>
    )
  }

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
        activeSection={activeHomepageSection}
        onSectionNavigate={showLegacyProjects ? undefined : navigateHomepageSection}
      />
      <main>
        <div className="homepage-major-shell relative">
          <HeroSection heroColor={heroColor} lang={lang} />
          <MajorSectionTabs
            activeSection={activeHomepageSection}
            onNavigate={showLegacyProjects ? undefined : navigateHomepageSection}
          />

          {showLegacyProjects ? (
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
          ) : (
            <div className="homepage-major-panels">
              <div
                hidden={activeHomepageSection !== 'work'}
                aria-hidden={activeHomepageSection !== 'work' ? 'true' : undefined}
              >
                <SelectedWorkSection />
              </div>
              <div
                hidden={activeHomepageSection !== 'about'}
                aria-hidden={activeHomepageSection !== 'about' ? 'true' : undefined}
              >
                <ProjectsSection lang={lang} />
              </div>
              <div
                hidden={activeHomepageSection !== 'archive'}
                aria-hidden={activeHomepageSection !== 'archive' ? 'true' : undefined}
              >
                <ArchiveSection />
              </div>
            </div>
          )}
        </div>
        <ContactSection lang={lang} />
        <Footer accentColor={footerColor} lang={lang} />
      </main>
    </div>
  )
}

export default App
