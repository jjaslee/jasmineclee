import { useEffect, useMemo, useState } from 'react'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactForm({ lang = 'EN' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [showValidation, setShowValidation] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const fieldValidity = useMemo(
    () => ({
      name: Boolean(name.trim()),
      email: Boolean(email.trim()) && validateEmail(email.trim()),
      message: Boolean(message.trim()),
    }),
    [email, message, name],
  )
  const isValid = fieldValidity.name && fieldValidity.email && fieldValidity.message

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  useEffect(() => {
    if (!isConfirmOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isSending) setIsConfirmOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isConfirmOpen, isSending])

  const clearForm = () => {
    setName('')
    setEmail('')
    setMessage('')
    setShowValidation(false)
  }

  const submitMessage = async () => {
    if (honeypot) {
      setToast({ type: 'success', text: 'Thank you. Message sent.' })
      clearForm()
      setIsConfirmOpen(false)
      return
    }

    if (!FORMSPREE_ENDPOINT) {
      setToast({ type: 'error', text: 'Form is not configured yet.' })
      setIsConfirmOpen(false)
      return
    }

    if (!isValid) {
      setShowValidation(true)
      setToast({ type: 'error', text: 'Please fill out all required fields.' })
      setIsConfirmOpen(false)
      return
    }

    setIsSending(true)
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
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

      if (!response.ok) throw new Error('Request failed')

      setToast({ type: 'success', text: 'Thank you. Message sent.' })
      clearForm()
      setIsConfirmOpen(false)
    } catch {
      setToast({ type: 'error', text: 'Could not send. Please try again.' })
      setIsConfirmOpen(false)
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSending) return
    setShowValidation(true)
    if (!isValid) {
      setToast({ type: 'error', text: 'Please fill out all required fields.' })
      return
    }
    setIsConfirmOpen(true)
  }

  const label = {
    name: lang === 'ZH' ? '你嘅姓名' : 'Your name',
    email: lang === 'ZH' ? '你嘅電郵' : 'Your email',
    message: lang === 'ZH' ? '你嘅訊息' : 'Your message',
  }

  return (
    <div className="connect-form-shell">
      <form className="connect-form" onSubmit={handleSubmit} noValidate>
        <label className="sr-only" aria-hidden>
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            className="hidden"
          />
        </label>

        <div className="connect-form__grid">
          <label className="connect-field">
            <span className="type-meta">{label.name} *</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              aria-invalid={showValidation && !fieldValidity.name ? 'true' : undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="connect-field">
            <span className="type-meta">{label.email} *</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              aria-invalid={showValidation && !fieldValidity.email ? 'true' : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="connect-field connect-field--message">
            <span className="type-meta">{label.message} *</span>
            <textarea
              name="message"
              rows={3}
              value={message}
              aria-invalid={showValidation && !fieldValidity.message ? 'true' : undefined}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <div className="connect-form__actions">
          <span className="type-meta" aria-hidden>
            * Required
          </span>
          <button className="connect-send type-ui" type="submit" disabled={isSending}>
            {isSending ? 'SENDING…' : 'SEND →'}
          </button>
        </div>
      </form>

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
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="modal-title">Send this message?</p>
            <p className="modal-body">I will send your note to Jasmine.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn"
                autoFocus
                disabled={isSending}
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                disabled={isSending}
                onClick={submitMessage}
              >
                {isSending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      ) : null}
    </div>
  )
}
