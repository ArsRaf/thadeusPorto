import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { projects, CATEGORIES } from '../../data/projects'
import './portfolio.css'
import './feature.css'

/* Project detail page, ported from the Claude Design comp
   "Portfolio v6.dc.html". The comp's renderVals() feature branch is
   reproduced below: boards 01-05, the irregular 12-col mosaic packer,
   and the three stat treatments that rotate per project. */

const FEATURED = ['escape-detention']
const GREY = [
  'realistic-render', 'procedural-modelling', 'cyberpunk-workshop',
]
const SLOT_LABELS = ['Clay / wireframe pass', 'Process still', 'Final frame', 'Turnaround', 'Breakdown', 'Lighting pass']
// irregular 12-col mosaic: the pattern repeats every 6 cells
const PAT = [{ col: 'span 7', row: 'span 2' }, { col: 'span 5', row: 'span 1' }, { col: 'span 5', row: 'span 1' }]
const POS = ['50% 30%', '50% 50%', '40% 40%', '60% 50%']
const TAIL = ['span 6', 'span 6', 'span 4', 'span 4', 'span 4']

/* Ordering matches the landing page so "next feature" follows the reel. */
function buildOrder() {
  const list = projects.filter(p => p.id !== 'ponta')
  const out = []
  for (const name of CATEGORIES) {
    const items = list.filter(p => p.category === name)
    if (!items.length) continue
    out.push(...items.filter(p => FEATURED.includes(p.id)))
    out.push(...items.filter(p => !FEATURED.includes(p.id)))
  }
  return out
}

function LazyVideo({ src, poster, className, style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const load = () => {
      el.preload = 'auto'
      if (!el.getAttribute('src')) el.setAttribute('src', src)
      el.play?.().catch(() => {})
    }

    // This page is a fixed scroll container, so a viewport-rooted observer
    // can miss an element that is already on screen when the page opens.
    // Load immediately if it is visible, and observe for the rest.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight + 200 && r.bottom > -200) load()

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) load()
      else el.pause?.()
    }, { threshold: 0, rootMargin: '200px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [src])
  return <video ref={ref} poster={poster} muted loop playsInline preload="none"
                className={className} style={style} />
}

/* The result board replays the finished piece as a proper player rather
   than a muted loop — controls, sound, and a poster until the viewer starts it. */
function ResultPlayer({ item, title }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) { el.play().catch(() => {}) } else { el.pause() }
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const on = () => setPlaying(true)
    const off = () => setPlaying(false)
    el.addEventListener('play', on)
    el.addEventListener('pause', off)
    el.addEventListener('ended', off)
    return () => {
      el.removeEventListener('play', on)
      el.removeEventListener('pause', off)
      el.removeEventListener('ended', off)
    }
  }, [])

  return (
    <div className={'ft-player' + (playing ? ' is-playing' : '')}>
      <video
        ref={ref}
        src={item.src}
        poster={item.poster}
        preload="none"
        playsInline
        controls
        onClick={toggle}
      />
      {!playing && (
        <button className="ft-player-start" onClick={toggle} aria-label={`Play ${title}`}>
          <span className="ft-player-icon">&#9654;</span>
          <span className="ft-player-label">Watch the finished piece</span>
        </button>
      )}
    </div>
  )
}

