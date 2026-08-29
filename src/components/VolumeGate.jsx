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
            stroke={volume === 0 ? 'rgba(243,233,212,0.3)' : '#b08d4f'}
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
            <div style={{ ...s.sliderFill, width: `${volume * 100}%` }}>
              <span style={s.sliderKnob} />
            </div>
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
          borderTop:    v === 'top'    ? '1px solid rgba(176,141,79,0.35)' : 'none',
          borderBottom: v === 'bottom' ? '1px solid rgba(176,141,79,0.35)' : 'none',
          borderLeft:   h === 'left'   ? '1px solid rgba(176,141,79,0.35)' : 'none',
          borderRight:  h === 'right'  ? '1px solid rgba(176,141,79,0.35)' : 'none',
        }} />
      ))}
    </motion.div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 5000,
    background: 'radial-gradient(ellipse at 50% 40%, #5c1119 0%, #31080d 68%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  scanlines: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'radial-gradient(rgba(243,233,212,.14) .5px, transparent .5px), radial-gradient(rgba(0,0,0,.12) .5px, transparent .5px)',
    backgroundSize: '3px 3px, 5px 5px', backgroundPosition: '0 0, 2px 2px', opacity: 0.5,
  },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 0, position: 'relative', zIndex: 1, textAlign: 'center',
    padding: '48px 56px',
    border: '2px solid #7d6435',
    borderRadius: 22,
    background: 'rgba(75,13,20,0.72)',
    boxShadow: '0 26px 70px rgba(0,0,0,0.55)',
    minWidth: 320,
  },
  eyebrow: {
    fontFamily: "'Josefin Sans', system-ui, sans-serif", fontWeight: 600,
    fontSize: 11, letterSpacing: '0.4em', color: '#b08d4f',
    textTransform: 'uppercase', marginBottom: 36,
  },
  iconWrap: {
    position: 'relative', width: 80, height: 80,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  ring: {
    position: 'absolute', inset: -12,
    borderRadius: '50%', border: '1px solid rgba(176,141,79,0.45)',
    pointerEvents: 'none',
  },
  title: {
    fontFamily: "'Limelight', 'Bodoni Moda', serif",
    fontSize: 26, fontWeight: 400, fontStyle: 'normal',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#F3E9D4', marginBottom: 10,
    textShadow: '2px 2px 0 #8B0E16',
  },
  sub: {
    fontFamily: "'Josefin Sans', system-ui, sans-serif",
    fontSize: 13, color: '#d8ccb4',
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
    width: '100%', height: 3, borderRadius: 3,
    background: 'rgba(243,233,212,0.14)',
    position: 'relative', overflow: 'visible',
  },
  sliderFill: {
    height: '100%', background: '#b08d4f', borderRadius: 3,
    transition: 'width 0.05s',
    position: 'relative',
  },
  sliderKnob: {
    position: 'absolute', right: 0, top: '50%',
    width: 14, height: 14, marginRight: -7,
    transform: 'translateY(-50%) rotate(45deg)',
    background: '#8B0E16', border: '2px solid #b08d4f',
    borderRadius: 3, pointerEvents: 'none',
  },
  volumeLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.3em',
    color: '#b08d4f', marginBottom: 36,
  },

  enterBtn: {
    background: 'transparent',
    border: '2px solid #7d6435', borderRadius: 100,
    cursor: 'pointer', padding: '13px 40px',
    fontFamily: "'Josefin Sans', system-ui, sans-serif", fontWeight: 600,
    fontSize: 11, letterSpacing: '0.22em',
    color: '#d8ccb4', textTransform: 'uppercase',
    transition: 'color .25s, border-color .25s, background .25s',
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 20, width: '100%', justifyContent: 'center',
  },
  enterArrow: { fontSize: 14, letterSpacing: 0 },

  skipBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'Josefin Sans', system-ui, sans-serif",
    fontSize: 10, letterSpacing: '0.22em',
    color: 'rgba(243,233,212,0.4)', textTransform: 'uppercase',
  },

  corner: { position: 'absolute', width: 16, height: 16, pointerEvents: 'none' },
}
