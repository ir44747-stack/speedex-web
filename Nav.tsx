'use client'

import { useEffect, useState } from 'react'
import { dict, type Lang } from '@/lib/i18n'
import SpeedexMark from '@/components/SpeedexMark'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'ar', label: 'عربي' },
  { id: 'zh', label: '中文' },
]

function Emblem3D() {
  return (
    <span className="emblem-3d relative block h-11 w-[35px] shrink-0 sm:h-12 sm:w-[38px]" data-emblem-3d>
      <span aria-hidden="true" className="absolute inset-0 translate-x-[3px] translate-y-[3px] opacity-70" style={{ color: '#260914' }}>
        <SpeedexMark className="h-full w-full" />
      </span>
      <span aria-hidden="true" className="absolute inset-0 translate-x-[1.5px] translate-y-[1.5px] opacity-90" style={{ color: '#6B1D2F' }}>
        <SpeedexMark className="h-full w-full" />
      </span>
      <span className="absolute inset-0" style={{ color: 'var(--mark)', filter: 'drop-shadow(0 6px 10px rgba(107,29,47,.34))' }}>
        <SpeedexMark className="h-full w-full" />
      </span>
      <span aria-hidden="true" className="absolute inset-0 -translate-x-[0.5px] -translate-y-[0.5px] opacity-25 mix-blend-screen" style={{ color: '#fff4d6' }}>
        <SpeedexMark className="h-full w-full" />
      </span>
    </span>
  )
}

export default function Nav({ lang, setLang }: {
  lang: Lang
  setLang: (lang: Lang) => void
}) {
  const t = dict[lang]
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#trade', label: t.nav_trade },
    { href: '#planner', label: t.nav_calc },
    { href: '#setup', label: t.nav_setup },
    { href: '#china-gateway', label: t.nav_china },
    { href: '#why-qatar', label: t.nav_qatar },
    { href: '#insights', label: t.nav_insights },
  ]
  const close = () => setOpen(false)

  return (
    <header className="floating-nav pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4" data-clean-header>
      <div
        className={`glass-header floating-nav-pill pointer-events-auto mx-auto grid h-16 w-full max-w-[104rem] grid-cols-[minmax(0,auto)_1fr_auto] items-center gap-3 px-4 transition-[background,box-shadow] duration-500 sm:px-5 ${scrolled ? 'is-scrolled' : ''}`}
        data-floating-nav
      >
        <a href="#top" onClick={close} className="group flex min-w-0 items-center gap-2.5" aria-label="SPEEDEX — home" data-nav-logo>
          <Emblem3D />
          <span dir="ltr" className="font-display hidden text-[17px] leading-none font-bold tracking-[0.19em] whitespace-nowrap min-[350px]:block" style={{ color: 'var(--text)' }}>
            SPEED<span style={{ color: 'var(--wine)' }}>EX</span>
          </span>
        </a>

        <nav className="hidden min-w-0 items-center justify-center gap-4 min-[1280px]:flex 2xl:gap-6" aria-label="Primary" data-primary-navigation style={{ color: 'var(--muted)' }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} data-nav-link={link.href.slice(1)} className="nav-link py-2 text-[11px] font-bold whitespace-nowrap 2xl:text-xs">
              {link.label}
            </a>
          ))}
        </nav>
        <span className="min-[1280px]:hidden" aria-hidden="true" />

        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
          <div dir="ltr" className="flex h-10 items-center" role="group" aria-label="Language" data-language-switcher>
            {LANGS.map((item, index) => (
              <span key={item.id} className="flex items-center">
                {index > 0 && <span aria-hidden="true" className="mx-0.5 h-3 w-px" style={{ background: 'var(--line-strong)' }} />}
                <button
                  type="button"
                  onClick={() => setLang(item.id)}
                  aria-pressed={lang === item.id}
                  data-active={lang === item.id}
                  className="tab-underline px-1.5 py-2 text-[11px] font-bold sm:px-2"
                  style={{ color: lang === item.id ? 'var(--accent-ink)' : 'var(--muted)' }}
                >
                  {item.label}
                </button>
              </span>
            ))}
          </div>

          <a
            href="#quote"
            data-executive-cta
            className="btn-executive ms-2 hidden items-center bg-[#6B1D2F] text-white rounded-full px-5 py-2 text-[11px] font-bold tracking-[0.08em] whitespace-nowrap uppercase min-[1050px]:inline-flex"
          >
            {t.nav_cta}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Menu"
            className="icon-action min-[1280px]:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300" style={{ transform: open ? 'translateY(7px) rotate(45deg)' : undefined }} />
              <span className="absolute inset-x-0 top-[7px] h-px bg-current transition-opacity duration-300" style={{ opacity: open ? 0 : 1 }} />
              <span className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300" style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : undefined }} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="glass-header is-scrolled floating-nav-pill pointer-events-auto mx-auto mt-2 max-w-[104rem] min-[1280px]:hidden"
          style={{ borderRadius: '1.75rem' }}
        >
          <nav className="px-5 py-3 sm:px-7" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                data-nav-link={link.href.slice(1)}
                className="group flex items-center justify-between gap-5 py-3.5"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <span className="font-display text-xl font-semibold">{link.label}</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--gold)' }}>
                  {lang === 'ar' ? '←' : '→'}
                </span>
              </a>
            ))}
            <div className="py-4">
              <a href="#quote" onClick={close} data-executive-cta className="btn-executive inline-flex items-center bg-[#6B1D2F] text-white rounded-full px-5 py-2 text-sm font-bold">
                {t.nav_cta}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
