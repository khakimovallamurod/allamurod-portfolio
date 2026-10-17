import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { FadeUp, SplitReveal } from './Reveal.jsx'

export default function Journey() {
  const { t } = useLang()
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  return (
    <section className="section journey" id="journey">
      <div className="section-head">
        <FadeUp className="kicker"><span className="dot" /> {t.journey.kicker}</FadeUp>
        <SplitReveal as="h2" className="h2" text={t.journey.title} />
      </div>
      <div className="timeline" ref={ref}>
        <div className="tl-track"><motion.div className="tl-fill" style={{ scaleY }} /></div>
        {t.journey.items.map((it, i) => (
          <FadeUp className="tl-item" key={it.y + it.t} delay={0.05}>
            <span className="tl-node" />
            <span className="tl-year">{it.y}</span>
            <div className="tl-body">
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
            <span className="tl-idx mono">0{i + 1}</span>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
