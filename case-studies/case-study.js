const ACCENTS = {
  purple: '#6A22FF',
  red: '#F62F60',
  green: '#8DFD19',
}

const storage = {
  get(key, fallback) {
    try { return window.localStorage.getItem(key) || fallback } catch { return fallback }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value) } catch { /* Storage may be unavailable. */ }
  },
}

const root = document.documentElement
const accentButtons = [...document.querySelectorAll('[data-accent]')]
const themeButton = document.querySelector('[data-theme-toggle]')
const languageButton = document.querySelector('[data-language-toggle]')

function setAccent(name) {
  const safeName = Object.hasOwn(ACCENTS, name) ? name : 'purple'
  root.style.setProperty('--accent', ACCENTS[safeName])
  root.dataset.accent = safeName
  accentButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.accent === safeName)))
  storage.set('portfolio-accent', safeName)
}

function setTheme(theme) {
  const safeTheme = theme === 'light' ? 'light' : 'dark'
  root.dataset.theme = safeTheme
  themeButton?.setAttribute('aria-label', safeTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
  storage.set('portfolio-theme', safeTheme)
}

function setLanguage(language) {
  const safeLanguage = language === 'ZH' ? 'ZH' : 'EN'
  document.documentElement.lang = safeLanguage === 'ZH' ? 'zh-Hant' : 'en'
  languageButton?.querySelectorAll('[data-lang]').forEach((node) => {
    node.classList.toggle('is-active', node.dataset.lang === safeLanguage)
  })
  languageButton?.setAttribute('aria-label', safeLanguage === 'EN' ? 'Switch language to Chinese' : 'Switch language to English')
  storage.set('portfolio-language', safeLanguage)
}

setAccent(storage.get('portfolio-accent', 'purple'))
setTheme(storage.get('portfolio-theme', 'dark'))
setLanguage(storage.get('portfolio-language', 'EN'))

accentButtons.forEach((button) => button.addEventListener('click', () => {
  const swatch = button.querySelector('.accent-button__swatch')
  if (swatch && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    swatch.classList.remove('flip-square')
    void swatch.offsetWidth
    swatch.classList.add('flip-square')
    swatch.addEventListener('animationend', () => swatch.classList.remove('flip-square'), { once: true })
  }
  setAccent(button.dataset.accent)
}))
themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'))
languageButton?.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'ZH' : 'EN'))

const sections = [...document.querySelectorAll('.case-section[id]')]
const tocLinks = [...document.querySelectorAll('[data-toc-link]')]
const mobileLabel = document.querySelector('[data-mobile-label]')
const mobileToc = document.querySelector('.mobile-toc')

function setCurrentSection(id) {
  const activeLink = tocLinks.find((link) => link.hash === `#${id}`)
  tocLinks.forEach((link) => {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  })
  if (mobileLabel && activeLink) mobileLabel.textContent = activeLink.textContent.trim()
}

tocLinks.forEach((link) => link.addEventListener('click', () => {
  const id = decodeURIComponent(link.hash.slice(1))
  setCurrentSection(id)
  if (mobileToc?.open) mobileToc.open = false
}))

if ('IntersectionObserver' in window && sections.length) {
  const visible = new Map()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target.id, entry))
    const active = [...visible.values()]
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0]
    if (active) setCurrentSection(active.target.id)
  }, { rootMargin: '-20% 0px -68% 0px', threshold: [0, 0.01] })
  sections.forEach((section) => observer.observe(section))
}

setCurrentSection(window.location.hash.slice(1) || sections[0]?.id)
