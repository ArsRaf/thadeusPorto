import './portfolio.css'

// ─── Project data ─────────────────────────────────────────
export const PROJECT = {
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

// ─── Playbill spread ──────────────────────────────────────
export default function PlaybillSpread({ p }) {
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
