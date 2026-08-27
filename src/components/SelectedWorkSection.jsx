import { useEffect, useMemo, useRef, useState } from 'react'
import { FEATURED_PROJECTS } from '../data/projects'
import Folder from './ui/Folder'
import Window from './ui/Window'

const MOBILE_QUERY = '(max-width: 639px)'

function ProjectPreview({ project }) {
  const title = project.featuredTitle || project.title
  const thumbnail = project.featuredThumbnail || null

  return (
    <article className="w-full text-black" aria-labelledby={`preview-${project.id}-heading`}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.8fr)] md:items-stretch">
        {thumbnail ? (
          <figure className="min-h-48 overflow-hidden bg-black/10 md:min-h-72">
            <img
              src={thumbnail}
              alt={project.featuredThumbnailAlt || `${title} project interface`}
              className="h-full max-h-[24rem] w-full object-cover"
            />
          </figure>
        ) : (
          <div
            className="flex min-h-48 flex-col justify-between p-5 md:min-h-72 md:p-7"
            style={{ backgroundColor: project.folderColors.body }}
            aria-label={`${title} text-only project preview`}
          >
            <span className="type-meta tracking-[0.18em] text-black/65">
              {String(project.featuredOrder).padStart(2, '0')} / SELECTED WORK
            </span>
            <span className="type-heading max-w-[12ch] text-black">{title}</span>
          </div>
        )}

        <div className="flex flex-col justify-between gap-8 py-1">
          <div>
            <p className="type-meta mb-4 tracking-[0.13em] text-black/60">
              {project.featuredDiscipline}
            </p>
            <h3 id={`preview-${project.id}-heading`} className="type-heading mb-4 text-black">
              {title}
            </h3>
            <p className="type-body max-w-[34rem] text-black/80">{project.featuredSummary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.caseStudyRoute ? (
              <a
                href={project.caseStudyRoute}
                className="type-ui w-fit border-b border-black pb-1 font-semibold tracking-[0.08em] text-black transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                VIEW CASE STUDY ↗
              </a>
            ) : null}
            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="type-ui w-fit border-b border-black/50 pb-1 font-medium tracking-[0.08em] text-black/75 transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                {(project.externalLabel || 'View live site').toUpperCase()} ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function SelectedWorkSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [openProjectIds, setOpenProjectIds] = useState([])
  const [windowStack, setWindowStack] = useState([])
  const [cascadeOrder, setCascadeOrder] = useState([])
  const [maximizedIds, setMaximizedIds] = useState([])
  const [minimizingIds, setMinimizingIds] = useState([])
  const folderRefs = useRef(new Map())

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const sync = () => setIsMobile(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isMobile || windowStack.length < 2) return
    const frontProjectId = windowStack[windowStack.length - 1]
    setOpenProjectIds([frontProjectId])
    setWindowStack([frontProjectId])
    setCascadeOrder([frontProjectId])
    setMaximizedIds((ids) => ids.filter((id) => id === frontProjectId))
  }, [isMobile, windowStack])

  const openProjects = useMemo(
    () =>
      openProjectIds
        .map((id) => FEATURED_PROJECTS.find((project) => project.id === id))
        .filter(Boolean),
    [openProjectIds],
  )

  const bringToFront = (projectId) => {
    setWindowStack((ids) => [...ids.filter((id) => id !== projectId), projectId])
  }

  const openProject = (projectId) => {
    setMinimizingIds((ids) => ids.filter((id) => id !== projectId))
    if (isMobile) {
      setOpenProjectIds([projectId])
      setWindowStack([projectId])
      setCascadeOrder([projectId])
      return
    }
    setOpenProjectIds((ids) => (ids.includes(projectId) ? ids : [...ids, projectId]))
    setCascadeOrder((ids) => (ids.includes(projectId) ? ids : [...ids, projectId]))
    bringToFront(projectId)
  }

  const closeProject = (projectId) => {
    setOpenProjectIds((ids) => ids.filter((id) => id !== projectId))
    setWindowStack((ids) => ids.filter((id) => id !== projectId))
    setCascadeOrder((ids) => ids.filter((id) => id !== projectId))
    setMaximizedIds((ids) => ids.filter((id) => id !== projectId))
    setMinimizingIds((ids) => ids.filter((id) => id !== projectId))
    folderRefs.current.get(projectId)?.focus()
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="relative z-20">
      <h2 id="work-heading" className="sr-only">
        Selected Work
      </h2>
      <div className="section-bg px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 justify-items-center gap-x-4 gap-y-10 min-[360px]:grid-cols-2 sm:gap-x-16 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-10">
            {FEATURED_PROJECTS.map((project) => {
              const title = project.featuredTitle || project.title
              const isOpen = openProjectIds.includes(project.id)
              return (
                <Folder
                  key={project.id}
                  ref={(node) => {
                    if (node) folderRefs.current.set(project.id, node)
                    else folderRefs.current.delete(project.id)
                  }}
                  label={title}
                  bodyColor={project.folderColors.body}
                  tabColor={project.folderColors.tab}
                  labelClassName="type-ui text-center tracking-normal"
                  className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
                  aria-label={`Open ${title} project preview`}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? `preview-window-${project.id}` : undefined}
                  onClick={() => openProject(project.id)}
                />
              )
            })}
          </div>
        </div>

        {openProjects.length ? (
          <div
            className={`relative mx-auto mt-8 max-w-[90rem] ${
              isMobile ? '' : 'min-h-[34rem]'
            }`}
            aria-live="polite"
          >
            {openProjects.map((project) => {
              const title = project.featuredTitle || project.title
              const stackIndex = windowStack.indexOf(project.id)
              return (
                <div id={`preview-window-${project.id}`} key={project.id}>
                  <Window
                    title={title}
                    displayTitle={title}
                    iconType={project.featuredIconType}
                    borderColor={project.folderColors.border}
                    stackIndex={stackIndex}
                    cascadeSlot={cascadeOrder.indexOf(project.id)}
                    isFrontWindow={stackIndex === windowStack.length - 1}
                    isMaximized={maximizedIds.includes(project.id)}
                    isMinimizing={minimizingIds.includes(project.id)}
                    variant="preview"
                    layoutMode={isMobile ? 'flow' : 'stacked'}
                    onBringToFront={() => bringToFront(project.id)}
                    onMinimize={() =>
                      setMinimizingIds((ids) =>
                        ids.includes(project.id) ? ids : [...ids, project.id],
                      )
                    }
                    onMaximize={() =>
                      setMaximizedIds((ids) =>
                        ids.includes(project.id)
                          ? ids.filter((id) => id !== project.id)
                          : [...ids, project.id],
                      )
                    }
                    onClose={() => closeProject(project.id)}
                    onMinimizeTransitionEnd={() => {
                      if (minimizingIds.includes(project.id)) closeProject(project.id)
                    }}
                  >
                    <ProjectPreview project={project} />
                  </Window>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
