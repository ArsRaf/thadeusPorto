import { useState } from 'react'
import { motion } from 'framer-motion'

const CARD_W = 310
const CARD_H = 420 // total including sprockets

// Sprocket holes row — appears top and bottom of each frame
function Sprockets() {
  return (
    <div style={styles.sprockets}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={styles.hole} />
      ))}
    </div>
  )
}

export default function ProjectCard({ project, index, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      style={{ ...styles.card, width: CARD_W, height: CARD_H }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: [0.25, 0, 0.25, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* Frame top sprockets */}
      <Sprockets />

      {/* Main image area */}
      <div style={styles.imageWrap}>
        {/* Gradient placeholder — replace src with real media */}
        {project.media?.src ? (
          <img
            src={project.media.src}
            alt={project.title}
            style={styles.image}
            loading="lazy"
          />
        ) : (
          <div style={{ ...styles.gradientPlaceholder, background: project.gradient }} />
        )}

        {/* Hover: light-leak overlay */}
        <motion.div
          style={styles.lightLeak}
          animate={{
            opacity: hovered ? 1 : 0,
            background: hovered
              ? `radial-gradient(ellipse 60% 40% at 30% 25%, rgba(${project.accentRgb},0.22) 0%, transparent 70%)`
              : 'transparent',
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover: subtle scan-line glimmer */}
        <motion.div
          style={styles.scanGlimmer}
          animate={{ opacity: hovered ? 0.06 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Year badge */}
        <span style={styles.year}>{project.year}</span>
      </div>

      {/* Frame bottom sprockets */}
      <Sprockets />

      {/* Title area */}
      <div style={styles.titleArea}>
        <motion.p
          style={styles.title}
          animate={{ color: hovered ? '#c8dcf0' : '#7a8aaa' }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.p>
      </div>

      {/* Outer frame glow on hover */}
      <motion.div
        style={styles.frameGlow}
        animate={{
          boxShadow: hovered
            ? `0 0 0 1px rgba(${project.accentRgb},0.25), 0 8px 40px rgba(${project.accentRgb},0.12)`
            : '0 0 0 1px rgba(255,255,255,0.04)',
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.article>
  )
}

const styles = {
  card: {
    position: 'relative',
    flexShrink: 0,
    cursor: 'pointer',
    background: '#07070f',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    userSelect: 'none',
  },
  sprockets: {
    height: 28,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '0 18px',
    background: '#050510',
    borderTop: '1px solid #121228',
    borderBottom: '1px solid #121228',
  },
  hole: {
    width: 12,
    height: 12,
    borderRadius: 3,
    background: '#04040c',
    border: '1px solid #1a1a30',
  },
  imageWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientPlaceholder: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  lightLeak: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  },
  scanGlimmer: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)',
    pointerEvents: 'none',
  },
  year: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    color: 'rgba(180,200,220,0.35)',
    letterSpacing: '0.12em',
  },
  titleArea: {
    height: 44,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    background: '#06060f',
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 300,
    fontSize: 12,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#7a8aaa',
  },
  frameGlow: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 0,
  },
}
