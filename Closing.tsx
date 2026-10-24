'use client'

import { useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react'
import Image from 'next/image'
import { dict, type Lang } from '@/lib/i18n'
import DayNightToggle from '@/components/DayNightToggle'

type Service = 'trade' | 'setup' | 'both'

export default function Closing({ lang, theme, setTheme }: { lang: Lang; theme: string; setTheme: (theme: string) => void }) {
  const t = dict[lang]
  const isRtl = t.dir === 'rtl'
  const [reference, setReference] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', company: '', contact: '', details: '' })
  const [service, setService] = useState<Service>('trade')

  const setField = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const suffix = service === 'trade' ? 'TRD' : service === 'setup' ? 'SET' : 'ALL'
    setReference(`SPX-2026-${Math.floor(1000 + Math.random() * 9000)}-${suffix}`)
  }

  const services: { id: Service; label: string }[] = [
    { id: 'trade', label: t.svc_trade },
    { id: 'setup', label: t.svc_setup },
    { id: 'both', label: t.svc_both },
  ]

  const rfqVars = { '--input-line': 'rgba(255,255,255,.32)' } as CSSProperties
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <>
      {/* Why — principles carried by type and hairlines over a Qatar market image. */}
      <section id="why" className="film-grain relative isolate scroll-mt-20 overflow-hidden bg-[#070709] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10">
        <div className="absolute inset-0 -z-20" data-parallax-wrap>
          <div className="absolute inset-[-8%_0]" data-parallax>
            <Image
              src="/assets/doha-west-bay-real.jpg"
              alt="Commercial skyline in Qatar at night"
              fill
              sizes="100vw"
              className="object-cover object-[50%_48%]"
            />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,2,6,.84), rgba(5,2,6,.68) 45%, rgba(5,2,6,.94))' }} />

        <div className="relative mx-auto max-w-[88rem]">
          <div className="reveal max-w-3xl">
            <p className="kicker"><span className="font-display me-4" style={{ color: 'var(--gold)' }}>11</span>{t.why_kicker}</p>
            <h2 className="architectural-heading mt-5 text-4xl sm:text-6xl">{t.why_title}</h2>
            <p className="mt-6 max-w-2xl leading-8 text-white/68">{t.why_sub}</p>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8 lg:grid-cols-12" data-why-principles>
            {t.why_cards.map(([title, body], index) => (
              <article
                key={title}
                data-why-principle
                className={`reveal swiss-node group ${['lg:col-start-1 lg:col-end-6', 'md:mt-16 lg:col-start-6 lg:col-end-9 lg:mt-24', 'md:mt-8 lg:col-start-10 lg:col-end-13 lg:mt-10'][index]}`}
                style={{ '--meter': `${[92, 84, 100][index]}%` } as CSSProperties}
              >
                <span className="swiss-node-sheen" aria-hidden="true" />
                <span className="swiss-node-index font-display text-7xl leading-none font-bold">0{index + 1}</span>
                <h3 className="architectural-subhead mt-6 text-2xl text-white" style={{ textShadow: '0 3px 18px rgba(0,0,0,.82)' }}>{title}</h3>
                <p className="mt-3 max-w-sm leading-7 text-white/76" style={{ textShadow: '0 2px 14px rgba(0,0,0,.86)' }}>{body}</p>
                <span className="data-meter mt-8 block" aria-hidden="true">
                  <span className="data-meter-fill" data-meter-fill style={{ width: `${[92, 84, 100][index]}%` }} />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RFQ — a maroon room with editorial underline fields, not a form card. */}
      <section
        id="quote"
        className="film-grain relative isolate scroll-mt-20 overflow-hidden px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10"
        style={{ background: 'linear-gradient(128deg, #260914 0%, #4C1222 48%, #6B1D2F 78%, #260914 118%)', ...rfqVars }}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-18" data-parallax-wrap>
          <div className="absolute inset-[-8%_0]" data-parallax>
            <Image src="/assets/beijing-cbd-real.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_12%]" />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-[5]" style={{ background: 'linear-gradient(90deg, rgba(43,7,18,.72), rgba(43,7,18,.18) 58%, rgba(43,7,18,.48))' }} />

        <div className="relative mx-auto grid max-w-[88rem] gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div className="reveal">
            <p className="text-[10px] font-bold tracking-[0.32em] text-[#E5C98C] uppercase"><span className="font-display me-4">12</span>{t.quote_kicker}</p>
            <h2 className="architectural-heading mt-5 text-4xl sm:text-6xl">{t.quote_title}</h2>
            <p className="mt-6 max-w-md leading-8 text-white/66">{t.quote_sub}</p>
            <div aria-hidden="true" className="glass-chip mt-10 hidden max-w-md p-6 lg:block">
              <div className="hairline" data-progress-line />
              <div className="font-display mt-5 flex justify-between gap-4 text-[10px] font-bold tracking-[0.26em] text-white/48">
                <span>{t.compare_right}</span><span className="text-[#E5C98C]">{t.route_bidirectional}</span><span>{t.compare_left}</span>
              </div>
            </div>
          </div>

          {reference ? (
            <div className="reveal glass-ribbon-dark flex min-h-[420px] flex-col justify-center p-8 lg:p-10" role="status" aria-live="polite">
              <p className="text-sm text-white/64">{t.sent_title}</p>
              <p dir="ltr" className="font-display mt-4 text-4xl font-bold tracking-[0.08em] text-[#E5C98C] sm:text-6xl">{reference}</p>
              <div aria-hidden="true" className="hairline mt-8" data-progress-line />
              <p className="mt-6 max-w-lg leading-8 text-white/66">{t.sent_sub}</p>
              <button type="button" onClick={() => setReference(null)} className="text-link mt-8 self-start py-2 text-sm font-bold text-white">
                + {t.send}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="reveal glass-ribbon-dark p-7 lg:p-10" aria-label={t.get_quote}>
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[10px] font-bold tracking-[0.24em] text-white/74 uppercase">{t.f_name}</span>
                  <input id="rfq-name" required autoComplete="name" value={form.name} onChange={setField('name')} placeholder={t.f_name} className="underline-field text-base" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold tracking-[0.24em] text-white/74 uppercase">{t.f_company}</span>
                  <input id="rfq-company" autoComplete="organization" value={form.company} onChange={setField('company')} placeholder={t.f_company} className="underline-field text-base" />
                </label>
              </div>

              <label className="mt-7 block">
                <span className="text-[10px] font-bold tracking-[0.24em] text-white/74 uppercase">{t.f_contact}</span>
                <input id="rfq-contact" required autoComplete="email" value={form.contact} onChange={setField('contact')} placeholder={t.f_contact} className="underline-field text-base" />
              </label>

              <fieldset className="mt-9">
                <legend className="text-[10px] font-bold tracking-[0.24em] text-white/74 uppercase">{t.f_service}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {services.map((item) => {
                    const active = service === item.id
                    return (
                      <label
                        key={item.id}
                        className="group flex cursor-pointer items-center gap-3 py-2"
                        style={{ borderBottom: `1px solid ${active ? '#E5C98C' : 'rgba(255,255,255,.2)'}` }}
                      >
                        <input
                          type="radio"
                          name="speedex-service"
                          value={item.id}
                          checked={active}
                          onChange={() => setService(item.id)}
                          className="peer sr-only"
                        />
                        <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[#E5C98C] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#4C1222]" style={{ border: `1px solid ${active ? '#E5C98C' : 'rgba(255,255,255,.42)'}` }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: active ? '#E5C98C' : 'transparent' }} />
                        </span>
                        <span className="text-sm leading-5 font-semibold" style={{ color: active ? '#fff' : 'rgba(255,255,255,.62)' }}>{item.label}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <label className="mt-8 block">
                <span className="text-[10px] font-bold tracking-[0.24em] text-white/74 uppercase">{t.f_details}</span>
                <textarea
                  id="rfq-details"
                  required
                  rows={4}
                  value={form.details}
                  onChange={setField('details')}
                  placeholder={t.f_details}
                  className="underline-field resize-none text-base leading-7"
                />
              </label>

              <button type="submit" className="btn-gold mt-9 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 text-sm sm:w-auto sm:min-w-[240px]">
                {t.send} <span aria-hidden="true" className="ms-2">{isRtl ? '←' : '→'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="px-5 py-10 sm:px-8 lg:px-10" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto grid max-w-[88rem] gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="leading-tight">
            <div dir="ltr" className="font-display font-bold tracking-[0.2em]">SPEED<span style={{ color: 'var(--wine)' }}>EX</span></div>
            <div className="mt-1 text-[10px] tracking-[0.08em]" style={{ color: 'var(--faint)' }}>{t.footer_tag}</div>
          </div>
          <div className="text-xs leading-6 md:text-center" style={{ color: 'var(--muted)' }}>
            <p>{t.rights}</p>
            <p className="mt-1 text-[10px]" style={{ color: 'var(--faint)' }}>
              {t.photo_credit_label}: HoweyYuan · Thameur Belghith · Zairon — Wikimedia Commons (CC BY-SA 4.0 / CC BY 4.0), cropped &amp; graded.
            </p>
          </div>
          <div className="flex items-center gap-4" data-footer-theme-control>
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--faint)' }}>{t.theme_toggle}</span>
            <DayNightToggle theme={theme} onToggle={toggleTheme} label={t.theme_toggle} />
          </div>
        </div>
      </footer>
    </>
  )
}
