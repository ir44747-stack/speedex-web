'use client'

import type { CSSProperties } from 'react'
import { dict, type Lang } from '@/lib/i18n'

const SERVICE_HREFS = ['#trade', '#setup', '#quote', '#setup', '#quote'] as const
const PILLAR_LAYOUTS = ['lg:me-[27%]', 'lg:ms-[17%] lg:me-[9%] lg:mt-5', 'lg:ms-[36%] lg:mt-5'] as const
const SERVICE_LAYOUTS = [
  'lg:me-[17%]',
  'lg:ms-[9%] lg:me-[5%]',
  'lg:ms-[2%] lg:me-[24%]',
  'lg:ms-[18%]',
  'lg:me-[12%]',
] as const
const METERS = [92, 84, 76, 88, 95] as const

function SignalBars({ seed, meter }: { seed: number; meter: number }) {
  return (
    <span className="flex h-12 items-end gap-1" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => {
        const height = 22 + ((seed * 17 + index * 23) % 67)
        const active = index < Math.round(meter / 10)
        return (
          <span
            key={index}
            className="w-px transition-transform duration-500 motion-safe:group-hover:scale-y-110"
            style={{
              height: `${height}%`,
              background: active ? 'linear-gradient(180deg,var(--gold-2),var(--maroon))' : 'var(--line-strong)',
              transformOrigin: 'bottom center',
            }}
          />
        )
      })}
    </span>
  )
}