function Cell({ c, grade }) {
  return (
    <div className="ft-cell" style={{ gridColumn: c.col, gridRow: c.row }}>
      {c.isImg && <img src={c.src} alt={c.label || ''} loading="lazy" decoding="async"
                       style={{ objectPosition: c.pos, objectFit: c.fit, filter: grade }} />}
      {c.isVid && <LazyVideo src={c.src} poster={c.poster} />}
      {c.isSlot && <div className="ft-cell-empty">{c.label}</div>}

      {c.isActStat && (
        <div className="ft-actstat">
          <span className="v">{c.v}</span>
          <span className="l">{c.l}</span>
        </div>
      )}

      {c.isStamp && !c.isActStat && (
        <>
          {c.hasSrc
            ? <img src={c.src} alt="" loading="lazy" decoding="async"
                   style={{ objectPosition: c.pos, filter: `${grade} brightness(.55)` }} />
            : <div className="ft-cell-empty">{c.slotLabel}</div>}
          <span className="ft-stamp-v">{c.v}</span>
          <span className="ft-stamp-l">{c.l}</span>
        </>
      )}

      {c.isTicket && (
        <div className="ft-ticket" style={{ transform: `rotate(${c.rot})` }}>
          <img className="grain" src="/assets/tex/grain.png" alt="" aria-hidden="true" />
          <div className="ft-ticket-head">
            <span>Admit one</span>
            <span className="serial">No. {c.serial}</span>
          </div>
          <span className="ft-ticket-v">{c.v}</span>
          <div className="ft-ticket-foot">
            <span>{c.l}</span>
            <span className="dim">{c.ftTitle} · {c.ftYear}</span>
          </div>
        </div>
      )}

      {c.isSlate && (
        <div className="ft-slate">
          <div className="ft-slate-bar" />
          <div className="ft-slate-body">
            <span className="k">Prod.</span><span className="val">{c.ftTitle}</span>
            <span className="k">Scene</span><span className="val">{c.ftNo} · Take 1 · Roll A</span>
            {c.rows.map((s, i) => (
              <Fragment key={i}>
                <span className="sl">{s.l}</span>
                <span className="sv">{s.v}</span>
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {c.label && !c.isStamp && !c.note && <span className="ft-cell-label">{c.label}</span>}
    </div>
  )
}

/* A frame with context is rendered as a figure so the caption sits in the
   layout instead of floating over the picture. */
function Figure({ c, grade }) {
  if (!c.note) return <Cell c={c} grade={grade} />
  return (
    <figure className="ft-fig" style={{ gridColumn: c.col, gridRow: c.row }}>
      <div className="ft-fig-frame">
        {c.isImg && <img src={c.src} alt={c.label || ''} loading="lazy" decoding="async"
                         style={{ objectPosition: c.pos, objectFit: c.fit, filter: grade }} />}
        {c.isVid && <LazyVideo src={c.src} poster={c.poster} />}
      </div>
      <figcaption>
        <span className="ft-fig-label">{c.label}</span>
        <span className="ft-fig-note">{c.note}</span>
      </figcaption>
    </figure>
  )
}

export default function FeaturePage({ project, onClose, onSelectProject }) {
  const order = useMemo(buildOrder, [])
  const idx = order.findIndex(p => p.id === project.id)
  const cur = idx >= 0 ? order[idx] : project
  const nxt = idx >= 0 ? order[(idx + 1) % order.length] : null

  const f = useMemo(() => {
    const media = (cur.media || [])
      .filter(x => x.src)
      .filter((x, k, a) => a.findIndex(y => y.src === x.src) === k)
    const hero = media[0] || null
    const rest = media.slice(1)
    const grade = GREY.includes(cur.id)
      ? 'sepia(.45) saturate(.9) contrast(1.08) brightness(.92)'
      : 'saturate(1.05) contrast(1.04)'

    const cell = (m, k) => m
      ? { isImg: m.type === 'image', isVid: m.type === 'video', src: m.src, label: m.label || '' }
      : { isSlot: true, label: SLOT_LABELS[k % SLOT_LABELS.length] }

    const hasBrief = !!((cur.goals && cur.goals.length) || (cur.strategy && cur.strategy.length))
    // Board 02 borrows the first two supporting frames — but only when the
    // media list is NOT chaptered. With acts, every frame belongs to an act
    // and lifting two here would show them twice.
    const chaptered = (cur.media || []).some(x => x.chapter)
    const cellsA = (hasBrief && !chaptered)
      ? [rest[0], rest[1]].map((m, k) => ({ ...cell(m, k), col: '1/-1' })) : []
    const queue = (hasBrief && !chaptered) ? rest.slice(2) : rest.slice()

    const stats = cur.stats || []
    const vi = (idx >= 0 ? idx : 0) % 3
    const serialBase = String((idx >= 0 ? idx : 0) + 1).padStart(3, '0')
    const S = i => stats[i % stats.length] || { v: '—', l: '' }

    let k = 0
    const imgCell = pat => ({ ...cell(queue.shift() || null, k + 2), ...pat, pos: POS[k++ % POS.length] })
    const takeImg = () => { const i = queue.findIndex(m => m.type === 'image'); return i < 0 ? null : queue.splice(i, 1)[0] }
    const stamp = (i, col) => {
      const m = takeImg()
      return { isStamp: true, hasSrc: !!m, src: m ? m.src : '', slotLabel: 'Process still',
               v: S(i).v, l: S(i).l, col, row: 'span 1', pos: '50% 40%' }
    }
    const ticket = (i, col, row, rot) => ({
      isTicket: true, v: S(i).v, l: S(i).l, serial: `${serialBase}-${i + 1}`, rot, col, row,
      ftTitle: cur.title, ftYear: cur.year,
    })

    const cellsB = [imgCell(PAT[0]), imgCell(PAT[1]), imgCell(PAT[2])].filter(c => !c.isSlot)
    if (stats.length) {
      if (vi === 0) cellsB.push(...[stamp(0, 'span 8'), stamp(1, 'span 4')].filter(c => c.hasSrc))
      else if (vi === 1) cellsB.push(
        ticket(0, 'span 4', 'span 2', '-2deg'),
        ticket(1, 'span 8', 'span 1', '1.2deg'),
        imgCell({ col: 'span 8', row: 'span 1' }))
      else cellsB.push(
        { isSlate: true, rows: stats.slice(0, 3), col: 'span 5', row: 'span 2',
          ftTitle: cur.title, ftNo: String((idx >= 0 ? idx : 0) + 1).padStart(2, '0') },
        imgCell({ col: 'span 7', row: 'span 1' }),
        imgCell({ col: 'span 7', row: 'span 1' }))
    }
    // Remaining frames only. The comp padded each row out to 12 columns with
    // empty drop-targets for its canvas editor; on a live site those read as
    // unfinished placeholders, so a short final row is preferable.
    let t = 0
    while (queue.length) {
      cellsB.push(imgCell({ col: TAIL[t % 5], row: 'span 1' })); t++
      if (t > 40) break // guard against a malformed media list
    }

    const cellsBClean = cellsB.filter(c => !c.isSlot)

    /* If the media list carries { chapter } markers, the mosaic is split into
       labelled acts instead of one undifferentiated collage. Each act packs
       with the same 12-col patterns, so the rhythm stays consistent. */
    const raw = cur.media || []
    const acts = []
    let act = null
    for (const item of raw) {
      if (item.chapter) { act = { name: item.chapter, note: item.note || '', items: [] }; acts.push(act); continue }
      if (!item.src) continue
      if (act) act.items.push(item)
    }
    /* Cells are sized by the frame's own shape so a tall turnaround is not
       cropped into a letterbox and a wide banner is not squeezed into a
       column. `shape` is declared in the data; anything unmarked packs
       to the rolling default pattern. */
    const SPAN = {
      tall:  { col: 'span 3', row: 'span 2' },   // turnarounds, poly sheets
      port:  { col: 'span 4', row: 'span 2' },   // character illustrations
      wide:  { col: 'span 8', row: 'span 1' },   // references, screenshots
      band:  { col: 'span 12', row: 'span 1' },  // very wide banners
      hero:  { col: 'span 7', row: 'span 2' },
      half:  { col: 'span 6', row: 'span 1' },
      third: { col: 'span 4', row: 'span 1' },
    }
    const ROLL = ['hero', 'half', 'half', 'third', 'third', 'third']

    const packed = acts.map((a, ai) => {
      const cells = []
      a.items.forEach((m, i) => {
        const key = m.shape || ROLL[i % ROLL.length]
        cells.push({
          isImg: m.type === 'image', isVid: m.type === 'video',
          src: m.src, poster: m.poster, label: m.label || '', note: m.note || '',
          ...(SPAN[key] || SPAN.half),
          pos: m.pos || POS[i % POS.length],
          fit: m.fit || 'cover',
        })
      })
      // A stat is dealt into each act so the numbers live inside the story
      // rather than sitting in one block at the end.
      const st = (cur.stats || [])[ai]
      if (st && cells.length >= 2) {
        cells.splice(Math.min(2, cells.length), 0, {
          isStamp: true, hasSrc: false, slotLabel: '',
          isActStat: true, v: st.v, l: st.l,
          col: 'span 4', row: 'span 1',
        })
      }
      return { ...a, no: String(ai + 1).padStart(2, '0'), cells }
    }).filter(a => a.cells.length)

    const railImg = (hero && hero.type === 'image')
      ? hero : (cur.media || []).find(m => m.src && m.type === 'image')
    const meta = [['Client', cur.client], ['Turnaround', cur.turnaround], ['Role', cur.role], ['Year', cur.year]]
      .filter(x => x[1]).map(x => ({ k: x[0], v: x[1] }))

    return {
      ...cur, grade, meta, hasBrief, cellsB: cellsBClean,
      cellsA: cellsA.filter(c => !c.isSlot),
      no: String((idx >= 0 ? idx : 0) + 1).padStart(2, '0'),
      hero,
      stats,
      hasStats: stats.length > 0,
      railTicket: vi === 0, railSlate: vi === 1, railStamp: vi === 2,
      railOrder: vi === 1 ? 3 : 5,
      railSrc: railImg ? railImg.src : '',
      acts: packed,
      hasOutcome: !!((cur.results && cur.results.length) || (cur.delivered && cur.delivered.length) || (cur.credits && cur.credits.length)),
    }
  }, [cur, idx])

  // Esc closes; lock the page behind it.
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rail = f.hasStats && (
    <section style={{ order: f.railOrder, position: 'relative' }}>
      {f.railTicket && (
        <div className="ft-rail-ticket">
          <img className="grain" src="/assets/tex/grain.png" alt="" aria-hidden="true" />
          <div className="ft-rail-stub">
            <span className="admit">Admit one</span>
            <span className="ttl">{f.title}</span>
            <span className="sub">Scene {f.no} · {f.category} · {f.year}</span>
          </div>
          {f.stats.map((s, i) => (
            <div key={i} className="ft-rail-cell"><span className="v">{s.v}</span><span className="l">{s.l}</span></div>
          ))}
        </div>
      )}
      {f.railSlate && (
        <div className="ft-rail-slate">
          <div className="bar" />
          <div className="body">
            <div className="prod">
              <span className="k">Prod. · Scene {f.no} · Take 1</span>
              <span className="ttl">{f.title}</span>
              <span className="k">Roll A · {f.category} · {f.year}</span>
            </div>
            {f.stats.map((s, i) => (
              <div key={i} className="st"><span className="v">{s.v}</span><span className="l">{s.l}</span></div>
            ))}
          </div>
        </div>
      )}
      {f.railStamp && (
        <div className="ft-rail-stamp">
          {f.railSrc && <img src={f.railSrc} alt="" loading="lazy" decoding="async"
                             style={{ filter: `${f.grade} brightness(.5)` }} />}
          <div className="nums">
            {f.stats.map((s, i) => (
              <div key={i} className="st"><span className="v">{s.v}</span><span className="l">{s.l}</span></div>
            ))}
          </div>
        </div>
      )}
    </section>
  )

  return (
    <motion.div
      className="ft"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ft-boards ft-in">

        {/* ── board 01 · title plate ── */}
        <section className="ft-title-plate" style={{ order: 1 }}>
          {f.hero?.type === 'video' && <LazyVideo src={f.hero.src} poster={f.hero.poster} className="ft-hero" />}
          {f.hero?.type === 'image' && (
            <img className="ft-hero" src={f.hero.src} alt="" fetchpriority="high" decoding="async"
                 style={{ filter: f.grade }} />
          )}
          <div className="ft-plate-scrim" />
          <img className="ft-leak" src="/assets/tex/leak.png" alt="" aria-hidden="true"
               style={{ top: '-12%', right: '-8%', width: '70%', opacity: .55 }} />

          <div className="ft-plate-top">
            <button className="ft-back" onClick={onClose}>← Back to the reel</button>
            {f.tools?.length > 0 && (
              <div className="ft-tools">{f.tools.map(t => <span key={t}>{t}</span>)}</div>
            )}
          </div>

          <div className="ft-plate-copy">
            <span className="ft-kicker ft-stag">Feature {f.no} · {f.category} · {f.year}</span>
            <h1 className="ft-stag" style={{ animationDelay: '.09s' }}>{f.title}</h1>
            {f.description && <p className="ft-stag" style={{ animationDelay: '.18s' }}>{f.description}</p>}
            {f.meta.length > 0 && (
              <div className="ft-meta ft-stag" style={{ animationDelay: '.27s' }}>
                {f.meta.map(m => <span key={m.k}><span className="k">{m.k}</span>{m.v}</span>)}
              </div>
            )}
          </div>
        </section>

        {/* ── board 02 · brief panel + first mosaic ── */}
        {f.hasBrief && (
          <section className="ft-brief" style={{ order: 2 }}>
            <div className="ft-brief-panel">
              <img className="ft-leak" src="/assets/tex/leak.png" alt="" aria-hidden="true"
                   style={{ top: '-30%', right: '-30%', width: '100%', opacity: .35 }} />
              <span className="ft-tape">Scene {f.no} · {f.category}</span>
              {f.goals?.length > 0 && (
                <div className="ft-brief-block">
                  <span className="ft-brief-label">The brief</span>
                  {f.goals.map((g, i) => <p key={i}>{g}</p>)}
                </div>
              )}
              {f.strategy?.length > 0 && (
                <div className="ft-brief-block approach">
                  <span className="ft-brief-label">The approach</span>
                  {f.strategy.map((g, i) => <p key={i}>{g}</p>)}
                </div>
              )}
            </div>
            <div className="ft-cells-a">
              {f.cellsA.map((c, i) => <Cell key={i} c={c} grade={f.grade} />)}
            </div>
          </section>
        )}

        {/* ── board 03 · the pipeline, partitioned into acts ── */}
        {f.acts.length > 0 ? (
          <div style={{ order: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {f.acts.map((a) => (
              <section key={a.name}>
                <div className="ft-act-head">
                  <div className="ft-act-sprocket" />
                  <div className="ft-act-bar">
                    <span className="ft-tape">Act {a.no}</span>
                    <h3>{a.name}</h3>
                    {a.note && <p>{a.note}</p>}
                  </div>
                </div>
                <div className="ft-mosaic">
                  {a.cells.map((c, i) => <Figure key={i} c={c} grade={f.grade} />)}
                </div>
              </section>
            ))}
          </div>
        ) : f.cellsB.length > 0 ? (
          <section className="ft-mosaic" style={{ order: 4 }}>
            {f.cellsB.map((c, i) => <Cell key={i} c={c} grade={f.grade} />)}
          </section>
        ) : null}

        {/* ── stats rail (order rotates per project) ── */}
        {rail}

        {/* ── board 04 · results ── */}
        {(f.hasOutcome || f.hero?.type === 'video') && (
          <section className="ft-results" style={{ order: 6 }}>
            {f.hero?.type === 'video' && (
              <div className="ft-result-video">
                <ResultPlayer item={f.hero} title={f.title} />
              </div>
            )}
            {f.hasOutcome && <h2>The<br /><span className="accent">result</span></h2>}
            {f.results?.length > 0 && (
              <div className="ft-results-body">
                {f.results.map((g, i) => <p key={i}>{g}</p>)}
              </div>
            )}
            {f.delivered?.length > 0 && (
              <div className="ft-delivered">
                {f.delivered.map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span className="line">{d.line}</span>
                    <span className="spec">{d.spec}</span>
                  </div>
                ))}
              </div>
            )}
            {f.credits?.length > 0 && (
              <div className="ft-credits">
                <span className="hd">Environments &amp; credits</span>
                {f.credits.map((g, i) => <span key={i}>{g}</span>)}
              </div>
            )}
          </section>
        )}

        {/* ── board 05 · next feature ── */}
        {nxt && (
          <button className="ft-next" style={{ order: 8 }} onClick={() => onSelectProject?.(nxt)}>
            {(() => {
              // Prefer a nominated preview frame over the raw first media item.
              const pick = (nxt.preview || [])
                .map(s => (nxt.media || []).find(x => x.src === s))
                .find(Boolean) || (nxt.media || []).find(x => x.type === 'image')
              return pick && (
              <img src={pick.src} alt="" loading="lazy" decoding="async"
                   style={{ filter: GREY.includes(nxt.id) ? 'sepia(.45) saturate(.9) contrast(1.08) brightness(.92)' : 'saturate(1.05) contrast(1.04)' }} />
              )
            })()}
            <div className="ft-next-scrim" />
            <span className="ft-back" style={{ position: 'absolute', top: 26, left: 48, zIndex: 3 }}
                  onClick={e => { e.stopPropagation(); onClose?.() }}>← Back to the reel</span>
            <div className="ft-next-copy">
              <span className="ft-kicker">Next feature · {nxt.category} · {nxt.year}</span>
              <span className="ttl">{nxt.title} →</span>
            </div>
          </button>
        )}
      </div>
    </motion.div>
  )
}
