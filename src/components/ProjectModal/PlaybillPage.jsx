import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PlaybillSpread, { PROJECT } from '../Portfolio/PlaybillSpread'

export default function PlaybillPage({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 500, overflowY: 'auto', overflowX: 'hidden', background: '#1d100f' }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="page pp-root" style={{ paddingBottom: 64 }}>
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 0', borderBottom: '1px solid var(--outline-dim)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 18, letterSpacing: '0.02em', color: 'var(--parchment)' }}>
            <span style={{ width: 8, height: 8, background: 'var(--kabuki)', transform: 'rotate(45deg)', flexShrink: 0, display: 'inline-block' }}></span>
            <span>Thaddeus</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--outline-dim)', cursor: 'pointer',
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--grotesk)', fontSize: 11, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--parchment-dim)',
          }}>
            <span style={{ fontSize: 14 }}>←</span> Back
          </button>
        </header>

        <PlaybillSpread p={PROJECT} />
      </div>
    </motion.div>
  )
}
