const heroColorMap = {
  purple: '#6A22FF',
  red: '#F62F60',
  green: '#8DFD19',
}

const heroCopy = {
  EN: {
    title: 'Designer & Builder',
    body: 'I design and build products, interfaces, and physical systems grounded in human behavior and data.',
    education: 'Cognitive Science + Data Science',
    school: 'UC Berkeley · Design Innovation',
  },
}

export default function HeroSection({ heroColor = 'purple', lang = 'EN' }) {
  const accentColor = heroColorMap[heroColor] ?? heroColorMap.purple
  const copy = heroCopy[lang] ?? heroCopy.EN

  return (
    <section
      id="home"
      className="hero-shell relative flex min-h-[100svh] overflow-hidden"
    >
      <div className="flex min-h-0 w-full flex-1 items-center">
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 sm:px-10 lg:px-[var(--page-inline)]">
          <div className="w-full max-w-[64rem] -translate-y-4 lg:ml-[var(--header-accent-start)] lg:w-[calc(100%_-_var(--header-accent-start))]">
            <h1
              className="type-display max-w-[12ch] tracking-[-0.04em]"
              style={{ color: accentColor }}
            >
              {copy.title}
            </h1>

            <p className="type-body mt-7 max-w-[42rem] app-text sm:mt-8">
              {copy.body}
            </p>

            <div className="type-ui mt-8 app-text sm:mt-10">
              <p className="font-semibold">{copy.education}</p>
              <p className="mt-1 font-normal opacity-60">{copy.school}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[5.5rem] sm:bottom-28">
        <div className="type-meta flex items-center justify-between px-6 uppercase tracking-[0.2em] app-text opacity-45 sm:px-10 lg:px-[8vw]">
          <span>BAY AREA</span>
          <span>© 2026</span>
        </div>
      </div>
    </section>
  )
}
