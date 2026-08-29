import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../../data/projects'
import '../Portfolio/portfolio.css'

// Project card in the marquee comp's grid style: thumbnail, title/year,
// blurb, tool pills.
function ProjectCard({ project, onSelect }) {
  const media = project.media?.[0]
  return (
    <article className="pcard" onClick={() => onSelect(project)}>
      <div className="th">
        {media?.type === 'video' ? (
          <video src={media.src} muted loop autoPlay playsInline className="media" />
        ) : media?.type === 'image' ? (
          <img src={media.src} alt={project.title} className="media" />
        ) : (
          <div className="pl">{project.title.charAt(0)}</div>
        )}
        <span className="tag">{project.category}</span>
        <span className="rb" />
      </div>
      <div className="row">
        <h3>{project.title}</h3>
        {project.year && <span className="yr">{project.year}</span>}
      </div>
      {project.description && <p>{project.description}</p>}
      {project.tools?.length > 0 && (
        <div className="tools">
          {project.tools.map((t) => <span key={t}>{t}</span>)}
        </div>
      )}
    </article>
  )
}

export default function ProjectGrid({ projects, onSelectProject }) {
  const [openCategory, setOpenCategory] = useState(null)

  // Categories that actually have work, in CATEGORIES order.
  const categories = useMemo(() => (
    CATEGORIES
      .map((name) => ({ name, items: projects.filter((p) => p.category === name) }))
      .filter((c) => c.items.length > 0)
  ), [projects])

  const open = categories.find((c) => c.name === openCategory)
  const shown = open ? open.items : projects
  const title = open ? open.name : 'All Works'

  if (projects.length === 0) {
    return (
      <div className="g-head">
        <h2>All Works</h2>
        <div className="cnt">No projects yet — check back later.</div>
      </div>
    )
  }

  return (
    <>
      <div className="g-head">
        <h2>{title}</h2>
        <div className="g-rule"><span className="dia" /></div>
        <div className="cnt">
          {String(shown.length).padStart(2, '0')} {shown.length === 1 ? 'Project' : 'Projects'}
        </div>

        <div className="g-filters">
          <button
            className={'g-filter' + (open ? '' : ' on')}
            onClick={() => setOpenCategory(null)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              className={'g-filter' + (openCategory === c.name ? ' on' : '')}
              onClick={() => setOpenCategory(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={title}
          className="g-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {shown.map((p) => (
            <ProjectCard key={p.id} project={p} onSelect={onSelectProject} />
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
