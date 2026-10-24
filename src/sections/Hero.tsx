import { dict, type Lang } from '../i18n'

export default function Hero({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const isRtl = t.dir === 'rtl'
  const stats: [string, string][] = [
    [t.hero_stat1, t.hero_stat1l], [t.hero_stat2, t.hero_stat2l], [t.hero_stat3, t.hero_stat3l],
  ]

  // The dark side of the gradient always sits behind the copy (start side),
  // in both LTR and RTL, while the city render stays clean on the open side.
  const sideShade = isRtl
    ? 'linear-gradient(270deg, rgba(5,2,6,.90) 0%, rgba(24,5,15,.78) 42%, rgba(24,5,15,.28) 72%, rgba(5,2,6,.10) 100%)'
    : 'linear-gradient(90deg, rgba(5,2,6,.90) 0%, rgba(24,5,15,.78) 42%, rgba(24,5,15,.28) 72%, rgba(5,2,6,.10) 100%)'

  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#0a0508]">
      {/* Clean, full-bleed city render — no floating image cards on top of it. */}
      <img src="/assets/doha-aerial.jpg" alt="" aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_36%]" />

      {/* Readability system: side shade + top shade + controlled fade into the page. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: sideShade }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, rgba(5,2,6,.58) 0%, rgba(5,2,6,.08) 34%, rgba(5,2,6,.34) 68%, var(--bg) 100%)' }} />

      <div className="relative mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <div className="hero-copy hero-in w-full max-w-[840px] rounded-[1.75rem] p-6 sm:p-9 lg:p-10">
          <p className="flex items-center gap-3 text-[11px] font-bold tracking-[.24em] text-[#e8d5a8] uppercase">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-[#c9a86a]" />
            <span>{t.hero_kicker}</span>
          </p>

          <h1 className="font-display mt-5 leading-[.98] font-bold text-white sm:whitespace-nowrap"
            style={{ fontSize: 'clamp(2.55rem, 6.2vw, 5.6rem)', textShadow: '0 5px 34px rgba(0,0,0,.55)' }}>
            <span className="whitespace-nowrap">{t.hero_1}</span> <span className="gold-grad px-1" aria-hidden="true">{t.hero_arrow}</span> <span className="whitespace-nowrap">{t.hero_2}<span style={{ color: '#e05575' }}>.</span></span>
          </h1>

          <p className={`${lang === 'en' ? 'font-serif-lux italic' : 'font-display'} mt-4 text-[1.65rem] leading-snug font-semibold text-[#e8d5a8] sm:text-4xl`}
            style={{ textShadow: '0 3px 22px rgba(0,0,0,.6)' }}>{t.hero_title}</p>

          <p className="mt-5 max-w-[620px] text-[15px] leading-8 text-white/[.88] sm:text-base"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,.65)' }}>{t.hero_sub}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a href="#trade" className="btn-gold inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm">{t.hero_cta1}</a>
            <a href="#setup" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#e8d5a8] hover:text-[#e8d5a8]"
              style={{ background: 'rgba(7,3,8,.52)', border: '1px solid rgba(255,255,255,.42)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 14px 34px rgba(0,0,0,.28)' }}>{t.hero_cta2}</a>
          </div>
        </div>

        {/* Integrated metrics bar — aligned to the same content grid, not floating cards. */}
        <div className="hero-in mt-8 grid w-full max-w-[980px] overflow-hidden rounded-3xl sm:grid-cols-3"
          style={{ background: 'rgba(6,3,7,.58)', border: '1px solid rgba(232,213,168,.24)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 22px 50px rgba(0,0,0,.28)' }}>
          {stats.map(([value, label], index) => (
            <div key={label} className="px-5 py-4 sm:px-6"
              style={index ? { borderInlineStart: '1px solid rgba(232,213,168,.16)' } : undefined}>
              <div className="font-display text-base font-bold text-[#e8d5a8] sm:text-lg">{value}</div>
              <div className="mt-1 text-xs leading-5 text-white/75">{label}</div>
            </div>
          ))}
        </div>

        <div className="hero-in mt-7 flex items-center gap-3 text-[10px] font-semibold tracking-[.28em] text-white/70 uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,.8)' }}>
          <span aria-hidden="true" className="inline-block h-8 w-px bg-gradient-to-b from-transparent via-[#e8d5a8] to-transparent" />
          {t.scroll}
        </div>
      </div>

      {/* Service marquee — a deliberate full-width band below the hero, not an overlay. */}
      <div className="relative overflow-hidden py-3" style={{ borderTop: '1px solid rgba(232,213,168,.18)', background: '#2b0712' }} dir="ltr">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {t.marquee.map((m) => <span key={m} className="font-display px-6 text-sm font-semibold tracking-[.24em] whitespace-nowrap text-[#f5efe4]">{m} <span className="text-[#c9a86a]">◆</span></span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
