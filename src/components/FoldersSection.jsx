const folders = [
  { label: 'PHOTOS', bodyColor: '#C96AED', tabColor: '#A825D9' },
  { label: 'DESIGN', bodyColor: '#50C0FA', tabColor: '#1688C4' },
  { label: 'TECHNICALS', bodyColor: '#C0F000', tabColor: '#8EAC12' },
]

const innerFolderNames = ['animālis', 'sēcūdēre', 'sōlītūdō', 'havaia', 'pacificus']

function FolderIcon({ bodyColor, tabColor }) {
  return (
    <div className="relative w-40 h-28">
      {/* Top strip behind tab (slight band across the top) */}
      <div
        className="absolute left-0 top-3 w-full h-4 rounded-t-[4px]"
        style={{
          backgroundColor: tabColor,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      />

      {/* Trapezoid tab sitting on the strip */}
      <div
        className="absolute left-0 top-0 h-6 w-16"
        style={{
          backgroundColor: tabColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '4px',
        }}
      />

      {/* Folder body */}
      <div
        className="absolute left-0 top-5 w-full h-[calc(100%-20px)] rounded-b-[6px] shadow-lg"
        style={{
          backgroundColor: bodyColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
    </div>
  )
}

function SmallFolderIcon() {
  const bodyColor = '#C96AED'
  const tabColor = '#A825D9'
  return (
    <div className="relative w-20 h-16">
      <div
        className="absolute left-0 top-2 w-full h-3 rounded-t-[3px]"
        style={{
          backgroundColor: tabColor,
          borderTopLeftRadius: '3px',
          borderTopRightRadius: '3px',
        }}
      />
      <div
        className="absolute left-0 top-0 h-4 w-12"
        style={{
          backgroundColor: tabColor,
          clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
          borderTopLeftRadius: '3px',
        }}
      />
      <div
        className="absolute left-0 top-3 w-full h-[calc(100%-14px)] rounded-b-[4px] shadow-md"
        style={{
          backgroundColor: bodyColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
    </div>
  )
}

export default function FoldersSection() {
  return (
    <section id="work" className="relative">
      {/* Sticky tab bar for PROJECTS */}
      <div className="sticky top-14 z-40">
        <div className="relative h-8 bg-black/90 backdrop-blur-sm">
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: '#6A22FF',
              clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
            }}
            aria-hidden
          >
            <div className="pl-[10%] flex items-center h-full">
              <span className="font-bangers text-white tracking-widest text-sm">PROJECTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section content below the sticky tab (purple grid) */}
      <div className="grid-bg-purple bg-black min-h-screen pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {folders.map((folder) => (
              <button
                key={folder.label}
                className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
              >
                <FolderIcon bodyColor={folder.bodyColor} tabColor={folder.tabColor} />
                <span className="text-white text-sm font-medium tracking-wide">
                  {folder.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-16">
          <div className="relative shadow-2xl bg">
            {/* Window body */}
            <div
              className="bg-white border-2 rounded-xl overflow-hidden"
              style={{
                borderColor: '#C96AED',
                clipPath:
                  'polygon(0 0, 26% 0, 30% -14%, 62% -14%, 66% 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
              <div className="bg-white px-5 py-3 flex items-center justify-between gap-4 border-b border-black/10">
                {/* Left: camera icon + active tab label */}
                <div className="flex items-center gap-3">
                  <div className="relative w-6 h-3 bg-black">
                    {/* Top tab: slightly taller and touching body */}
                    <div
                      className="absolute -top-0.5 left-0.5 bg-black"
                      style={{ width: '10px', height: '4px' }}
                    />
                    {/* Lens circle moved to the right side */}
                    <div className="absolute inset-y-0.5 right-1.5 w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-black font-medium text-sm">Photos</span>
                </div>

                {/* Right: window controls */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="bg-white/85 p-8 min-h-[180px]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {innerFolderNames.map((name) => (
                    <button
                      key={name}
                      className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <SmallFolderIcon />
                      <span className="text-black text-xs font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
