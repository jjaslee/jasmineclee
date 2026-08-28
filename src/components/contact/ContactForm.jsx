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
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const fieldErrors = useMemo(
    () => ({
      name: name.trim() ? '' : 'Please enter your name.',
      email: !email.trim()
        ? 'Please enter your email.'
        : validateEmail(email.trim())
          ? ''
          : 'Please enter a valid email address.',
      message: message.trim() ? '' : 'Please enter a message.',
    }),
    [email, message, name],
  )
  const fieldValidity = {
    name: !fieldErrors.name,
    email: !fieldErrors.email,
    message: !fieldErrors.message,
  }
  const isValid = fieldValidity.name && fieldValidity.email && fieldValidity.message

  useEffect(() => {
    if (!submissionStatus) return undefined
    const timeoutId = window.setTimeout(() => setSubmissionStatus(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [submissionStatus])

  const clearForm = () => {
    setName('')
    setEmail('')
    setMessage('')
    setShowValidation(false)
  }

  const submitMessage = async () => {
    if (honeypot) {
      setSubmissionStatus({ type: 'success', text: 'Thank you. Message sent.' })
      clearForm()
      return
    }

    if (!FORMSPREE_ENDPOINT) {
      setSubmissionStatus({ type: 'error', text: 'Form is not configured yet.' })
      return
    }

    if (!isValid) {
      setShowValidation(true)
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

      setSubmissionStatus({ type: 'success', text: 'Thank you. Message sent.' })
      clearForm()
    } catch {
      setSubmissionStatus({ type: 'error', text: 'Could not send. Please try again.' })
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSending) return
    setSubmissionStatus(null)
    setShowValidation(true)
    if (!isValid) return
    submitMessage()
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
              aria-describedby={showValidation && fieldErrors.name ? 'contact-name-error' : undefined}
              onChange={(event) => setName(event.target.value)}
            />
            {showValidation && fieldErrors.name ? (
              <span id="contact-name-error" className="connect-field__error" role="alert">
                {fieldErrors.name}
              </span>
            ) : null}
          </label>

          <label className="connect-field">
            <span className="type-meta">{label.email} *</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              aria-invalid={showValidation && !fieldValidity.email ? 'true' : undefined}
              aria-describedby={showValidation && fieldErrors.email ? 'contact-email-error' : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
            {showValidation && fieldErrors.email ? (
              <span id="contact-email-error" className="connect-field__error" role="alert">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>

          <label className="connect-field connect-field--message">
            <span className="type-meta">{label.message} *</span>
            <textarea
              name="message"
              rows={3}
              value={message}
              aria-invalid={showValidation && !fieldValidity.message ? 'true' : undefined}
              aria-describedby={showValidation && fieldErrors.message ? 'contact-message-error' : undefined}
              onChange={(event) => setMessage(event.target.value)}
            />
            {showValidation && fieldErrors.message ? (
              <span id="contact-message-error" className="connect-field__error" role="alert">
                {fieldErrors.message}
              </span>
            ) : null}
          </label>
        </div>

        <div className="connect-form__actions">
          <span className="type-meta" aria-hidden>
            * Required
          </span>
          <div className="connect-form__submit">
            {submissionStatus?.type === 'error' ? (
              <p className="connect-form__error" role="status" aria-live="polite">
                {submissionStatus.text}
              </p>
            ) : null}
            <button
              className="connect-send type-ui"
              type="submit"
              disabled={isSending || submissionStatus?.type === 'success'}
              aria-live="polite"
            >
              {isSending ? 'SENDING…' : submissionStatus?.type === 'success' ? 'SENT!' : 'SEND →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
