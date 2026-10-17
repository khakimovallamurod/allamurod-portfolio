import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { ease } from './Reveal.jsx'

const MIN_MS = 1800

export default function Preloader({ onStart, onFinish }) {
  const { t } = useLang()
  const [sceneReady, setSceneReady] = useState(() => !!window.__sceneReady)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const ready = () => setSceneReady(true)
    window.addEventListener('scene-ready', ready)
    // Never block the site on WebGL — give up waiting after a few seconds.
    const t = setTimeout(ready, 7000)
    return () => {
      window.removeEventListener('scene-ready', ready)
      clearTimeout(t)
    }
  }, [])
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (now) => {
      const timeP = Math.min((now - start) / MIN_MS, 1) * 100
      // Hold at 90 until the 3D scene has compiled and its textures loaded.
      const loadP = sceneReady ? 100 : 90
      setCount((c) => Math.max(c, Math.floor(Math.min(timeP, loadP))))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sceneReady])

  useEffect(() => {
    if (count >= 100 && !leaving) {
      setLeaving(true)
      setTimeout(onStart, 550)
    }
  }, [count, leaving, onStart])

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      animate={{ y: leaving ? '-100%' : 0 }}
      transition={{ duration: 1.1, ease, delay: leaving ? 0.25 : 0 }}
      onAnimationComplete={() => leaving && onFinish()}
    >
      <div className="preloader-top">
        <span>Allamurod Khakimov</span>
        <span>Portfolio © {new Date().getFullYear()}</span>
      </div>
      <div className="preloader-count">
        <motion.span key={count}>{String(count).padStart(3, '0')}</motion.span>
      </div>
      <div className="preloader-bottom">
        <span>{t.loading}</span>
        <div className="preloader-bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </div>
    </motion.div>
  )
}
