import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NowShowingReels from './NowShowingReels'
import { projects, CATEGORIES } from '../../data/projects'
import './portfolio.css'

// ─── Ink blob ─────────────────────────────────────────────
function InkBlob({ style, color = '#170b0a', seed = 1 }) {
  const path = useMemo(() => {
    const rand = (n) => ((Math.sin(seed * 9301 + n * 49297) + 1) / 2)
    const N = 14, cx = 200, cy = 200, base = 130
    let d = ''
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      const r = base * (0.65 + rand(i) * 0.55)
      const x = cx + Math.cos(a) * r
      const y = cy + Math.sin(a) * r
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '
    }
    return d + 'Z'
  }, [seed])

  return (
    <div className="blob" style={style}>
      <svg viewBox="0 0 400 400" preserveAspectRatio="none">
        <defs>
          <filter id={'goo' + seed}>
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path d={path} fill={color} filter={`url(#goo${seed})`} />
        <circle cx="60"  cy="80"  r="8"  fill={color} opacity="0.7" />
        <circle cx="340" cy="320" r="14" fill={color} opacity="0.6" />
        <circle cx="350" cy="60"  r="4"  fill={color} opacity="0.9" />
      </svg>
    </div>
  )
}

// ─── Portrait ─────────────────────────────────────────────
function Portrait() {
  return (
    <section className="portrait-section">
      <div className="portrait-left">
        <div className="label-sm" style={{ color: 'var(--gold-deep)' }}>The Director</div>
        <h2 className="portrait-headline">
          Behind the<br />
          <span className="it">curtain.</span>
        </h2>
        <p className="portrait-lede">
          Thaddeus is a solo designer-engineer working across procedural
          systems, animation, three-dimensional modelling, and live-action
          camera tracking — a practice rehearsed in equal parts code,
          camera, and craft.
        </p>
        <div className="pf-cols">
          <div>
            <h4 className="pf-h">Skills</h4>
            <ul className="pf-list">
              <li>Modelling &amp; Texturing</li>
              <li>Rigging &amp; Animation</li>
              <li>Lighting &amp; Look-dev</li>
              <li>VFX &amp; Compositing</li>
              <li>Procedural &amp; Scripting</li>
              <li>Editing &amp; Grade</li>
            </ul>
          </div>
          <div>
            <h4 className="pf-h">Experience</h4>
            <ul className="pf-list pf-exp">
              <li><span className="pf-yr">2026</span><span>Solo director — final-year anime sequence</span></li>
              <li><span className="pf-yr">2025</span><span>Freelance motion &amp; 3D commissions</span></li>
              <li><span className="pf-yr">2024</span><span>Spot animation &amp; product renders</span></li>
            </ul>
          </div>
        </div>

        <div className="pf-edu">
          <h4 className="pf-h">Education</h4>
          <div className="pf-track">
            <div className="pf-node">
              <span className="pf-yr">2022</span>
              <span className="pf-t">Foundation — Design</span>
            </div>
            <div className="pf-node">
              <span className="pf-yr">2024</span>
              <span className="pf-t">Specialisation — 3D &amp; Motion</span>
            </div>
            <div className="pf-node">
              <span className="pf-yr">2026</span>
              <span className="pf-t">Final Project — Anime Pipeline</span>
            </div>
          </div>
        </div>

        <div className="portrait-grid">
          <div>
            <div className="label-sm">Practice</div>
            <div className="val">Solo, end-to-end.</div>
          </div>
          <div>
            <div className="label-sm">Tools</div>
            <div className="val">Blender · Houdini · After Effects · Nuke.</div>
          </div>
          <div>
            <div className="label-sm">Discipline</div>
            <div className="val">Procedural · Animation · 3D · Tracking.</div>
          </div>
          <div>
            <div className="label-sm">Status</div>
            <div className="val" style={{ color: 'var(--kabuki-light)' }}>Open for commission.</div>
          </div>
        </div>
      </div>

      <div className="portrait-right">
        <div className="portrait-frame">
          <img src="/assets/thaddeus-portrait.jpeg" alt="Thaddeus" />
          <span className="frame-corner tl"></span>
          <span className="frame-corner tr"></span>
          <span className="frame-corner bl"></span>
          <span className="frame-corner br"></span>
        </div>
      </div>
    </section>
  )
}

