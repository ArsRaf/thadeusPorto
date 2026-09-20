import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './Portfolio/portfolio.css'
import './Portfolio/gate.css'

/* Sound check, ported from the Claude Design comp "Portfolio v6.dc.html".
   A centred card that sets the level before the curtain: staggered letters,
   a mute toggle, a slider with tick marks, and a preview chime so the
   viewer can actually hear what they are choosing. */

const STORE = 'tt-volume'

function VolIcon({ vol }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {vol > 0   && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
      {vol >= 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
      {vol === 0 && <path d="M16 9l5 6M21 9l-5 6" />}
    </svg>
  )
}

export default function VolumeGate({ onEnter }) {
  const [volume, setVol] = useState(() => {
    const saved = Number(localStorage.getItem(STORE))
    return Number.isFinite(saved) && localStorage.getItem(STORE) !== null ? saved : 20
  })
  const [leaving, setLeaving] = useState(false)
  const lastVol = useRef(volume || 20)
  const ac = useRef(null)

  const store = (v) => { localStorage.setItem(STORE, String(v)); setVol(v) }

  const toggleMute = () => {
    if (volume > 0) { lastVol.current = volume; store(0) }
    else store(lastVol.current || 20)
  }

  const nudge = (d) => store(Math.max(0, Math.min(100, volume + d)))

  /* A short arpeggio so the level means something before committing to it. */
  const hearIt = () => {
    const v = volume / 100
    if (!v) return
    try {
      const C = ac.current || (ac.current = new (window.AudioContext || window.webkitAudioContext)())
      const g = C.createGain()
      g.gain.setValueAtTime(0.0001, C.currentTime)
      g.gain.exponentialRampToValueAtTime(v * 0.4, C.currentTime + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, C.currentTime + 0.9)
      g.connect(C.destination)
      ;[440, 554.37, 659.25].forEach((f, i) => {
        const o = C.createOscillator()
        o.type = 'triangle'
        o.frequency.value = f
        o.connect(g)
        o.start(C.currentTime + i * 0.12)
        o.stop(C.currentTime + 0.95)
      })
    } catch { /* audio unavailable; the gate still works */ }
  }

  const enter = (v = volume) => {
    if (leaving) return
    setLeaving(true)
    localStorage.setItem(STORE, String(v))
    setTimeout(() => onEnter?.(v / 100), 520)
  }

  // Arrow keys adjust, M mutes, Enter commits — as the comp specifies.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return
      if (e.key === 'm' || e.key === 'M') return toggleMute()
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { e.preventDefault(); return nudge(5) }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { e.preventDefault(); return nudge(-5) }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const word = volume === 0 ? 'Silent'
    : volume <= 25 ? 'Quiet'
    : volume <= 60 ? 'Comfortable'
    : volume <= 85 ? 'Loud' : 'Full'

  const title = [...'SET', ' ', ...'YOUR']
  const title2 = [...'VOLUME']
  let k = 0

  return (
    <motion.div
      className="gate"
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="gate-grain" aria-hidden="true" />

      <div className="gate-card">
        <span className="gate-kicker">Before you enter</span>

        <h1 className="gate-title">
          <span className="row cream">
            {title.map((c, i) => c === ' ' ? <span key={i} className="sp" /> : (
              <motion.span key={i}
                initial={{ y: '105%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + (k++) * 0.04, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >{c}</motion.span>
            ))}
          </span>
          <span className="row accent">
            {title2.map((c, i) => (
              <motion.span key={i}
                initial={{ y: '105%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + (k++) * 0.04, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >{c}</motion.span>
            ))}
          </span>
        </h1>

        <motion.p className="gate-lede"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Audio is part of the experience. Set a level you like — you can change
          it at any time once you are inside.
        </motion.p>

        <motion.div className="gate-panel"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.8 }}
        >
          <div className="gate-row">
            <button className="gate-mute" onClick={toggleMute}
                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}>
              <VolIcon vol={volume} />
            </button>

            <div className="gate-slider">
              <div className="track" />
              <div className="fill" style={{ width: `${volume}%` }} />
              <span className="knob" style={{ left: `${volume}%` }} />
              <input
                type="range" min="0" max="100" step="1" value={volume}
                onChange={(e) => store(Number(e.target.value))}
                onMouseUp={hearIt} onTouchEnd={hearIt}
                aria-label="Sound level"
              />
            </div>

            <span className="gate-pct">{volume}<span className="u">%</span></span>
          </div>
          <span className="gate-word">{word}</span>
        </motion.div>

        <motion.button className="gate-enter" onClick={() => enter()}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.94, duration: 0.8 }}
        >
          <span className="stub">Admit one</span>
          <span className="main">Enter &rarr;</span>
          <span className="lvl">{volume === 0 ? 'Muted' : volume + '%'}</span>
        </motion.button>

        <motion.p className="gate-hint"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.06, duration: 0.8 }}
        >
          Headphones recommended. Arrow keys adjust, <span className="key">M</span> mutes.
          <button className="gate-skip" onClick={() => { store(0); enter(0) }}>
            Continue without audio
          </button>
        </motion.p>
      </div>
    </motion.div>
  )
}
