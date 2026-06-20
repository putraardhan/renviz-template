import { useState, useRef, useCallback } from 'react'
import domtoimage from 'dom-to-image-more'
import './App.css'

function UploadSlot({ label, image, onUpload, inputRef, projectFirst, projectRest }) {
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
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  return (
    <div
      className="dark-card"
      onClick={!image ? handleClick : undefined}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ cursor: image ? 'default' : 'pointer' }}
    >
      <div className="polaroid">
        <div className="polaroid-inner">
          {image ? (
            <img src={image} alt={label} className="slot-img" />
          ) : (
            <div className="slot-placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Upload foto</span>
            </div>
          )}
        </div>
      </div>

      {label === 'After' && (
        <div className="project-block">
          <span className="project-eyebrow">Rendered with AI</span>
          <div className="project-name-line">
            <span className="project-first">{projectFirst}</span>
            {projectRest && <span className="project-rest">{projectRest}</span>}
          </div>
        </div>
      )}

      {label === 'Before' && (
        <div className="project-block">
          <span className="project-eyebrow">As Designed</span>
          <div className="project-name-line">
            <span className="project-first">Raw</span>
            <span className="project-rest">Concept</span>
          </div>
        </div>
      )}

      {image && (
        <button
          className="remove-btn"
          onClick={(e) => { e.stopPropagation(); onUpload(null) }}
          title="Hapus foto"
        >
          ×
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
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

  const splitProject = () => {
    const words = displayProject.split(' ')
    if (words.length === 1) return { first: words[0], rest: '' }
    return { first: words[0], rest: words.slice(1).join(' ') }
  }
  const { first, rest } = splitProject()

  const handleDownload = useCallback(async () => {
    if (!templateRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await domtoimage.toPng(templateRef.current, {
        width: templateRef.current.offsetWidth * 3,
        height: templateRef.current.offsetHeight * 3,
        style: {
          transform: `scale(3)`,
          transformOrigin: 'top left',
        }
      })
      const link = document.createElement('a')
      const slug = displayProject.toLowerCase().replace(/\s+/g, '-')
      link.download = `renviz-${slug}.png`
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

      <div className="template-wrapper" id="rv-template" ref={templateRef}>
        <div className="dot-grid" />

        <div className="template-inner">

          <div className="brand-pill">Renviz · AI Render</div>

          <div className="label-row">
            <div className="label-col">
              <span className="label-big">Before</span>
            </div>
            <div className="label-col">
              <span className="label-big">After</span>
            </div>
          </div>

          <div className="cards-row">
            <UploadSlot
              label="Before"
              image={beforeImage}
              onUpload={setBeforeImage}
              inputRef={beforeInputRef}
              projectFirst={first}
              projectRest={rest}
            />
            <UploadSlot
              label="After"
              image={afterImage}
              onUpload={setAfterImage}
              inputRef={afterInputRef}
              projectFirst={first}
              projectRest={rest}
            />
          </div>

        </div>
      </div>

      <div className="controls">
        <div className="ctrl-group">
          <label className="ctrl-label">Nama Project</label>
          <input
            className="ctrl-input"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="mis. A+W House"
          />
        </div>

        <div className="ctrl-uploads">
          <button className="upload-btn" onClick={() => beforeInputRef.current?.click()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {beforeImage ? '✓ Before uploaded' : 'Upload Before'}
          </button>
          <button className="upload-btn" onClick={() => afterInputRef.current?.click()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {afterImage ? '✓ After uploaded' : 'Upload After'}
          </button>
        </div>

        <button
          className={`download-btn ${downloading ? 'loading' : ''}`}
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Generating...' : 'Download PNG'}
        </button>
      </div>

    </div>
  )
}