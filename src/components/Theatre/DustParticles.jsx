import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

const COUNT = 180

export default function DustParticles() {
  const meshRef = useRef()

  // Generate initial positions and per-particle drift velocities once
  const { positions, vx, vy, vz } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const vx = new Float32Array(COUNT)
    const vy = new Float32Array(COUNT)
    const vz = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7 + 1.5
      positions[i * 3 + 2] = Math.random() * 12 - 3

      vx[i] = (Math.random() - 0.5) * 0.0018
      vy[i] = Math.random() * 0.0008 + 0.0002 // drift upward slowly
      vz[i] = (Math.random() - 0.5) * 0.0012
    }

    return { positions, vx, vy, vz }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position

    for (let i = 0; i < COUNT; i++) {
      pos.array[i * 3]     += vx[i]
      pos.array[i * 3 + 1] += vy[i]
      pos.array[i * 3 + 2] += vz[i]

      // Wrap bounds so particles recirculate
      if (pos.array[i * 3 + 1] > 5.5) pos.array[i * 3 + 1] = -2.5
      if (Math.abs(pos.array[i * 3]) > 9) vx[i] *= -1
    }

    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#90aac8"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
