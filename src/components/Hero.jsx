import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useTheme } from '../theme.jsx'
import { scrollTo } from '../hooks/useLenis.js'
import Magnetic from './Magnetic.jsx'
import { SplitReveal, easeOut } from './Reveal.jsx'

const HeroScene = lazy(() => import('./HeroScene.jsx'))

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Samarkand', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Hero({ started }) {
  const { t } = useLang()
  const { theme } = useTheme()
  const [gl] = useState(webglOk)
  useEffect(() => {
    if (!gl) window.dispatchEvent(new Event('scene-ready'))
  }, [gl])
  const time = useClock()
  const fade = (d) => ({
    initial: { opacity: 0, y: 24 },
    animate: started ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, ease: easeOut, delay: d },
  })

  return (
    <section className="hero" id="top">
      {gl ? (
        <Suspense fallback={null}>
          <HeroScene started={started} theme={theme} />
        </Suspense>
      ) : (
        <div className="hero-canvas hero-fallback">
          <img src={`${import.meta.env.BASE_URL}img/allamurod.jpg`} alt="Allamurod Khakimov" />
        </div>
      )}

      <div className="hero-content">
        <motion.div className="hero-kicker" {...fade(0.2)}>
          <span className="pulse" /> {t.hero.available}
        </motion.div>

        <h1 className="hero-title">
          <SplitReveal text="Allamurod" play={started} delay={0.1} className="line" />
          <SplitReveal text="Khakimov" play={started} delay={0.22} className="line line-outline" />
        </h1>

        <motion.p className="hero-role" {...fade(0.45)}>
          <span className="mono">[ </span>{t.hero.role}<span className="mono"> ]</span>
        </motion.p>
        <motion.p className="hero-lead" {...fade(0.55)}>{t.hero.lead}</motion.p>

        <motion.div className="hero-ctas" {...fade(0.7)}>
          <Magnetic>
            <button className="btn btn-solid" onClick={() => scrollTo('#work')} data-cursor="">
              <span className="roll" data-text={t.hero.cta}><span>{t.hero.cta}</span></span>
              <span className="btn-arrow">↘</span>
            </button>
          </Magnetic>
          <Magnetic>
            <button className="btn btn-ghost" onClick={() => scrollTo('#contact')}>
              <span className="roll" data-text={t.hero.cta2}><span>{t.hero.cta2}</span></span>
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div className="hero-meta" {...fade(0.9)}>
        <div>
          <span className="meta-label">Based in</span>
          <span>{t.hero.based}</span>
        </div>
        <div>
          <span className="meta-label">Local time</span>
          <span className="mono">{time} UTC+5</span>
        </div>
        <button className="scroll-hint" onClick={() => scrollTo('#about')}>
          <span className="scroll-line" />
          {t.hero.scroll}
        </button>
      </motion.div>
    </section>
  )
}