export default function ConsultancyOverview({ lang }: { lang: Lang }) {
  const t = dict[lang]

  return (
    <>
      <section id="about" className="relative scroll-mt-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 52%, var(--bg) 100%)', borderTop: '1px solid var(--line)' }} aria-label={t.about_kicker}>
        <div className="swiss-rules pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <span data-drift aria-hidden="true" className="font-display pointer-events-none absolute -top-8 end-5 text-[11rem] leading-none font-bold opacity-[0.055] select-none lg:text-[19rem]">
          01
        </span>
        <div className="relative mx-auto max-w-[88rem] px-5 py-28 sm:px-8 lg:py-36">
          <p data-reveal className="kicker"><span className="font-display me-4" style={{ color: 'var(--gold)' }}>01</span>{t.about_kicker}</p>
          <h2 data-reveal className="architectural-heading mt-7 max-w-5xl text-[clamp(2.35rem,5.2vw,5.5rem)]">
            {t.about_title}
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
            <p data-reveal className="max-w-3xl text-xl leading-relaxed lg:text-2xl" style={{ color: 'var(--text)' }}>
              {t.about_lead}
            </p>
            <p data-reveal className="glass-ribbon max-w-xl p-6 leading-loose lg:mt-10 lg:p-7" style={{ color: 'var(--muted)' }}>
              {t.about_body}
            </p>
          </div>

          <ol className="relative mt-20" data-editorial-pillars>
            <span aria-hidden="true" className="absolute top-0 bottom-0 start-[9%] hidden w-px lg:block" style={{ background: 'linear-gradient(180deg,transparent,var(--line-strong),transparent)' }} />
            {t.about_pillars.map(([title, body], index) => (
              <li
                key={title}
                data-reveal
                data-about-pillar
                className={`swiss-node group ${PILLAR_LAYOUTS[index]}`}
                style={{ '--meter': `${[88, 74, 96][index]}%` } as CSSProperties}
              >
                <span className="swiss-node-sheen" aria-hidden="true" />
                <div className="grid gap-5 sm:grid-cols-[8rem_1fr] lg:gap-10">
                  <span className="swiss-node-index font-display text-7xl leading-none font-bold lg:text-8xl" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="architectural-subhead text-xl" style={{ color: 'var(--text)' }}>{title}</h3>
                    <p className="mt-4 max-w-2xl leading-loose" style={{ color: 'var(--muted)' }}>{body}</p>
                    <span className="data-meter mt-7 block max-w-xl" aria-hidden="true">
                      <span className="data-meter-fill" data-meter-fill style={{ width: `${[88, 74, 96][index]}%` }} />
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p data-reveal className="glass-ribbon mt-14 max-w-3xl p-7 leading-loose lg:ms-[22%] lg:p-9" style={{ color: 'var(--muted)' }}>
            <span className="font-display me-4 text-xs tracking-[0.22em]" style={{ color: 'var(--gold)' }}>A—Z</span>
            {t.about_film_note}
          </p>
        </div>
      </section>

      <section id="consultancy" className="relative scroll-mt-20 overflow-hidden" style={{ background: 'var(--bg)', borderTop: '1px solid var(--line)' }} aria-label={t.consult_kicker}>
        <div className="swiss-rules pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative mx-auto max-w-[88rem] px-5 py-28 sm:px-8 lg:py-36">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <div>
              <p data-reveal className="kicker"><span className="font-display me-4" style={{ color: 'var(--gold)' }}>02</span>{t.consult_kicker}</p>
              <h2 data-reveal className="architectural-heading mt-7 text-[clamp(2.35rem,5vw,5.2rem)]">
                {t.consult_title}
              </h2>
            </div>
            <div data-reveal className="lg:pb-2">
              <p className="max-w-xl leading-loose" style={{ color: 'var(--muted)' }}>{t.consult_sub}</p>
              <div className="mt-7 flex items-end gap-5" aria-hidden="true">
                <span className="font-display text-6xl leading-none font-bold" style={{ color: 'var(--wine)' }}>05</span>
                <span className="data-meter mb-2 flex-1"><span className="data-meter-fill" data-meter-fill style={{ width: '91%' }} /></span>
              </div>
            </div>
          </div>

          <div className="relative mt-16" data-editorial-services>
            <span aria-hidden="true" className="absolute top-0 bottom-0 start-[5%] hidden w-px xl:block" style={{ background: 'linear-gradient(180deg,transparent,var(--line-strong),transparent)' }} />
            {t.consult_services.map(([title, body], index) => (
              <a
                key={title}
                href={SERVICE_HREFS[index]}
                data-reveal
                data-editorial-service
                className={`swiss-node group block ${SERVICE_LAYOUTS[index]}`}
                style={{ '--meter': `${METERS[index]}%` } as CSSProperties}
              >
                <span className="swiss-node-sheen" aria-hidden="true" />
                <span className="grid items-start gap-6 md:grid-cols-[7rem_1fr_1.15fr] xl:grid-cols-[8rem_0.95fr_1.1fr_9rem_auto]">
                  <span className="swiss-node-index font-display text-7xl leading-none font-bold" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="architectural-subhead block text-xl leading-snug lg:text-2xl" style={{ color: 'var(--text)' }}>{title}</span>
                    <span className="font-display mt-4 block text-[10px] tracking-[0.24em]" style={{ color: 'var(--gold)' }}>
                      CAPABILITY / {String(index + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className="block leading-loose" style={{ color: 'var(--muted)' }}>{body}</span>
                  <span className="hidden xl:block">
                    <SignalBars seed={index + 1} meter={METERS[index]} />
                    <span className="data-meter mt-3 block"><span className="data-meter-fill" data-meter-fill style={{ width: `${METERS[index]}%` }} /></span>
                  </span>
                  <span aria-hidden="true" className="justify-self-end text-2xl transition-transform duration-500 motion-safe:group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-1.5" style={{ color: 'var(--gold)' }}>
                    →
                  </span>
                </span>
              </a>
            ))}

            <div data-reveal className="glass-ribbon mt-16 p-8 lg:ms-[14%] lg:p-11">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-display text-[10px] tracking-[0.26em]" style={{ color: 'var(--gold)' }}>06 / EXECUTIVE ACTION</p>
                  <h3 className="architectural-heading mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3.8rem)]">{t.consult_cta}</h3>
                </div>
                <a href="#quote" className="btn-executive inline-flex min-h-12 shrink-0 items-center px-7 text-sm">
                  {t.nav_cta}
                  <span aria-hidden="true" className="ms-3">{lang === 'ar' ? '←' : '→'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
