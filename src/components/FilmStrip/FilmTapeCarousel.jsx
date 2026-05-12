import { useState, useEffect, useRef, useMemo } from 'react'
import anime from 'animejs'
import { projects } from '../../data/projects'

function SplitTitle({ text }) {
  return (
    <span style={{ display: 'inline-block' }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="title-char"
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

// Corner bracket marks for the media panel
function CornerMarks({ accent }) {
  const c = `${accent}55`
  return (
    <>
      <div style={{ ...cm.corner, top: 10, left: 10, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <div style={{ ...cm.corner, top: 10, right: 10, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
      <div style={{ ...cm.corner, bottom: 10, left: 10, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <div style={{ ...cm.corner, bottom: 10, right: 10, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
    </>
  )
}

const cm = {
  corner: { position: 'absolute', width: 16, height: 16, pointerEvents: 'none' },
}

export default function FilmTapeCarousel({ activeCategory, onSelectProject, onBgChange }) {
  const filtered = useMemo(
    () => projects.filter(p => p.category === activeCategory),
    [activeCategory]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const isAnimating = useRef(false)
  const contentRef = useRef(null)
  const categoryLabelRef = useRef(null)

  useEffect(() => {
    setCurrentIndex(0)
  }, [activeCategory])

  useEffect(() => {
    const project = filtered[currentIndex]
    if (project) onBgChange({ accent: project.accent, colorBg: project.colorBg })
  }, [currentIndex, filtered, onBgChange])

  useEffect(() => {
    animateEnter('right')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = categoryLabelRef.current
    if (!el) return
    const chars = el.querySelectorAll('.cat-char')
    anime.set(chars, { opacity: 0, translateY: 20 })
    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      delay: anime.stagger(30, { from: 'center' }),
      easing: 'easeOutCubic',
    })
  }, [activeCategory])

  const animateEnter = (dir) => {
    const el = contentRef.current
    if (!el) return
    const fromX = dir === 'right' ? 60 : -60
    const chars = el.querySelectorAll('.title-char')
    const mediaEl = el.querySelector('.media-panel')
    const metaEl = el.querySelector('.meta-panel')

    anime.set(el, { opacity: 1 })
    if (chars.length) anime.set(chars, { opacity: 0, translateY: 24 })
    if (mediaEl) anime.set(mediaEl, { opacity: 0, scale: 0.96, translateX: fromX * 0.4 })
    if (metaEl) anime.set(metaEl, { opacity: 0, translateX: fromX })

    if (chars.length) {
      anime({
        targets: chars,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 500,
        delay: anime.stagger(18, { from: 'first' }),
        easing: 'easeOutCubic',
      })
    }
    if (mediaEl) {
      anime({
        targets: mediaEl,
        opacity: [0, 1],
        scale: [0.96, 1],
        translateX: [fromX * 0.4, 0],
        duration: 560,
        delay: 80,
        easing: 'easeOutCubic',
      })
    }
    if (metaEl) {
      anime({
        targets: metaEl,
        opacity: [0, 1],
        translateX: [fromX, 0],
        duration: 480,
        delay: 120,
        easing: 'easeOutCubic',
        complete: () => { isAnimating.current = false },
      })
    } else {
      isAnimating.current = false
    }
  }

  const transitionTo = (next, dir) => {
    if (isAnimating.current || next === currentIndex) return
    isAnimating.current = true
    const el = contentRef.current
    const exitX = dir === 'right' ? -60 : 60
    anime({
      targets: el,
      opacity: [1, 0],
      translateX: [0, exitX],
      duration: 280,
      easing: 'easeInCubic',
      complete: () => {
        anime.set(el, { translateX: 0 })
        setCurrentIndex(next)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => animateEnter(dir))
        })
      },
    })
  }

  const navigate = (dir) => {
    const next = dir === 'right'
      ? (currentIndex + 1) % filtered.length
      : (currentIndex - 1 + filtered.length) % filtered.length
    transitionTo(next, dir)
  }

  const goTo = (idx) => {
    if (idx === currentIndex) return
    transitionTo(idx, idx > currentIndex ? 'right' : 'left')
  }

  const project = filtered[currentIndex]
  if (!project) return null

  const catLabel = activeCategory.toUpperCase().split('').join(' ')
  const accent = project.accent

  const firstMedia = project.media?.[0]
  const hasMedia = firstMedia?.src

  return (
    <div style={s.root}>
      {/* Category label */}
      <div ref={categoryLabelRef} style={{ ...s.categoryLabel, color: accent }}>
        {catLabel.split('').map((ch, i) => (
          <span
            key={i}
            className="cat-char"
            style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* Main content row */}
      <div ref={contentRef} style={s.content}>
        {/* Media panel */}
        <div className="media-panel" style={s.mediaPanel}>
          {hasMedia ? (
            firstMedia.type === 'youtube'
              ? <iframe
                  src={`https://www.youtube.com/embed/${firstMedia.src}?autoplay=1&mute=1&loop=1&playlist=${firstMedia.src}&controls=0&playsinline=1`}
                  style={{ ...s.mediaSrc, border: 'none' }}
                  allow="autoplay; encrypted-media"
                />
              : firstMedia.type === 'video'
                ? <video src={firstMedia.src} style={s.mediaSrc} autoPlay muted loop playsInline />
                : <img src={firstMedia.src} alt={project.title} style={s.mediaSrc} />
          ) : (
            <div style={s.mediaPlaceholder}>
              <span style={s.placeholderText}>NO MEDIA</span>
            </div>
          )}
          <CornerMarks accent={accent} />

          {/* Category · Year tag */}
          <div style={s.mediaTag}>
            <span style={{ ...s.mediaTagText, color: `${accent}99` }}>
              {project.category} · {project.year}
            </span>
          </div>
        </div>

        {/* Meta panel */}
        <div className="meta-panel" style={s.metaPanel}>
          <div style={{ ...s.year, color: `${accent}bb` }}>{project.year}</div>
          <h2 style={s.title}>
            <SplitTitle text={project.title} />
          </h2>
          <p style={s.description}>{project.description}</p>
          <div style={s.tools}>
            {project.tools.map(t => (
              <span key={t} style={{ ...s.tool, borderColor: `${accent}33`, color: `${accent}bb` }}>
                {t}
              </span>
            ))}
          </div>
          <button
            style={{ ...s.viewBtn, borderColor: `${accent}55`, color: '#fff' }}
            onClick={() => onSelectProject(project)}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${accent}22`
              e.currentTarget.style.borderColor = accent
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = `${accent}55`
            }}
          >
            VIEW PROJECT ↗
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={s.bottomBar}>
        {filtered.length > 1 && (
          <button
            style={s.arrowBtn}
            onClick={() => navigate('left')}
            onMouseEnter={e => { e.currentTarget.style.color = accent }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            aria-label="Previous"
          >←</button>
        )}

        <div style={s.projectTabs}>
          {filtered.map((p, i) => {
            const isActive = i === currentIndex
            return (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                style={{
                  ...s.projectTab,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                  borderBottom: `1px solid ${isActive ? accent : 'transparent'}`,
                  paddingBottom: 8,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
              >
                <span style={s.projectTabNumber}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={s.projectTabName}>{p.title}</span>
              </button>
            )
          })}
        </div>

        {filtered.length > 1 && (
          <button
            style={s.arrowBtn}
            onClick={() => navigate('right')}
            onMouseEnter={e => { e.currentTarget.style.color = accent }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            aria-label="Next"
          >→</button>
        )}
      </div>
    </div>
  )
}

const s = {
  root: {
    flex: 1, display: 'flex', flexDirection: 'column',
    padding: '0 48px 0',
    minHeight: 0, overflow: 'hidden',
  },

  categoryLabel: {
    fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontStyle: 'italic',
    fontSize: 'clamp(24px, 3.5vw, 52px)',
    letterSpacing: '0.05em',
    marginBottom: 12, marginTop: 16,
    userSelect: 'none', lineHeight: 1,
    opacity: 0.6,
  },

  content: {
    flex: 1, display: 'flex', gap: 48,
    alignItems: 'center', minHeight: 0, overflow: 'hidden',
  },

  mediaPanel: {
    flex: '0 0 55%', height: '100%',
    maxHeight: 440, overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    position: 'relative',
  },

  mediaSrc: { width: '100%', height: '100%', objectFit: 'cover' },

  mediaPlaceholder: {
    width: '100%', height: '100%', minHeight: 280,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.1)',
  },

  mediaTag: { position: 'absolute', bottom: 14, left: 18, pointerEvents: 'none' },
  mediaTagText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
  },

  metaPanel: {
    flex: 1, display: 'flex', flexDirection: 'column',
    gap: 14, minWidth: 0,
  },

  year: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
  },

  title: {
    fontFamily: "'Bodoni Moda', serif", fontWeight: 500,
    fontSize: 'clamp(24px, 3vw, 48px)',
    color: '#ffffff', margin: 0, lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },

  description: {
    fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300,
    fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)',
    margin: 0, maxWidth: 360,
  },

  tools: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tool: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
    letterSpacing: '0.2em', textTransform: 'uppercase',
    border: '1px solid', padding: '3px 10px',
  },

  viewBtn: {
    alignSelf: 'flex-start', background: 'transparent', border: '1px solid',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
    letterSpacing: '0.3em', textTransform: 'uppercase',
    padding: '11px 26px', cursor: 'pointer',
    transition: 'background 0.2s ease, border-color 0.2s ease', marginTop: 6,
  },

  bottomBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 0, padding: '14px 0',
    borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
  },

  projectTabs: {
    display: 'flex', alignItems: 'flex-end', gap: 0,
    flex: 1, justifyContent: 'center', overflow: 'hidden',
  },

  projectTab: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0 18px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4,
    transition: 'color 0.2s, border-bottom-color 0.2s',
  },

  projectTabNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 7, letterSpacing: '0.2em', color: 'inherit', opacity: 0.5,
  },

  projectTabName: {
    fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 10,
    fontWeight: 500, letterSpacing: '0.04em',
    textTransform: 'uppercase', color: 'inherit', whiteSpace: 'nowrap',
  },

  arrowBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: 'rgba(255,255,255,0.4)',
    padding: '0 20px 8px',
    fontFamily: "'Space Grotesk', sans-serif",
    transition: 'color 0.15s ease', flexShrink: 0,
  },
}
