import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FlightPreloader from './components/three/FlightPreloader'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Trade from './sections/Trade'
import Corporate from './sections/Corporate'
import Closing from './sections/Closing'
import { dict, type Lang } from './i18n'

gsap.registerPlugin(ScrollTrigger)

// localStorage can throw inside sandboxed file previews (no allow-same-origin),
// so every access is guarded — the app must never crash before first paint.
const safeGet = (key: string) => { try { return localStorage.getItem(key) } catch { return null } }
const safeSet = (key: string, value: string) => { try { localStorage.setItem(key, value) } catch { /* non-fatal */ } }
const initialLang = (): Lang => { const v = safeGet('spx-lang'); return v === 'ar' || v === 'zh' ? v : 'en' }

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [theme, setTheme] = useState(() => safeGet('spx-theme') || 'dark')
  const [entered, setEntered] = useState(false)
  const [flightKey, setFlightKey] = useState(0)

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang
    document.documentElement.dir = dict[lang].dir
    safeSet('spx-lang', lang)
  }, [lang])
  useEffect(() => { const id = window.setTimeout(() => ScrollTrigger.refresh(), 350); return () => window.clearTimeout(id) }, [lang, theme])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeSet('spx-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.classList.toggle('locked', !entered)
    if (!entered) window.scrollTo(0, 0)
  }, [entered])

  useEffect(() => {
    if (!entered) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-in', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: 0.1, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el, { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 87%' } })
      })
    })
    const safety = window.setTimeout(() => gsap.set('.reveal', { clearProps: 'opacity' }), 6000)
    return () => { window.clearTimeout(safety); ctx.revert() }
  }, [entered])

  const replay = () => { setEntered(false); setFlightKey((k) => k + 1) }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100svh' }}>
      {!entered && <FlightPreloader key={flightKey} lang={lang} onDone={() => setEntered(true)} />}
      <Nav lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onReplay={replay} />
      <main>
        <Hero lang={lang} />
        <Trade lang={lang} />
        <Corporate lang={lang} />
        <Closing lang={lang} onReplay={replay} />
      </main>
    </div>
  )
}
