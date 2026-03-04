const folders = [
  { label: 'FRONT END', color: 'bg-pink-500' },
  { label: 'DESIGN', color: 'bg-blue-400' },
  { label: 'SIDEHUSTLE', color: 'bg-green-400' },
]

function FolderIcon({ color }) {
  return (
    <div
      className={`w-28 h-24 ${color} shadow-lg flex items-end pb-3 pl-4`}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 88%)',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
      }}
    >
      <div className="w-10 h-1 bg-black/20 rounded" />
    </div>
  )
}

export default function FoldersSection() {
  return (
    <section id="work" className="relative grid-bg py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {folders.map((folder) => (
            <button
              key={folder.label}
              className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
            >
              <FolderIcon color={folder.color} />
              <span className="text-white text-sm font-medium tracking-wide">{folder.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-16">
        <div className="relative shadow-2xl">
          {/* Manila folder tab (label ~1/3 from left) */}
          <div
            className="absolute -top-10 left-1/3 -translate-x-1/2 h-12 w-[220px] border-2 border-black/70 bg-[#f1e2b6]"
            style={{
              clipPath: 'polygon(0 100%, 0 18%, 10% 0, 100% 0, 92% 100%)',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <div className="h-full w-full flex items-center justify-center">
              <span className="font-bangers tracking-wide text-black text-lg">PROJECTS</span>
            </div>
          </div>

          {/* Folder body */}
          <div
            className="bg-[#f7f0d6] border-2 border-black/70 rounded-xl overflow-hidden"
            style={{
              clipPath:
                'polygon(0 0, 26% 0, 30% -14%, 62% -14%, 66% 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            <div className="bg-[#e9ddc0] px-5 py-3 flex items-center justify-end gap-2 border-b border-black/10">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="bg-white/85 p-8 min-h-[180px]">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {['resumecv', 'portfolio', 'sidehustle', 'work', 'design', 'assets'].map((name) => (
                  <button
                    key={name}
                    className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-14 h-12 bg-purple-600 rounded-t-md rounded-br-md flex items-end pb-1 pl-2">
                      <div className="w-4 h-0.5 bg-black/20 rounded" />
                    </div>
                    <span className="text-black text-xs font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 bg-red-500 flex items-center justify-center mt-20">
        <span className="text-white font-medium tracking-widest text-sm">ABOUT ME</span>
      </div>
    </section>
  )
}
