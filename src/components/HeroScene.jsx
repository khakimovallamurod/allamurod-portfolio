import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  Sparkles,
  useTexture,
} from '@react-three/drei'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL
const damp = THREE.MathUtils.damp

const palette = {
  dark: { env: '#0a0a0a', accent: '#ff4d1c', sparkle: '#ffffff', line: '#edebe6' },
  light: { env: '#9a9aa0', accent: '#f0420f', sparkle: '#111111', line: '#09090b' },
}

// Fewer particles on phones / weak CPUs, almost static with reduced motion.
function getQuality() {
  const w = window.innerWidth
  const cores = navigator.hardwareConcurrency || 4
  const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const lite = w < 768 || cores <= 4
  const mid = !lite && w < 1200
  return {
    lite,
    calm,
    nodes: lite ? 140 : mid ? 220 : 320,
    ring: lite ? 500 : mid ? 900 : 1400,
    sparkles: lite ? 20 : 50,
    dpr: lite ? [1, 1.4] : [1, 1.75],
  }
}

// Neural-network sphere: nodes on a Fibonacci sphere, nearest neighbours joined by lines.
function NeuralSphere({ radius, count, color, line, calm }) {
  const ref = useRef()
  const { points, segments } = useMemo(() => {
    const pts = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      // slight jitter so it reads as organic, not a perfect lattice
      const k = radius * (0.92 + ((i * 7919) % 100) / 100 * 0.16)
      pts.push(new THREE.Vector3(Math.cos(th) * r * k, y * k, Math.sin(th) * r * k))
    }
    const seg = []
    const max = radius * 0.36
    for (let i = 0; i < count; i++) {
      let links = 0
      for (let j = i + 1; j < count && links < 3; j++) {
        if (pts[i].distanceTo(pts[j]) < max) {
          seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
          links++
        }
      }
    }
    const flat = new Float32Array(count * 3)
    pts.forEach((p, i) => p.toArray(flat, i * 3))
    return { points: flat, segments: new Float32Array(seg) }
  }, [count, radius])

  useFrame((state, dt) => {
    const g = ref.current
    const p = Math.min(window.scrollY / window.innerHeight, 1.5)
    g.rotation.y += dt * (calm ? 0.02 : 0.12 + p * 0.25)
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * (calm ? 0 : 0.1)
    // Scroll pulls the network open around the portrait.
    g.scale.setScalar(damp(g.scale.x, 1 + p * 0.35, 4, dt))
  })

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.035} sizeAttenuation transparent opacity={0.95} depthWrite={false} toneMapped={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={line} transparent opacity={0.14} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// Quai-style particle halo orbiting the sphere.
function ParticleRing({ radius, count, color, calm }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const th = (i / count) * Math.PI * 2 * 7.13
      const spread = ((i * 2654435761) % 1000) / 1000 - 0.5
      const r = radius * (1 + spread * 0.22)
      a[i * 3] = Math.cos(th) * r
      a[i * 3 + 1] = spread * radius * 0.06
      a[i * 3 + 2] = Math.sin(th) * r
    }
    return a
  }, [count, radius])
  useFrame((_, dt) => {
    if (!calm) ref.current.rotation.y -= dt * 0.08
  })
  return (
    <points ref={ref} rotation={[Math.PI / 2.6, 0.25, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.018} sizeAttenuation transparent opacity={0.7} depthWrite={false} toneMapped={false} />
    </points>
  )
}

