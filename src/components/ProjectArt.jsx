import { useState } from 'react'

// Procedural, animated SVG covers for each project — solid colors only, themed via CSS variables.

function Frame({ children, tag }) {
  return (
    <svg className="art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect width="400" height="300" className="art-bg" />
      <g className="art-grid">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
        ))}
      </g>
      {children}
      {tag && (
        <g className="art-tag">
          <circle cx="22" cy="22" r="4" className="art-rec" />
          <text x="32" y="26">{tag}</text>
        </g>
      )}
    </svg>
  )
}

function Box({ x, y, w, h, label, delay = 0 }) {
  return (
    <g className="det" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={w} height={h} className="det-box" />
      <rect x={x - 1} y={y - 16} width={label.length * 6.4 + 10} height="16" className="det-label-bg" />
      <text x={x + 4} y={y - 4} className="det-label">{label}</text>
    </g>
  )
}

function Person({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="art-shape">
      <circle cx="0" cy="0" r="13" />
      <rect x="-20" y="18" width="40" height="62" rx="16" />
    </g>
  )
}

function Vision({ p }) {
  const [a, b, c] = p.labels || []
  return (
    <Frame tag="LIVE · CAM 01">
      <Person x={95} y={130} s={1.05} />
      <Person x={210} y={110} s={1.3} />
      <Person x={318} y={142} s={0.95} />
      <Box x={70} y={110} w={52} h={110} label={a} delay={0.2} />
      <Box x={178} y={84} w={64} h={140} label={b} delay={0.8} />
      <Box x={295} y={124} w={48} h={100} label={c} delay={1.4} />
      <rect className="scan" x="0" y="0" width="400" height="2" />
    </Frame>
  )
}

function Robot({ p }) {
  const [a, b, c] = p.labels || []
  return (
    <Frame tag="ESP32 · WS">
      <g className="radar">
        <circle cx="200" cy="160" r="60" />
        <circle cx="200" cy="160" r="100" />
        <circle cx="200" cy="160" r="140" />
      </g>
      <g className="art-shape">
        <rect x="160" y="120" width="80" height="64" rx="16" />
        <rect x="196" y="100" width="8" height="20" />
        <circle cx="200" cy="96" r="7" className="accent-fill" />
      </g>
      <circle cx="184" cy="150" r="7" className="eye-led" />
      <circle cx="216" cy="150" r="7" className="eye-led" />
      <Box x={40} y={190} w={70} h={70} label={a} delay={0.3} />
      <Box x={300} y={60} w={60} h={50} label={b} delay={1} />
      <text x="290" y="270" className="mono-txt">{c}</text>
    </Frame>
  )
}

