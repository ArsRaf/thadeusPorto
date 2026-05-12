import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './portfolio.css'

// ─── Project data ─────────────────────────────────────────
const PROJECT = {
  title: "That Time When I Tried to Escape Detention",
  subtitle: "A solo-built anime render pipeline, in ten weeks.",
  client: "Self-Initiated Project",
  year: "2026",
  turnaround: "10 Weeks",
  role: "Solo — Direction, Pipeline, Animation",

  goals: [
    "Create a solo animated project in 10 weeks for the final of my course.",
    "Storyboarding, scene compositing, modelling, texturing, rigging, lighting, animating, VFX, rendering, video editing — self-directed end-to-end.",
  ],

  strategy: [
    "Built a fully custom anime render pipeline from scratch — no shortcuts, no pre-made shaders.",
    "Every system was scripted or engineered deliberately: a Fresnel toon shader deployed across 985 materials, a dual-character transformation rig with frame-accurate visibility switching, a non-destructive retiming engine across 16,000+ keyframe curves, and a distributed render-ready scene optimized through a programmatic frustum-cull pass.",
    "Technical execution was the creative tool.",
  ],

  results: [
    "A 1,600-frame cinematic anime sequence at 1920×1080 / 24fps — spanning four environments, two hero character states, a full villain rig with particles, toon-shaded town of 561 objects, explosion FX, and impact lighting.",
    "Over 79,000 keyframes cleaned algorithmically. Every asset production-ready for a 10-machine distributed render.",
  ],

  delivered: [
    { line: "1,600-frame anime animation",                        spec: "1920×1080 / 24fps — distributed render ready" },
    { line: "Custom Fresnel toon shader system",                  spec: "Deployed across 985 unique materials" },
    { line: "Frame-accurate dual-character transformation",       spec: "Material keyframe switching, hero state A → B" },
    { line: "Procedural retiming engine",                         spec: "Operates across 16,000+ keyframe curves" },
    { line: "Ghost antagonist",                                   spec: "Particle FX · toon shading · animated eye sequences" },
    { line: "Japanese town environment",                          spec: "Scene-scheduled visibility across 20+ frame windows" },
    { line: "Fully packed, optimised .blend",                     spec: "Frustum-culled across 481 frames" },
  ],

  stats: [
    { v: "1,600", l: "Frames Rendered" },
    { v: "985",   l: "Toon Materials" },
    { v: "79K",   l: "Keyframes Cleaned" },
    { v: "561",   l: "Town Objects" },
    { v: "10",    l: "Machine Render Farm" },
    { v: "1",     l: "Director" },
  ],
}

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

// ─── Act separator ────────────────────────────────────────
function ActSeparator({ act, label }) {
  return (
    <div className="act-sep">
      <span className="act-no">{act}</span>
      <span className="hair"></span>
      <span className="act-label">{label}</span>
    </div>
  )
}

