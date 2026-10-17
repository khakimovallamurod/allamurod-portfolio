import { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { FadeUp, SplitReveal } from './Reveal.jsx'

const icons = [
  // eye / detection
  <svg viewBox="0 0 48 48" key="cv"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z" /><circle cx="24" cy="24" r="6" /><path d="M4 8V4h4M40 4h4v4M44 40v4h-4M8 44H4v-4" /></svg>,
  // neural
  <svg viewBox="0 0 48 48" key="llm"><circle cx="10" cy="12" r="4" /><circle cx="10" cy="36" r="4" /><circle cx="38" cy="24" r="4" /><circle cx="24" cy="24" r="4" /><path d="M14 13l6 9M14 35l6-9M28 24h6" /></svg>,
  // server
  <svg viewBox="0 0 48 48" key="be"><rect x="6" y="8" width="36" height="12" rx="3" /><rect x="6" y="28" width="36" height="12" rx="3" /><path d="M12 14h2M12 34h2M22 14h14M22 34h14" /></svg>,
  // container
  <svg viewBox="0 0 48 48" key="ops"><path d="M24 4l18 10v20L24 44 6 34V14z" /><path d="M6 14l18 10 18-10M24 24v20" /></svg>,
]

function Card({ g, i }) {
  const ref = useRef()
  const rx = useSpring(0, { stiffness: 140, damping: 16 })
  const ry = useSpring(0, { stiffness: 140, damping: 16 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 14)
    rx.set(-(py - 0.5) * 14)
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  return (
    <FadeUp delay={i * 0.1} className="stack-cell">
      <motion.article
        ref={ref}
        className="stack-card"
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onPointerMove={move}
        onPointerLeave={() => { rx.set(0); ry.set(0) }}
      >
        <div className="stack-top">
          <span className="mono">0{i + 1}</span>
          <span className="stack-icon">{icons[i]}</span>
        </div>
        <h3>{g.t}</h3>
        <p>{g.d}</p>
        <ul>
          {g.items.map((it) => <li key={it}>{it}</li>)}
        </ul>
        <span className="stack-spot" aria-hidden="true" />
      </motion.article>
    </FadeUp>
  )
}

export default function Stack() {
  const { t } = useLang()
  return (
    <section className="section stack" id="stack">
      <div className="section-head">
        <FadeUp className="kicker"><span className="dot" /> {t.stack.kicker}</FadeUp>
        <SplitReveal as="h2" className="h2" text={t.stack.title} />
      </div>
      <div className="stack-grid">
        {t.stack.groups.map((g, i) => <Card key={g.t} g={g} i={i} />)}
      </div>
    </section>
  )
}