// ─── Portfolio page ───────────────────────────────────────
function Portfolio({ onWorksClick, onBack, onSelectProject }) {
  const [shown, setShown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const studioRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const cls = (extra = '') => 'reveal' + (shown ? ' in' : '') + (extra ? ' ' + extra : '')

  // Reel cells come from real project data — a category appears only when it
  // has work, and its first project supplies the cover art.
  const BLURBS = {
    Shorts:    'Sequences, spots & loops',
    VFX:       'Plates, solves & composites',
    Animation: 'Motion & character work',
    Modelling: 'Assets, renders & turntables',
    Art:       'Studies & stills',
  }
  const reelCategories = useMemo(() => (
    CATEGORIES
      .map((name) => {
        const items = projects.filter((p) => p.category === name)
        const withMedia = items.find((p) => p.media?.[0])
        return {
          name,
          items,
          blurb: BLURBS[name] ?? '',
          cover: withMedia?.media?.[0],
          bg: items[0]?.colorBg,
        }
      })
      .filter((c) => c.items.length > 0)
  ), [])


  const scrollTo = (ref) => {
    setMenuOpen(false)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const navWorks = () => { setMenuOpen(false); onWorksClick() }

  return (
    <div className="page pp-root">
      {/* Ink blobs */}
      <InkBlob seed={1} style={{ top: -60,  right: -120, width: 520, height: 520, opacity: 0.35 }} color="#120807" />
      <InkBlob seed={4} style={{ top: 1100, left: -160,  width: 420, height: 420, opacity: 0.45 }} color="#170b0a" />
      <InkBlob seed={7} style={{ top: 2400, right: -80,  width: 380, height: 380, opacity: 0.50 }} color="#170b0a" />

      {/* Top nav */}
      <header className={cls('topbar')}>
        <div className="mark">
          <span className="dot"></span>
          <span>Thaddeus</span>
        </div>
        <div className="center">PORTFOLIO · VOLUME I</div>
        <nav>
          {onBack && (
            <button className="nav-link" onClick={onBack}>← Theatre</button>
          )}
          <button className="nav-link active" onClick={() => onWorksClick()}>Work</button>
          <button className="nav-link" onClick={() => scrollTo(studioRef)}>Studio</button>
          <button className="nav-link" onClick={() => scrollTo(contactRef)}>Contact</button>
        </nav>
        {/* Hamburger — mobile only */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div className="pp-drawer-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} onClick={() => setMenuOpen(false)} />
            <motion.div className="pp-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
              <p className="pp-drawer-label">Navigation</p>
              {[
                { label: 'Work',    action: navWorks },
                { label: 'Studio',  action: () => scrollTo(studioRef) },
                { label: 'Contact', action: () => scrollTo(contactRef) },
              ].map(({ label, action }, i) => (
                <button key={label} className="pp-drawer-item" onClick={action}>
                  <span className="pp-drawer-num">0{i + 1}</span>
                  {label}
                  <span className="pp-drawer-arrow">→</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Now Showing section */}
      <div className={cls('ow-section')}>
        <div className="ow-header">
          <div>
            <div className="label-sm" style={{ color: 'var(--gold-deep)', marginBottom: 8 }}>CATALOGUE · VOLUME I</div>
            <h2 className="ow-title">Now Showing.</h2>
          </div>
          <button className="ow-all-btn" onClick={() => onWorksClick()}>VIEW ALL WORKS ↗</button>
        </div>
        <NowShowingReels
          categories={reelCategories}
          onSelect={(cat) => onWorksClick(cat.name)}
        />
      </div>

      <div className={cls()}><span className="hair"></span></div>

      {/* Programme ticker */}
      <div className={cls('programme')}>
        <span className="blink"></span>
        <div style={{ overflow: 'hidden' }}>
          <div className="ticker">
            <span className="gold">◆ NOW SHOWING ◆</span>
            <span>1,600 Frames</span>
            <span className="red">985 Toon Materials</span>
            <span>79,000 Keyframes</span>
            <span className="red">561 Town Objects</span>
            <span>10-Machine Render Farm</span>
            <span className="gold">◆ INTERMISSION ◆</span>
            <span>·</span>
            <span className="gold">◆ NOW SHOWING ◆</span>
            <span>1,600 Frames</span>
            <span className="red">985 Toon Materials</span>
            <span>79,000 Keyframes</span>
            <span className="red">561 Town Objects</span>
            <span>10-Machine Render Farm</span>
            <span className="gold">◆ INTERMISSION ◆</span>
            <span>·</span>
          </div>
        </div>
        <span style={{ fontFamily: 'var(--grotesk)', letterSpacing: '0.4em', color: 'var(--gold)', fontSize: 11 }}>
          VOL. I
        </span>
      </div>

      {/* Portrait / Studio */}
      <div id="studio" ref={studioRef} className={cls()}>
        <Portrait />
      </div>

      {/* Footer */}
      <footer id="contact" ref={contactRef} className={cls('foot')}>
        <div>
          <div className="label-sm">Curtain Call</div>
          <div className="val">For new commissions, kindly write.</div>
        </div>
        <div>
          <div className="label-sm">Mail</div>
          <div className="val">Thadeustristansalim@gmail.com</div>
        </div>
        <div>
          <div className="label-sm">Phone</div>
          <div className="val">+61 424 003 221</div>
        </div>
        <div>
          <div className="label-sm">Instagram</div>
          <div className="val">@not.tristandeus</div>
        </div>
      </footer>

      <div className="colophon">
        <span>© 2025 · Thaddeus · All Acts Reserved.</span>
      </div>
    </div>
  )
}

// ─── Root export with Framer Motion fade ──────────────────
export default function PortfolioPage({ onWorksClick, onBack, onSelectProject }) {
  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', overflowX: 'hidden', background: '#31080d', scrollbarWidth: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Portfolio onWorksClick={onWorksClick} onBack={onBack} onSelectProject={onSelectProject} />
    </motion.div>
  )
}
