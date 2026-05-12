import { useRef } from 'react'
import anime from 'animejs'
import { CATEGORIES } from '../../data/projects'

export default function CategoryNav({ active, onChange, accentColor = '#ffb3ad' }) {
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
              borderColor: isActive ? `${accentColor}66` : 'rgba(255,255,255,0.12)',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
            }}
          >
            <span style={s.label}>{cat}</span>
            {isActive && (
              <span style={{ ...s.underline, background: accentColor }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}

const s = {
  nav: { display: 'flex', gap: 6, alignItems: 'center' },
  btn: {
    background: 'none', border: '1px solid', cursor: 'pointer',
    padding: '6px 14px', outline: 'none', position: 'relative',
    transition: 'color 0.25s ease, border-color 0.25s ease',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace", fontWeight: 400,
    fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', display: 'block',
  },
  underline: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
  },
}
