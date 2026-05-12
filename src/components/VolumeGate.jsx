import { useState } from 'react'
import { motion } from 'framer-motion'

export default function VolumeGate({ onEnter }) {
  const [volume, setVolume] = useState(0.2)

  const handleEnter = () => {
    onEnter(volume)
  }

  const label = volume === 0 ? 'MUTED' : `${Math.round(volume * 100)}%`

  return (
    <motion.div
      style={s.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Scanlines */}
      <div style={s.scanlines} />

      {/* Content */}
      <div style={s.card}>
        <p style={s.eyebrow}>BEFORE YOU ENTER</p>

        {/* Speaker icon */}
        <div style={s.iconWrap}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none"
            stroke={volume === 0 ? 'rgba(255,255,255,0.25)' : '#d4af37'}
            strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'stroke 0.3s' }}
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {volume > 0 && (
              <motion.path d="M15.54 8.46a5 5 0 0 1 0 7.07"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} />
            )}
            {volume >= 0.5 && (
              <motion.path d="M19.07 4.93a10 10 0 0 1 0 14.14"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} />
            )}
          </svg>

          {/* Animated ring */}
          {volume > 0 && (
            <motion.div style={s.ring}
              animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.08, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>

        <p style={s.title}>Set your volume</p>
        <p style={s.sub}>Audio is part of the experience.</p>

        {/* Slider */}
        <div style={s.sliderWrap}>
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={s.slider}
          />
          <div style={s.sliderTrack}>
            <div style={{ ...s.sliderFill, width: `${volume * 100}%` }} />
          </div>
        </div>

        <p style={s.volumeLabel}>{label}</p>

        {/* Enter button */}
        <motion.button
          style={s.enterBtn}
          onClick={handleEnter}
          whileTap={{ scale: 0.97 }}
        >
          ENTER
          <span style={s.enterArrow}>→</span>
        </motion.button>

        {/* Skip audio */}
        <button style={s.skipBtn} onClick={() => onEnter(0)}>
          continue without audio
        </button>
      </div>

      {/* Corner marks */}
      {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
        <div key={v+h} style={{
          ...s.corner,
          [v]: 24, [h]: 24,
          borderTop:    v === 'top'    ? '1px solid rgba(212,175,55,0.2)' : 'none',
          borderBottom: v === 'bottom' ? '1px solid rgba(212,175,55,0.2)' : 'none',
          borderLeft:   h === 'left'   ? '1px solid rgba(212,175,55,0.2)' : 'none',
          borderRight:  h === 'right'  ? '1px solid rgba(212,175,55,0.2)' : 'none',
        }} />
      ))}
    </motion.div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 5000,
    background: '#060402',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  scanlines: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 3px)',
  },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 0, position: 'relative', zIndex: 1, textAlign: 'center',
    padding: '48px 56px',
    border: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.015)',
    minWidth: 320,
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.2)',
    textTransform: 'uppercase', marginBottom: 36,
  },
  iconWrap: {
    position: 'relative', width: 80, height: 80,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  ring: {
    position: 'absolute', inset: -12,
    borderRadius: '50%', border: '1px solid rgba(212,175,55,0.4)',
    pointerEvents: 'none',
  },
  title: {
    fontFamily: "'Bodoni Moda', serif",
    fontSize: 26, fontWeight: 500, fontStyle: 'italic',
    color: '#f7ddda', marginBottom: 8,
  },
  sub: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: 12, color: 'rgba(255,255,255,0.3)',
    lineHeight: 1.6, marginBottom: 36,
  },

  sliderWrap: {
    position: 'relative', width: '100%', height: 32,
    display: 'flex', alignItems: 'center', marginBottom: 8,
  },
  slider: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    opacity: 0, cursor: 'pointer', zIndex: 2, margin: 0,
  },
  sliderTrack: {
    width: '100%', height: 1,
    background: 'rgba(255,255,255,0.1)',
    position: 'relative', overflow: 'visible',
  },
  sliderFill: {
    height: '100%', background: '#d4af37',
    transition: 'width 0.05s',
    position: 'relative',
  },
  volumeLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.3em',
    color: '#d4af37', marginBottom: 36,
  },

  enterBtn: {
    background: 'none',
    border: '1px solid rgba(212,175,55,0.5)',
    cursor: 'pointer', padding: '13px 40px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, letterSpacing: '0.4em',
    color: '#d4af37', textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 20, width: '100%', justifyContent: 'center',
  },
  enterArrow: { fontSize: 14, letterSpacing: 0 },

  skipBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8, letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.15)', textTransform: 'lowercase',
  },

  corner: { position: 'absolute', width: 16, height: 16, pointerEvents: 'none' },
}