function Water() {
  return (
    <Frame tag="WQI · SanPiN">
      <defs>
        <clipPath id="drop">
          <path d="M200 50 C200 50 130 140 130 185 a70 70 0 0 0 140 0 C270 140 200 50 200 50Z" />
        </clipPath>
      </defs>
      <path d="M200 50 C200 50 130 140 130 185 a70 70 0 0 0 140 0 C270 140 200 50 200 50Z" className="art-outline" />
      <g clipPath="url(#drop)">
        <path className="wave" d="M0 170 q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V300 H0Z" />
      </g>
      <text x="200" y="215" textAnchor="middle" className="big-num">87</text>
      <g className="bars-mini">
        {[30, 52, 40, 64, 24, 46].map((h, i) => (
          <rect key={i} x={300 + i * 14} y={250 - h} width="8" height={h} style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </g>
      <text x="40" y="262" className="mono-txt">pH 7.2 · TDS 312</text>
    </Frame>
  )
}

function Plate({ p }) {
  return (
    <Frame tag="ANPR · OCR">
      <g className="art-shape">
        <rect x="90" y="110" width="220" height="110" rx="26" />
        <rect x="120" y="70" width="160" height="60" rx="18" />
      </g>
      <circle cx="125" cy="150" r="14" className="eye-led" />
      <circle cx="275" cy="150" r="14" className="eye-led" />
      <rect x="150" y="180" width="100" height="26" rx="3" className="plate" />
      <text x="200" y="198" textAnchor="middle" className="plate-txt typing">{p.labels[0]}</text>
      <Box x={144} y={174} w={112} h={38} label="plate 0.97" delay={0.4} />
    </Frame>
  )
}

function Leaf() {
  return (
    <Frame tag="AGRO · SCAN">
      <path d="M110 230 C110 120 200 60 300 70 C300 170 230 240 110 230Z" className="leaf" />
      <path d="M110 230 L280 90 M160 190 L170 140 M200 160 L220 120 M160 190 L210 196 M200 160 L250 166" className="leaf-vein" />
      <circle cx="215" cy="140" r="9" className="spot" />
      <circle cx="180" cy="175" r="6" className="spot" />
      <circle cx="245" cy="118" r="5" className="spot" />
      <circle cx="210" cy="150" r="50" className="scan-ring" />
      <Box x={160} y={100} w={100} h={95} label="rust 0.89" delay={0.6} />
    </Frame>
  )
}

function Eye() {
  return (
    <Frame tag="OPTI · CARE">
      <circle cx="200" cy="150" r="90" className="pulse-ring" />
      <circle cx="200" cy="150" r="90" className="pulse-ring r2" />
      <path d="M80 150 Q200 50 320 150 Q200 250 80 150Z" className="art-shape" />
      <circle cx="200" cy="150" r="44" className="iris" />
      <circle cx="200" cy="150" r="20" className="pupil" />
      <circle cx="212" cy="138" r="7" className="glint" />
      <text x="40" y="270" className="mono-txt">redness: low · status: ok</text>
    </Frame>
  )
}

function Chart() {
  const bars = [80, 120, 95, 150, 130, 180, 165, 210]
  return (
    <Frame tag="FORECAST">
      <g className="bars">
        {bars.map((h, i) => (
          <rect key={i} x={50 + i * 40} y={260 - h} width="22" height={h} style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </g>
      <polyline className="line-draw" points="61,170 101,150 141,160 181,110 221,120 261,80 301,90 341,50" />
      {[[181, 110], [261, 80], [341, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="accent-fill" />
      ))}
      <text x="250" y="40" className="mono-txt">R² 0.94 · MAE 1.2</text>
    </Frame>
  )
}

function Web() {
  return (
    <Frame tag="SAAS · PANEL">
      <g className="browser">
        <rect x="50" y="40" width="300" height="220" rx="10" className="art-shape" />
        <rect x="50" y="40" width="300" height="26" rx="10" className="browser-bar" />
        <circle cx="66" cy="53" r="4" className="accent-fill" />
        <circle cx="80" cy="53" r="4" className="dim-fill" />
        <circle cx="94" cy="53" r="4" className="dim-fill" />
        <rect x="64" y="80" width="70" height="166" rx="6" className="block" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={146 + i * 66} y="80" width="58" height="50" rx="6" className="block shimmer" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
        <rect x="146" y="142" width="190" height="104" rx="6" className="block" />
        <polyline className="line-draw" points="156,226 186,206 216,214 246,184 276,192 306,164 326,170" />
      </g>
    </Frame>
  )
}

function MapArt() {
  const pins = [[90, 120], [150, 170], [205, 130], [260, 185], [310, 110]]
  return (
    <Frame tag="UZ · TOUR">
      <g className="dots">
        {Array.from({ length: 18 }, (_, x) =>
          Array.from({ length: 11 }, (_, y) => {
            const dx = x * 20 + 30, dy = y * 22 + 40
            const inside = Math.hypot((dx - 200) / 170, (dy - 150) / 95) < 1
            return inside ? <circle key={`${x}-${y}`} cx={dx} cy={dy} r="2.2" /> : null
          }),
        )}
      </g>
      <polyline className="route" points={pins.map((p) => p.join(',')).join(' ')} />
      {pins.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" className="pin-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          <circle cx={x} cy={y} r="6" className="accent-fill" />
        </g>
      ))}
    </Frame>
  )
}

function Chat({ p }) {
  const msgs = p.chat || []
  return (
    <Frame tag="TELEGRAM · BOT">
      <rect x="120" y="30" width="160" height="250" rx="22" className="art-shape" />
      {msgs.map((m, i) => {
        const mine = i % 2 === 1
        const w = Math.min(m.length * 6.6 + 20, 140)
        const x = mine ? 268 - w : 132
        return (
          <g key={i} className="bubble" style={{ animationDelay: `${0.3 + i * 0.7}s` }}>
            <rect x={x} y={70 + i * 52} width={w} height="34" rx="12" className={mine ? 'accent-fill' : 'block'} />
            <text x={x + 10} y={92 + i * 52} className={mine ? 'bubble-txt on-accent' : 'bubble-txt'}>{m}</text>
          </g>
        )
      })}
      <g className="typing-dots">
        <circle cx="146" cy="244" r="4" />
        <circle cx="160" cy="244" r="4" />
        <circle cx="174" cy="244" r="4" />
      </g>
    </Frame>
  )
}

export function resolveImg(src) {
  if (!src) return ''
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  const base = import.meta.env.BASE_URL || './'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const cleanSrc = src.replace(/^\.?\/+/, '')
  return `${cleanBase}${cleanSrc}`
}

const arts = { vision: Vision, robot: Robot, water: Water, plate: Plate, leaf: Leaf, eye: Eye, chart: Chart, web: Web, map: MapArt, chat: Chat }

export default function ProjectArt({ project }) {
  const [imgError, setImgError] = useState(false)
  const A = arts[project.art] || Web

  if (project.image && !imgError) {
    const src = resolveImg(project.image)
    return (
      <div className="art-img-wrap">
        <img
          src={src}
          alt={project.title}
          className="art-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="art-overlay" />
        {project.category === 'vision' && <div className="art-scan" />}
        <div className="art-badge-tag mono">
          <span className="art-rec-dot" /> {project.category.toUpperCase()} · AI
        </div>
      </div>
    )
  }

  return <A p={project} />
}