// ─── Stat ─────────────────────────────────────────────────
function Stat({ v, l }) {
  return (
    <div className="stat">
      <div className="stat-v">{v}</div>
      <div className="stat-l">{l}</div>
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
          <div className="portrait-caption">
            <span>Plate 01</span>
            <span>The Director, in repose.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Playbill spread ──────────────────────────────────────
function PlaybillSpread({ p }) {
  return (
    <section className="spread">
      {/* Title block */}
      <div className="spread-title">
        <div className="eyebrow-line">
          <span className="num">PROGRAMME · NO. 01</span>
          <span className="line"></span>
          <span className="num red">Now Playing</span>
        </div>
        <h2 className="spread-h1">
          That Time When I<br />
          <span className="it">Tried to Escape Detention.</span>
        </h2>
        <p className="spread-sub">{p.subtitle}</p>
      </div>

      {/* Poster — actual project video */}
      <figure className="poster-marquee">
        <video
          src="/assets/escape-detention.mp4"
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span className="poster-tag" style={{ zIndex: 2 }}>
          REEL · 1,600 FRAMES · 1920×1080 · 24fps
        </span>
        <span className="poster-corner tl"></span>
        <span className="poster-corner tr"></span>
        <span className="poster-corner bl"></span>
        <span className="poster-corner br"></span>
        <span className="poster-redbar"></span>
      </figure>

      {/* Metadata table */}
      <div className="meta-table">
        <div className="meta-cell">
          <div className="label-sm">Client</div>
          <div className="val">{p.client}</div>
        </div>
        <div className="meta-cell">
          <div className="label-sm">Year</div>
          <div className="val">{p.year}</div>
        </div>
        <div className="meta-cell">
          <div className="label-sm">Turnaround</div>
          <div className="val">{p.turnaround}</div>
        </div>
        <div className="meta-cell">
          <div className="label-sm">Role</div>
          <div className="val">{p.role}</div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="stats-strip">
        {p.stats.map((s, i) => <Stat key={i} v={s.v} l={s.l} />)}
      </div>

      {/* Act II — Challenge */}
      <ActSeparator act="II" label="The Challenge" />
      <div className="prose-row">
        <h3 className="prose-h">Goals.</h3>
        <ol className="prose-list">
          {p.goals.map((g, i) => (
            <li key={i}>
              <span className="li-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="li-text">{g}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Act III — Strategy */}
      <ActSeparator act="III" label="The Strategy" />
      <div className="prose-row strategy">
        <h3 className="prose-h">
          A pipeline,<br />
          <span className="it">from scratch.</span>
        </h3>
        <div className="prose-body">
          {p.strategy.map((s, i) => <p key={i}>{s}</p>)}
        </div>
      </div>

      {/* Act IV — Results */}
      <ActSeparator act="IV" label="The Results" />
      <div className="prose-row">
        <h3 className="prose-h">Results.</h3>
        <div className="prose-body">
          {p.results.map((r, i) => <p key={i}>{r}</p>)}
        </div>
      </div>

      {/* Act V — Delivered */}
      <ActSeparator act="V" label="Delivered" />
      <ul className="delivery-list">
        {p.delivered.map((d, i) => (
          <li key={i}>
            <span className="d-no">{String(i + 1).padStart(2, '0')}</span>
            <div className="d-body">
              <div className="d-line">{d.line}</div>
              <div className="d-spec">{d.spec}</div>
            </div>
            <span className="d-redline"></span>
          </li>
        ))}
      </ul>
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
          <button className="nav-link active" onClick={onWorksClick}>Work</button>
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

      {/* Hero */}
      <section className={cls('hero')}>
        <div className="eyebrow">
          <span className="num">ACT ONE</span>
          <span className="div"></span>
          <span className="meta">Now Playing</span>
        </div>
        <h1>
          A Theatre of<br />
          <span className="it">Selected </span>Works<span className="red">.</span>
        </h1>
        <div className="sub">
          <div className="col">
            <span className="label-sm">Direction</span>
            <span className="val">Thaddeus — Solo designer-engineer building across procedural systems, motion, and live-action.</span>
          </div>
          <div className="col">
            <span className="label-sm">Practice</span>
            <span className="val">Procedural · Animation</span>
            <span className="val small">3D · Camera Tracking</span>
          </div>
          <div className="col">
            <span className="label-sm">Currently</span>
            <span className="val">Final project — a self-directed anime sequence.</span>
          </div>
          <div className="col">
            <span className="label-sm">Availability</span>
            <span className="val" style={{ color: 'var(--kabuki-light)' }}>Open for commission.</span>
            <span className="val small">hello@thaddeus.studio</span>
          </div>
        </div>
      </section>

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

      {/* Playbill spread */}
      <div id="work" className={cls()}>
        <PlaybillSpread p={PROJECT} />
      </div>

      {/* Other Works section */}
      <div className={cls('ow-section')}>
        <div className="ow-header">
          <div>
            <div className="label-sm" style={{ color: 'var(--gold-deep)', marginBottom: 8 }}>CATALOGUE · VOLUME I</div>
            <h2 className="ow-title">Other Works.</h2>
          </div>
          <button className="ow-all-btn" onClick={onWorksClick}>VIEW ALL WORKS ↗</button>
        </div>
        <div className="ow-grid">
          {[
            { label: 'Animation', sub: "Fool's Gold · Star Dunes · Moonlace", src: '/assets/fools-gold-thumb.png' },
            { label: 'VFX',       sub: 'Camera Tracking · Cyberpunk Workshop', src: '/assets/camera-tracking.mp4' },
            { label: 'Art',       sub: 'Realistic Render · Blimp Model', src: '/assets/realistic-01.png' },
          ].map(({ label, sub, src }) => (
            <button key={label} className="ow-card" onClick={onWorksClick}>
              {src.endsWith('.mp4') ? (
                <video src={src} muted loop autoPlay playsInline className="ow-media" />
              ) : (
                <img src={src} alt={label} className="ow-media" />
              )}
              <div className="ow-card-grad" />
              <div className="ow-card-info">
                <div className="ow-card-label">{label}</div>
                <div className="ow-card-sub">{sub}</div>
              </div>
            </button>
          ))}
        </div>
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
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', overflowX: 'hidden', background: '#1d100f', scrollbarWidth: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Portfolio onWorksClick={onWorksClick} onBack={onBack} onSelectProject={onSelectProject} />
    </motion.div>
  )
}
