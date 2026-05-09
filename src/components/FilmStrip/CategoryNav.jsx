import { useRef } from 'react'
import anime from 'animejs'
import { CATEGORIES } from '../../data/projects'

export default function CategoryNav({ active, onChange, accentColor = '#ffffff' }) {
  const btnRefs = useRef({})

  const handleClick = (cat) => {
    if (cat === active) return
    const btn = btnRefs.current[cat]
    if (btn) {
      anime({
        targets: btn,
        scale: [1, 0.88, 1.06, 1],
        duration: 360,
        easing: 'easeOutElastic(1, 0.5)',
      })
    }
    onChange(cat)
  }

  return (
    <nav style={s.nav}>
      {CATEGORIES.map((cat) => {
        const isActive = cat === active
        return (
          <button
            key={cat}
            ref={(el) => { btnRefs.current[cat] = el }}
            onClick={() => handleClick(cat)}
            style={{
              ...s.btn,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
              borderBottom: isActive ? `1px solid ${accentColor}` : '1px solid transparent',
            }}
          >
            <span style={s.label}>{cat}</span>
          </button>
        )
      })}
    </nav>
  )
}

const s = {
  nav: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  btn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 14px',
    outline: 'none',
    transition: 'color 0.25s ease, border-bottom-color 0.25s ease',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 400,
    fontSize: 9,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    display: 'block',
  },
}
