import { useEffect, useMemo, useState } from 'react'
import './App.css'

const storageKey = 'wizard-outreach-admin-ui'

const defaultContent = {
  heroTitle: 'Wizard Outreach Control',
  heroSubtitle:
    'Ship fresh messaging to the field without waiting on devs. Keep crews, customers, and comms aligned.',
  banner:
    'Glass Wizard Australia outreach is due Thursday 5:00pm AEST. Call-to-action: book inspection slots with the new calendar link.',
  ctaLabel: 'Publish to outreach',
  ctaLink: 'https://glasswizard.au/bookings',
  supportEmail: 'ops@glasswizard.au',
  hotline: '+61 431 000 200',
  cadence: 'Weekly send — Thursdays @ 5:00pm AEST',
  nextSend: '2026-04-11T07:00:00.000Z',
  status: 'Draft',
  readinessNote: 'Hero image approved; CTA link needs a final UTM check.',
  updateOwner: 'Alex (Operations)',
  highlights: [
    'Emergency response <2hrs in metro QLD',
    'Add before/after gallery link',
    'Confirm CTA UTM tags',
  ],
  contentBlocks: [
    {
      title: 'Hero promise',
      audience: 'Homeowners',
      message:
        'Same-day glass repair with insurance paperwork handled. Phone-first routing for emergencies.',
    },
    {
      title: 'Commercial CTA',
      audience: 'Facility managers',
      message:
        'Book a 15-minute scoping call for multi-site replacements. Priority path for health and retail.',
    },
    {
      title: 'Social proof',
      audience: 'Councils & schools',
      message:
        'Night repair testimonial from Bundaberg Council approved. Add photo of stage door fix.',
    },
  ],
  changelog: [
    {
      note: 'Baseline content loaded',
      when: '2026-04-06T00:00:00.000Z',
      type: 'info',
    },
  ],
  metrics: {
    updatesThisWeek: 3,
    assetsReady: 6,
    blockers: 1,
    successRate: 92,
  },
}

const requiredFields = [
  { key: 'heroTitle', label: 'Hero title' },
  { key: 'heroSubtitle', label: 'Hero subheading' },
  { key: 'ctaLabel', label: 'CTA label' },
  { key: 'ctaLink', label: 'CTA link' },
  { key: 'supportEmail', label: 'Support email' },
]

const statuses = {
  Draft: { tone: 'neutral', text: 'Draft' },
  'Ready to ship': { tone: 'good', text: 'Ready to ship' },
  Published: { tone: 'accent', text: 'Live' },
  'Needs review': { tone: 'warn', text: 'Needs review' },
}

const loadContent = () => {
  if (typeof localStorage === 'undefined') return defaultContent
  const saved = localStorage.getItem(storageKey)
  if (!saved) return defaultContent
  try {
    const parsed = JSON.parse(saved)
    return {
      ...defaultContent,
      ...parsed,
      contentBlocks: parsed.contentBlocks || defaultContent.contentBlocks,
      changelog: parsed.changelog || defaultContent.changelog,
      metrics: parsed.metrics || defaultContent.metrics,
      highlights: parsed.highlights || defaultContent.highlights,
    }
  } catch {
    return defaultContent
  }
}

const formatDate = (value) => {
  if (!value) return 'Not saved yet'
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const toInputDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const pad = (num) => `${num}`.padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const StatusPill = ({ status }) => {
  const tone = statuses[status]?.tone || 'neutral'
  const label = statuses[status]?.text || status || 'Draft'
  return <span className={`pill pill-${tone}`}>{label}</span>
}

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  required = false,
  hint,
}) => (
  <label className="field">
    <div className="field-label">
      <span>{label}</span>
      {required ? <span className="required">Required</span> : null}
    </div>
    {multiline ? (
      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )}
    {hint ? <small>{hint}</small> : null}
  </label>
)

const BlockCard = ({ block, onChange, onRemove, active, onSelect }) => (
  <article
    className={`block-card ${active ? 'block-card-active' : ''}`}
    onClick={onSelect}
  >
    <div className="block-card-head">
      <div>
        <p className="eyebrow">{block.audience}</p>
        <h3>{block.title}</h3>
      </div>
      <button
        className="ghost"
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onRemove()
        }}
      >
        Remove
      </button>
    </div>
    <div className="block-fields">
      <Field
        label="Title"
        value={block.title}
        onChange={(value) => onChange('title', value)}
      />
      <Field
        label="Audience"
        value={block.audience}
        onChange={(value) => onChange('audience', value)}
      />
      <Field
        label="Message"
        value={block.message}
        multiline
        onChange={(value) => onChange('message', value)}
      />
    </div>
  </article>
)

