import { Fragment } from 'react'
import { motion } from 'framer-motion'

export const ease = [0.7, 0, 0.2, 1]
export const easeOut = [0.16, 1, 0.3, 1]

// Splits text into words that slide up from a clipping mask.
export function SplitReveal({ text, as: Tag = 'span', className, delay = 0, stagger = 0.06, play }) {
  const words = text.split(' ')
  const animate = play === undefined ? undefined : play ? 'show' : 'hide'
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        style={{ display: 'inline' }}
        initial="hide"
        animate={animate}
        whileInView={play === undefined ? 'show' : undefined}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        aria-hidden="true"
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="mask">
              <motion.span
                className="mask-in"
                variants={{ hide: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0 } }}
                transition={{ duration: 1, ease: easeOut }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}

export function FadeUp({ children, delay = 0, y = 40, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1, ease: easeOut, delay }}
    >
      {children}
    </M>
  )
}
