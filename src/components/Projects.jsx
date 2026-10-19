import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { categories, projects } from '../data/projects.js'
import { lenis } from '../hooks/useLenis.js'
import ProjectArt, { resolveImg } from './ProjectArt.jsx'
import Magnetic from './Magnetic.jsx'
import { FadeUp, SplitReveal, ease, easeOut } from './Reveal.jsx'

const GH = 'https://github.com/khakimovallamurod/'
const pad = (n) => String(n).padStart(2, '0')

function Tilt({ children, className }) {
  const ref = useRef()
  const rx = useSpring(0, { stiffness: 150, damping: 18 })
  const ry = useSpring(0, { stiffness: 150, damping: 18 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={move}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function Links({ p, t }) {
  return (
    <div className="p-links">
      <a className="btn btn-solid btn-sm" href={GH + p.repo} target="_blank" rel="noreferrer" data-cursor="GitHub">
        <span className="roll" data-text={t.work.code}><span>{t.work.code}</span></span>
        <span className="btn-arrow">↗</span>
      </a>
      {p.url && (
        <a className="btn btn-ghost btn-sm" href={p.url} target="_blank" rel="noreferrer">
          <span className="roll" data-text={t.work.site}><span>{t.work.site}</span></span>
        </a>
      )}
    </div>
  )
}

function FeaturedCard({ p, i, total, progress }) {
  const { t, lang } = useLang()
  // Earlier cards shrink and dim as later ones stack on top of them.
  const start = i / total
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.05])
  const dim = useTransform(progress, [start, 1], [0, (total - 1 - i) * 0.25])
  return (
    <div className="feat-wrap" style={{ top: `calc(12vh + ${i * 26}px)` }}>
      <motion.article className="feat" style={{ scale }}>
        <div className="feat-info">
          <div className="feat-top">
            <span className="mono">{pad(i + 1)} / {pad(total)}</span>
            <span className="chip">{t.work.cats[p.category]}</span>
          </div>
          <h3 className="feat-title">{p.title}</h3>
          <p className="feat-desc">{p.desc[lang]}</p>
          <ul className="tags">
            {p.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <Links p={p} t={t} />
        </div>
        <Tilt className="feat-art">
          <ProjectArt project={p} />
          <span className="feat-year mono">{p.year}</span>
        </Tilt>
        <motion.div className="feat-dim" style={{ opacity: dim }} />
      </motion.article>
    </div>
  )
}

function Featured() {
  const { t } = useLang()
  const ref = useRef()
  const list = projects.filter((p) => p.featured)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <div className="featured" ref={ref}>
      <div className="sub-head">
        <span className="mono">↳ {t.work.featured}</span>
      </div>
      {list.map((p, i) => (
        <FeaturedCard key={p.id} p={p} i={i} total={list.length} progress={scrollYProgress} />
      ))}
    </div>
  )
}

function Modal({ p, onClose }) {
  const { t, lang } = useLang()
  useEffect(() => {
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  const n = projects.indexOf(p) + 1
  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        initial={{ y: 80, opacity: 0, rotateX: 12 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <div className="modal-art">
          <ProjectArt project={p} />
        </div>
        <div className="modal-body">
          <div className="feat-top">
            <span className="mono">{pad(n)} — {p.year}</span>
            <span className="chip">{t.work.cats[p.category]}</span>
          </div>
          <h3 className="feat-title">{p.title}</h3>
          <p className="feat-desc">{p.desc[lang]}</p>
          <ul className="tags">
            {p.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <Links p={p} t={t} />
        </div>
        <button className="modal-close" onClick={onClose} aria-label={t.work.close}>
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

function Index() {
  const { t, lang } = useLang()
  const [cat, setCat] = useState('all')
  const [hover, setHover] = useState(null)
  const [open, setOpen] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 20 })
  const sy = useSpring(y, { stiffness: 160, damping: 20 })
  const list = projects.filter((p) => cat === 'all' || p.category === cat)
  const count = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length)

  return (
    <div className="index" onPointerMove={(e) => { x.set(e.clientX); y.set(e.clientY) }}>
      <div className="sub-head">
        <span className="mono">↳ {t.work.index}</span>
      </div>
      <div className="filters" role="tablist">
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cat === c.id}
            className={`filter ${cat === c.id ? 'is-active' : ''}`}
            onClick={() => setCat(c.id)}
          >
            {cat === c.id && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ duration: 0.5, ease }} />}
            <span className="filter-txt">{t.work.cats[c.id]}</span>
            <sup>{count(c.id)}</sup>
          </button>
        ))}
      </div>

      <motion.ul className="rows" layout onPointerLeave={() => setHover(null)}>
        <AnimatePresence mode="popLayout">
          {list.map((p) => {
            const n = projects.indexOf(p) + 1
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="row"
                onPointerEnter={() => setHover(p)}
              >
                <button className="row-btn" onClick={() => setOpen(p)} data-cursor={t.work.open}>
                  <span className="row-num mono">{pad(n)}</span>
                  <div className="row-main">
                    {p.image && (
                      <span className="row-thumb">
                        <img src={resolveImg(p.image)} alt="" loading="lazy" />
                      </span>
                    )}
                    <span className="row-title">{p.title}</span>
                  </div>
                  <span className="row-desc">{p.desc[lang].split(/[.:]/)[0]}</span>
                  <span className="row-cat">{t.work.cats[p.category]}</span>
                  <span className="row-year mono">{p.year}</span>
                  <span className="row-arrow">→</span>
                </button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>

      <motion.div
        className="preview"
        style={{ x: sx, y: sy }}
        animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
        aria-hidden="true"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {hover && (
            <motion.div
              key={hover.id}
              className="preview-inner"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.5, ease }}
            >
              <ProjectArt project={hover} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{open && <Modal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  )
}

export default function Projects() {
  const { t } = useLang()
  return (
    <section className="section work" id="work">
      <div className="section-head">
        <FadeUp className="kicker"><span className="dot" /> {t.work.kicker} — ({projects.length})</FadeUp>
        <SplitReveal as="h2" className="h2" text={t.work.title} />
      </div>
      <Featured />
      <Index />
      <FadeUp className="work-more">
        <Magnetic>
          <a className="btn btn-ghost" href="https://github.com/khakimovallamurod?tab=repositories" target="_blank" rel="noreferrer">
            <span className="roll" data-text="GitHub — 130+ repos"><span>GitHub — 130+ repos</span></span>
            <span className="btn-arrow">↗</span>
          </a>
        </Magnetic>
      </FadeUp>
    </section>
  )
}
