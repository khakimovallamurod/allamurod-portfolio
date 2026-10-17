import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
  Html,
  Image,
  Lightformer,
  MeshTransmissionMaterial,
  RoundedBox,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL
const damp = THREE.MathUtils.damp

const palette = {
  dark: { env: '#0a0a0a', accent: '#ff4d1c', sparkle: '#ffffff' },
  light: { env: '#8f8b83', accent: '#ff4d1c', sparkle: '#111111' },
}

function Portrait({ size }) {
  return (
    <group>
      {/* Thin metal slab behind the photo gives the card physical depth */}
      <RoundedBox args={[size * 1.04, size * 1.04, 0.07]} radius={0.05} smoothness={6} position={[0, 0, -0.045]}>
        <meshStandardMaterial color="#1b1b1e" metalness={0.9} roughness={0.28} />
      </RoundedBox>
      <Image url={`${BASE}img/allamurod.jpg`} scale={[size, size]} radius={0.045} toneMapped={false} />
    </group>
  )
}

function Ring({ radius, speed, axis, tube = 0.008 }) {
  const ref = useRef()
  useFrame((_, dt) => {
    ref.current.rotation[axis] += dt * speed
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0.3, 0]}>
      <torusGeometry args={[radius, tube, 24, 220]} />
      <meshStandardMaterial color="#d9d9d9" metalness={1} roughness={0.12} />
    </mesh>
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

function CCTV({ position, rotation, scale, sweep = 0.35, phase = 0 }) {
  const head = useRef()
  const led = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime + phase
    // Pan left/right like a real PTZ camera.
    head.current.rotation.y = Math.sin(t * 0.6) * sweep
    head.current.rotation.x = Math.sin(t * 0.4) * 0.08
    led.current.emissiveIntensity = Math.sin(t * 4) > 0 ? 3 : 0.2
  })
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={head}>
        {/* body */}
        <RoundedBox args={[0.34, 0.3, 0.72]} radius={0.06} smoothness={5}>
          <meshPhysicalMaterial color="#ececec" roughness={0.32} clearcoat={0.6} />
        </RoundedBox>
        {/* sun shield */}
        <RoundedBox args={[0.42, 0.05, 0.84]} radius={0.02} smoothness={3} position={[0, 0.18, 0.04]}>
          <meshPhysicalMaterial color="#f4f4f4" roughness={0.3} clearcoat={0.6} />
        </RoundedBox>
        {/* lens bezel + glass */}
        <mesh position={[0, -0.01, 0.37]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 48]} />
          <meshStandardMaterial color="#111114" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.01, 0.39]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.085, 0.085, 0.03, 48]} />
          <meshPhysicalMaterial color="#05060a" roughness={0.02} metalness={0.2} clearcoat={1} />
        </mesh>
        <mesh position={[0, -0.01, 0.398]}>
          <torusGeometry args={[0.087, 0.008, 12, 48]} />
          <meshStandardMaterial color="#ff4d1c" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, -0.1, 0.362]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial ref={led} color="#ff2a00" emissive="#ff2a00" emissiveIntensity={2} />
        </mesh>
      </group>
      {/* bracket arm */}
      <mesh position={[0, -0.2, -0.18]}>
        <cylinderGeometry args={[0.025, 0.025, 0.16, 16]} />
        <meshStandardMaterial color="#cfcfcf" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.28, -0.18]}>
        <cylinderGeometry args={[0.09, 0.09, 0.025, 32]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  )
}

// Face-detection brackets drawn over the portrait.
function Detection({ size }) {
  const ref = useRef()
  const scan = useRef()
  const w = size * 0.2
  const h = size * 0.26
  const l = Math.min(w, h) * 0.28
  const t = size * 0.006
  const corners = [
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
  ]
  useFrame((state) => {
    const k = state.clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(k * 2.2) * 0.025)
    scan.current.position.y = ((k * 0.22) % 1) * -size + size / 2
  })
  return (
    <group position={[0, 0, 0.02]}>
      <group ref={ref} position={[-size * 0.01, size * 0.3, 0]}>
        {corners.map(([sx, sy], i) => (
          <group key={i} position={[(sx * w) / 2, (sy * h) / 2, 0]}>
            <mesh position={[(-sx * l) / 2, 0, 0]}>
              <planeGeometry args={[l, t]} />
              <meshBasicMaterial color="#ff4d1c" toneMapped={false} />
            </mesh>
            <mesh position={[0, (-sy * l) / 2, 0]}>
              <planeGeometry args={[t, l]} />
              <meshBasicMaterial color="#ff4d1c" toneMapped={false} />
            </mesh>
          </group>
        ))}
        <Html position={[-w / 2, h / 2, 0]} zIndexRange={[1, 0]} className="det-tag-wrap">
          <div className="det-tag">person · 0.98</div>
        </Html>
      </group>
      <mesh ref={scan}>
        <planeGeometry args={[size, size * 0.004]} />
        <meshBasicMaterial color="#ff4d1c" transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Rig({ started, theme }) {
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
      <Detection size={size} />

      <group ref={orbit}>
        <Ring radius={size * 0.78} speed={0.18} axis="z" />
        <Ring radius={size * 0.9} speed={-0.12} axis="y" tube={0.005} />

        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.6}>
          <CCTV position={[-size * 0.68, size * 0.5, 0.6]} rotation={[0.25, 0.6, 0]} scale={size * 0.3} />
        </Float>
        <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.7}>
          <CCTV position={[size * 0.62, -size * 0.28, 0.5]} rotation={[-0.1, -0.6, 0]} scale={size * 0.26} sweep={0.45} phase={2} />
        </Float>

        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
          <Glass position={[-size * 0.5, -size * 0.42, 0.8]} scale={size * 0.3} />
        </Float>

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

      <Sparkles count={50} scale={[size * 2.4, size * 2, 1.5]} size={1.6} speed={0.25} opacity={0.5} color={colors.sparkle} />
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
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Rig started={started} theme={theme} />
          <Studio theme={theme} />
          <Ready />
        </Suspense>
      </Canvas>
    </div>
  )
}
