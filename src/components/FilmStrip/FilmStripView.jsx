import { useState, useEffect, useRef, useCallback } from 'react'
import anime from 'animejs'
import { projects } from '../../data/projects'
import CategoryNav from './CategoryNav'
import FilmTapeCarousel from './FilmTapeCarousel'
import useIsMobile from '../../hooks/useIsMobile'

const firstProject = projects.find(p => p.category === 'Animation')

export default function FilmStripView({ onBack, onSelectProject }) {
  const isMobile = useIsMobile()
  const [activeCategory, setActiveCategory] = useState('Animation')
  const [colorBg, setColorBg] = useState(firstProject?.colorBg ?? '#1d100f')
  const [accentColor, setAccentColor] = useState(firstProject?.accent ?? '#ffb3ad')

  const topTearRef = useRef(null)
  const bottomTearRef = useRef(null)

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

  const handleBgChange = useCallback(({ accent, colorBg: bg }) => {
    setColorBg(bg)
    setAccentColor(accent)
  }, [])

  return (
    <div style={{ ...s.root, backgroundColor: colorBg, gridTemplateRows: isMobile ? '56px 1fr' : '72px 1fr' }}>
      {/* Screen-tear panels */}
      <div ref={topTearRef} style={s.tearTop} />
      <div ref={bottomTearRef} style={s.tearBottom} />

      {/* Vignette */}
      <div style={s.vignette} />

      {/* Header — row 1 */}
      <header style={{ ...s.header, padding: isMobile ? '0 16px' : '0 40px' }}>
        <button onClick={onBack} style={s.backBtn} aria-label="Back to portfolio">
          <span style={s.backArrow}>←</span>
          <span style={s.backLabel}>back</span>
        </button>

        {!isMobile && (
          <div style={s.wordmark}>
            <span style={s.wordmarkDiamond}>◆</span>
            <span style={s.wordmarkMain}>Thadeus Tristan</span>
            <span style={s.wordmarkDiamond}>◆</span>
          </div>
        )}

        <div style={s.navWrapper}>
          <CategoryNav active={activeCategory} onChange={setActiveCategory} accentColor={accentColor} />
        </div>
      </header>

      {/* Carousel — row 2 */}
      <div style={s.carouselArea}>
        <FilmTapeCarousel
          activeCategory={activeCategory}
          onSelectProject={onSelectProject}
          onBgChange={handleBgChange}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 100,
    display: 'grid',
    gridTemplateRows: '72px 1fr',
    overflow: 'hidden',
    transition: 'background-color 0.6s ease',
  },

  tearTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '50.5%', background: '#ffffff',
    zIndex: 200, pointerEvents: 'none',
  },
  tearBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '50.5%', background: '#ffffff',
    zIndex: 200, pointerEvents: 'none',
  },

  vignette: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
    pointerEvents: 'none', zIndex: 1,
  },

  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    zIndex: 10, position: 'relative',
    flexShrink: 0,
  },

  backBtn: {
    background: 'none', border: '1px solid rgba(255,255,255,0.12)',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: 8, padding: '7px 14px',
    transition: 'border-color 0.2s',
  },
  backArrow: {
    fontSize: 14, color: 'rgba(255,255,255,0.5)',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  backLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
    color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', textTransform: 'uppercase',
  },

  wordmark: {
    display: 'flex', alignItems: 'center', gap: 10,
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
  },
  wordmarkMain: {
    fontFamily: "'Bodoni Moda', serif", fontWeight: 500,
    fontSize: 16, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em',
  },
  wordmarkDiamond: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 7, color: 'rgba(255,255,255,0.2)',
  },

  navWrapper: { display: 'flex', alignItems: 'center' },

  carouselArea: {
    flex: 1, display: 'flex', flexDirection: 'column',
    minHeight: 0, overflow: 'hidden',
    zIndex: 10, position: 'relative',
  },
}
