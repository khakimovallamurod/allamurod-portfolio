import { useCallback, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useLenis } from './hooks/useLenis.js'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Stack from './components/Stack.jsx'
import Projects from './components/Projects.jsx'
import Journey from './components/Journey.jsx'
import Contact, { Footer } from './components/Contact.jsx'

const tech = ['Python', 'FastAPI', 'Django', 'YOLOv11', 'OpenCV', 'PyTorch', 'Ollama', 'Qdrant', 'RAG', 'PostgreSQL', 'Docker', 'Nginx', 'Linux']
const words = ['Computer Vision', 'AI Agents', 'LLM Apps', 'Backend APIs', 'Automation', 'Smart Cities']

export default function App() {
  const [ready, setReady] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const start = useCallback(() => setReady(true), [])
  const finish = useCallback(() => setLoaderGone(true), [])
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  useLenis(ready)

  return (
    <>
      {!loaderGone && <Preloader onStart={start} onFinish={finish} />}
      <Cursor />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Nav show={ready} />
      <main>
        <Hero started={ready} />
        <Marquee items={tech} />
        <About />
        <Stack />
        <Marquee items={words} reverse base={2.2} />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
