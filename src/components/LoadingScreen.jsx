import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Portfolio/portfolio.css'

// Marquee opening: the house lights come up on a brass-framed board, then the
// curtains part. Styled to match the landing page (navy / brick / brass,
// Limelight display type) rather than the old amber film-leader countdown.
const EXIT_MS = 1100 // curtain travel + fade

export default function LoadingScreen({ onComplete }) {
  const [opening, setOpening] = useState(false)

  // The curtains wait for the visitor — nothing opens on a timer.
  useEffect(() => {
    if (!opening) return
    const done = setTimeout(onComplete, EXIT_MS)
    return () => clearTimeout(done)
  }, [opening, onComplete])

  const open = () => setOpening(true)

  // Enter/Space act as the click, so the opening is reachable by keyboard.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <motion.div
      className="ls-root"
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, times: [0, 1], ease: 'easeInOut' }}
      style={{ pointerEvents: opening ? 'none' : 'auto' }}
    >
      {/* Curtains — part outward to reveal the site */}
      <motion.div
        className="ls-curtain l"
        animate={{ x: opening ? '-101%' : '0%' }}
        transition={{ duration: EXIT_MS / 1000, ease: [0.7, 0, 0.2, 1] }}
      />
      <motion.div
        className="ls-curtain r"
        animate={{ x: opening ? '101%' : '0%' }}
        transition={{ duration: EXIT_MS / 1000, ease: [0.7, 0, 0.2, 1] }}
      />

      {/* Marquee board */}
      <motion.div
        className="ls-board"
        role="button"
        tabIndex={0}
        aria-label="Open the curtains and enter"
        onClick={open}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
        whileHover={opening ? undefined : { y: -3 }}
        whileTap={opening ? undefined : { y: -1 }}
      >
        <span className="ls-bulbs l">
          {Array.from({ length: 6 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${(i * 0.22).toFixed(2)}s` }} />
          ))}
        </span>
        <span className="ls-bulbs r">
          {Array.from({ length: 6 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${(i * 0.22).toFixed(2)}s` }} />
          ))}
        </span>

        <div className="ls-inner">
          <div className="ls-kick">Now Showing</div>
          <motion.h1
            className="ls-title"
            initial={{ letterSpacing: '0.34em', opacity: 0 }}
            animate={{ letterSpacing: '0.14em', opacity: 1 }}
            transition={{ delay: 0.15, duration: 1.1, ease: 'easeOut' }}
          >
            Thaddeus Tristan
          </motion.h1>
          <div className="ls-rule"><span className="dia" /></div>
          <div className="ls-sub">Animation · 3D · VFX</div>
        </div>
      </motion.div>

      <motion.div
        className="ls-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 0.75 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <span className="ls-dot" />
        <span>Click to raise the curtain</span>
      </motion.div>
    </motion.div>
  )
}
