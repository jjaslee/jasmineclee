import { forwardRef } from 'react'

const Folder = forwardRef(function Folder(
  {
    label,
    bodyColor,
    tabColor,
    size = 'large',
    className = '',
    labelClassName = '',
    ...buttonProps
  },
  ref,
) {
  const isSmall = size === 'small'
  const buttonClassName = isSmall
    ? 'flex flex-col items-center gap-2 hover:opacity-80 transition-opacity'
    : 'group flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer'
  const defaultLabelClassName = isSmall
    ? 'text-black text-xs font-medium text-center'
    : 'app-text text-sm font-medium tracking-wide'

  return (
    <button
      ref={ref}
      type="button"
      className={`${buttonClassName} ${className}`.trim()}
      {...buttonProps}
    >
      {isSmall ? (
        <div className="relative w-20 h-16" aria-hidden>
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
      ) : (
        <div className="relative w-40 h-28" aria-hidden>
          <div
            className="absolute left-0 top-3 w-full h-4 rounded-t-[4px]"
            style={{
              backgroundColor: tabColor,
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
            }}
          />
          <div
            className="absolute left-0 top-0 h-6 w-16"
            style={{
              backgroundColor: tabColor,
              clipPath: 'polygon(0 100%, 0 0, 75% 0, 100% 100%)',
              borderTopLeftRadius: '4px',
            }}
          />
          <div
            className="absolute left-0 top-5 w-full h-[calc(100%-20px)] rounded-b-[6px] shadow-lg"
            style={{
              backgroundColor: bodyColor,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
        </div>
      )}
      <span className={`${defaultLabelClassName} ${labelClassName}`.trim()}>{label}</span>
    </button>
  )
})

export default Folder
