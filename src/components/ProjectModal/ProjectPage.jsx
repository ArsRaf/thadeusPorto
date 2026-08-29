import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useIsMobile from '../../hooks/useIsMobile'

function ActSeparator({ num, label, accent }) {
  return (
    <div style={s.actSep}>
      <span style={{ ...s.actNo, color: accent }}>{num}</span>
      <span style={s.actHair} />
      <span style={s.actLabel}>{label}</span>
    </div>
  )
}

export default function ProjectPage({ project, onClose }) {
  const isMobile = useIsMobile()
  const mediaList = project.media ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const active = mediaList[activeIdx] ?? {}

  // Reset to first item when project changes
  useEffect(() => { setActiveIdx(0) }, [project.id])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const accent = project.accent ?? '#c09040'
  const hasGallery = mediaList.length > 1

  const metaFields = [
    { label: 'Category',   val: project.category },
    { label: 'Client',     val: project.client },
    { label: 'Year',       val: project.year },
    { label: 'Turnaround', val: project.turnaround },
  ].filter(f => f.val)

  const wrapPad = isMobile ? '0 20px' : '0 60px'

  return (
    <motion.div
      style={s.root}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <header style={{ ...s.header, padding: isMobile ? '16px 20px' : '18px 60px' }}>
        <button onClick={onClose} style={s.backBtn} aria-label="Back">
          <span style={s.backArrow}>←</span>
          <span style={s.backLabel}>back</span>
        </button>
        {!isMobile && <span style={s.wordmark}>THADEUS TRISTAN</span>}
        <span style={s.headerSpacer} />
      </header>

      <div style={s.scroll}>
        <div style={{ ...s.wrap, padding: wrapPad }}>

          {/* Title block */}
          <div style={s.titleBlock}>
            <div style={s.eyebrowLine}>
              <span style={{ ...s.eyebrowNum, color: accent }}>{project.category}</span>
              <span style={s.eyebrowHair} />
              {project.year && <span style={s.eyebrowYear}>{project.year}</span>}
            </div>
            <motion.h1
              style={{ ...s.title, color: accent }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0, 0.25, 1] }}
            >
              {project.title}
            </motion.h1>
            {project.description && (
              <p style={s.subtitle}>{project.description}</p>
            )}
          </div>

          {/* Poster — hero media */}
          <motion.figure
            style={s.poster}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.25, 0, 0.25, 1] }}
          >
            {active.src ? (
              active.type === 'youtube' ? (
                <iframe
                  key={active.src}
                  src={`https://www.youtube.com/embed/${active.src}?autoplay=1&mute=1&loop=1&playlist=${active.src}&controls=1&playsinline=1`}
                  style={{ ...s.posterMedia, border: 'none' }}
                  allow="autoplay; encrypted-media; fullscreen"
                />
              ) : active.type === 'video' ? (
                <video key={active.src} src={active.src} autoPlay loop muted playsInline style={s.posterMedia} />
              ) : (
                <img key={active.src} src={active.src} alt={project.title} style={s.posterMedia} />
              )
            ) : (
              <div style={{ ...s.posterPlaceholder, background: project.colorBg ?? '#0a0a0a' }} />
            )}

            <span style={{ ...s.posterTag, borderColor: `${accent}55` }}>
              {(active.label ?? project.category ?? '').toUpperCase()}
            </span>
            <span style={{ ...s.posterCorner, top: 14, left: 14, borderTop: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` }} />
            <span style={{ ...s.posterCorner, top: 14, right: 14, borderTop: `1px solid ${accent}`, borderRight: `1px solid ${accent}` }} />
            <span style={{ ...s.posterCorner, bottom: 14, left: 14, borderBottom: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` }} />
            <span style={{ ...s.posterCorner, bottom: 14, right: 14, borderBottom: `1px solid ${accent}`, borderRight: `1px solid ${accent}` }} />
            <span style={{ ...s.posterBar, background: accent }} />
          </motion.figure>

          {/* Gallery strip */}
          {hasGallery && (
            <div style={s.gallery}>
              {mediaList.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    ...s.galleryThumb,
                    borderColor: i === activeIdx ? accent : 'rgba(255,255,255,0.1)',
                    opacity: i === activeIdx ? 1 : 0.45,
                  }}
                  title={item.label}
                >
                  {item.src ? (
                    item.type === 'youtube' ? (
                      <img src={`https://img.youtube.com/vi/${item.src}/mqdefault.jpg`} alt={item.label ?? ''} style={s.galleryMedia} />
                    ) : item.type === 'video' ? (
                      <video src={item.src} style={s.galleryMedia} muted playsInline preload="metadata" />
                    ) : (
                      <img src={item.src} alt={item.label ?? ''} style={s.galleryMedia} />
                    )
                  ) : (
                    <div style={{ ...s.galleryEmpty, background: project.colorBg ?? '#111' }} />
                  )}
                  {item.label && (
                    <span style={{ ...s.galleryLabel, color: i === activeIdx ? accent : 'rgba(255,255,255,0.3)' }}>
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Metadata table */}
          {metaFields.length > 0 && (
            <div style={s.metaTable}>
              {metaFields.map(f => (
                <div key={f.label} style={s.metaCell}>
                  <div style={s.metaLabel}>{f.label}</div>
                  <div style={s.metaVal}>{f.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Act I — Goals */}
          {project.goals?.length > 0 && (
            <>
              <ActSeparator num="I" label="The Challenge" accent={accent} />
              <h3 style={s.sectionH}>Goals.</h3>
              <ol style={s.goalsList}>
                {project.goals.map((g, i) => (
                  <li key={i} style={s.goalItem}>
                    <span style={{ ...s.goalNo, color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={s.goalText}>{g}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {/* Act II — Strategy */}
          {project.strategy?.length > 0 && (
            <>
              <ActSeparator num="II" label="The Strategy" accent={accent} />
              <div style={{ ...s.proseRow, gridTemplateColumns: isMobile ? '1fr' : '0.75fr 1.25fr', gap: isMobile ? 20 : 56 }}>
                <h3 style={s.sectionH}>Strategy.</h3>
                <div>
                  {project.strategy.map((p, i) => <p key={i} style={s.proseP}>{p}</p>)}
                </div>
              </div>
            </>
          )}

          {/* Act III — Results */}
          {project.results?.length > 0 && (
            <>
              <ActSeparator num="III" label="The Results" accent={accent} />
              <div style={{ ...s.proseRow, gridTemplateColumns: isMobile ? '1fr' : '0.75fr 1.25fr', gap: isMobile ? 20 : 56 }}>
                <h3 style={s.sectionH}>Results.</h3>
                <div>
                  {project.results.map((p, i) => <p key={i} style={s.proseP}>{p}</p>)}
                </div>
              </div>
            </>
          )}

          {/* Tools + link */}
          <div style={s.footRow}>
            <div style={s.tools}>
              {project.tools.map((t) => (
                <span key={t} style={{ ...s.tool, borderColor: `${accent}33`, color: `${accent}bb` }}>{t}</span>
              ))}
            </div>

            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                style={{ ...s.viewBtn, color: accent, borderColor: `${accent}66` }}>
                VIEW PROJECT ↗
              </a>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  )
}

const s = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    background: '#060504',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8, padding: 0,
  },
  backArrow: {
    fontSize: 16, color: 'rgba(255,255,255,0.4)',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  backLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.3em', textTransform: 'uppercase',
  },
  wordmark: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 300, fontSize: 11,
    letterSpacing: '0.42em', color: 'rgba(255,255,255,0.2)',
    textTransform: 'uppercase',
  },
  headerSpacer: { width: 60 },

  scroll: {
    flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none',
  },
  wrap: {
    maxWidth: 1120, margin: '0 auto',
    padding: '0 60px 100px',
  },

  // Title block
  titleBlock: { paddingTop: 56, maxWidth: 820 },
  eyebrowLine: {
    display: 'flex', alignItems: 'center', gap: 18,
    marginBottom: 22,
  },
  eyebrowNum: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600,
  },
  eyebrowHair: { flex: 1, maxWidth: 200, height: 1, background: 'rgba(255,255,255,0.14)' },
  eyebrowYear: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontFamily: "'Bodoni Moda', serif",
    fontWeight: 500,
    fontSize: 'clamp(32px, 5.5vw, 68px)',
    lineHeight: 1.02, letterSpacing: '-0.015em',
    margin: '0 0 20px',
  },
  subtitle: {
    fontFamily: "'Bodoni Moda', serif",
    fontStyle: 'italic', fontWeight: 400,
    fontSize: 'clamp(15px, 1.6vw, 18px)',
    lineHeight: 1.55,
    color: 'rgba(255,255,255,0.45)',
    margin: 0, maxWidth: '58ch',
  },

  // Poster
  poster: {
    position: 'relative', width: '100%', aspectRatio: '16 / 9',
    margin: '48px 0 0', overflow: 'hidden', background: '#030202',
  },
  posterMedia: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  posterPlaceholder: { width: '100%', height: '100%' },
  posterTag: {
    position: 'absolute', top: 14, left: 14,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)',
    padding: '6px 10px', border: '1px solid', zIndex: 2,
  },
  posterCorner: { position: 'absolute', width: 22, height: 22, pointerEvents: 'none', zIndex: 2 },
  posterBar: { position: 'absolute', left: 14, bottom: 14, width: 60, height: 3, zIndex: 2 },

  // Gallery
  gallery: {
    display: 'flex', gap: 6, marginTop: 10,
    overflowX: 'auto', scrollbarWidth: 'none',
  },
  galleryThumb: {
    position: 'relative', flexShrink: 0, width: 104, height: 62,
    border: '1px solid', background: 'none', cursor: 'pointer', padding: 0,
    overflow: 'hidden', transition: 'opacity 0.2s, border-color 0.2s',
    display: 'flex', flexDirection: 'column',
  },
  galleryMedia: { width: '100%', flex: 1, objectFit: 'cover', display: 'block', minHeight: 0 },
  galleryEmpty: { width: '100%', flex: 1 },
  galleryLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.15em',
    textTransform: 'uppercase', padding: '2px 4px', background: 'rgba(0,0,0,0.6)',
    flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },

  // Meta table
  metaTable: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 24, padding: '28px 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    margin: '48px 0 0',
  },
  metaLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)', marginBottom: 10,
  },
  metaVal: {
    fontFamily: "'Bodoni Moda', serif", fontSize: 17,
    lineHeight: 1.3, color: 'rgba(255,255,255,0.85)',
  },

  // Act separator
  actSep: {
    display: 'grid', gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center', gap: 24, margin: '64px 0 32px',
  },
  actNo: {
    fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic',
    fontSize: 38, lineHeight: 1, letterSpacing: '-0.01em',
  },
  actHair: { background: 'rgba(255,255,255,0.12)', height: 1 },
  actLabel: {
    fontFamily: "'Mona Sans', sans-serif", fontSize: 10,
    letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
  },

  sectionH: {
    fontFamily: "'Bodoni Moda', serif", fontWeight: 500,
    fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1,
    letterSpacing: '-0.01em', margin: '0 0 20px', color: 'rgba(255,255,255,0.9)',
  },

  // Goals numbered list
  goalsList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 20 },
  goalItem: {
    display: 'grid', gridTemplateColumns: '40px 1fr', gap: 20,
    paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  goalNo: { fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontSize: 17, lineHeight: 1.3 },
  goalText: {
    fontFamily: "'Mona Sans', sans-serif", fontWeight: 300, fontSize: 14.5,
    lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', maxWidth: '62ch',
  },

  // Prose rows (Strategy / Results)
  proseRow: { display: 'grid' },
  proseP: {
    fontFamily: "'Mona Sans', sans-serif", fontWeight: 300, fontSize: 14.5,
    lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', maxWidth: '64ch',
  },

  // Tools / link
  footRow: {
    marginTop: 64, display: 'flex', flexDirection: 'column', gap: 20,
    borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32,
  },
  tools: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tool: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, letterSpacing: '0.2em',
    border: '1px solid', padding: '4px 10px',
    textTransform: 'uppercase',
  },
  viewBtn: {
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.28em',
    border: '1px solid', padding: '10px 20px',
    textDecoration: 'none', textTransform: 'uppercase',
    alignSelf: 'flex-start', transition: 'opacity 0.2s',
  },
}
