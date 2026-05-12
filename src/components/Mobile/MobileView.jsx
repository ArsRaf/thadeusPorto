import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, CATEGORIES } from '../../data/projects'

const NAV_ITEMS = ['Works', 'Studio', 'Contact']

function HamburgerIcon({ open }) {
  return (
    <div style={{ width: 22, height: 16, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} style={{
          display: 'block', height: 1.5, borderRadius: 1,
          background: 'rgba(255,255,255,0.75)',
          transformOrigin: 'center',
        }}
          animate={
            i === 0 ? { rotate: open ? 45 : 0,  y: open ? 7.25 : 0 } :
            i === 1 ? { opacity: open ? 0 : 1, scaleX: open ? 0 : 1 } :
                      { rotate: open ? -45 : 0, y: open ? -7.25 : 0 }
          }
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  )
}

function ProjectCard({ project, onSelect }) {
  const media = project.media?.[0]
  return (
    <button style={s.card} onClick={() => onSelect(project)}>
      <div style={{ ...s.thumb, background: project.colorBg ?? '#0a0604' }}>
        {media?.type === 'video' ? (
          <video src={media.src} muted playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        ) : media?.type === 'image' ? (
          <img src={media.src} alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        ) : null}
        <div style={{ ...s.thumbOverlay, background: `linear-gradient(to top, ${project.colorBg ?? '#0a0604'} 0%, transparent 60%)` }} />
        <span style={{ ...s.thumbCat, color: project.accent ?? '#d4af37' }}>{project.category}</span>
      </div>
      <div style={s.cardBody}>
        <p style={s.cardTitle}>{project.title}</p>
        <p style={{ ...s.cardYear, color: (project.accent ?? '#d4af37') + '66' }}>{project.year}</p>
      </div>
    </button>
  )
}

export default function MobileView({ onSelectProject }) {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [section,  setSection]        = useState('home')
  const [activeCat, setActiveCat]     = useState('Animation')

  const filtered = useMemo(() => projects.filter(p => p.category === activeCat), [activeCat])

  const navTo = (sec) => { setSection(sec.toLowerCase()); setMenuOpen(false) }

  return (
    <div style={s.root}>
      {/* ── Topbar ── */}
      <header style={s.topbar}>
        <button style={s.logoBtn} onClick={() => navTo('home')}>
          <span style={s.logoDot} />
          <span style={s.logoText}>Thaddeus</span>
        </button>
        <button style={s.hamburgerBtn} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <HamburgerIcon open={menuOpen} />
        </button>
      </header>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div style={s.drawer}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={s.drawerInner}>
              <p style={s.drawerLabel}>NAVIGATION</p>
              {NAV_ITEMS.map((item, i) => (
                <motion.button key={item} style={s.drawerItem}
                  onClick={() => navTo(item)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.06, duration: 0.3 }}
                >
                  <span style={s.drawerNum}>0{i + 1}</span>
                  <span style={s.drawerItemText}>{item}</span>
                  <span style={s.drawerArrow}>→</span>
                </motion.button>
              ))}
              <div style={s.drawerFoot}>
                <p style={s.drawerFootText}>hello@thaddeus.studio</p>
                <p style={s.drawerFootText}>Open for commission</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div style={s.content}>
        <AnimatePresence mode="wait">

          {section === 'home' && (
            <motion.div key="home" style={s.section}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              {/* Hero */}
              <div style={s.hero}>
                <figure style={s.heroPoster}>
                  <video src="/assets/escape-detention.mp4" autoPlay muted loop playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  <div style={s.heroPosterGrad} />
                </figure>
                <div style={s.heroText}>
                  <p style={s.heroEyebrow}>PORTFOLIO · VOL. I</p>
                  <h1 style={s.heroTitle}>A Theatre of<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Selected Works.</em></h1>
                  <p style={s.heroSub}>Solo designer-engineer. Procedural systems, animation, 3D, live-action.</p>
                  <button style={s.heroCta} onClick={() => navTo('works')}>
                    VIEW WORKS ↗
                  </button>
                </div>
              </div>
              {/* Featured project */}
              <div style={s.featuredLabel}>
                <span style={s.featuredTag}>NOW SHOWING</span>
              </div>
              <ProjectCard project={projects[0]} onSelect={onSelectProject} />
            </motion.div>
          )}

          {section === 'works' && (
            <motion.div key="works" style={s.section}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <div style={s.sectionHead}>
                <p style={s.sectionEyebrow}>CATALOGUE</p>
                <h2 style={s.sectionTitle}>All Works.</h2>
              </div>
              {/* Category tabs */}
              <div style={s.tabs}>
                {CATEGORIES.map(cat => (
                  <button key={cat} style={{ ...s.tab, ...(cat === activeCat ? s.tabActive : {}) }}
                    onClick={() => setActiveCat(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeCat} style={s.grid}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {filtered.map(p => <ProjectCard key={p.id} project={p} onSelect={onSelectProject} />)}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {section === 'studio' && (
            <motion.div key="studio" style={s.section}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <div style={s.sectionHead}>
                <p style={s.sectionEyebrow}>THE DIRECTOR</p>
                <h2 style={s.sectionTitle}>Behind the<br /><em style={{ fontStyle: 'italic' }}>curtain.</em></h2>
              </div>
              <img src="/assets/thaddeus-portrait.jpeg" alt="Thaddeus"
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', opacity: 0.85 }} />
              <div style={s.studioBody}>
                <p style={s.studioPara}>Thaddeus is a solo designer-engineer working across procedural systems, animation, three-dimensional modelling, and live-action camera tracking.</p>
                {[
                  ['Practice', 'Solo, end-to-end.'],
                  ['Tools', 'Blender · Houdini · After Effects · Nuke'],
                  ['Discipline', 'Procedural · Animation · 3D · Tracking'],
                  ['Status', 'Open for commission.'],
                ].map(([label, val]) => (
                  <div key={label} style={s.studioRow}>
                    <span style={s.studioLabel}>{label}</span>
                    <span style={s.studioVal}>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === 'contact' && (
            <motion.div key="contact" style={s.section}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <div style={s.sectionHead}>
                <p style={s.sectionEyebrow}>CURTAIN CALL</p>
                <h2 style={s.sectionTitle}>Get in<br /><em style={{ fontStyle: 'italic' }}>touch.</em></h2>
              </div>
              <div style={s.contactBody}>
                {[
                  ['Mail', 'hello@thaddeus.studio', 'Replies within 48 hours.'],
                  ['Social', '@thaddeus', 'Studio — at large.'],
                  ['Box Office', 'By appointment', 'Open for Q3–Q4.'],
                ].map(([label, val, sub]) => (
                  <div key={label} style={s.contactRow}>
                    <p style={s.studioLabel}>{label}</p>
                    <p style={s.contactVal}>{val}</p>
                    <p style={s.contactSub}>{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0,
    background: '#1d100f',
    display: 'flex', flexDirection: 'column',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },

  /* Topbar */
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0, zIndex: 200, background: '#1d100f',
  },
  logoBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
  logoDot: { width: 6, height: 6, borderRadius: '50%', background: '#b32929', display: 'inline-block' },
  logoText: { fontFamily: "'Bodoni Moda', serif", fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' },
  hamburgerBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0 },

  /* Drawer */
  drawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: 320,
    background: '#120808', borderLeft: '1px solid rgba(255,255,255,0.06)',
    zIndex: 300, display: 'flex', flexDirection: 'column',
  },
  drawerInner: { padding: '80px 32px 40px', display: 'flex', flexDirection: 'column', flex: 1 },
  drawerLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', marginBottom: 32, textTransform: 'uppercase' },
  drawerItem: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'left', width: '100%',
  },
  drawerNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#b32929', letterSpacing: '0.1em' },
  drawerItemText: { fontFamily: "'Bodoni Moda', serif", fontSize: 24, fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', flex: 1 },
  drawerArrow: { fontSize: 14, color: 'rgba(255,255,255,0.2)' },
  drawerFoot: { marginTop: 'auto', paddingTop: 32 },
  drawerFootText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', marginBottom: 6 },

  /* Content area */
  content: { flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' },
  section: { minHeight: '100%' },

  /* Hero */
  hero: { position: 'relative' },
  heroPoster: { margin: 0, height: '55vw', minHeight: 200, position: 'relative', overflow: 'hidden', background: '#0a0604' },
  heroPosterGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #1d100f 100%)' },
  heroText: { padding: '20px 24px 28px' },
  heroEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.25)', marginBottom: 12 },
  heroTitle: { fontFamily: "'Bodoni Moda', serif", fontSize: 32, fontWeight: 500, color: '#f7ddda', lineHeight: 1.15, margin: '0 0 12px' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: 24 },
  heroCta: {
    background: 'none', border: '1px solid rgba(212,175,55,0.5)', cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em',
    color: '#d4af37', padding: '10px 20px', textTransform: 'uppercase',
  },
  featuredLabel: { padding: '0 24px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 },
  featuredTag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.4em', color: '#b32929' },

  /* Section headers */
  sectionHead: { padding: '32px 24px 20px' },
  sectionEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', marginBottom: 10 },
  sectionTitle: { fontFamily: "'Bodoni Moda', serif", fontSize: 36, fontWeight: 500, color: '#f7ddda', lineHeight: 1.15, margin: 0 },

  /* Category tabs */
  tabs: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 },
  tab: {
    background: 'none', border: 'none', borderBottom: '2px solid transparent',
    cursor: 'pointer', padding: '12px 20px',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase',
  },
  tabActive: { color: '#d4af37', borderBottomColor: '#d4af37' },

  /* Grid */
  grid: { display: 'flex', flexDirection: 'column', gap: 1 },

  /* Cards */
  card: { background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', flexDirection: 'column' },
  thumb: { width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' },
  thumbOverlay: { position: 'absolute', inset: 0 },
  thumbCat: { position: 'absolute', top: 10, left: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase' },
  cardBody: { padding: '12px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  cardTitle: { fontFamily: "'Bodoni Moda', serif", fontSize: 16, fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', margin: '0 0 4px' },
  cardYear: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em', margin: 0 },

  /* Studio */
  studioBody: { padding: '24px 24px 40px' },
  studioPara: { fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, marginBottom: 28 },
  studioRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 16 },
  studioLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', flexShrink: 0, marginBottom: 0 },
  studioVal: { fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'right' },

  /* Contact */
  contactBody: { padding: '8px 24px 48px', display: 'flex', flexDirection: 'column', gap: 0 },
  contactRow: { padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  contactVal: { fontFamily: "'Bodoni Moda', serif", fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', margin: '6px 0 4px' },
  contactSub: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', margin: 0 },
}
