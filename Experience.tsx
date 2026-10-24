'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ConsultancyOverview from '@/components/ConsultancyOverview'
import { ChinaGateway, CompanySetupServices, WhyChooseUs, WhyQatar } from '@/components/StrategicSections'
import TradeJourney from '@/components/TradeJourney'
import CorporateSetup from '@/components/CorporateSetup'
import Insights from '@/components/Insights'
import Closing from '@/components/Closing'
import { dict, type Lang } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const safeGet = (key: string) => {
  try { return localStorage.getItem(key) } catch { return null }
}
const safeSet = (key: string, value: string) => {
  try { localStorage.setItem(key, value) } catch { /* storage is an enhancement, never a blocker */ }
}

export default function Experience() {
  const [lang, setLang] = useState<Lang>('en')
  const [theme, setTheme] = useState('dark')
  const [preferencesReady, setPreferencesReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = safeGet('spx-lang')
    if (savedLang === 'ar' || savedLang === 'zh' || savedLang === 'en') setLang(savedLang)
    const savedTheme = safeGet('spx-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    setPreferencesReady(true)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang
    document.documentElement.dir = dict[lang].dir
    if (preferencesReady) safeSet('spx-lang', lang)
  }, [lang, preferencesReady])

  useEffect(() => {
    if (!preferencesReady) return
    document.documentElement.dataset.theme = theme
    safeSet('spx-theme', theme)
  }, [theme, preferencesReady])

  /*
   * Smooth gives the page its physical, cinematic glide. It drives the native
   * scrollbar, so the pinned hero, CSS sticky scenes and ScrollTrigger stay
   * perfectly in sync from the first frame — there is no preloader gate.
   */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.18,
      easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      touchMultiplier: 1.05,
    })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const element = document.querySelector(hash)
      if (!element) return
      event.preventDefault()
      lenis.scrollTo(element as HTMLElement, { offset: -96, duration: 1.35 })
      window.history.pushState(null, '', hash)
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!rootRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isRtl = dict[lang].dir === 'rtl'

    const tiltCleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.reveal, [data-reveal], [data-progress-line], [data-meter-fill]', { clearProps: 'all', opacity: 1 })
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
          element.textContent = element.dataset.count ?? element.textContent
        })
        return
      }

      gsap.utils.toArray<HTMLElement>('.reveal, [data-reveal]').forEach((element) => {
        const siblings = element.parentElement
          ? Array.from(element.parentElement.querySelectorAll<HTMLElement>(':scope > .reveal, :scope > [data-reveal]'))
          : []
        const stagger = Math.min(Math.max(siblings.indexOf(element), 0) * 0.055, 0.22)
        gsap.fromTo(element, { y: 46, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        const trigger = element.closest<HTMLElement>('[data-parallax-wrap]')?.parentElement ?? element.parentElement ?? element
        gsap.fromTo(element, { yPercent: -5 }, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((element) => {
        gsap.fromTo(element, { y: 28 }, {
          y: -28,
          ease: 'none',
          scrollTrigger: { trigger: element.parentElement ?? element, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-orbit]').forEach((element) => {
        gsap.to(element, { rotation: 360, duration: 56, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })
      })

      gsap.utils.toArray<HTMLElement>('[data-progress-line], [data-meter-fill]').forEach((element) => {
        gsap.fromTo(element, { scaleX: element.hasAttribute('data-meter-fill') ? 0.16 : 0, transformOrigin: isRtl ? 'right center' : 'left center' }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top 94%', end: 'top 58%', scrub: true },
        })
      })

      /* Live data counters — DOM text tweened by GSAP once in view, never React state. */
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
        const end = Number(element.dataset.count ?? 0)
        if (!Number.isFinite(end)) return
        const counter = { value: 0 }
        gsap.to(counter, {
          value: end,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          onUpdate: () => { element.textContent = String(Math.round(counter.value)) },
          onComplete: () => { element.textContent = String(end) },
        })
      })

      /* Pointer-tracked 3D tilt on glass surfaces — fine pointers only, transform-only. */
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        gsap.utils.toArray<HTMLElement>('.glass-ribbon:not(form):not([data-board-control-ribbon]), .glass-ribbon-dark:not(form), .platform-ribbon').forEach((element) => {
          element.dataset.tiltReady = 'true'
          gsap.set(element, { transformPerspective: 900 })
          const onMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return
            const px = (event.clientX - rect.left) / rect.width - 0.5
            const py = (event.clientY - rect.top) / rect.height - 0.5
            gsap.to(element, { rotationY: px * 3.2, rotationX: py * -3.2, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
          }
          const onLeave = () => gsap.to(element, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
          element.addEventListener('pointermove', onMove)
          element.addEventListener('pointerleave', onLeave)
          tiltCleanups.push(() => {
            element.removeEventListener('pointermove', onMove)
            element.removeEventListener('pointerleave', onLeave)
          })
        })

        /* Pointer-reactive sheen for editorial service modules. CSS owns the
           pixels; this only updates two custom properties on the active node. */
        gsap.utils.toArray<HTMLElement>('.swiss-node').forEach((element) => {
          element.dataset.pointerReactive = 'true'
          const onMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return
            element.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`)
            element.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`)
          }
          const onLeave = () => {
            element.style.setProperty('--pointer-x', '12%')
            element.style.setProperty('--pointer-y', '0%')
          }
          element.addEventListener('pointermove', onMove)
          element.addEventListener('pointerleave', onLeave)
          tiltCleanups.push(() => {
            element.removeEventListener('pointermove', onMove)
            element.removeEventListener('pointerleave', onLeave)
          })
        })
      }
    }, rootRef)

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 280)
    document.fonts?.ready?.then(() => ScrollTrigger.refresh()).catch(() => undefined)

    return () => {
      window.clearTimeout(refresh)
      tiltCleanups.forEach((cleanup) => cleanup())
      ctx.revert()
    }
  }, [lang])

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => window.clearTimeout(id)
  }, [theme])

  return (
    <div ref={rootRef} style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100svh' }}>
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <ConsultancyOverview lang={lang} />
        <WhyChooseUs lang={lang} />
        <ChinaGateway lang={lang} />
        <TradeJourney lang={lang} />
        <WhyQatar lang={lang} />
        <CompanySetupServices lang={lang} />
        <CorporateSetup lang={lang} />
        <Insights lang={lang} />
        <Closing lang={lang} theme={theme} setTheme={setTheme} />
      </main>
    </div>
  )
}
