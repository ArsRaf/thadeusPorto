import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { projects, CATEGORIES } from '../../data/projects'
import './portfolio.css'
import './v5.css'

/* Ported from the Claude Design comp "Cinema Portfolio Design Refresh"
   (Portfolio v5.dc.html). The comp's DCLogic renderVals() is reproduced
   below as plain React: same featured/grade/layout/tile tables. */

const FEATURED = ['escape-detention']

// renders on flat grey / checker backgrounds get graded into the palette
// so they belong to the same world as the shot footage
const GREY = [
  'realistic-render', 'procedural-modelling', 'cyberpunk-workshop',
]

// every mask fades on all four sides so no render ends in a hard edge
/* Image and text hold separate column ranges. The comp overlapped them so
   copy floated across a masked render; at these type sizes that reads as a
   collision, so each side gets its own half and the sides alternate. */
const LAYOUT = [
  { imgCol: '7/13', textCol: '1/7',  mask: 'radial-gradient(ellipse 85% 80% at 55% 50%,#000 45%,transparent 100%)' },
  { imgCol: '1/7',  textCol: '7/13', mask: 'radial-gradient(ellipse 85% 80% at 45% 50%,#000 45%,transparent 100%)' },
  { imgCol: '6/13', textCol: '1/6',  mask: 'radial-gradient(ellipse 85% 80% at 55% 50%,#000 45%,transparent 100%)' },
]

// tighter crops for the checkerboard character studies
const CROP = {
  'realistic-render': 'scale(1.35) translate(2%,6%)',
}

/* Six tiles filling the full 12-col row. Columns never overlap — the
   stagger comes from margin-top alone, so captions have room beneath. */
/* Columns 1-4 are held by a standing type panel, so tiles start at 5.
   Three across the remaining eight columns, staggered by margin only. */
const TILES = [
  [ { col: '5/9',  mt: '0',    rot: '-1.2deg', z: 1, ar: '16/9' },
    { col: '9/13', mt: '56px', rot: '1.1deg',  z: 1, ar: '16/9' },
    { col: '5/9',  mt: '24px', rot: '1deg',    z: 1, ar: '16/9' },
    { col: '9/13', mt: '-8px', rot: '-1.3deg', z: 1, ar: '16/9' },
    { col: '5/9',  mt: '40px', rot: '-0.9deg', z: 1, ar: '16/9' },
    { col: '9/13', mt: '16px', rot: '0.8deg',  z: 1, ar: '16/9' } ],
  [ { col: '5/9',  mt: '40px', rot: '1deg',    z: 1, ar: '16/9' },
    { col: '9/13', mt: '0',    rot: '-1.2deg', z: 1, ar: '16/9' },
    { col: '5/9',  mt: '8px',  rot: '-1deg',   z: 1, ar: '16/9' },
    { col: '9/13', mt: '48px', rot: '1.2deg',  z: 1, ar: '16/9' },
    { col: '5/9',  mt: '32px', rot: '0.9deg',  z: 1, ar: '16/9' },
    { col: '9/13', mt: '12px', rot: '-0.8deg', z: 1, ar: '16/9' } ],
]

/* Reveal-on-scroll, matching the comp's IntersectionObserver */
function Reveal({ children, className = '', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Sections here are often taller than the viewport, so a percentage
    // threshold can never be met. Fire as soon as any part enters, and
    // pull the bottom margin in so it triggers slightly before arrival.
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.unobserve(el) } },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    // If it is already on screen at mount (or the observer never fires),
    // reveal immediately rather than leaving the section invisible.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) setShown(true)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`v5-reveal${shown ? ' in' : ''} ${className}`} {...rest}>
      {children}
    </div>
  )
}

/* Video heroes are large, and the landing page has eight of them. Loading all
   of them up front stalls the page, so each one only fetches once it is near
   the viewport, and pauses again when it leaves. */
