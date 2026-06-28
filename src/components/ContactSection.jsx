import { useEffect, useMemo, useState } from 'react'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT
const CONTACT_EMAIL = 'jas.lee@berkeley.edu'
const RESUME_PDF_PATH = '/jasmine-lee-resume.pdf'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactSection({ lang = 'EN' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [toast, setToast] = useState(null) // { type: 'success' | 'error', text: string }
  const [isSending, setIsSending] = useState(false)

  const isValid = useMemo(() => {
    if (!name.trim()) return false
    if (!email.trim() || !validateEmail(email.trim())) return false
    if (!message.trim()) return false
    return true
  }, [name, email, message])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(t)
  }, [toast])

  const copyEmailToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(CONTACT_EMAIL)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = CONTACT_EMAIL
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setToast({ type: 'success', text: 'Copied!' })
    } catch {
      setToast({ type: 'error', text: 'Could not copy email.' })
    }
  }

  const onSubmit = async () => {
    if (honeypot) {
      // Spam: pretend success but do nothing.
      setToast({ type: 'success', text: 'Thank you. Message sent.' })
      setName('')
      setEmail('')
      setMessage('')
      setIsConfirmOpen(false)
      return
    }

    if (!FORMSPREE_ENDPOINT) {
      setToast({ type: 'error', text: 'Form is not configured yet.' })
      setIsConfirmOpen(false)
      return
    }

    if (!isValid) {
      setToast({ type: 'error', text: 'Please fill out all required fields.' })
      setIsConfirmOpen(false)
      return
    }

    setIsSending(true)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      setToast({ type: 'success', text: 'Thank you. Message sent.' })
      setName('')
      setEmail('')
      setMessage('')
      setIsConfirmOpen(false)
    } catch {
      setToast({ type: 'error', text: 'Could not send. Please try again.' })
      setIsConfirmOpen(false)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="relative -mt-8">
      {/* Sticky tab bar for CONTACT with translucent backing outside the tab */}
      <div className="sticky z-[70]" style={{ top: 'var(--app-header-height, 56px)' }}>
        <div className="relative h-8 chrome-bg-60 backdrop-blur-sm">
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: '#8DFD19',
              clipPath: 'polygon(0 0, 33% 0, 36% 64%, 100% 64%, 100% 100%, 0 100%)',
            }}
            aria-hidden
          >
            <div className="pl-[10%] flex items-center h-full">
              <span className="font-bangers text-black tracking-widest text-sm">CONTACT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section content below the sticky tab */}
      <div className="section-bg min-h-screen pt-16 pb-20">
        <div className="mx-auto px-6" style={{ maxWidth: 740 }}>
          <div
            className="paper-bg border-[6px] border-[#8DFD19] relative rounded-xl overflow-hidden"
            style={{ minHeight: 499 }}
          >
            <form
              className="relative grid min-h-[499px] grid-cols-1 md:grid-cols-2 md:grid-rows-[auto,1fr]"
              onSubmit={(e) => {
                e.preventDefault()
                if (!isSending) setIsConfirmOpen(true)
              }}
            >
              {/* Center line (desktop only) */}
              <div
                className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-px bg-green-400/60 md:block"
                aria-hidden
              />

              {/* Image */}
              <div className="p-6 pb-3 md:row-start-1 md:col-start-1">
                <div className="bg-gray-400 overflow-hidden rounded-lg">
                  <img
                    src="/contact-sf.jpg"
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                    style={{ filter: 'grayscale(1) contrast(0.72) brightness(1.08)' }}
                  />
                </div>
              </div>

              {/* Title */}
              <div
                className="flex items-end px-6 pb-3 pt-2 md:row-start-1 md:col-start-2 md:p-6 md:pb-1 md:pt-[1.85rem]"
                style={{ color: '#2F5D00' }}
              >
                <h2 className="font-bangers text-2xl tracking-wide">LET'S CONNECT</h2>
              </div>

              {/* Name + email */}
              <div
                className="flex flex-col px-6 pt-0 pb-3 md:row-start-2 md:col-start-2 md:h-full md:p-6 md:pt-3 md:pb-1"
                style={{ color: '#2F5D00' }}
              >
                <label className="sr-only" aria-hidden>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    name="website"
                  />
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ZH' ? '你嘅姓名 *' : 'Your name *'}
                  className="contact-placeholder mb-4 w-full border border-gray-300 bg-white px-4 py-3 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  style={{ color: '#2F5D00' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder={lang === 'ZH' ? '你嘅電郵 *' : 'Your email *'}
                  className="contact-placeholder mb-4 w-full border border-gray-300 bg-white px-4 py-3 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50 md:mb-0"
                  style={{ color: '#2F5D00' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="mt-auto hidden justify-end md:flex">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-2 px-7 py-3 font-bangers text-xl tracking-wide transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ color: '#2F5D00' }}
                  >
                    <span>{isSending ? 'SENDING' : 'SEND'}</span>
                    <span className="text-lg" aria-hidden>
                      ▶
                    </span>
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col justify-between px-6 pt-0 pb-3 md:row-start-2 md:col-start-1 md:h-full md:p-6 md:pt-3">
                <textarea
                  placeholder={lang === 'ZH' ? '你嘅訊息 *' : 'Your message *'}
                  rows={6}
                  className="contact-placeholder w-full resize-none border border-gray-300 bg-white px-4 py-3 placeholder:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  style={{ color: '#2F5D00' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="mt-4 hidden flex-shrink-0 items-center gap-3 pl-1 md:mt-6 md:flex">
                  <a
                    href="https://www.linkedin.com/in/jasmineclee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: '#2F5D00', display: 'block' }}
                      aria-hidden
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={RESUME_PDF_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                    style={{ color: '#2F5D00' }}
                    aria-label="Open resume PDF"
                  >
                    <span className="font-bangers text-base leading-none" aria-hidden>
                      PDF
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                    style={{ color: '#2F5D00' }}
                    aria-label="Copy email address"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: '#2F5D00', flexShrink: 0 }}
                      aria-hidden
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile footer: icons + send */}
              <div className="flex items-center justify-between gap-4 px-6 pb-6 pt-1 md:hidden">
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/jasmineclee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: '#2F5D00', display: 'block' }}
                      aria-hidden
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={RESUME_PDF_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                    style={{ color: '#2F5D00' }}
                    aria-label="Open resume PDF"
                  >
                    <span className="font-bangers text-base leading-none" aria-hidden>
                      PDF
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                    style={{ color: '#2F5D00' }}
                    aria-label="Copy email address"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: '#2F5D00', flexShrink: 0 }}
                      aria-hidden
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex flex-shrink-0 items-center gap-2 px-4 py-3 font-bangers text-xl tracking-wide transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ color: '#2F5D00' }}
                >
                  <span>{isSending ? 'SENDING' : 'SEND'}</span>
                  <span className="text-lg" aria-hidden>
                    ▶
                  </span>
                </button>
              </div>
            </form>

            {/* Confirm modal (only blurs this postcard) */}
            {isConfirmOpen ? (
              <div
                className="contact-modal-overlay"
                role="presentation"
                onMouseDown={() => (!isSending ? setIsConfirmOpen(false) : null)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Confirm send"
                  className="modal-card"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <p className="modal-title">Send this message?</p>
                  <p className="modal-body">I will send your note to Jasmine.</p>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="modal-btn"
                      disabled={isSending}
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="modal-btn modal-btn-primary"
                      disabled={isSending}
                      onClick={onSubmit}
                    >
                      {isSending ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast ? (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      ) : null}
    </section>
  )
}

