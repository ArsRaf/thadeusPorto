import { motion, AnimatePresence } from 'framer-motion'

function GridCard({ project, onSelect }) {
  const media = project.media?.[0]
  return (
    <button className="ow-card" onClick={() => onSelect(project)}>
      {media?.type === 'video' ? (
        <video src={media.src} muted loop autoPlay playsInline className="ow-media" />
      ) : media?.type === 'image' ? (
        <img src={media.src} alt={project.title} className="ow-media" />
      ) : (
        <div className="ow-media" style={{ background: project.colorBg ?? '#0a0604' }} />
      )}
      <div className="ow-card-grad" />
      <div className="ow-card-info">
        <div className="ow-card-label">{project.title}</div>
        <div className="ow-card-sub">
          {project.category}{project.year ? ` · ${project.year}` : ''}
        </div>
      </div>
    </button>
  )
}

export default function ProjectGrid({ projects, activeCategory, onSelectProject }) {
  const catLabel = activeCategory.toUpperCase().split('').join(' ')

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div style={s.categoryLabel}>{catLabel}</div>

        {projects.length > 0 ? (
          <div className="ow-grid">
            {projects.map(p => <GridCard key={p.id} project={p} onSelect={onSelectProject} />)}
          </div>
        ) : (
          <div style={s.emptyState}>
            <span style={s.emptyText}>NO PROJECTS YET</span>
            <span style={s.emptySub}>This category is coming soon — check back later.</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

const s = {
  categoryLabel: {
    fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontStyle: 'italic',
    fontSize: 'clamp(24px, 3.5vw, 52px)',
    letterSpacing: '0.05em',
    marginBottom: 20,
    userSelect: 'none', lineHeight: 1,
    opacity: 0.6, color: '#fff',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: '64px 24px',
    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)',
  },
  emptyText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)',
  },
  emptySub: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: 13, color: 'rgba(255,255,255,0.2)',
  },
}
