import { useMemo } from 'react'

/**
 * "Now Showing" film reels.
 *
 * Two sprocketed lanes scrolling in opposite directions, each cell a category
 * cover drawn from that category's first project. Ported from the Claude Design
 * marquee comp to this codebase's plain JSX + CSS conventions.
 *
 * Each lane's contents are duplicated so the -50% keyframe loops seamlessly.
 */
function Cell({ cat, onSelect }) {
  const media = cat.cover
  return (
    <button
      className="reel-cell"
      onClick={() => onSelect?.(cat)}
      aria-label={`${cat.name} — ${cat.items.length} works`}
    >
      {media?.type === 'video' ? (
        <video src={media.src} muted loop autoPlay playsInline className="reel-media" />
      ) : media?.type === 'image' ? (
        <img src={media.src} alt={cat.name} className="reel-media" />
      ) : (
        <div className="reel-media" style={{ background: cat.bg ?? 'var(--slate)' }} />
      )}
      <div className="reel-cap">
        <span className="reel-n">
          {String(cat.items.length).padStart(2, '0')} {cat.items.length === 1 ? 'Reel' : 'Reels'}
        </span>
        <h3>{cat.name}</h3>
        <span className="reel-ct">{cat.blurb}</span>
      </div>
      <span className="reel-bar" />
    </button>
  )
}

export default function NowShowingReels({ categories, onSelect }) {
  // Duplicate so the translateX(-50%) loop has an identical second half.
  const top = useMemo(() => [...categories, ...categories], [categories])
  const bottom = useMemo(
    () => [...categories].reverse().concat([...categories].reverse()),
    [categories]
  )

  if (categories.length === 0) return null

  return (
    <div className="reels">
      <div className="reel">
        <div className="reel-lane l">
          {top.concat(top).map((c, i) => (
            <Cell key={`t${i}`} cat={c} onSelect={onSelect} />
          ))}
        </div>
      </div>
      <div className="reel">
        <div className="reel-lane r">
          {bottom.concat(bottom).map((c, i) => (
            <Cell key={`b${i}`} cat={c} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  )
}
