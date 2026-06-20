import { useState, useRef, useCallback } from 'react'
import domtoimage from 'dom-to-image-more'
import './App.css'

const BEFORE_BULLETS = [
  'Tampilan flat tanpa material realistis',
  'Tidak ada pencahayaan yang dramatis',
  'Sulit dipresentasikan ke klien awam',
  'Hanya bisa dipahami oleh arsitek',
]

const AFTER_BULLETS = [
  'Material dan tekstur terlihat nyata',
  'Pencahayaan natural & dramatis',
  'Siap presentasi langsung ke klien',
  'Langsung terlihat jadi bangunan nyata',
]

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z" />
  </svg>
)
const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L21 8 L12 13 L3 8 Z" />
    <path d="M3 13 L12 18 L21 13" />
  </svg>
)
const TypeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 8 L16 8 M12 8 L12 16" />
  </svg>
)
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L14.6 9 L21 9.6 L16.2 13.9 L17.7 20 L12 16.7 L6.3 20 L7.8 13.9 L3 9.6 L9.4 9 Z" />
  </svg>
)

const KEUNGGULAN = [
  { Icon: SparkleIcon, title: 'Visual Lebih Realistis', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.' },
  { Icon: LayersIcon, title: 'Desain Lebih Padat', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.' },
  { Icon: TypeIcon, title: 'Tipografi Elegan', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.' },
  { Icon: StarIcon, title: 'Siap Presentasi', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.' },
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

  const displayProject = projectName.trim() || 'Lorem Ipsum'
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

          {/* Header */}
          <div className="header-row">
            <span className="header-before">Before</span>
            <span className="header-arrow">→</span>
            <span className="header-after">After</span>
          </div>

          <p className="header-sub">
            Lihat perbedaan nyata antara desain mentah dan hasil rendering AI.<br />
            Dari konsep menjadi visual yang siap dipresentasikan.
          </p>

          {/* Cards */}
          <div className="cards-row">
            {/* BEFORE */}
            <div className="card card--before">
              <div className="card-label card-label--before">BEFORE</div>
              <ImageSlot label="before" image={beforeImage} onUpload={setBeforeImage} inputRef={beforeInputRef} />
              <div className="card-body">
                <div className="eyebrow eyebrow--before">AS DESIGNED</div>
                <div className="card-title">
                  <span className="title-black">Lorem </span>
                  <span className="title-orange-italic">Ipsum</span>
                </div>
                <p className="card-desc">Tampilan desain dalam kondisi awal sebelum diproses oleh AI rendering Renviz.</p>
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
                <p className="card-desc">Hasil render AI Renviz yang mengubah desain mentah menjadi visual fotorealistis.</p>
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

          {/* Keunggulan */}
          <div className="keunggulan-section">
            <div className="keunggulan-pill">KEUNGGULAN REDESIGN</div>
            <div className="keunggulan-panel">
              {KEUNGGULAN.map((k, i) => (
                <div key={i} className="keunggulan-item">
                  <div className="keunggulan-icon"><k.Icon /></div>
                  <div className="keunggulan-title">{k.title}</div>
                  <div className="keunggulan-desc">{k.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Controls */}
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
