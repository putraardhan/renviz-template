import { useState, useRef, useCallback } from 'react'
import domtoimage from 'dom-to-image-more'
import './App.css'

const BEFORE_POINTS = [
  'Tampilan flat tanpa material',
  'Tidak ada pencahayaan realistis',
  'Sulit dipresentasikan ke klien',
  'Hanya bisa dilihat oleh arsitek',
]

const AFTER_POINTS = [
  'Material dan tekstur realistis',
  'Pencahayaan natural & dramatis',
  'Siap presentasi ke klien',
  'Langsung terlihat jadi nyata',
]

const KEUNGGULAN = [
  { icon: '⚡', title: 'Cepat', desc: 'Render dalam hitungan detik, bukan jam' },
  { icon: '🎨', title: 'Realistis', desc: 'AI menghasilkan detail material akurat' },
  { icon: '💡', title: 'Mudah', desc: 'Upload foto, langsung dapat hasil render' },
  { icon: '⭐', title: 'Profesional', desc: 'Kualitas setara render studio 3D' },
]

function ImageSlot({ label, image, onUpload, inputRef }) {
  const handleClick = () => inputRef.current?.click()
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) processFile(file)
  }
  const handleDragOver = (e) => e.preventDefault()
  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div
      className={`img-slot ${label === 'after' ? 'img-slot--after' : ''}`}
      onClick={!image ? handleClick : undefined}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
          <span>Upload Foto</span>
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

  const displayProject = projectName.trim() || 'Nama Project'
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

      {/* ── TEMPLATE ── */}
      <div className="template-wrapper" ref={templateRef}>
        <div className="template-inner">

          {/* Brand pill */}
          <div className="brand-pill">
            <span className="brand-dot">◆</span> RENVIZ · AI RENDER <span className="brand-dot">◆</span>
          </div>

          {/* Cards */}
          <div className="cards-row">

            {/* BEFORE card */}
            <div className="card card--before">
              <div className="card-label card-label--before">BEFORE</div>
              <ImageSlot label="before" image={beforeImage} onUpload={setBeforeImage} inputRef={beforeInputRef} />
              <div className="card-body">
                <div className="card-eyebrow card-eyebrow--before">AS DESIGNED</div>
                <div className="card-title">
                  <span className="card-title-first">{projFirst}</span>
                  {projRest && <span className="card-title-rest"> {projRest}</span>}
                </div>
                <ul className="point-list">
                  {BEFORE_POINTS.map((p, i) => (
                    <li key={i} className="point-item point-item--before">
                      <span className="point-icon">✕</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow */}
            <div className="arrow-divider">→</div>

            {/* AFTER card */}
            <div className="card card--after">
              <div className="card-label card-label--after">AFTER</div>
              <ImageSlot label="after" image={afterImage} onUpload={setAfterImage} inputRef={afterInputRef} />
              <div className="card-body">
                <div className="card-eyebrow card-eyebrow--after">RENDERED WITH AI</div>
                <div className="card-title">
                  <span className="card-title-first">{projFirst}</span>
                  {projRest && <span className="card-title-rest"> {projRest}</span>}
                </div>
                <ul className="point-list">
                  {AFTER_POINTS.map((p, i) => (
                    <li key={i} className="point-item point-item--after">
                      <span className="point-icon">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Keunggulan */}
          <div className="keunggulan-section">
            <div className="keunggulan-pill">KEUNGGULAN REDESIGN</div>
            <div className="keunggulan-row">
              {KEUNGGULAN.map((k, i) => (
                <div key={i} className="keunggulan-item">
                  <div className="keunggulan-icon">{k.icon}</div>
                  <div className="keunggulan-title">{k.title}</div>
                  <div className="keunggulan-desc">{k.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="controls">
        <div className="ctrl-group">
          <label className="ctrl-label">Nama Project</label>
          <input className="ctrl-input" type="text" value={projectName}
            onChange={(e) => setProjectName(e.target.value)} placeholder="mis. A+W House" />
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
