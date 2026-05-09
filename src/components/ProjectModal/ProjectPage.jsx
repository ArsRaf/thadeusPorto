import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ProjectPage({ project, onClose }) {
  const mediaList = project.media ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const active = mediaList[activeIdx] ?? {}

  // Reset to first item when project changes
  useEffect(() => { setActiveIdx(0) }, [project.id])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const accent = project.color ?? '#c09040'
  const hasGallery = mediaList.length > 1

  return (
    <motion.div
      style={s.root}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <header style={s.header}>
        <button onClick={onClose} style={s.backBtn} aria-label="Back">
          <span style={s.backArrow}>←</span>
          <span style={s.backLabel}>back</span>
        </button>
        <span style={s.wordmark}>THADEUS TRISTAN</span>
        <span style={s.headerSpacer} />
      </header>

      {/* Hero media */}
      <div style={s.hero}>
        {active.src ? (
          active.type === 'video' ? (
            <video
              key={active.src}
              src={active.src}
              autoPlay loop muted playsInline
              style={s.heroMedia}
            />
          ) : (
            <img key={active.src} src={active.src} alt={project.title} style={s.heroMedia} />
          )
        ) : (
          <div style={{ ...s.heroPlaceholder, background: project.colorBg ?? '#0a0a0a' }} />
        )}

        {/* Corner marks */}
        <div style={{ ...s.corner, top: 16, left: 20,  borderTop:    `1px solid ${accent}55`, borderLeft:   `1px solid ${accent}55` }} />
        <div style={{ ...s.corner, top: 16, right: 20, borderTop:    `1px solid ${accent}55`, borderRight:  `1px solid ${accent}55` }} />
        <div style={{ ...s.corner, bottom: 16, left: 20,  borderBottom: `1px solid ${accent}55`, borderLeft:  `1px solid ${accent}55` }} />
        <div style={{ ...s.corner, bottom: 16, right: 20, borderBottom: `1px solid ${accent}55`, borderRight: `1px solid ${accent}55` }} />

        {/* Category + year */}
        <div style={s.heroTag}>
          <span style={{ ...s.heroTagText, color: `${accent}99` }}>
            {project.category} · {project.year}
          </span>
        </div>
      </div>

      {/* Gallery strip */}
      {hasGallery && (
        <div style={s.gallery}>
          {mediaList.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                ...s.galleryThumb,
                borderColor: i === activeIdx ? accent : 'rgba(255,255,255,0.08)',
                opacity: i === activeIdx ? 1 : 0.45,
              }}
              title={item.label}
            >
              {item.src ? (
                item.type === 'video' ? (
                  <video src={item.src} style={s.galleryMedia} muted playsInline preload="metadata" />
                ) : (
                  <img src={item.src} alt={item.label ?? ''} style={s.galleryMedia} />
                )
              ) : (
                <div style={{ ...s.galleryEmpty, background: project.colorBg ?? '#111' }} />
              )}
              {item.label && (
                <span style={{ ...s.galleryLabel, color: i === activeIdx ? accent : 'rgba(255,255,255,0.3)' }}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Project info */}
      <div style={s.info}>
        <div style={s.infoLeft}>
          <motion.h1
            style={{ ...s.title, color: accent }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.25, 0, 0.25, 1] }}
          >
            {project.title}
          </motion.h1>
        </div>

        <motion.div
          style={s.infoRight}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.5, ease: [0.25, 0, 0.25, 1] }}
        >
          <p style={s.description}>{project.description}</p>

          <div style={s.tools}>
            {project.tools.map((t) => (
              <span key={t} style={{ ...s.tool, borderColor: `${accent}33`, color: `${accent}99` }}>{t}</span>
            ))}
          </div>

          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              style={{ ...s.viewBtn, color: accent, borderColor: `${accent}66` }}>
              VIEW PROJECT ↗
            </a>
          ) : (
            <span style={s.viewBtnDisabled}>PROJECT COMING SOON</span>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

const s = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    background: '#060504',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 48px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8, padding: 0,
  },
  backArrow: {
    fontSize: 16, color: 'rgba(255,255,255,0.4)',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  backLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.3em', textTransform: 'uppercase',
  },
  wordmark: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300, fontSize: 11,
    letterSpacing: '0.42em', color: 'rgba(255,255,255,0.2)',
    textTransform: 'uppercase',
  },
  headerSpacer: { width: 80 },

  hero: {
    flex: '0 0 52%',
    position: 'relative',
    overflow: 'hidden',
    background: '#030202',
  },
  heroMedia: {
    width: '100%', height: '100%',
    objectFit: 'cover', display: 'block',
  },
  heroPlaceholder: {
    width: '100%', height: '100%',
  },
  corner: {
    position: 'absolute', width: 20, height: 20, pointerEvents: 'none',
  },
  heroTag: {
    position: 'absolute', bottom: 20, left: 28, pointerEvents: 'none',
  },
  heroTagText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase',
  },

  // Gallery strip
  gallery: {
    display: 'flex',
    gap: 6,
    padding: '10px 48px',
    flexShrink: 0,
    overflowX: 'auto',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    scrollbarWidth: 'none',
  },
  galleryThumb: {
    position: 'relative',
    flexShrink: 0,
    width: 96,
    height: 58,
    border: '1px solid',
    background: 'none',
    cursor: 'pointer',
    padding: 0,
    overflow: 'hidden',
    transition: 'opacity 0.2s, border-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  galleryMedia: {
    width: '100%',
    flex: 1,
    objectFit: 'cover',
    display: 'block',
    minHeight: 0,
  },
  galleryEmpty: {
    width: '100%', flex: 1,
  },
  galleryLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 7,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '2px 4px',
    background: 'rgba(0,0,0,0.6)',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color 0.2s',
  },

  info: {
    flex: 1,
    display: 'flex',
    gap: 0,
    borderTop: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden',
    minHeight: 0,
  },
  infoLeft: {
    flex: '0 0 42%',
    padding: '24px 40px 24px 48px',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300,
    fontSize: 'clamp(20px, 3vw, 40px)',
    letterSpacing: '-0.01em',
    lineHeight: 1.15,
    margin: 0,
  },
  infoRight: {
    flex: 1,
    padding: '24px 48px 24px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    justifyContent: 'center',
    overflow: 'auto',
  },
  description: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300, fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.75, margin: 0, maxWidth: 440,
  },
  tools: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tool: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.2em',
    border: '1px solid', padding: '3px 9px',
    textTransform: 'uppercase',
  },
  viewBtn: {
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.28em',
    border: '1px solid', padding: '10px 20px',
    textDecoration: 'none', textTransform: 'uppercase',
    alignSelf: 'flex-start', transition: 'opacity 0.2s',
    marginTop: 4,
  },
  viewBtnDisabled: {
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.28em',
    color: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '10px 20px', textTransform: 'uppercase',
    alignSelf: 'flex-start', marginTop: 4,
  },
}
