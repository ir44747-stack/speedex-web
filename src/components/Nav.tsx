import { useState } from 'react'
import { dict, type Lang } from '../i18n'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'EN' }, { id: 'ar', label: 'عربي' }, { id: 'zh', label: '中文' },
]

export default function Nav({ lang, setLang, theme, setTheme, onReplay }: {
  lang: Lang; setLang: (l: Lang) => void; theme: string; setTheme: (t: string) => void; onReplay: () => void
}) {
  const t = dict[lang]
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#trade', label: t.nav_trade },
    { href: '#setup', label: t.nav_setup },
    { href: '#planner', label: t.nav_calc },
    { href: '#why', label: t.nav_why },
  ]
  const close = () => setOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 shadow-[0_14px_42px_rgba(0,0,0,.18)]"
      style={{ background: 'var(--nav)', backdropFilter: 'blur(22px) saturate(1.25)', WebkitBackdropFilter: 'blur(22px) saturate(1.25)', borderBottom: '1px solid var(--line)' }}>
      <div className="mx-auto grid h-[72px] max-w-[88rem] grid-cols-[minmax(0,auto)_1fr_auto] items-center gap-2 px-3 min-[420px]:px-4 sm:gap-5 sm:px-6 lg:px-8">
        {/* Integrated brand lockup — the website's only logo treatment */}
        <a href="#top" onClick={close} className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label="SPEEDEX — home">
          <img src="/assets/gazelle-globe.png" alt="" aria-hidden="true"
            className="h-11 w-11 shrink-0 object-contain"
            style={{ filter: theme === 'dark' ? 'brightness(1.65) saturate(1.15) drop-shadow(0 2px 8px rgba(232,213,168,.28))' : 'drop-shadow(0 2px 5px rgba(110,15,43,.16))' }} />
          <span className="hidden min-w-0 leading-none min-[360px]:block">
            <span dir="ltr" className="font-display block text-[17px] font-bold tracking-[.18em] whitespace-nowrap">SPEED<span style={{ color: 'var(--wine)' }}>EX</span></span>
            <span className="mt-1 hidden max-w-[205px] truncate text-[8px] tracking-[.12em] uppercase md:block" style={{ color: 'var(--faint)' }}>{t.footer_tag}</span>
          </span>
        </a>

        {/* Centred desktop navigation */}
        <nav className="hidden min-w-0 items-center justify-center gap-6 xl:flex 2xl:gap-9" aria-label="Primary" style={{ color: 'var(--muted)' }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link py-2 text-[13px] font-semibold whitespace-nowrap">{link.label}</a>
          ))}
        </nav>
        <span className="xl:hidden" aria-hidden="true" />

        {/* Utilities: one baseline, fixed-height controls */}
        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2.5">
          <div dir="ltr" className="glass flex h-9 items-center rounded-full p-1" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button key={l.id} type="button" onClick={() => setLang(l.id)} aria-pressed={lang === l.id}
                className="h-7 min-w-9 rounded-full px-2 text-[11px] font-semibold transition sm:min-w-10 sm:px-2.5"
                style={lang === l.id ? { background: 'var(--maroon)', color: '#fff', boxShadow: '0 4px 14px rgba(138,21,56,.3)' } : { color: 'var(--muted)' }}>{l.label}</button>
            ))}
          </div>

          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark / light mode" title="Dark / Light"
            className="glass hidden h-9 w-9 place-items-center rounded-full text-[13px] transition hover:border-[#c9a86a] min-[480px]:grid">{theme === 'dark' ? '☀️' : '🌙'}</button>

          <button type="button" onClick={onReplay} aria-label={t.replay_flight} title={t.replay_flight}
            className="glass hidden h-9 w-9 place-items-center rounded-full text-base transition hover:border-[#c9a86a] lg:grid">↺</button>

          <a href="#quote" className="btn-maroon hidden h-10 items-center rounded-full px-4 text-[13px] whitespace-nowrap md:inline-flex lg:px-5">{t.get_quote}</a>

          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu"
            className="glass grid h-9 w-9 place-items-center rounded-full text-lg leading-none xl:hidden">{open ? '×' : '☰'}</button>
        </div>
      </div>

      {/* Tablet / mobile navigation panel */}
      {open && (
        <div className="xl:hidden" style={{ borderTop: '1px solid var(--line)', background: 'var(--nav)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
          <nav className="mx-auto max-w-[88rem] px-4 py-3 sm:px-6" aria-label="Mobile">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={close}
                className="flex items-center justify-between py-3 text-sm font-semibold" style={{ borderBottom: '1px solid var(--line)' }}>
                <span>{link.label}</span><span aria-hidden="true" style={{ color: 'var(--gold)' }}>{lang === 'ar' ? '←' : '→'}</span>
              </a>
            ))}
            <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
              <a href="#quote" onClick={close} className="btn-maroon inline-flex h-10 items-center rounded-full px-5 text-[13px]">{t.get_quote}</a>
              <button type="button" onClick={() => { onReplay(); close() }} className="btn-ghost h-10 rounded-full px-4 text-[13px]">{t.replay_flight}</button>
              <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="glass grid h-10 w-10 place-items-center rounded-full" aria-label="Toggle dark / light mode">{theme === 'dark' ? '☀️' : '🌙'}</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
