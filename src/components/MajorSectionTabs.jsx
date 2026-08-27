import SectionTab from './ui/SectionTab'

const sections = [
  {
    id: 'work',
    label: '01 / Selected Work',
    shortLabel: '01 / Work',
    href: '/#work',
    backgroundColor: '#6A22FF',
    textColor: 'white',
    position: 'left',
  },
  {
    id: 'about',
    label: '02 / About Me',
    shortLabel: '02 / About',
    href: '/#about',
    backgroundColor: '#F62F60',
    textColor: 'white',
    position: 'middle',
  },
  {
    id: 'archive',
    label: '03 / Archives',
    shortLabel: '03 / Archive',
    href: '/#archive',
    backgroundColor: '#8DFD19',
    textColor: 'black',
    position: 'right',
  },
]

export default function MajorSectionTabs({ activeSection = 'work', onNavigate }) {
  const activeTab = sections.find((section) => section.id === activeSection) || sections[0]

  return (
    <nav
      id="major-section-tabs"
      aria-label="Homepage sections"
      className="major-section-tabs hero-folder-tabs"
    >
      <div className="hero-folder-tabs__list">
        {sections.map((section) => (
          <SectionTab
            key={section.id}
            variant="hero-folder"
            isActive={section.id === activeSection}
            onClick={(event) => onNavigate?.(event, section.id)}
            {...section}
          />
        ))}
      </div>
      <div
        className="hero-folder-tabs__rail"
        style={{ backgroundColor: activeTab.backgroundColor }}
        aria-hidden
      />
    </nav>
  )
}
