import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

const wrap = (min, max, v) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min

// Infinite marquee whose speed and direction react to scroll velocity.
export default function Marquee({ items, base = 3, reverse = false }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [0, 1000], [0, 5], { clamp: false })
  const dir = useRef(reverse ? -1 : 1)
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    const f = factor.get()
    if (f < 0) dir.current = reverse ? 1 : -1
    else if (f > 0) dir.current = reverse ? -1 : 1
    x.set(x.get() - dir.current * base * (delta / 1000) * (1 + Math.abs(f)))
  })

  const row = items.map((it, i) => (
    <span className="marquee-item" key={i}>
      {it}
      <span className="marquee-star">✳</span>
    </span>
  ))
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x: tx }}>
        {row}
        {row}
      </motion.div>
    </div>
  )
}
