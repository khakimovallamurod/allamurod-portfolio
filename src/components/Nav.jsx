import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { useTheme } from '../theme.jsx'
import { scrollTo } from '../hooks/useLenis.js'
import { ease } from './Reveal.jsx'

const links = ['about', 'stack', 'work', 'journey', 'contact']

function ThemeIcon({ theme }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      animate={{ rotate: theme === 'dark' ? 0 : 180 }}
      transition={{ duration: 0.7, ease }}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </motion.svg>
  )
}

export default function Nav({ show }) {
  const { t, lang, setLang } = useLang()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 300 && !open)
      setScrolled(y > 40)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  const go = (id) => {
    setOpen(false)
    scrollTo(`#${id}`)
  }

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: show && !hidden ? 0 : -100 }}
        transition={{ duration: 0.8, ease }}
      >
        <button className="nav-logo" onClick={() => go('top')} data-cursor="">
          <span className="nav-logo-mark">AK</span>
          <span className="nav-logo-text">Allamurod<br />Khakimov</span>
        </button>

        <nav className="nav-links" aria-label="Main">
          {links.map((id, i) => (
            <button key={id} onClick={() => go(id)} className="nav-link">
              <span className="nav-num">0{i + 1}</span>
              <span className="roll" data-text={t.nav[id]}><span>{t.nav[id]}</span></span>
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            {['uz', 'en'].map((l) => (
              <button key={l} className={lang === l ? 'is-active' : ''} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={toggle} aria-label="Toggle theme" data-cursor="">
            <ThemeIcon theme={theme} />
          </button>
          <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease }}
          >
            {links.map((id, i) => (
              <motion.button
                key={id}
                className="menu-link"
                onClick={() => go(id)}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease }}
              >
                <span>0{i + 1}</span>
                {t.nav[id]}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
