import {
  DocumentMedia,
  MEDIA_CLOSE_BUTTON_CLASS,
  MEDIA_NAV_ARROW_CLASS,
  PhoneScrollMedia,
} from './MediaViewer'

export default function AquaSyncMediaPresentation({
  item = {},
  count,
  borderColor,
  onClose,
  onPrevious,
  onNext,
  isMaximized,
  isMdUp,
}) {
  return (
    <div className="w-full h-full flex items-stretch justify-center gap-3 sm:gap-5">
      {count > 1 ? (
        <div className="flex items-center justify-center w-10 sm:w-14 shrink-0">
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous item"
            className={MEDIA_NAV_ARROW_CLASS}
            style={{ color: borderColor }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {'<'}
          </button>
        </div>
      ) : (
        <div className="w-10 sm:w-14 shrink-0" aria-hidden />
      )}

      <div className="flex-1 min-w-0 flex items-stretch justify-center">
        {item.type === 'doc' ? (
          <DocumentMedia
            pages={item.pages || []}
            isMaximized={isMaximized}
            isMdUp={isMdUp}
          />
        ) : item.type === 'phoneScrollImage' ? (
          <PhoneScrollMedia screenSrc={item.screenSrc} isMaximized={isMaximized} />
        ) : item.type === 'image' && item.src ? (
          <div className="relative w-full h-full max-w-[min(720px,100%)] flex items-center justify-center px-6 py-6 sm:px-10 sm:py-8">
            <img
              src={item.src}
              alt=""
              className="block object-contain rounded-md cursor-default"
              style={{ maxHeight: '88%', maxWidth: '88%' }}
              onMouseDown={(event) => event.stopPropagation()}
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
              draggable={false}
            />
          </div>
        ) : null}
      </div>

      <div
        className="flex h-full min-h-0 w-10 shrink-0 flex-col items-center pr-0.5 pt-2 sm:w-14 sm:pr-1 sm:pt-3"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className={MEDIA_CLOSE_BUTTON_CLASS}
          style={{ color: borderColor }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          ×
        </button>
        {count > 1 ? (
          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            <button
              type="button"
              onClick={onNext}
              aria-label="Next item"
              className={MEDIA_NAV_ARROW_CLASS}
              style={{ color: borderColor }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {'>'}
            </button>
          </div>
        ) : (
          <div className="min-h-0 flex-1" aria-hidden />
        )}
      </div>
    </div>
  )
}
