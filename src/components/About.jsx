import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { FadeUp } from './Reveal.jsx'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="word">
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </span>
  )
}

function Counter({ n, s }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [v, setV] = useState(n > 1000 ? n - 40 : 0)
  useEffect(() => {
    if (!inView) return
    const c = animate(v, n, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, n])
  return (
    <span ref={ref}>
      {v}
      {s}
    </span>
  )
}

export default function About() {
  const { t } = useLang()
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = t.about.text.split(' ')

  return (
    <section className="section about" id="about">
      <FadeUp className="kicker"><span className="dot" /> {t.about.kicker}</FadeUp>
      <p className="about-text" ref={ref}>
        {words.map((w, i) => (
          <Word key={`${t.about.text.length}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>

      <div className="about-grid">
        <div className="about-left">
        <ul className="about-bullets">
          {t.about.bullets.map((b, i) => (
            <FadeUp as="li" key={b} delay={i * 0.08}>
              <span className="mono">0{i + 1}</span> {b}
            </FadeUp>
          ))}
        </ul>
        <FadeUp className="abroad">
          <span className="abroad-title mono">✈ {t.about.abroadTitle}</span>
          <div className="abroad-list">
            {t.about.abroad.map((a) => (
              <div className="abroad-item" key={a.code}>
                <span className="abroad-code">{a.code}</span>
                <span className="abroad-c">{a.c}</span>
                <span className="mono">{a.y}</span>
              </div>
            ))}
          </div>
        </FadeUp>
        </div>
        <div className="stats">
          {t.about.stats.map((s, i) => (
            <FadeUp className="stat" key={s.l} delay={i * 0.08}>
              <div className="stat-n">
                <Counter n={s.n} s={s.s} />
              </div>
              <div className="stat-l">{s.l}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