function LazyVideo({ src, poster, className, style }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true)
          // preload="none" means there is nothing buffered until we ask.
          if (el.preload !== 'auto') el.preload = 'auto'
          el.play?.().catch(() => {})
        } else {
          el.pause?.()
        }
      },
      { threshold: 0, rootMargin: '200px 0px' }
    )
    io.observe(el)
    // Already on screen at mount (the landing page also scrolls inside a
    // fixed container, where a viewport-rooted observer can miss it).
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight + 200 && r.bottom > -200) setActive(true)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      data-src={src}
      poster={poster}
      muted loop playsInline
      preload="none"
      className={className}
      style={style}
    />
  )
}

function Media({ item, className, style }) {
  if (!item) return null
  return item.type === 'video'
    ? <LazyVideo src={item.src} poster={item.poster} className={className} style={style} />
    : <img src={item.src} alt="" loading="lazy" decoding="async" className={className} style={style} />
}

export default function PortfolioV5({ onBack, onSelectProject }) {
  // Mirrors the comp's deco()/chapters build.
  const chapters = useMemo(() => {
    const list = projects.filter(p => p.id !== 'ponta')
    let n = 0, fi = 0

    const deco = (p) => {
      n++
      const media = (p.media || [])
        .filter(x => x.src)
        .filter((x, k, a) => a.findIndex(y => y.src === x.src) === k)
      const hero = media[0] || null
      const grade = GREY.includes(p.id)
        ? 'sepia(.45) saturate(.9) contrast(1.08) brightness(.92)'
        : 'saturate(1.05) contrast(1.04)'
      const set = TILES[fi % 2]
      /* A project can nominate its own preview frames. Without that the
         reel just takes the first supporting frames, which for a documented
         project means reference material rather than finished work. */
      const picks = (p.preview || [])
        .map(src => media.find(x => x.src === src))
        .filter(Boolean)
      const shown = picks.length ? picks : media.slice(1, 4)
      const tiles = shown.slice(0, 6).map((m, k) => ({ ...m, ...set[k] }))
      const support = shown.slice(0, 3).map((m, k) => ({ ...m, rot: (k % 2 ? 2 : -2) + 'deg' }))
      const L = LAYOUT[(n - 1) % 3]
      return {
        ...p, ...L, hero, grade,
        crop: CROP[p.id] || 'none',
        tiles, support,
        no: String(n).padStart(2, '0'),
        toolsLine: (p.tools || []).join(' · ') + (p.turnaround ? ' · ' + p.turnaround : ''),
      }
    }

    let sc = 0
    return CATEGORIES.map((name) => {
      const items = list.filter(p => p.category === name)
      if (!items.length) return null
      const all = items.map(p => { const r = deco(p); if (FEATURED.includes(p.id)) fi++; return r })
      return {
        id: name.toLowerCase(), name,
        no: String(++sc).padStart(2, '0'),
        count: all.length,
        ticker: (name + ' · ').repeat(6),
        featured: all.filter(p => FEATURED.includes(p.id)),
        rest:     all.filter(p => !FEATURED.includes(p.id)),
      }
    }).filter(Boolean)
  }, [])

  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <motion.div
      className="v5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="v5-vignette" />

      {/* letterbox slate */}
      <div className="v5-slate">
        <span>Thaddeus Tristan — Portfolio</span>
        <span className="rt">
          <span className="ar">2.39 : 1</span>
          <span>Reel 01 · 2024–26</span>
        </span>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="v5-hero">
        <div className="v5-hero-bed">
          <img className="bg" src="/assets/fools-gold-thumb.png" alt=""
               fetchpriority="high" decoding="async" />
          <div className="v5-hero-grad" />
          <div className="v5-curtain-l" />
          <div className="v5-curtain-r" />
          <div className="v5-topfade" />
          <div className="v5-scanbeam" />
        </div>

        <div className="v5-hero-top">
          <span className="v5-hero-name">Thaddeus Tristan</span>
          <span className="v5-hero-meta">
            Shorts · VFX · Modelling<br />
            <span className="loc">Melbourne, AU</span>
          </span>
        </div>

        <div className="v5-hero-title">
          <h1>
            {'PORTFOLIO'.split('').map((c, i) => (
              <motion.span key={i}
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.055, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >{c}</motion.span>
            ))}
          </h1>
          <div className="v5-hero-sub">
            <span className="v5-hero-role">3D Generalist</span>
            <button className="v5-hero-cta" onClick={() => jump('credits')}>Contact me ↓</button>
          </div>
        </div>

        <div className="v5-billing">
          <b>Thaddeus Tristan</b> presents a solo production “<b>Portfolio</b>” starring{' '}
          <b>Blender</b> · <b>Houdini</b> · <b>Maya</b> &nbsp; simulations <b>Houdini</b>
          &nbsp; look-dev <b>Substance Painter</b> &nbsp; compositing <b>After Effects</b><br />
          written · modelled · rigged · lit · rendered and directed by <b>Thaddeus Tristan</b>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="v5-about">
        <div className="v5-portrait">
          <img src="/assets/thaddeus-portrait.jpeg" alt="Thaddeus"
               loading="lazy" decoding="async" />
        </div>
        <Reveal className="v5-about-copy">
          <h2>The<br /><span className="accent">Director</span></h2>
          <p className="v5-lede">
            Thaddeus is a solo designer-engineer working across procedural systems,
            animation, three-dimensional modelling, and live-action camera tracking —
            a practice rehearsed in equal parts code, camera, and craft.
          </p>
          <dl className="v5-facts">
            <dt>Software</dt>
            <dd>Blender · Cycles · Houdini · Karma · Redshift · Maya · Arnold · Substance Painter · After Effects · Premiere Pro · Nuke · Illustrator · Photoshop · Daz 3D</dd>
            <dt>Experience</dt>
            <dd>
              <span className="yr">2026</span> Solo director — final-year anime sequence<br />
              <span className="yr">2025</span> Freelance motion &amp; 3D commissions<br />
              <span className="yr">2024</span> Spot animation &amp; product renders
            </dd>
            <dt>Status</dt>
            <dd><span className="v5-tape">Open for commission</span></dd>
          </dl>
        </Reveal>
      </section>

      {/* ═══ CHAPTERS ═══ */}
      {chapters.map((ch) => (
        <section key={ch.id} id={ch.id}>
          <div className="v5-sprocket" />
          <div className="v5-ch-head">
            <span>Scene {ch.no} · {ch.name}</span>
            <span>Roll A · Take 1 · <span className="cuts">{ch.count} cuts</span></span>
          </div>
          <div className="v5-ticker-wrap">
            <div className="v5-ticker"><span>{ch.ticker}</span><span>{ch.ticker}</span></div>
          </div>

          {/* featured spreads */}
          {ch.featured.map((p) => (
            <Reveal key={p.id} className="v5-feature">
              <div className="v5-feature-bed"
                   onClick={() => onSelectProject?.(p)}
                   style={{ cursor: onSelectProject ? 'pointer' : 'default' }}>
                {p.hero
                  ? <Media item={p.hero} style={{ filter: p.grade }} />
                  : <div className="v5-feature-empty" />}
                <div className="v5-feature-scrim" />
              </div>

              {/* Copy sits OUTSIDE the bed: the bed carries the torn-edge
                  mask, which would otherwise clip the text with the image. */}
              <div className="v5-feature-copy">
                <span className="v5-kicker">Feature presentation · {p.category} · {p.year}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>

              {p.tiles.length > 0 && (
                <div className="v5-tiles">
                  <aside className="v5-tile-panel">
                    <span className="v5-panel-kicker">Selected frames</span>
                    <span className="v5-panel-word">{p.category}</span>
                    {p.stats?.length > 0 && (
                      <dl className="v5-panel-stats">
                        {p.stats.slice(0, 4).map((st) => (
                          <div key={st.l}>
                            <dt>{st.v}</dt>
                            <dd>{st.l}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <button
                      className="v5-cta"
                      onClick={(e) => { e.stopPropagation(); onSelectProject?.(p) }}
                      aria-label={`Open ${p.title}`}
                    >
                      View the breakdown <span aria-hidden="true">&rarr;</span>
                    </button>
                  </aside>
                  {p.tiles.map((t, i) => (
                    <figure key={i} style={{
                      gridColumn: t.col, marginTop: t.mt,
                      transform: `rotate(${t.rot})`, zIndex: t.z,
                    }}>
                      <img src={t.src} alt={t.label || ''}
                           style={{ aspectRatio: t.ar, filter: p.grade }} />
                      {t.label && <figcaption>{t.label}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}

              <div className="v5-tools">{p.toolsLine}</div>
            </Reveal>
          ))}

          {/* editorial spreads */}
          {ch.rest.map((p) => (
            <Reveal
              key={p.id}
              className="v5-spread is-clickable"
              role="button"
              tabIndex={0}
              aria-label={`Open ${p.title}`}
              onClick={() => onSelectProject?.(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectProject?.(p) }
              }}
            >
              <div className="v5-spread-img"
                   style={{ gridColumn: p.imgCol, WebkitMaskImage: p.mask, maskImage: p.mask }}>
                {p.hero
                  ? <Media item={p.hero} style={{ filter: p.grade, transform: p.crop }} />
                  : <div className="v5-spread-empty" />}
              </div>
              <div className="v5-spread-copy" style={{ gridColumn: p.textCol }}>
                <span className="v5-kicker">{p.no} · {p.category} · {p.year}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <span className="v5-kicker">{p.toolsLine}</span>
                <button
                  className="v5-cta"
                  onClick={(e) => { e.stopPropagation(); onSelectProject?.(p) }}
                  aria-label={`Open ${p.title}`}
                >
                  View the breakdown <span aria-hidden="true">&rarr;</span>
                </button>
                {p.support.length > 0 && (
                  <div className="v5-support">
                    {p.support.map((m, i) => (
                      <img key={i} src={m.src} alt={m.label || ''} title={m.label}
                           style={{ transform: `rotate(${m.rot})`, filter: p.grade }} />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </section>
      ))}

      {/* ═══ END CREDITS ═══ */}
      <section id="credits" className="v5-credits">
        <img className="v5-credits-bg" src="/assets/star-dunes-thumb.png" alt=""
             loading="lazy" decoding="async" />
        <div className="v5-credits-grid">
          <Reveal>
            <h2>Thanks<br />for<br /><span className="accent">watching</span></h2>
            <dl className="v5-contact">
              <dt>Mail</dt>
              <dd><a href="mailto:Thadeustristansalim@gmail.com">Thadeustristansalim@gmail.com</a></dd>
              <dt>Phone</dt><dd>+61 424 003 221</dd>
              <dt>Instagram</dt><dd>@not.tristandeus</dd>
            </dl>
          </Reveal>

          <div className="v5-roll-window">
            <div className="v5-roll">
              <div><div className="role">Directed by</div><div className="who lead">Thaddeus Tristan</div></div>
              <div><div className="role">Modelling · Rigging · Animation</div><div className="who">Thaddeus Tristan</div></div>
              <div><div className="role">Simulation &amp; VFX</div><div className="who">Houdini · Redshift · Karma</div></div>
              <div><div className="role">Look development</div><div className="who">Blender · Cycles · Substance</div></div>
              <div><div className="role">Compositing &amp; edit</div><div className="who">After Effects · Premiere Pro · Nuke</div></div>
              <div>
                <div className="role">Environments</div>
                <div className="env">
                  “Streets of Japan” classroom — RafaelRodrigues (CGTrader)<br />
                  “Streets of Japan 3D model” — Mostafa Ebrahim Fathallah (CGTrader)
                </div>
              </div>
              <div className="end">The End</div>
              <div className="role">© 2026 Thaddeus Tristan · All Acts Reserved</div>
            </div>
          </div>
        </div>
      </section>

      <div className="v5-fin">
        <div className="v5-fin-scrim" />
        <div className="v5-fin-word">Fin</div>
      </div>

      {/* letterbox nav */}
      <nav className="v5-nav">
        {onBack && <button className="back" onClick={onBack}>← Theatre</button>}
        <button className="link" onClick={() => jump('about')}>About</button>
        {chapters.map((ch) => (
          <button key={ch.id} className="link" onClick={() => jump(ch.id)}>{ch.name}</button>
        ))}
        <button className="link accent" onClick={() => jump('credits')}>Credits</button>
      </nav>
    </motion.div>
  )
}
