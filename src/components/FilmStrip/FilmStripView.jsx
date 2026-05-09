import { useState, useEffect, useRef, useCallback } from 'react'
import anime from 'animejs'
import { projects } from '../../data/projects'
import CategoryNav from './CategoryNav'
import FilmTapeCarousel from './FilmTapeCarousel'

const firstProject = projects.find(p => p.category === 'Animation')

export default function FilmStripView({ onBack, onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('Animation')
  const [colorBg, setColorBg] = useState(firstProject?.colorBg ?? '#0a0a0a')
  const [accentColor, setAccentColor] = useState(firstProject?.color ?? '#ffffff')

  const topTearRef = useRef(null)
  const bottomTearRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const top = topTearRef.current
    const bottom = bottomTearRef.current
    if (!top || !bottom) return

    anime.set([top, bottom], { opacity: 1 })
    anime({
      targets: top,
      translateY: [0, '-105%'],
      duration: 900,
      easing: 'spring(1, 80, 12, 0)',
    })
    anime({
      targets: bottom,
      translateY: [0, '105%'],
      duration: 900,
      easing: 'spring(1, 80, 12, 0)',
      complete: () => {
        top.style.pointerEvents = 'none'
        bottom.style.pointerEvents = 'none'
        top.style.opacity = '0'
        bottom.style.opacity = '0'
      },
    })
  }, [])

  const handleBgChange = useCallback(({ color, colorBg: bg }) => {
    setColorBg(bg)
    setAccentColor(color)
  }, [])

  return (
    <div ref={rootRef} style={{ ...s.root, backgroundColor: colorBg }}>
      {/* Tear panels */}
      <div ref={topTearRef} style={s.tearTop} />
      <div ref={bottomTearRef} style={s.tearBottom} />

      {/* Subtle grain / vignette overlay */}
      <div style={s.vignette} />

      {/* Header */}
      <header style={s.header}>
        <button onClick={onBack} style={s.backBtn} aria-label="Back to theatre">
          <span style={s.backArrow}>←</span>
          <span style={s.backLabel}>back</span>
        </button>

        <div style={s.wordmark}>
          <span style={s.wordmarkMain}>THADEUS TRISTAN</span>
          <span style={s.wordmarkSep}>·</span>
          <span style={s.wordmarkSub}>SELECTED WORKS</span>
        </div>

        <div style={s.navWrapper}>
          <CategoryNav active={activeCategory} onChange={setActiveCategory} accentColor={accentColor} />
        </div>
      </header>

      {/* Carousel */}
      <div style={s.carouselArea}>
        <FilmTapeCarousel
          activeCategory={activeCategory}
          onSelectProject={onSelectProject}
          onBgChange={handleBgChange}
        />
      </div>
    </div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 100,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    transition: 'background-color 0.6s ease',
  },

  tearTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '50.5%',
    background: '#ffffff',
    zIndex: 200,
    pointerEvents: 'none',
  },
  tearBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '50.5%',
    background: '#ffffff',
    zIndex: 200,
    pointerEvents: 'none',
  },

  vignette: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },

  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 48px 14px',
    flexShrink: 0,
    zIndex: 10,
    position: 'relative',
  },

  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8, padding: 0,
  },
  backArrow: {
    fontSize: 16, color: 'rgba(255,255,255,0.5)',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  backLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.3em', textTransform: 'uppercase',
  },

  wordmark: {
    display: 'flex', alignItems: 'baseline', gap: 10,
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
  },
  wordmarkMain: {
    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, fontSize: 11,
    letterSpacing: '0.42em', color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  wordmarkSep: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
  },
  wordmarkSub: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
    color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },

  navWrapper: {
    display: 'flex', alignItems: 'center',
  },

  carouselArea: {
    flex: 1, display: 'flex', flexDirection: 'column',
    minHeight: 0, overflow: 'hidden',
    zIndex: 10,
    position: 'relative',
  },
}