function App() {
  const [content, setContent] = useState(loadContent)
  const [message, setMessage] = useState('')
  const [selectedBlock, setSelectedBlock] = useState(0)

  const missingFields = useMemo(
    () =>
      requiredFields.filter(
        (field) => !content[field.key] || !content[field.key].trim(),
      ),
    [content],
  )

  const readyToPublish = missingFields.length === 0

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(storageKey, JSON.stringify(content))
  }, [content])

  const addLog = (note, type = 'update') => {
    const when = new Date().toISOString()
    setContent((previous) => ({
      ...previous,
      changelog: [{ note, when, type }, ...(previous.changelog || [])].slice(
        0,
        10,
      ),
    }))
  }

  const updateField = (key, value) => {
    setContent((previous) => ({ ...previous, [key]: value }))
  }

  const updateBlock = (index, key, value) => {
    setContent((previous) => {
      const nextBlocks = previous.contentBlocks.map((block, idx) =>
        idx === index ? { ...block, [key]: value } : block,
      )
      return { ...previous, contentBlocks: nextBlocks }
    })
  }

  const addBlock = () => {
    setContent((previous) => {
      const nextBlocks = [
        ...previous.contentBlocks,
        {
          title: 'New update',
          audience: 'Audience',
          message: 'Outline the change and the next action for readers.',
        },
      ]
      setSelectedBlock(nextBlocks.length - 1)
      return { ...previous, contentBlocks: nextBlocks }
    })
  }

  const removeBlock = (index) => {
    if (content.contentBlocks.length === 1) return
    setContent((previous) => ({
      ...previous,
      contentBlocks: previous.contentBlocks.filter((_, idx) => idx !== index),
    }))
    setSelectedBlock(0)
  }

  const handleSave = () => {
    const when = new Date().toISOString()
    setContent((previous) => ({
      ...previous,
      lastSaved: when,
      status: previous.status === 'Published' ? 'Published' : 'Draft',
    }))
    addLog('Saved changes locally', 'update')
    setMessage('Saved locally. Publish to mark live for admins.')
  }

  const handlePublish = () => {
    const when = new Date().toISOString()
    setContent((previous) => ({
      ...previous,
      status: 'Ready to ship',
      lastSaved: when,
      lastPublished: when,
    }))
    addLog('Marked ready for outreach', 'publish')
    setMessage('Marked ready. Share with comms or toggle live content.')
  }

  const handleReset = () => {
    setContent(defaultContent)
    localStorage.removeItem(storageKey)
    setSelectedBlock(0)
    setMessage('Reset to Wizard defaults.')
  }

  const quickStatuses = [
    {
      label: 'Need approvals',
      note: 'Approvals still pending',
      onClick: () => {
        updateField('status', 'Needs review')
        addLog('Flagged for approvals', 'warn')
        setMessage('Flagged that approvals are outstanding.')
      },
    },
    {
      label: 'Go live',
      note: 'Everything approved',
      onClick: () => {
        updateField('status', 'Published')
        addLog('Marked live for admins', 'publish')
        setMessage('Marked live. Remember to mirror updates to prod.')
      },
    },
    {
      label: 'Hold send',
      note: 'Pause this cycle',
      onClick: () => {
        updateField('status', 'Draft')
        addLog('Send paused for this cycle', 'update')
        setMessage('Draft mode restored for this send.')
      },
    },
  ]

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Wizard Outreach Admin</p>
          <h1>Front-end updater</h1>
          <p className="lede">
            Keep the outreach front end fresh without waiting on engineering.
            Update hero copy, banners, CTA links, and preview what admins will
            see.
          </p>
          <div className="status-row">
            <StatusPill status={content.status} />
            <span className="meta">
              Next send: {formatDate(content.nextSend)}
            </span>
            <span className="meta">
              Last saved: {formatDate(content.lastSaved)}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={handleReset}>
            Reset defaults
          </button>
          <button className="secondary" type="button" onClick={handleSave}>
            Save locally
          </button>
          <button
            className="primary"
            type="button"
            onClick={handlePublish}
            disabled={!readyToPublish}
          >
            Mark ready
          </button>
        </div>
      </header>

      {message ? <div className="toast">{message}</div> : null}

      <section className="panel-grid">
        <div className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Content inputs</p>
              <h2>Update the front end</h2>
            </div>
            <span className="pill pill-outline">
              Owner: {content.updateOwner}
            </span>
          </div>

          <div className="form-grid">
            <Field
              label="Hero title"
              value={content.heroTitle}
              onChange={(value) => updateField('heroTitle', value)}
              required
            />
            <Field
              label="Hero subheading"
              value={content.heroSubtitle}
              multiline
              onChange={(value) => updateField('heroSubtitle', value)}
              required
            />
            <Field
              label="CTA label"
              value={content.ctaLabel}
              onChange={(value) => updateField('ctaLabel', value)}
              required
            />
            <Field
              label="CTA link"
              value={content.ctaLink}
              onChange={(value) => updateField('ctaLink', value)}
              required
              hint="Live URL for the admin-facing call to action."
            />
            <Field
              label="Support email"
              value={content.supportEmail}
              onChange={(value) => updateField('supportEmail', value)}
              required
            />
            <Field
              label="Hotline"
              value={content.hotline}
              onChange={(value) => updateField('hotline', value)}
              hint="Display a direct line for urgent outreach items."
            />
            <Field
              label="Send cadence"
              value={content.cadence}
              onChange={(value) => updateField('cadence', value)}
              hint="Surface the outbound rhythm for admins."
            />
            <Field
              label="Next send"
              type="datetime-local"
              value={toInputDateTime(content.nextSend)}
              onChange={(value) =>
                updateField(
                  'nextSend',
                  value ? new Date(value).toISOString() : '',
                )
              }
              hint="Used to show the next deployment window."
            />
            <Field
              label="Banner / announcement"
              value={content.banner}
              multiline
              onChange={(value) => updateField('banner', value)}
              hint="Use for deadlines, outages, or time-bound pushes."
            />
            <Field
              label="Readiness note"
              value={content.readinessNote}
              multiline
              onChange={(value) => updateField('readinessNote', value)}
            />
          </div>

          <div className="actions-row">
            <div className="status-row">
              {missingFields.length ? (
                <span className="meta warn">
                  Missing: {missingFields.map((field) => field.label).join(', ')}
                </span>
              ) : (
                <span className="meta good">
                  Ready to publish — all required fields filled.
                </span>
              )}
            </div>
            <div className="quick-actions">
              {quickStatuses.map((item) => (
                <button
                  key={item.label}
                  className="chip"
                  type="button"
                  onClick={item.onClick}
                  title={item.note}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card preview">
          <div className="section-head">
            <div>
              <p className="eyebrow">Live preview</p>
              <h2>What admins will see</h2>
            </div>
            <StatusPill status={content.status} />
          </div>

          <div className="hero-preview">
            <div className="badge">Outreach</div>
            <p className="eyebrow">{content.cadence}</p>
            <h3>{content.heroTitle}</h3>
            <p className="lede">{content.heroSubtitle}</p>
            <div className="cta-row">
              <button className="primary" type="button">
                {content.ctaLabel || 'CTA goes here'}
              </button>
              <div className="meta">{content.ctaLink || 'Link not set'}</div>
            </div>
            <div className="highlight-list">
              {content.highlights?.map((item) => (
                <span key={item} className="pill pill-outline">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="banner">
            <span className="pill pill-warn">Announcement</span>
            <p>{content.banner}</p>
          </div>

          <div className="preview-grid">
            <div className="preview-card">
              <p className="eyebrow">Support</p>
              <h4>{content.supportEmail}</h4>
              <p>{content.hotline}</p>
              <p className="meta">{content.readinessNote}</p>
            </div>
            <div className="preview-card">
              <p className="eyebrow">Next send</p>
              <h4>{formatDate(content.nextSend)}</h4>
              <p className="meta">Owner: {content.updateOwner}</p>
              <p className="meta">
                Assets ready: {content.metrics?.assetsReady ?? 0} | Updates this
                week: {content.metrics?.updatesThisWeek ?? 0}
              </p>
            </div>
          </div>

          <div className="timeline">
            <p className="eyebrow">Recent changes</p>
            <ul>
              {(content.changelog || []).map((log) => (
                <li key={`${log.note}-${log.when}`}>
                  <span className={`dot dot-${log.type || 'update'}`} />
                  <div>
                    <p>{log.note}</p>
                    <span className="meta">{formatDate(log.when)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Content blocks</p>
            <h2>Targeted updates</h2>
          </div>
          <div className="block-actions">
            <button className="secondary" type="button" onClick={addBlock}>
              Add block
            </button>
          </div>
        </div>

        <div className="block-grid">
          {content.contentBlocks.map((block, index) => (
            <BlockCard
              key={`${block.title}-${index}`}
              block={block}
              active={selectedBlock === index}
              onSelect={() => setSelectedBlock(index)}
              onRemove={() => removeBlock(index)}
              onChange={(key, value) => updateBlock(index, key, value)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
