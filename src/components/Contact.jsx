import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { scrollTo } from '../hooks/useLenis.js'
import Magnetic from './Magnetic.jsx'
import { FadeUp, SplitReveal } from './Reveal.jsx'

const EMAIL = 'xakimov2806@gmail.com'

const socials = [
  { l: 'Telegram', h: '@allamurod_2806', u: 'https://t.me/allamurod_2806' },
  { l: 'GitHub', h: 'khakimovallamurod', u: 'https://github.com/khakimovallamurod' },
  { l: 'Email', h: EMAIL, u: `mailto:${EMAIL}` },
]

export default function Contact() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }
  return (
    <section className="section contact" id="contact">
      <FadeUp className="kicker"><span className="dot" /> {t.contact.kicker}</FadeUp>
      <h2 className="contact-title">
        <SplitReveal text={t.contact.title[0]} className="line" />
        <SplitReveal text={t.contact.title[1]} className="line line-accent" delay={0.12} />
      </h2>
      <div className="contact-grid">
        <FadeUp className="contact-left">
          <p>{t.contact.text}</p>
          <Magnetic strength={0.25}>
            <a className="contact-circle" href={`mailto:${EMAIL}`} data-cursor="">
              <span>{t.contact.email}</span>
              <span className="btn-arrow">↗</span>
            </a>
          </Magnetic>
        </FadeUp>
        <ul className="socials">
          {socials.map((s, i) => (
            <FadeUp as="li" key={s.l} delay={i * 0.08}>
              <a href={s.u} target="_blank" rel="noreferrer">
                <span className="mono">0{i + 1}</span>
                <span className="soc-l">{s.l}</span>
                <span className="soc-h">{s.h}</span>
                <span className="soc-arrow">↗</span>
              </a>
            </FadeUp>
          ))}
          <FadeUp as="li" delay={0.3}>
            <button className="copy" onClick={copy}>
              {copied ? '✓ Copied' : 'Copy email'}
            </button>
          </FadeUp>
        </ul>
      </div>
      <FadeUp className="motto">{t.contact.motto}</FadeUp>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="footer-big" aria-hidden="true">ALLAMUROD</div>
      <div className="footer-row">
        <span>© {new Date().getFullYear()} Allamurod Khakimov. {t.footer.rights}</span>
        <span className="mono">AI Engineer · Backend · CV</span>
        <button onClick={() => scrollTo('#top')} className="to-top">{t.footer.top} ↑</button>
      </div>
    </footer>
  )
}
