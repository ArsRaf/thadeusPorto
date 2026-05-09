import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import ProjectCard from './ProjectCard'

const GAP = 20   // px gap between cards
const CARD_W = 310

export default function FilmStrip({ projects, onSelectProject }) {
  const trackRef   = useRef(null)
  const posRef     = useRef(0)      // current translateX
  const velRef     = useRef(0)      // pointer velocity
  const dragging   = useRef(false)
  const startXRef  = useRef(0)
  const tweenRef   = useRef(null)

  // Compute the leftmost allowed position (never scroll past last card)
  const getMinPos = useCallback(() => {
    if (!trackRef.current) return 0
    const containerW = trackRef.current.parentElement?.offsetWidth ?? window.innerWidth
    const totalW = projects.length * (CARD_W + GAP) - GAP
    return Math.min(0, containerW - totalW - 80) // 80px padding on right
  }, [projects.length])

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const applyPos = (x) => {
    posRef.current = x
    gsap.set(trackRef.current, { x })
  }

  const momentumTo = (target) => {
    if (tweenRef.current) tweenRef.current.kill()
    tweenRef.current = gsap.to(trackRef.current, {
      x: clamp(target, getMinPos(), 0),
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => {
        posRef.current = gsap.getProperty(trackRef.current, 'x')
      },
    })
  }

  // ── Pointer events ────────────────────────────────────────
  const onPointerDown = (e) => {
    if (tweenRef.current) tweenRef.current.kill()
    dragging.current  = true
    velRef.current    = 0
    startXRef.current = e.clientX - posRef.current
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return
    const next = e.clientX - startXRef.current
    velRef.current = e.clientX - (posRef.current + startXRef.current - e.clientX + e.clientX)
    // simpler velocity: delta from last frame
    velRef.current = next - posRef.current
    applyPos(clamp(next, getMinPos() - 60, 60)) // slight overscroll
  }

  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    const projected = posRef.current + velRef.current * 14
    momentumTo(projected)
  }

  // ── Wheel support ─────────────────────────────────────────
  useEffect(() => {
    const el = trackRef.current?.parentElement
    if (!el) return

    const onWheel = (e) => {
      e.preventDefault()
      if (tweenRef.current) tweenRef.current.kill()
      const next = posRef.current - e.deltaY * 1.4
      applyPos(clamp(next, getMinPos(), 0))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [getMinPos])

  // Reset strip position whenever project list changes
  useEffect(() => {
    applyPos(0)
  }, [projects])

  return (
    <div style={styles.viewport}>
      <div
        ref={trackRef}
        style={styles.track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onClick={() => onSelectProject(project)}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  viewport: {
    width: '100%',
    overflow: 'hidden',
    cursor: 'grab',
    padding: '0 60px',
  },
  track: {
    display: 'flex',
    gap: GAP,
    alignItems: 'center',
    willChange: 'transform',
    touchAction: 'none',
    userSelect: 'none',
  },
}
