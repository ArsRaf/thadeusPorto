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
    if (project) onBgChange({ color: project.color, colorBg: project.colorBg })
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
  const accentColor = project.color

  return (
    <div style={s.root}>
      <div ref={categoryLabelRef} style={{ ...s.categoryLabel, color: accentColor }}>
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

      <div ref={contentRef} style={s.content}>
        <div className="media-panel" style={s.mediaPanel}>
          {project.media?.[0]?.src ? (
            project.media[0].type === 'video'
              ? <video src={project.media[0].src} style={s.mediaSrc} autoPlay muted loop playsInline />
              : <img src={project.media[0].src} alt={project.title} style={s.mediaSrc} />
          ) : (
            <div style={s.mediaPlaceholder}>
              <span style={s.placeholderText}>NO MEDIA</span>
            </div>
          )}
        </div>

        <div className="meta-panel" style={s.metaPanel}>
          <div style={{ ...s.year, color: accentColor }}>{project.year}</div>
          <h2 style={s.title}>
            <SplitTitle text={project.title} />
          </h2>
          <p style={s.description}>{project.description}</p>
          <div style={s.tools}>
            {project.tools.map(t => (
              <span key={t} style={{ ...s.tool, borderColor: `${accentColor}44`, color: `${accentColor}cc` }}>
                {t}
              </span>
            ))}
          </div>
          <button
            style={{ ...s.viewBtn, borderColor: `${accentColor}66`, color: '#fff' }}
            onClick={() => onSelectProject(project)}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${accentColor}22`
              e.currentTarget.style.borderColor = accentColor
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = `${accentColor}66`
            }}
          >
            VIEW PROJECT ↗
          </button>
        </div>
      </div>

      <div style={s.bottomBar}>
        {filtered.length > 1 && (
          <button
            style={s.arrowBtn}
            onClick={() => navigate('left')}
            onMouseEnter={e => { e.currentTarget.style.color = accentColor }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
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
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                  borderBottom: `2px solid ${isActive ? accentColor : 'transparent'}`,
                  paddingBottom: 8,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
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
            onMouseEnter={e => { e.currentTarget.style.color = accentColor }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            aria-label="Next"
          >→</button>
        )}
      </div>
    </div>
  )
}

const s = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 24px',
    minHeight: 0,
    overflow: 'hidden',
  },

  categoryLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300,
    fontSize: 'clamp(28px, 4.5vw, 64px)',
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    marginBottom: 16,
    userSelect: 'none',
    lineHeight: 1,
    opacity: 0.7,
  },

  content: {
    flex: 1,
    display: 'flex',
    gap: 48,
    alignItems: 'center',
    minHeight: 0,
    overflow: 'hidden',
  },

  mediaPanel: {
    flex: '0 0 55%',
    height: '100%',
    maxHeight: 460,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  mediaSrc: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    minHeight: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.4em',
    color: 'rgba(255,255,255,0.12)',
  },

  metaPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    minWidth: 0,
  },

  year: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.3em',
    fontWeight: 400,
  },

  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300,
    fontSize: 'clamp(26px, 3.2vw, 52px)',
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },

  description: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300,
    fontSize: 13,
    lineHeight: 1.75,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    maxWidth: 360,
  },

  tools: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },

  tool: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    border: '1px solid',
    padding: '4px 10px',
  },

  viewBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px solid',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    padding: '12px 28px',
    cursor: 'pointer',
    transition: 'background 0.2s ease, border-color 0.2s ease',
    marginTop: 8,
  },

  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingTop: 16,
    borderTop: '1px solid rgba(255,255,255,0.07)',
    flexShrink: 0,
  },

  projectTabs: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 0,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  projectTab: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    transition: 'color 0.2s, border-bottom-color 0.2s',
  },

  projectTabNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 8,
    letterSpacing: '0.2em',
    color: 'inherit',
    opacity: 0.5,
  },

  projectTabName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'inherit',
    whiteSpace: 'nowrap',
  },

  arrowBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
    padding: '0 20px 8px',
    fontFamily: "'Space Grotesk', sans-serif",
    transition: 'color 0.15s ease',
    flexShrink: 0,
  },
}
