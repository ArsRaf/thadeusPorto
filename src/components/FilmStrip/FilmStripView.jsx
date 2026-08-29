import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { projects } from '../../data/projects'
import ProjectGrid from './ProjectGrid'
import useIsMobile from '../../hooks/useIsMobile'

export default function FilmStripView({ onBack, onSelectProject }) {
  const isMobile = useIsMobile()

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

  return (
    <div style={s.root}>
      {/* Screen-tear panels */}
      <div ref={topTearRef} style={s.tearTop} />
      <div ref={bottomTearRef} style={s.tearBottom} />

      {/* Vignette */}
      <div style={s.vignette} />

      {/* Header — row 1 */}
      <div className="bar-top">
        <div className="lt">
          <button className="bar-btn" onClick={onBack}>← Lobby</button>
        </div>
        <div className="mk"><span className="d"></span><span>Thaddeus Tristan</span></div>
        <div className="rt"></div>
      </div>

      {/* Grid — row 2 */}
      <div style={{ ...s.gridArea, padding: 0 }}>
        <ProjectGrid
          projects={projects}
          onSelectProject={onSelectProject}
        />
      </div>
    </div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 100,
    backgroundColor: '#31080d',
    overflowY: 'auto', overflowX: 'hidden',
    scrollbarWidth: 'none',
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

  gridArea: { zIndex: 10, position: 'relative' },
}
