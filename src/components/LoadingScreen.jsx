import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_FRAMES = 5   // counts 5 → 1
const FRAME_MS     = 900 // ms per frame
const TOTAL_MS     = TOTAL_FRAMES * FRAME_MS + 400

export default function LoadingScreen({ onComplete }) {
  const [count, setCount]       = useState(TOTAL_FRAMES)
  const [flash, setFlash]       = useState(false)
  const [exiting, setExiting]   = useState(false)
  const [scanAngle, setScanAngle] = useState(0)

  useEffect(() => {
    // Countdown tick
    const tick = setInterval(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 80)
      setCount((c) => Math.max(0, c - 1))
    }, FRAME_MS)

    // Rotating scan line
    const scan = setInterval(() => {
      setScanAngle((a) => (a + 6) % 360)
    }, 16)

    // Exit
    const exit = setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 900)
    }, TOTAL_MS)

    return () => {
      clearInterval(tick)
      clearInterval(scan)
      clearTimeout(exit)
    }
  }, [onComplete])

  return (
    <motion.div
      style={styles.root}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: exiting ? 0.9 : 0.05 }}
    >
      {/* White flash between frames */}
      <motion.div
        style={styles.flashOverlay}
        animate={{ opacity: flash ? 0.18 : 0 }}
        transition={{ duration: 0.05 }}
      />

      {/* Scan lines */}
      <div style={styles.scanlines} />

      {/* ── TOP FILM STRIP ── */}
      <div style={styles.filmStripTop}>
        <div style={styles.sprocketRow}>
          {Array.from({ length: 32 }).map((_, i) => <div key={i} style={styles.sprocket} />)}
        </div>
        <div style={styles.frameCounterRow}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ ...styles.frameCell, opacity: i % 4 === 0 ? 0.7 : 0.18 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </div>
        <div style={styles.sprocketRow}>
          {Array.from({ length: 32 }).map((_, i) => <div key={i} style={styles.sprocket} />)}
        </div>
      </div>

      {/* ── CAMERA DATA ROW ── */}
      <motion.div
        style={styles.dataRow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span style={styles.dataItem}>ISO&nbsp;400</span>
        <span style={styles.dataSep}>|</span>
        <span style={styles.dataItem}>1/60s</span>
        <span style={styles.dataSep}>|</span>
        <span style={styles.dataItem}>f/2.8</span>
        <span style={styles.dataSep}>|</span>
        <motion.span
          style={styles.dataItem}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
        >
          ● REC
        </motion.span>
      </motion.div>

      {/* ── LEADER CIRCLE ── */}
      <div style={styles.leaderWrap}>
        <svg viewBox="0 0 260 260" style={styles.leaderSvg}>
          {/* Outer ring */}
          <circle cx="130" cy="130" r="126" fill="none" stroke="#2a1808" strokeWidth="1.5" />
          <circle cx="130" cy="130" r="120" fill="#060402" />

          {/* Spoke lines */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2
            return (
              <line key={i}
                x1="130" y1="130"
                x2={130 + 120 * Math.cos(a)} y2={130 + 120 * Math.sin(a)}
                stroke="#1e1004" strokeWidth="0.8"
              />
            )
          })}

          {/* Rotating scan arc */}
          <line
            x1="130" y1="130"
            x2={130 + 118 * Math.cos(scanAngle * Math.PI / 180)}
            y2={130 + 118 * Math.sin(scanAngle * Math.PI / 180)}
            stroke="rgba(200,140,60,0.35)"
            strokeWidth="1.5"
          />

          {/* Cross-hairs */}
          <line x1="130" y1="6"   x2="130" y2="254" stroke="#3a2010" strokeWidth="1.2" />
          <line x1="6"   y1="130" x2="254" y2="130" stroke="#3a2010" strokeWidth="1.2" />

          {/* Tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2
            const isMajor = i % 5 === 0
            const r1 = isMajor ? 104 : 110
            return (
              <line key={i}
                x1={130 + r1  * Math.cos(a)} y1={130 + r1  * Math.sin(a)}
                x2={130 + 120 * Math.cos(a)} y2={130 + 120 * Math.sin(a)}
                stroke={isMajor ? '#5a3810' : '#1e1004'}
                strokeWidth={isMajor ? 1.8 : 0.7}
              />
            )
          })}

          {/* Mid ring */}
          <circle cx="130" cy="130" r="80"  fill="none" stroke="#2a1808" strokeWidth="1" />
          <circle cx="130" cy="130" r="60"  fill="#020510" />
          <circle cx="130" cy="130" r="60"  fill="none" stroke="#2a1808" strokeWidth="1" />

          {/* Cardinal accent circles */}
          {[[130,8],[130,252],[8,130],[252,130]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill="none" stroke="#2a1808" strokeWidth="1.2" />
          ))}

          {/* Corner brackets */}
          {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i) => {
            const bx = 130 + sx * 108
            const by = 130 + sy * 108
            return (
              <g key={i}>
                <line x1={bx} y1={by} x2={bx - sx * 12} y2={by} stroke="#5a3810" strokeWidth="1.8" />
                <line x1={bx} y1={by} x2={bx} y2={by - sy * 12} stroke="#5a3810" strokeWidth="1.8" />
              </g>
            )
          })}

          {/* Center dot */}
          <circle cx="130" cy="130" r="5" fill="#8a6020" />
          <circle cx="130" cy="130" r="2" fill="#c8a050" />
        </svg>

        {/* Countdown number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            style={styles.countNumber}
            initial={{ opacity: 0, scale: 1.6 }}
            animate={{ opacity: 1,  scale: 1   }}
            exit={{    opacity: 0,  scale: 0.4 }}
            transition={{ duration: 0.14 }}
          >
            {count > 0 ? count : ''}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── TITLE ── */}
      <motion.div
        style={styles.titleBlock}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
      >
        <motion.p
          style={styles.title}
          initial={{ letterSpacing: '0.7em' }}
          animate={{ letterSpacing: '0.48em' }}
          transition={{ delay: 0.4, duration: 1.8, ease: 'easeOut' }}
        >
          THADEUS TRISTAN
        </motion.p>
        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.0, duration: 1.2 }}
        >
          ─── SELECTED WORKS ───
        </motion.p>
      </motion.div>

      {/* ── BOTTOM FILM STRIP ── */}
      <div style={styles.filmStripBottom}>
        <div style={styles.sprocketRow}>
          {Array.from({ length: 32 }).map((_, i) => <div key={i} style={styles.sprocket} />)}
        </div>
        <div style={styles.frameCounterRow}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ ...styles.frameCell, opacity: i % 4 === 0 ? 0.7 : 0.18 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </div>
        <div style={styles.sprocketRow}>
          {Array.from({ length: 32 }).map((_, i) => <div key={i} style={styles.sprocket} />)}
        </div>
      </div>
    </motion.div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 5000,
    background: '#060402',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    overflow: 'hidden',
  },

  flashOverlay: {
    position: 'absolute',
    inset: 0,
    background: '#c8d8f0',
    pointerEvents: 'none',
    zIndex: 10,
  },

  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 3px)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  /* Film strips */
  filmStripTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    background: '#040200',
    borderBottom: '1px solid #1e1004',
    display: 'flex',
    flexDirection: 'column',
  },
  filmStripBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    background: '#040200',
    borderTop: '1px solid #1e1004',
    display: 'flex',
    flexDirection: 'column',
  },
  sprocketRow: {
    height: 9,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 12px',
    overflow: 'hidden',
  },
  sprocket: {
    flexShrink: 0,
    width: 11, height: 6,
    borderRadius: 1,
    background: '#060402',
    border: '1px solid #0e1828',
  },
  frameCounterRow: {
    height: 18,
    display: 'flex',
    overflow: 'hidden',
    borderTop: '1px solid #160c02',
    borderBottom: '1px solid #160c02',
  },
  frameCell: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Mono', monospace",
    fontSize: 6,
    color: '#6a4820',
    borderRight: '1px solid #160c02',
    letterSpacing: '0.05em',
  },

  /* Camera data */
  dataRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  dataItem: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    color: '#6a4820',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
  },
  dataSep: {
    color: '#142030',
    fontSize: 10,
  },

  /* Leader circle */
  leaderWrap: {
    position: 'relative',
    width: 210,
    height: 210,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderSvg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  countNumber: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 100,
    fontSize: 72,
    color: '#c8a050',
    lineHeight: 1,
    position: 'relative',
    zIndex: 1,
    textShadow: '0 0 40px rgba(200,150,60,0.5)',
  },

  /* Title */
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 200,
    fontSize: 13,
    color: '#d4b880',
    letterSpacing: '0.48em',
    margin: 0,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    color: '#7a5828',
    letterSpacing: '0.28em',
    margin: 0,
  },
}
