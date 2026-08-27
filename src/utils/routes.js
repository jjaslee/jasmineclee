export const LEGACY_PROJECT_CATEGORIES = ['photos', 'design', 'technicals']

export const SECTION_NAV_PATHS = new Set(['/', '/home', '/projects', '/about', '/contact'])

export function normalizePath(pathname) {
  const path = String(pathname || '/').split('?')[0]
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '') || '/'
}

export function buildProjectPath(category, slug = null) {
  if (!LEGACY_PROJECT_CATEGORIES.includes(category)) return null
  return slug ? `/projects/${category}/${slug}` : `/projects/${category}`
}

export function parseProjectPath(pathname) {
  const parts = normalizePath(pathname).split('/').filter(Boolean)
  if (parts[0] !== 'projects') return null
  const root = parts[1]
  const subSlug = parts[2] ?? null
  if (!LEGACY_PROJECT_CATEGORIES.includes(root)) return null
  return { root, subSlug }
}

export function legacyProjectPathFromHash(hash) {
  const rawHash = String(hash || '')
  if (!rawHash || rawHash === '#') return null

  let legacyValue = rawHash.slice(1)
  try {
    legacyValue = decodeURIComponent(legacyValue)
  } catch {
    return null
  }

  legacyValue = legacyValue.replace(/^\/+/, '').replace(/\/+$/, '')
  if (!legacyValue.startsWith('projects/')) return null

  const parts = legacyValue.split('/').filter(Boolean)
  if (parts.length < 2 || parts.length > 3) return null

  const candidatePath = `/${parts.join('/')}`
  return parseProjectPath(candidatePath) ? candidatePath : null
}

export function scrollPageToPath(pathname) {
  if (typeof window === 'undefined') return
  const parts = normalizePath(pathname).split('/').filter(Boolean)
  if (!parts.length) {
    const home = document.getElementById('home')
    if (home) home.scrollIntoView({ behavior: 'auto', block: 'start' })
    return
  }

  let id = null
  if (parts[0] === 'projects') id = 'projects'
  else if (parts[0] === 'home' || parts[0] === 'about' || parts[0] === 'contact') id = parts[0]

  if (!id) return

  const el = document.getElementById(id)
  if (!el) return

  const run = () => el.scrollIntoView({ behavior: 'auto', block: 'start' })
  run()
  requestAnimationFrame(() => requestAnimationFrame(run))
}

export function scrollPageToHash(hash) {
  if (typeof window === 'undefined') return false
  const rawHash = String(hash || '')
  if (!rawHash || rawHash === '#') return false

  let id = rawHash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    return false
  }

  const el = document.getElementById(id)
  if (!el) return false

  const run = () => el.scrollIntoView({ behavior: 'auto', block: 'start' })
  run()
  requestAnimationFrame(() => requestAnimationFrame(run))
  return true
}
