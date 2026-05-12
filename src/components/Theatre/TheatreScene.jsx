import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import gsap from 'gsap'
import DustParticles from './DustParticles'

// ── GLSL: Film burn on screen surface ────────────────────────────────────────
const burnVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const burnFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  void main() {
    float t = uTime * 0.22;
    float n = noise(vUv*5.5+vec2(t*.18,t*.11))*0.5
            + noise(vUv*10.0-vec2(t*.28,t*.07))*0.3
            + noise(vUv*2.8+vec2(-t*.09,t*.20))*0.2;
    float edge = 1.0 - smoothstep(0.0, 0.14, min(min(vUv.x,1.0-vUv.x),min(vUv.y,1.0-vUv.y)));
    float burn = smoothstep(0.52, 0.96, n*n*0.85 + edge*0.65) * 0.52;
    vec3 col = mix(vec3(0.55,0.14,0.01), vec3(1.0,0.62,0.06), n);
    gl_FragColor = vec4(col, burn);
  }
`

// ── Camera controller ─────────────────────────────────────────────────────────
function CameraController({ zooming, visible, onZoomComplete, timelineRef }) {
  const { camera } = useThree()
  const animated = useRef(false)
  const prevVisible = useRef(visible)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (visible && !prevVisible.current) {
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camera.rotation)
      camera.position.set(0, 4.0, 9.5)
      camera.rotation.set(0, 0, 0)
      animated.current = false
    }
    prevVisible.current = visible
  }, [visible, camera])

  useEffect(() => {
    if (zooming && !animated.current) {
      animated.current = true
      const tl = gsap.timeline({ onComplete: onZoomComplete })
      tl.to(camera.position, { z: -0.6, y: 2.5, x: 0, duration: 3.4, ease: 'power3.inOut' }, 0)
      tl.to(camera.rotation, { x: 0.0, duration: 3.4, ease: 'power3.inOut' }, 0)
      if (timelineRef) timelineRef.current = tl
    }
  }, [zooming, camera, onZoomComplete])

  useFrame(() => {
    if (animated.current) return
    camera.position.x += (mouse.current.x * 0.18 - camera.position.x) * 0.04
    camera.position.y += (4.0 - mouse.current.y * 0.12 - camera.position.y) * 0.04
    camera.lookAt(0, 1.5, -4)
  })

  return null
}

// ── Projector spotlight ───────────────────────────────────────────────────────
function ProjectorLight() {
  const lightRef = useRef()
  const { scene } = useThree()
  useEffect(() => {
    const l = lightRef.current
    if (!l) return
    l.target.position.set(0, 2.5, -4)
    scene.add(l.target)
    return () => scene.remove(l.target)
  }, [scene])
  return (
    <spotLight ref={lightRef} position={[0, 9, 8]}
      intensity={360} angle={0.22} penumbra={0.9}
      color="#e8dcc0" distance={34}
    />
  )
}

// ── Cinema screen ─────────────────────────────────────────────────────────────
function CinemaScreen({ onClick, zooming, volume }) {
  const screenRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [texture, setTexture]  = useState(null)

  const videoRef      = useRef(null)
  const canvasRef     = useRef(null)
  const ctxRef        = useRef(null)
  const lastTimeRef   = useRef(-1)
  const volumeInitRef = useRef(volume)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width  = 1280
    canvas.height = 720
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 1280, 720)

    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.colorSpace = THREE.SRGBColorSpace

    const video = document.createElement('video')
    video.src = '/assets/escape-detention.mp4'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.play().then(() => {
      video.muted = false
      video.volume = volumeInitRef.current
    }).catch(() => {})

    videoRef.current  = video
    canvasRef.current = canvas
    ctxRef.current    = ctx
    setTexture(tex)

    return () => {
      video.pause()
      video.src = ''
      tex.dispose()
    }
  }, [])

  const volumeMounted = useRef(false)
  useEffect(() => {
    if (!volumeMounted.current) { volumeMounted.current = true; return }
    const v = videoRef.current
    if (!v) return
    v.muted = volume === 0
    v.volume = volume
  }, [volume])

  useFrame(({ clock }) => {
    if (!screenRef.current) return

    // Draw video frame onto canvas with contain (black bars fill gaps)
    const video  = videoRef.current
    const canvas = canvasRef.current
    const ctx    = ctxRef.current
    if (video && ctx && video.readyState >= 2 && video.currentTime !== lastTimeRef.current) {
      lastTimeRef.current = video.currentTime
      const cw = canvas.width, ch = canvas.height
      const ca = cw / ch
      const va = video.videoWidth && video.videoHeight
        ? video.videoWidth / video.videoHeight : ca
      let dx, dy, dw, dh
      if (va > ca) {
        dh = ch; dw = ch * va; dy = 0; dx = (cw - dw) / 2
      } else {
        dw = cw; dh = cw / va; dx = 0; dy = (ch - dh) / 2
      }
      ctx.drawImage(video, dx, dy, dw, dh)
      if (texture) texture.needsUpdate = true
    }

    if (zooming || texture) return
    const t       = clock.getElapsedTime()
    const base    = 1.8
    const flutter = 0.08 * Math.sin(t * 2.1) + 0.04 * Math.sin(t * 8.7)
    const spike   = Math.random() < 0.006 ? -0.3 : 0
    screenRef.current.material.emissiveIntensity = base + flutter + spike
  })

  return (
    <group>
      {/* Pure black backing — no coloured border */}
      <mesh position={[0, 2.5, -4.08]}>
        <boxGeometry args={[12.2, 6.95, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh
        ref={screenRef} position={[0, 2.5, -4]}
        onClick={() => !zooming && onClick()}
        onPointerEnter={() => { if (!zooming) { setHovered(true);  document.body.style.cursor = 'pointer' } }}
        onPointerLeave={() => {                  setHovered(false); document.body.style.cursor = '' }}
      >
        <planeGeometry args={[12, 6.75]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={1} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            color={hovered ? '#faf8f0' : '#f0ece0'}
            emissive="#f8f4e4" emissiveIntensity={1.8} roughness={0.92} />
        )}
      </mesh>
    </group>
  )
}

// ── Velvet curtains ───────────────────────────────────────────────────────────
function Curtain({ side }) {
  const xSign  = side === 'left' ? -1 : 1
  const xBase  = xSign * 6.4
  const count  = 16
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const t      = i / (count - 1)
        const x      = xBase + xSign * t * 4.6
        const zFold  = Math.sin(t * Math.PI * 3.5) * 0.26
        const ridge  = i % 2 === 0
        return (
          <mesh key={i} position={[x, 0.5, -4.06 + zFold]}>
            <planeGeometry args={[0.35, 12, 1, 6]} />
            <meshStandardMaterial
              color={new THREE.Color(ridge ? 0.46 : 0.28, ridge ? 0.048 : 0.030, ridge ? 0.068 : 0.044)}
              roughness={0.97} side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
      {/* Pelmet */}
      <mesh position={[xBase + xSign * 2.3, 5.1, -3.88]}>
        <boxGeometry args={[5.2, 0.6, 0.65]} />
        <meshStandardMaterial color="#280810" emissive="#160408" emissiveIntensity={0.3} roughness={0.93} />
      </mesh>
      {/* Gold rod */}
      <mesh position={[xBase + xSign * 2.3, 5.45, -3.68]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 5.2, 8]} />
        <meshStandardMaterial color="#8a6820" metalness={0.88} roughness={0.28} />
      </mesh>
    </group>
  )
}

// ── Theatre room ──────────────────────────────────────────────────────────────
function TheatreRoom() {
  // Side wall pilasters (vertical decorative columns)
  const pilasterZs = [-1.5, 1.5, 4.5, 7.5]

  return (
    <group>
      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 2]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#070402" roughness={1} />
      </mesh>
      {/* Center carpet aisle runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.89, 2]}>
        <planeGeometry args={[1.6, 20]} />
        <meshStandardMaterial color="#0e0604" roughness={1} />
      </mesh>

      {/* ── Main ceiling ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.6, 3]}>
        <planeGeometry args={[24, 16]} />
        <meshStandardMaterial color="#030200" roughness={1} />
      </mesh>
      {/* Cove ceiling directly over screen — slightly lower, darker */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.4, -1.5]}>
        <planeGeometry args={[22, 5.5]} />
        <meshStandardMaterial color="#020100" roughness={1} />
      </mesh>
      {/* Angled cove drop — connects the two ceiling heights */}
      <mesh position={[0, 6.5, 1.2]} rotation={[-0.46, 0, 0]}>
        <planeGeometry args={[22, 1.5]} />
        <meshStandardMaterial color="#030100" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* Ceiling crown strip at center — emissive warm glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.55, 3]}>
        <planeGeometry args={[5, 14]} />
        <meshStandardMaterial color="#0e0804" emissive="#1a0e06" emissiveIntensity={0.4} roughness={1} />
      </mesh>

      {/* ── Screen wall ── */}
      <mesh position={[0, 1.5, -4.2]}>
        <planeGeometry args={[26, 16]} />
        <meshStandardMaterial color="#060402" roughness={1} />
      </mesh>

      {/* ── Back wall ── */}
      <mesh position={[0, 1.5, 10.2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[26, 16]} />
        <meshStandardMaterial color="#070503" roughness={1} />
      </mesh>
      {/* Back wall wainscot panel */}
      <mesh position={[0, 0.5, 10.15]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[24, 2.2]} />
        <meshStandardMaterial color="#090604" roughness={1} />
      </mesh>

      {/* ── Left wall ── */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-11, 1.5, 2]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#080503" roughness={1} />
      </mesh>
      {/* Left wall lower panel (wainscoting) */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10.96, 0.4, 2]}>
        <planeGeometry args={[20, 2.0]} />
        <meshStandardMaterial color="#0b0704" roughness={1} />
      </mesh>

      {/* ── Right wall ── */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[11, 1.5, 2]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#080503" roughness={1} />
      </mesh>
      {/* Right wall lower panel */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10.96, 0.4, 2]}>
        <planeGeometry args={[20, 2.0]} />
        <meshStandardMaterial color="#0b0704" roughness={1} />
      </mesh>

      {/* ── Left wall pilasters ── */}
      {pilasterZs.map((z, i) => (
        <mesh key={`lp-${i}`} position={[-10.72, 2.8, z]}>
          <boxGeometry args={[0.38, 9.5, 0.42]} />
          <meshStandardMaterial color="#0a0603" roughness={0.95} />
        </mesh>
      ))}
      {/* ── Right wall pilasters ── */}
      {pilasterZs.map((z, i) => (
        <mesh key={`rp-${i}`} position={[10.72, 2.8, z]}>
          <boxGeometry args={[0.38, 9.5, 0.42]} />
          <meshStandardMaterial color="#0a0603" roughness={0.95} />
        </mesh>
      ))}

      {/* ── Horizontal wall rails ── */}
      {/* Upper rail both sides */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10.82, 4.8, 2]}>
        <boxGeometry args={[20, 0.14, 0.28]} />
        <meshStandardMaterial color="#0d0906" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10.82, 4.8, 2]}>
        <boxGeometry args={[20, 0.14, 0.28]} />
        <meshStandardMaterial color="#0d0906" roughness={0.9} />
      </mesh>
      {/* Lower chair rail both sides */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10.82, 1.4, 2]}>
        <boxGeometry args={[20, 0.12, 0.24]} />
        <meshStandardMaterial color="#0d0906" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10.82, 1.4, 2]}>
        <boxGeometry args={[20, 0.12, 0.24]} />
        <meshStandardMaterial color="#0d0906" roughness={0.9} />
      </mesh>

      {/* ── Ceiling cornice (crown molding) both sides ── */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10.6, 6.2, 2]}>
        <boxGeometry args={[20, 0.3, 0.7]} />
        <meshStandardMaterial color="#0c0803" roughness={0.95} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10.6, 6.2, 2]}>
        <boxGeometry args={[20, 0.3, 0.7]} />
        <meshStandardMaterial color="#0c0803" roughness={0.95} />
      </mesh>

      {/* ── Proscenium arch ── */}
      {/* Left column */}
      <mesh position={[-6.85, 1.6, -4.05]}>
        <boxGeometry args={[0.6, 10.4, 0.5]} />
        <meshStandardMaterial color="#0e0803" roughness={0.95} />
      </mesh>
      {/* Right column */}
      <mesh position={[6.85, 1.6, -4.05]}>
        <boxGeometry args={[0.6, 10.4, 0.5]} />
        <meshStandardMaterial color="#0e0803" roughness={0.95} />
      </mesh>

      {/* ── Seat rows — raked (each row slightly higher) ── */}
      {[
        { z: 0.5, count: 6,  y: -0.18 },
        { z: 1.8, count: 7,  y: -0.08 },
        { z: 3.1, count: 8,  y:  0.02 },
        { z: 4.4, count: 9,  y:  0.12 },
        { z: 5.7, count: 10, y:  0.22 },
        { z: 7.0, count: 11, y:  0.32 },
      ].map(({ z, count, y }, ri) =>
        Array.from({ length: count }, (_, i) => {
          const x = (i - (count - 1) / 2) * 1.55
          return (
            <group key={`${ri}-${i}`} position={[x, y, z]}>
              <mesh>
                <boxGeometry args={[1.2, 0.1, 0.55]} />
                <meshStandardMaterial color="#2e0e14" roughness={0.95} />
              </mesh>
              <mesh position={[0, 0.44, 0.22]}>
                <boxGeometry args={[1.18, 0.8, 0.1]} />
                <meshStandardMaterial color="#3a1218" roughness={0.95} />
              </mesh>
              <mesh position={[-0.56, 0.28, 0]}>
                <boxGeometry args={[0.06, 0.38, 0.52]} />
                <meshStandardMaterial color="#160808" roughness={0.9} />
              </mesh>
              <mesh position={[0.56, 0.28, 0]}>
                <boxGeometry args={[0.06, 0.38, 0.52]} />
                <meshStandardMaterial color="#160808" roughness={0.9} />
              </mesh>
            </group>
          )
        })
      )}

      {/* ── Aisle step-lights — warm amber ── */}
      {[-1, 1].flatMap((side) =>
        [0.8, 2.5, 4.2, 6.0].map((z) => (
          <mesh key={`al-${side}-${z}`} position={[side * 4.8, -0.5, z]}>
            <boxGeometry args={[0.06, 0.04, 0.3]} />
            <meshStandardMaterial color="#6a3008" emissive="#6a3008" emissiveIntensity={2.4} />
          </mesh>
        ))
      )}

      {/* ── Wall sconces (between pilasters) ── */}
      {[-1, 1].flatMap((side) =>
        [0.0, 3.0, 6.0].map((z) => (
          <group key={`ws-${side}-${z}`}>
            {/* Sconce body */}
            <mesh position={[side * 10.62, 3.6, z]}>
              <boxGeometry args={[0.06, 0.42, 0.32]} />
              <meshStandardMaterial color="#3a1e08" emissive="#3a1e08" emissiveIntensity={1.4} />
            </mesh>
            {/* Sconce glow disc */}
            <mesh position={[side * 10.55, 3.6, z]} rotation={[0, side * Math.PI / 2, 0]}>
              <circleGeometry args={[0.18, 12]} />
              <meshStandardMaterial color="#c08030" emissive="#c08030" emissiveIntensity={2.0} transparent opacity={0.7} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

// ── TheatreScene (exported) ───────────────────────────────────────────────────
export default function TheatreScene({ visible, onScreenClick, initialVolume = 0 }) {
  const [zooming,     setZooming]     = useState(false)
  const [showFlash,   setShowFlash]   = useState(false)
  const [volume,      setVolume]      = useState(initialVolume)
  const [showSlider,  setShowSlider]  = useState(false)
  const zoomTlRef = useRef(null)

  useEffect(() => {
    if (visible) { setZooming(false); setShowFlash(false) }
  }, [visible])

  const handleZoomComplete = () => {
    setShowFlash(true)
    setVolume(0)
    setTimeout(() => {
      setZooming(false)
      onScreenClick()
    }, 550)
  }

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7 }}
      initial={false}
    >
      <Canvas
        camera={{ position: [0, 4.0, 9.5], fov: 68 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#060402' }}
        onDoubleClick={() => { if (zooming && zoomTlRef.current) zoomTlRef.current.timeScale(5) }}
      >
        <CameraController zooming={zooming} visible={visible} onZoomComplete={handleZoomComplete} timelineRef={zoomTlRef} />

        {/* Warm dim ambient — lets geometry be slightly visible in shadow */}
        <ambientLight intensity={20} color="#1c0e06" />

        {/* Projector cone from back */}
        <ProjectorLight />

        {/* Screen glow — primary light source, illuminates front rows */}
        <pointLight position={[0, 2.5, -2.8]} intensity={10} color="#e8dcc0" distance={22} />

        {/* Ceiling wash — lights the audience area from above */}
        <pointLight position={[0, 6.0, 3.5]} intensity={28} color="#4a2808" distance={30} />
        <pointLight position={[0, 6.0, 7.0]} intensity={18} color="#3a1e06" distance={22} />

        {/* Mid-room fill — makes mid-rows visible */}
        <pointLight position={[0, 4.0, 5.5]} intensity={16} color="#301804" distance={20} />

        {/* Side sconce point lights matching geometry */}
        {[-1, 1].flatMap((s) =>
          [0.0, 3.0, 6.0].map((z) => (
            <pointLight key={`sl-${s}-${z}`}
              position={[s * 10.2, 3.6, z]} intensity={3} color="#c08030" distance={7} />
          ))
        )}

        {/* Curtain fill — illuminates velvet red sides */}
        <pointLight position={[-8.5, 1.5, -3.5]} intensity={6} color="#8a2030" distance={8} />
        <pointLight position={[ 8.5, 1.5, -3.5]} intensity={6} color="#8a2030" distance={8} />

        <TheatreRoom />
        <Curtain side="left" />
        <Curtain side="right" />
        <CinemaScreen onClick={() => !zooming && setZooming(true)} zooming={zooming} volume={volume} />
        <DustParticles />
      </Canvas>

      {/* Volume control */}
      <div
        style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {showSlider && (
          <input
            type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={{
              width: 90, accentColor: '#d4af37', cursor: 'pointer',
              opacity: 0.9, verticalAlign: 'middle',
            }}
          />
        )}
        <button
          onClick={() => setVolume(v => v === 0 ? 0.4 : 0)}
          style={{
            background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)',
            cursor: 'pointer', padding: '7px 9px', lineHeight: 0, borderRadius: 2,
          }}
          aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {volume === 0 ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </>
            ) : volume < 0.5 ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Warm sepia vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(80,45,6,0.06) 0%, rgba(120,65,10,0.24) 100%)',
        mixBlendMode: 'multiply', pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Flash */}
      <motion.div
        style={{ position: 'absolute', inset: 0, background: '#f0ece0', pointerEvents: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showFlash ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeIn' }}
      />

      <motion.p
        style={hintStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: zooming ? 0 : 1 }}
        transition={{ delay: zooming ? 0 : 2.5, duration: 1 }}
      >
        click the screen to enter
      </motion.p>
    </motion.div>
  )
}

const hintStyle = {
  position: 'absolute',
  bottom: '8%',
  width: '100%',
  textAlign: 'center',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  letterSpacing: '0.45em',
  color: '#c8a050',
  textTransform: 'lowercase',
  pointerEvents: 'none',
  textShadow: '0 0 18px rgba(200,140,40,0.6)',
}
