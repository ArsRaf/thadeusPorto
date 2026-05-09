import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProjectModal({ project, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        style={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        style={styles.panel}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.45, ease: [0.25, 0, 0.15, 1] }}
      >
        {/* Close */}
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close">
          <span style={styles.closeIcon}>✕</span>
        </button>

        {/* Media area */}
        <div style={styles.mediaWrap}>
          {project.media?.src ? (
            project.media.type === 'video' ? (
              <video
                src={project.media.src}
                autoPlay
                loop
                muted
                playsInline
                style={styles.media}
              />
            ) : (
              <img src={project.media.src} alt={project.title} style={styles.media} />
            )
          ) : (
            /* Gradient placeholder */
            <div style={{ ...styles.gradientMedia, background: project.gradient }}>
              {/* Subtle centered accent circle */}
              <div
                style={{
                  ...styles.accentOrb,
                  background: `radial-gradient(circle, rgba(${project.accentRgb},0.35) 0%, transparent 65%)`,
                }}
              />
            </div>
          )}

          {/* Film-burn corners */}
          {['tl', 'tr', 'bl', 'br'].map((pos) => (
            <div key={pos} style={{ ...styles.corner, ...cornerPos[pos] }} />
          ))}
        </div>

        {/* Metadata */}
        <div style={styles.meta}>
          {/* Category label */}
          <p style={styles.category}>{project.category}</p>

          {/* Title */}
          <h2 style={styles.title}>{project.title}</h2>

          {/* Description */}
          <p style={styles.description}>{project.description}</p>

          {/* Tools */}
          <div style={styles.tools}>
            {project.tools.map((tool) => (
              <span key={tool} style={styles.tool}>{tool}</span>
            ))}
          </div>

          {/* Year */}
          <p style={styles.year}>{project.year}</p>
        </div>
      </motion.div>
    </>
  )
}

const cornerPos = {
  tl: { top: 12,    left: 12,   borderTop: '1px solid', borderLeft:   '1px solid' },
  tr: { top: 12,    right: 12,  borderTop: '1px solid', borderRight:  '1px solid' },
  bl: { bottom: 12, left: 12,   borderBottom: '1px solid', borderLeft:  '1px solid' },
  br: { bottom: 12, right: 12,  borderBottom: '1px solid', borderRight: '1px solid' },
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    background: 'rgba(4, 4, 12, 0.88)',
    backdropFilter: 'blur(4px)',
  },
  panel: {
    position: 'fixed',
    zIndex: 501,
    inset: '5vh 6vw',
    background: '#06060f',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #141428',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 24,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10,
    padding: 8,
  },
  closeIcon: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    color: '#3a4a60',
    letterSpacing: 0,
  },
  mediaWrap: {
    flex: '0 0 62%',
    position: 'relative',
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  gradientMedia: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentOrb: {
    width: '55%',
    aspectRatio: '1',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: 'rgba(255,255,255,0.08)',
    pointerEvents: 'none',
  },
  meta: {
    flex: 1,
    padding: '24px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    borderTop: '1px solid #0e0e20',
    overflow: 'auto',
  },
  category: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.35em',
    color: '#3a5070',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 200,
    fontSize: 28,
    letterSpacing: '0.08em',
    color: '#c0d4e8',
    lineHeight: 1.15,
  },
  description: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 300,
    fontSize: 13,
    color: '#4a6080',
    lineHeight: 1.7,
    maxWidth: 520,
  },
  tools: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tool: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.2em',
    color: '#283848',
    border: '1px solid #141e28',
    padding: '4px 10px',
    textTransform: 'uppercase',
  },
  year: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    color: '#1e2a3a',
    letterSpacing: '0.2em',
    marginTop: 'auto',
  },
}
