import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
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
      {/* Thin metal slab behind the photo gives the card physical thickness when it tilts */}
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

function Rig({ started, theme }) {
  const group = useRef()
  const card = useRef()
  const { viewport, pointer } = useThree()
  const mobile = viewport.width < viewport.height * 1.05
  const colors = palette[theme]

  // Desktop: portrait sits on the right, text lives in the DOM on the left.
  const size = mobile ? Math.min(viewport.width * 0.56, 2) : Math.min(viewport.height * 0.5, viewport.width * 0.26, 2.1)
  const baseX = mobile ? 0 : viewport.width * 0.22
  const baseY = mobile ? viewport.height * 0.12 : -0.05

  useFrame((state, dt) => {
    const g = group.current
    const p = Math.min(window.scrollY / window.innerHeight, 1.5)
    const s = started ? 1 : 0.55
    g.scale.setScalar(damp(g.scale.x, s, 3.2, dt))
    g.rotation.y = damp(g.rotation.y, started ? pointer.x * 0.28 - p * 0.6 : -1.1, 3, dt)
    g.rotation.x = damp(g.rotation.x, started ? -pointer.y * 0.16 + p * 0.25 : 0.4, 3, dt)
    g.position.y = damp(g.position.y, baseY + p * 1.6, 6, dt)
    g.position.x = damp(g.position.x, baseX, 4, dt)
    card.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.025
  })

  return (
    <>
      <group ref={group} position={[baseX, baseY, 0]} scale={0.55}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
          <group ref={card}>
            <Portrait size={size} />
          </group>
        </Float>

        <Ring radius={size * 0.78} speed={0.18} axis="z" />
        <Ring radius={size * 0.9} speed={-0.12} axis="y" tube={0.005} />

        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
          <Glass position={[-size * 0.5, -size * 0.4, 0.8]} scale={size * 0.32} />
        </Float>

        <Float speed={2.4} floatIntensity={1.2}>
          <mesh position={[size * 0.58, size * 0.46, 0.5]}>
            <sphereGeometry args={[size * 0.085, 64, 64]} />
            <meshPhysicalMaterial color={colors.accent} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
          </mesh>
        </Float>
        <Float speed={1.8} floatIntensity={1.4}>
          <mesh position={[size * 0.66, -size * 0.36, 0.25]}>
            <sphereGeometry args={[size * 0.05, 64, 64]} />
            <meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.08} />
          </mesh>
        </Float>
        <Float speed={1.6} floatIntensity={1}>
          <mesh position={[-size * 0.62, size * 0.5, -0.4]}>
            <icosahedronGeometry args={[size * 0.07, 0]} />
            <meshStandardMaterial color="#cfcfcf" metalness={1} roughness={0.2} flatShading />
          </mesh>
        </Float>

        <Sparkles count={50} scale={[size * 2.4, size * 2, 1.5]} size={1.6} speed={0.25} opacity={0.5} color={colors.sparkle} />
      </group>
    </>
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