function Portrait({ size }) {
  // Round portrait: matches the spherical network around it instead of a boxy card.
  const map = useTexture(`${BASE}img/allamurod.jpg`, (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
  return (
    <group>
      {/* Thin metal rim behind the photo gives it physical depth */}
      <mesh position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.515, size * 0.515, 0.07, 96]} />
        <meshStandardMaterial color="#1b1b1e" metalness={0.9} roughness={0.28} />
      </mesh>
      <mesh>
        <circleGeometry args={[size * 0.5, 96]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Glass({ position, scale }) {
  const ref = useRef()
  useFrame((state, dt) => {
    ref.current.rotation.x += dt * 0.25
    ref.current.rotation.y += dt * 0.35
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[0.62, 0.26, 64, 160]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        resolution={512}
        transmission={1}
        thickness={0.55}
        roughness={0.04}
        ior={1.28}
        chromaticAberration={0.08}
        anisotropy={0.15}
        distortion={0.12}
        distortionScale={0.4}
        temporalDistortion={0.08}
        clearcoat={1}
        attenuationDistance={2.5}
        attenuationColor="#ffffff"
        color="#ffffff"
      />
    </mesh>
  )
}

function Rig({ started, theme, quality }) {
  const root = useRef()
  const orbit = useRef()
  const { viewport, pointer } = useThree()
  const mobile = viewport.width < viewport.height * 1.05
  const colors = palette[theme]

  // Desktop: portrait sits on the right, text lives in the DOM on the left.
  const size = mobile ? Math.min(viewport.width * 0.56, 2) : Math.min(viewport.height * 0.5, viewport.width * 0.26, 2.1)
  const baseX = mobile ? 0 : viewport.width * 0.22
  const baseY = mobile ? viewport.height * 0.12 : -0.05

  useFrame((state, dt) => {
    const cam = state.camera
    const sp = Math.min(window.scrollY / window.innerHeight, 1.5)
    // Gentle dolly-in while the hero scrolls away (Quai-like depth, kept subtle).
    cam.position.z = damp(cam.position.z, 6 - (quality.calm ? 0 : sp * 1.4), 4, dt)
    const g = root.current
    const o = orbit.current
    const p = Math.min(window.scrollY / window.innerHeight, 1.5)
    // The portrait itself never rotates — only the objects around it move.
    g.scale.setScalar(damp(g.scale.x, started ? 1 : 0.55, 3.2, dt))
    g.position.y = damp(g.position.y, baseY + p * 1.6, 6, dt)
    g.position.x = damp(g.position.x, baseX, 4, dt)
    o.rotation.y = damp(o.rotation.y, started ? pointer.x * 0.35 - p * 0.6 : -1.1, 3, dt)
    o.rotation.x = damp(o.rotation.x, started ? -pointer.y * 0.2 + p * 0.25 : 0.4, 3, dt)
  })

  return (
    <group ref={root} position={[baseX, baseY, 0]} scale={0.55}>
      <Portrait size={size} />

      <group ref={orbit}>
        <NeuralSphere radius={size * 0.95} count={quality.nodes} color={colors.accent} line={colors.line} calm={quality.calm} />
        <ParticleRing radius={size * 1.25} count={quality.ring} color={colors.accent} calm={quality.calm} />

        {!quality.lite && (
          <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
            <Glass position={[-size * 0.5, -size * 0.42, 0.8]} scale={size * 0.3} />
          </Float>
        )}

        <Float speed={2.4} floatIntensity={1.2}>
          <mesh position={[size * 0.6, size * 0.5, 0.3]}>
            <sphereGeometry args={[size * 0.07, 64, 64]} />
            <meshPhysicalMaterial color={colors.accent} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
          </mesh>
        </Float>
        <Float speed={1.8} floatIntensity={1.4}>
          <mesh position={[size * 0.42, -size * 0.6, 0.4]}>
            <sphereGeometry args={[size * 0.045, 64, 64]} />
            <meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.08} />
          </mesh>
        </Float>
      </group>

      <Sparkles count={quality.sparkles} scale={[size * 2.4, size * 2, 1.5]} size={1.6} speed={0.25} opacity={0.5} color={colors.sparkle} />
    </group>
  )
}

function Ready() {
  // Mounted only after everything inside Suspense resolved.
  useEffect(() => {
    window.__sceneReady = true
    window.dispatchEvent(new Event('scene-ready'))
  }, [])
  return null
}

function Studio({ theme }) {
  // Procedural studio lighting — realistic reflections without downloading an HDRI.
  return (
    <Environment key={theme} resolution={256} frames={1}>
      <color attach="background" args={[palette[theme].env]} />
      <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[12, 3, 1]} />
      <Lightformer form="rect" intensity={2.4} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2.4} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      <Lightformer form="ring" color="#ff4d1c" intensity={4} position={[3, 3, 4]} scale={1.6} />
      <Lightformer form="circle" intensity={5} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={3} />
    </Environment>
  )
}

export default function HeroScene({ started, theme }) {
  const wrap = useRef()
  const [quality] = useState(getQuality)
  const [visible, setVisible] = useState(true)

  // Stop rendering when the hero is off screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="hero-canvas" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={quality.dpr}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Rig started={started} theme={theme} quality={quality} />
          <Studio theme={theme} />
          <Ready />
        </Suspense>
      </Canvas>
    </div>
  )
}
