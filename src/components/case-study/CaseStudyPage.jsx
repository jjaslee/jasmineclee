import { useEffect, useMemo, useRef } from 'react'
import { FEATURED_PROJECTS } from '../../data/projects'
import knownIssueSource from '../../../case-studies/known-issue.html?raw'
import jascielleSource from '../../../case-studies/jascielle-photography.html?raw'
import goniometrixSource from '../../../case-studies/goniometrix.html?raw'
import studioIndexSource from '../../../case-studies/objects-in-context.html?raw'
import calHacksSource from '../../../case-studies/cal-hacks.html?raw'
import './case-study.css'

const caseStudySources = {
  'known-issue': knownIssueSource,
  'jascielle-photography': jascielleSource,
  goniometrix: goniometrixSource,
  'the-studio-index': studioIndexSource,
  'cal-hacks': calHacksSource,
}

function extractAuthoredCaseStudy(source, disabledExternalUrls = []) {
  const documentNode = new DOMParser().parseFromString(source, 'text/html')
  const main = documentNode.querySelector('.case-main')
  const toc = documentNode.querySelector('.case-toc')

  disabledExternalUrls.forEach((href) => {
    main?.querySelector(`a[href="${href}"]`)?.closest('p')?.remove()
  })

  return {
    mainHtml: main?.innerHTML || '',
    tocHtml: toc?.innerHTML || '',
    tocLabel: toc?.getAttribute('aria-label') || 'Case study sections',
    title: documentNode.querySelector('title')?.textContent || 'Case Study — Jasmine Lee',
  }
}

function projectName(project) {
  return project.featuredTitle || project.title
}

export function CaseStudyComingSoon({ project, accentColor }) {
  useEffect(() => {
    document.title = `${project.title} — Case Study Coming Soon`
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [project.title])

  return (
    <div
      className="integrated-case-study"
      style={{ '--case-accent': accentColor }}
    >
      <main
        id="case-content"
        className="flex min-h-screen items-center justify-center px-5 pb-16 text-center sm:px-8"
        style={{ paddingTop: 'calc(var(--app-header-height, 3.75rem) + 4rem)' }}
      >
        <div className="flex max-w-2xl flex-col items-center">
          <h1 className="type-heading mb-5">CAL HACKS</h1>
          <p className="type-body mb-8 opacity-80">
            Collaborative product + design project
          </p>
          <p
            className="type-meta mb-12 font-semibold tracking-[0.12em]"
            style={{ color: accentColor }}
          >
            CASE STUDY COMING SOON
          </p>
          <a
            className="type-ui border-b pb-1 font-semibold tracking-[0.08em]"
            href="/#work"
            style={{ borderColor: accentColor }}
          >
            ← Back to Work
          </a>
        </div>
      </main>
    </div>
  )
}

export default function CaseStudyPage({ project }) {
  const rootRef = useRef(null)
  const authored = useMemo(
    () =>
      extractAuthoredCaseStudy(
        caseStudySources[project.id] || '',
        project.disabledExternalUrls,
      ),
    [project.disabledExternalUrls, project.id],
  )
  const featuredIndex = FEATURED_PROJECTS.findIndex((item) => item.id === project.id)
  const hasFeaturedNavigation = featuredIndex >= 0
  const previousProject = hasFeaturedNavigation
    ? FEATURED_PROJECTS[(featuredIndex - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length]
    : null
  const nextProject = hasFeaturedNavigation
    ? FEATURED_PROJECTS[(featuredIndex + 1) % FEATURED_PROJECTS.length]
    : null

  useEffect(() => {
    document.title = authored.title
    const root = rootRef.current
    if (!root) return undefined

    const sections = [...root.querySelectorAll('.case-section[id]')]
    const tocLinks = [...root.querySelectorAll('[data-toc-link]')]
    const mobileLabel = root.querySelector('[data-mobile-label]')
    const mobileToc = root.querySelector('.mobile-toc')

    const setCurrentSection = (id) => {
      const activeLink = tocLinks.find((link) => link.hash === `#${id}`)
      tocLinks.forEach((link) => {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      })
      if (mobileLabel && activeLink) mobileLabel.textContent = activeLink.textContent.trim()
    }

    const cleanups = tocLinks.map((link) => {
      const onClick = () => {
        setCurrentSection(decodeURIComponent(link.hash.slice(1)))
        if (mobileToc?.open) mobileToc.open = false
      }
      link.addEventListener('click', onClick)
      return () => link.removeEventListener('click', onClick)
    })

    let observer
    if ('IntersectionObserver' in window && sections.length) {
      const visible = new Map()
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => visible.set(entry.target.id, entry))
          const active = [...visible.values()]
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
            )[0]
          if (active) setCurrentSection(active.target.id)
        },
        { rootMargin: '-20% 0px -68% 0px', threshold: [0, 0.01] },
      )
      sections.forEach((section) => observer.observe(section))
    }

    const initialSection = window.location.hash.slice(1) || sections[0]?.id
    setCurrentSection(initialSection)
    window.requestAnimationFrame(() => {
      if (window.location.hash) {
        let hashId = window.location.hash.slice(1)
        try {
          hashId = decodeURIComponent(hashId)
        } catch {
          hashId = ''
        }
        document.getElementById(hashId)?.scrollIntoView({ behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      observer?.disconnect()
    }
  }, [authored])

  return (
    <div
      ref={rootRef}
      className="integrated-case-study"
      style={{ '--case-accent': project.folderColors.body }}
    >
      <a className="case-skip-link" href="#case-content">
        Skip to case study
      </a>
      <div className="case-shell">
        <nav
          className="case-toc"
          aria-label={authored.tocLabel}
          dangerouslySetInnerHTML={{ __html: authored.tocHtml }}
        />
        <div className="case-content-column">
          <a className="case-back-link" href="/#work">
            ← Back to Work
          </a>
          <main
            className="case-main"
            id="case-content"
            dangerouslySetInnerHTML={{ __html: authored.mainHtml }}
          />

          {hasFeaturedNavigation ? (
            <nav className="case-project-navigation" aria-label="Selected Work projects">
              <a href={previousProject.caseStudyRoute} rel="prev">
                <span>← Previous</span>
                <strong>{projectName(previousProject)}</strong>
              </a>
              <a href={nextProject.caseStudyRoute} rel="next">
                <span>Next →</span>
                <strong>{projectName(nextProject)}</strong>
              </a>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  )
}
