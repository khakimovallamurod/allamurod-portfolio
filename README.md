# Allamurod Khakimov — Portfolio

AI Engineer · Backend Developer · Computer Vision — shaxsiy portfolio sayti.

## Imkoniyatlar

- **3D bosh sahifa** — React Three Fiber: portret kartasi, shisha (transmission) torus, xrom halqalar, sichqoncha va scroll'ga javob beruvchi realistik studiya yorug'ligi (HDRI yuklamasdan)
- **Custom cursor** — kursor halqasi, hover holatlari, "Ochish" kabi yozuvli kursor, magnit tugmalar
- **Dark / Light mode** — View Transitions API bilan doira shaklida almashish, tanlov saqlanadi
- **UZ / EN** tillar
- **15 ta loyiha** GitHub'dan, turli yo'nalishlarda (Computer Vision, AI mahsulotlar, Veb platformalar, Botlar, Data & Analitika) — har biri uchun animatsiyali SVG muqova
- Preloader, smooth scroll (Lenis), so'zma-so'z matn animatsiyalari, scroll tezligiga bog'liq marquee, sticky stacking kartalar, filtr, modal, timeline
- Gradient ishlatilmagan — faqat tekis ranglar
- To'liq responsiv, `prefers-reduced-motion` va WebGL'siz brauzerlar uchun zaxira

## Texnologiyalar

React 19 · Vite · Three.js · @react-three/fiber · @react-three/drei · Framer Motion · Lenis

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ papkaga
```

## Ma'lumotlarni tahrirlash

- Loyihalar: `src/data/projects.js`
- Matnlar (UZ/EN): `src/i18n.jsx`
- Rasm: `public/img/allamurod.jpg`

## Deploy

`main` branch'ga push qilinganda `.github/workflows/deploy.yml` saytni build qilib `gh-pages` branch'ga joylaydi.
Repository → Settings → Pages → Source: **Deploy from a branch**, Branch: **gh-pages**.
