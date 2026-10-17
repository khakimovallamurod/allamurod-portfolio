import { createContext, useContext, useEffect, useState } from 'react'

const dict = {
  uz: {
    nav: { about: 'Men haqimda', work: 'Loyihalar', stack: "Yo'nalishlar", journey: "Yo'l", contact: 'Aloqa' },
    hero: {
      role: 'AI Engineer · Backend Developer',
      lead: "Computer Vision, LLM va backend tizimlar orqali real muammolarni yechadigan aqlli dasturlar yarataman.",
      cta: "Loyihalarni ko'rish",
      cta2: 'Bog‘lanish',
      based: "Samarqand, O'zbekiston",
      available: 'Yangi loyihalar uchun ochiq',
      scroll: 'Pastga aylantiring',
    },
    about: {
      kicker: 'Men haqimda',
      text: "Men Allamurod — AI Engineer va Backend dasturchiman, Samarqand davlat universitetining Dasturiy injiniring yo'nalishi bitiruvchi kurs talabasiman. Computer Vision, LLM va backend texnologiyalari asosida real mijozlar uchun juda ko'plab loyihalarni amalga oshirganman. 2025-yilda Malayziya va Xitoyda bo'lib, xalqaro tajriba orttirdim.",
      stats: [
        { n: 100, s: '+', l: 'Amalga oshirilgan loyiha' },
        { n: 130, s: '+', l: 'GitHub repozitoriya' },
        { n: 3, s: '', l: 'Hakaton loyihalari' },
        { n: 2, s: '', l: 'Xorijiy davlat tajribasi' },
      ],
      abroadTitle: 'Xalqaro tajriba',
      abroad: [
        { code: 'MY', c: 'Malayziya', y: '2025' },
        { code: 'CN', c: 'Xitoy', y: '2025' },
      ],
      bullets: [
        "YOLO asosidagi computer vision ilovalarida tajriba",
        'AI agentlar, RAG tizimlar va avtomatlashtirish',
        "Jamoat xavfsizligi, aqlli shahar va raqamli transformatsiya uchun AI",
      ],
    },
    stack: {
      kicker: "Yo'nalishlar",
      title: 'Nimalar bilan ishlayman',
      groups: [
        { t: 'Computer Vision', d: "Detektsiya, tracking, OCR va real-time video tahlil.", items: ['YOLOv11', 'OpenCV', 'PyTorch', 'ONNX', 'OCR'] },
        { t: 'LLM & RAG', d: "Lokal LLM, bilim bazasi va o'zbek tilini qo'llovchi AI yordamchilar.", items: ['Ollama', 'Qwen', 'Qdrant', 'Hugging Face', 'Gemini'] },
        { t: 'Backend', d: 'Tez, xavfsiz va masshtablanadigan API va tizimlar.', items: ['FastAPI', 'Django', 'Flask', 'SQLAlchemy', 'JWT'] },
        { t: 'DevOps & Data', d: "Productionga chiqarish, serverlar va ma'lumotlar bazalari.", items: ['Docker', 'Nginx', 'Linux', 'PostgreSQL', 'MySQL'] },
      ],
    },
    work: {
      kicker: 'Tanlangan ishlar',
      title: 'Loyihalar',
      featured: 'Asosiy loyihalar',
      index: "Barcha loyihalar",
      open: 'Ochish',
      code: 'Kodni ochish',
      site: 'Saytga o‘tish',
      close: 'Yopish',
      cats: { all: 'Barchasi', vision: 'Computer Vision', ai: 'AI mahsulotlar', web: 'Veb platformalar', bots: 'Botlar', data: 'Data & Analitika' },
    },
    journey: {
      kicker: "Yo'l",
      title: 'Qisqacha tarix',
      items: [
        { y: '2023', t: 'Backend asoslari', d: "Python, Django, DRF va Flask bilan birinchi veb ilovalar va Telegram botlar." },
        { y: '2024', t: 'Computer Vision', d: "OpenCV, YOLO, yuz tanish, avtomobil va rentgen tasvirlarini klassifikatsiya qilish." },
        { y: '2025', t: 'AI Hackathon Samarqand', d: "SafeVision va bolalar xavfsizligi roboti — YOLO + ESP32 + Telegram." },
        { y: '2025', t: 'Malayziya va Xitoy', d: "Xorijga safarlar: xalqaro tajriba, yangi texnologiyalar va hamkorlik aloqalari." },
        { y: '2026', t: 'AI mahsulotlar', d: "WaterAI, AgroDoktor, OptiCare, MMFI Hackatom 2026 va SaaS platformalar." },
      ],
    },
    contact: {
      kicker: 'Aloqa',
      title: ["Keling, aqlli", 'narsa quramiz.'],
      text: "Loyiha, hamkorlik yoki shunchaki g'oya bormi? Yozing — 24 soat ichida javob beraman.",
      email: 'Email yozish',
      motto: '“Real muammolarni yechadigan aqlli tizimlar yaratish.”',
    },
    footer: { local: 'Samarqand vaqti', rights: 'Barcha huquqlar himoyalangan.', top: 'Tepaga' },
    loading: 'Yuklanmoqda',
  },
  en: {
    nav: { about: 'About', work: 'Work', stack: 'Expertise', journey: 'Journey', contact: 'Contact' },
    hero: {
      role: 'AI Engineer · Backend Developer',
      lead: 'I build intelligent software that solves real-world problems with computer vision, LLMs and solid backend systems.',
      cta: 'View projects',
      cta2: 'Get in touch',
      based: 'Samarkand, Uzbekistan',
      available: 'Open to new projects',
      scroll: 'Scroll down',
    },
    about: {
      kicker: 'About me',
      text: "I'm Allamurod — an AI Engineer and Backend Developer, and a final-year Software Engineering student at Samarkand State University. I have delivered a large number of real-world projects for clients using computer vision, LLMs and backend technologies. In 2025 I travelled to Malaysia and China and gained international experience.",
      stats: [
        { n: 100, s: '+', l: 'Projects delivered' },
        { n: 130, s: '+', l: 'GitHub repositories' },
        { n: 3, s: '', l: 'Hackathon builds' },
        { n: 2, s: '', l: 'Countries abroad' },
      ],
      abroadTitle: 'International experience',
      abroad: [
        { code: 'MY', c: 'Malaysia', y: '2025' },
        { code: 'CN', c: 'China', y: '2025' },
      ],
      bullets: [
        'Experienced in YOLO-based computer vision applications',
        'Building AI agents, RAG systems and automation',
        'AI for public safety, smart cities and digital transformation',
      ],
    },
    stack: {
      kicker: 'Expertise',
      title: 'What I work with',
      groups: [
        { t: 'Computer Vision', d: 'Detection, tracking, OCR and real-time video analytics.', items: ['YOLOv11', 'OpenCV', 'PyTorch', 'ONNX', 'OCR'] },
        { t: 'LLM & RAG', d: 'Local LLMs, knowledge retrieval and Uzbek-language AI assistants.', items: ['Ollama', 'Qwen', 'Qdrant', 'Hugging Face', 'Gemini'] },
        { t: 'Backend', d: 'Fast, secure and scalable APIs and systems.', items: ['FastAPI', 'Django', 'Flask', 'SQLAlchemy', 'JWT'] },
        { t: 'DevOps & Data', d: 'Shipping to production, servers and databases.', items: ['Docker', 'Nginx', 'Linux', 'PostgreSQL', 'MySQL'] },
      ],
    },
    work: {
      kicker: 'Selected work',
      title: 'Projects',
      featured: 'Featured',
      index: 'All projects',
      open: 'View',
      code: 'View code',
      site: 'Visit site',
      close: 'Close',
      cats: { all: 'All', vision: 'Computer Vision', ai: 'AI Products', web: 'Web Platforms', bots: 'Bots', data: 'Data & Analytics' },
    },
    journey: {
      kicker: 'Journey',
      title: 'A short history',
      items: [
        { y: '2023', t: 'Backend foundations', d: 'First web apps and Telegram bots with Python, Django, DRF and Flask.' },
        { y: '2024', t: 'Computer Vision', d: 'OpenCV, YOLO, face recognition, car and X-ray image classification.' },
        { y: '2025', t: 'AI Hackathon Samarkand', d: 'SafeVision and a child-safety robot — YOLO + ESP32 + Telegram.' },
        { y: '2025', t: 'Malaysia & China', d: 'Trips abroad: international experience, new technologies and partnerships.' },
        { y: '2026', t: 'AI products', d: 'WaterAI, AgroDoktor, OptiCare, MMFI Hackatom 2026 and SaaS platforms.' },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: ["Let's build", 'something smart.'],
      text: 'Have a project, a collaboration or just an idea? Write to me — I reply within 24 hours.',
      email: 'Send an email',
      motto: '“Building intelligent systems that solve real-world problems.”',
    },
    footer: { local: 'Samarkand time', rights: 'All rights reserved.', top: 'Back to top' },
    loading: 'Loading',
  },
}

const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'uz'
    } catch {
      return 'uz'
    }
  })
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])
  return <LangCtx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
