import { useState, useRef, useCallback } from 'react'
import domtoimage from 'dom-to-image-more'
import './App.css'

const BEFORE_BULLETS = [
  'Flat appearance without realistic materials',
  'No dramatic lighting',
  'Hard to present to non-technical clients',
  'Only architects can interpret it',
]

const AFTER_BULLETS = [
  'Materials and textures look real',
  'Natural & dramatic lighting',
  'Ready to present directly to clients',
  'Instantly looks like a real building',
]

const STEPS = [
  { n: 1, title: 'Screenshot Your Model', desc: 'Capture a screenshot of your SketchUp model' },
  { n: 2, title: 'Upload to Renviz', desc: 'Upload your screenshot to the Renviz app' },
  { n: 3, title: 'Choose Render Mode', desc: 'Select your render mode (Interior / Exterior)' },
  { n: 4, title: 'Download Result', desc: 'Download your photorealistic result' },
]

function ImageSlot({ label, image, onUpload, inputRef }) {
  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target.result)
    reader.readAsDataURL(file)
  }
  return (
    <div
      className="img-slot"
      onClick={!image ? () => inputRef.current?.click() : undefined}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) processFile(f) }}
      onDragOver={(e) => e.preventDefault()}
      style={{ cursor: image ? 'default' : 'pointer' }}
    >
      {image ? (
        <>
          <img src={image} alt={label} className="slot-img" />
          <button className="remove-btn" onClick={(e) => { e.stopPropagation(); onUpload(null) }}>×</button>
        </>
      ) : (
        <div className="slot-placeholder">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Upload Photo</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f) }} />
    </div>
  )
}

export default function App() {
  const [beforeImage, setBeforeImage] = useState(null)
  const [afterImage, setAfterImage] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [downloading, setDownloading] = useState(false)

  const beforeInputRef = useRef(null)
  const afterInputRef = useRef(null)
  const templateRef = useRef(null)

  const displayProject = projectName.trim() || 'Modern Villa'
  const words = displayProject.split(' ')
  const projFirst = words[0]
  const projRest = words.slice(1).join(' ')

  const handleDownload = useCallback(async () => {
    if (!templateRef.current) return
    setDownloading(true)
    try {
      const el = templateRef.current
      const dataUrl = await domtoimage.toPng(el, {
        width: el.offsetWidth * 3,
        height: el.offsetHeight * 3,
        style: { transform: 'scale(3)', transformOrigin: 'top left' }
      })
      const link = document.createElement('a')
      link.download = `renviz-${displayProject.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }, [displayProject])

  return (
    <div className="app-shell">
      <div className="template-wrapper" ref={templateRef}>
        <div className="dots dots--tl" />
        <div className="dots dots--tr" />
        <div className="dots dots--bl" />
        <div className="dots dots--br" />
        <div className="template-inner">

          {/* Brand pill */}
          <div className="brand-pill">
            <span className="brand-dot" />
            RENVIZ · AI RENDER
          </div>

          {/* Cards */}
          <div className="cards-row">
            {/* BEFORE */}
            <div className="card card--before">
              <div className="card-label card-label--before">BEFORE</div>
              <ImageSlot label="before" image={beforeImage} onUpload={setBeforeImage} inputRef={beforeInputRef} />
              <div className="card-body">
                <div className="eyebrow eyebrow--before">AS DESIGNED</div>
                <div className="card-title">
                  <span className="title-black">Raw </span>
                  <span className="title-orange-italic">Concept</span>
                </div>
                <p className="card-desc">The original design in its raw state before being processed by Renviz AI rendering.</p>
                <ul className="bullet-list">
                  {BEFORE_BULLETS.map((b, i) => (
                    <li key={i} className="bullet-item bullet--before">
                      <span className="bullet-icon">⊗</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow center */}
            <div className="center-arrow">→</div>

            {/* AFTER */}
            <div className="card card--after">
              <div className="card-label card-label--after">AFTER</div>
              <ImageSlot label="after" image={afterImage} onUpload={setAfterImage} inputRef={afterInputRef} />
              <div className="card-body">
                <div className="eyebrow eyebrow--after">RENDERED WITH AI</div>
                <div className="card-title">
                  <span className="title-black">{projFirst} </span>
                  {projRest && <span className="title-orange-italic">{projRest}</span>}
                </div>
                <p className="card-desc">Renviz AI render result that transforms a raw design into a photorealistic visual.</p>
                <ul className="bullet-list">
                  {AFTER_BULLETS.map((b, i) => (
                    <li key={i} className="bullet-item bullet--after">
                      <span className="bullet-icon">⊙</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-section">
            <p className="cta-sub">Transform your architectural designs into photorealistic visuals in seconds. No 3D skills required.</p>
            <div className="cta-link">Try Free at renviz.app →</div>
          </div>

          {/* How It Works */}
          <div className="keunggulan-section">
            <div className="keunggulan-pill">HOW IT WORKS</div>
            <div className="keunggulan-panel">
              {STEPS.map((s) => (
                <div key={s.n} className="keunggulan-item">
                  <div className="step-number">{s.n}</div>
                  <div className="keunggulan-title">{s.title}</div>
                  <div className="keunggulan-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="ctrl-group">
          <label className="ctrl-label">Project Name</label>
          <input className="ctrl-input" type="text" value={projectName}
            onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. A+W House" />
        </div>
        <div className="ctrl-uploads">
          <button className="upload-btn" onClick={() => beforeInputRef.current?.click()}>
            {beforeImage ? '✓ Before uploaded' : 'Upload Before'}
          </button>
          <button className="upload-btn" onClick={() => afterInputRef.current?.click()}>
            {afterImage ? '✓ After uploaded' : 'Upload After'}
          </button>
        </div>
        <button className={`download-btn ${downloading ? 'loading' : ''}`}
          onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download PNG'}
        </button>
      </div>
    </div>
  )
}
