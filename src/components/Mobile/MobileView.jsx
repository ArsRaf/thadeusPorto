import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, CATEGORIES } from '../../data/projects'

// Lightweight 2D fallback — no Three.js, optimised for touch
export default function MobileView({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('Animation')

  const filtered = useMemo(
    () => projects.filter((p) => p.category === activeCategory),
    [activeCategory]
  )

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <p style={styles.wordmark}>THADEUS TRISTAN</p>
        <p style={styles.sub}>SELECTED WORKS</p>
      </header>

      {/* Category tabs */}
      <nav style={styles.tabs}>
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }}
            >
              {cat}
            </button>
          )
        })}
      </nav>

      {/* Project grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          style={styles.grid}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {filtered.map((project) => (
            <button
              key={project.id}
              style={styles.card}
              onClick={() => onSelectProject(project)}
            >
              <div
                style={{ ...styles.thumb, background: project.gradient }}
              >
                <div
                  style={{
                    ...styles.thumbGlow,
                    background: `radial-gradient(circle at 35% 30%, rgba(${project.accentRgb},0.3) 0%, transparent 60%)`,
                  }}
                />
              </div>
              <p style={styles.cardTitle}>{project.title}</p>
              <p style={styles.cardYear}>{project.year}</p>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    background: '#04040c',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '32px 24px 16px',
    borderBottom: '1px solid #0e0e20',
  },
  wordmark: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 200,
    fontSize: 12,
    letterSpacing: '0.4em',
    color: '#6a7a9a',
  },
  sub: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.25em',
    color: '#2a3448',
    marginTop: 4,
  },
  tabs: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid #0e0e20',
    overflowX: 'auto',
    flexShrink: 0,
  },
  tab: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    padding: '12px 20px',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 300,
    fontSize: 10,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: '#2a3448',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tabActive: {
    color: '#8090b0',
    borderBottomColor: '#4a6cf0',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 1,
    overflowY: 'auto',
    background: '#0c0c18',
  },
  card: {
    background: '#06060f',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  thumb: {
    width: '100%',
    aspectRatio: '4/3',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbGlow: {
    position: 'absolute',
    inset: 0,
  },
  cardTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 300,
    fontSize: 11,
    letterSpacing: '0.12em',
    color: '#4a5a70',
    padding: '10px 12px 2px',
    textTransform: 'uppercase',
  },
  cardYear: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    color: '#1e2a3a',
    padding: '0 12px 12px',
    letterSpacing: '0.1em',
  },
}
