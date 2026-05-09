// Pure CSS-driven grain & atmosphere layer — zero canvas/JS overhead.
export default function GrainOverlay() {
  return (
    <>
      <div className="grain" />
      <div className="vignette" />
      <div className="projector-flicker" />
    </>
  )
}
