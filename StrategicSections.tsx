'use client'

import type { CSSProperties } from 'react'
import { dict, type Lang } from '@/lib/i18n'

type Dict = (typeof dict)['en']
type PairList = readonly (readonly [string, string])[]

const NODE_LAYOUTS: Record<string, readonly string[]> = {
  standard: [
    'lg:col-start-1 lg:col-end-6 lg:row-start-1',
    'lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-24',
    'lg:col-start-2 lg:col-end-7 lg:row-start-2 lg:mt-8',
    'lg:col-start-7 lg:col-end-13 lg:row-start-2 lg:mt-28',
  ],
  reverse: [
    'lg:col-start-7 lg:col-end-13 lg:row-start-1',
    'lg:col-start-1 lg:col-end-6 lg:row-start-1 lg:mt-24',
    'lg:col-start-7 lg:col-end-13 lg:row-start-2 lg:mt-8',
    'lg:col-start-1 lg:col-end-7 lg:row-start-2 lg:mt-28',
  ],
  data: [
    'lg:col-start-1 lg:col-end-5 lg:row-start-1',
    'lg:col-start-5 lg:col-end-9 lg:row-start-1 lg:mt-24',
    'lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:mt-10',
    'lg:col-start-4 lg:col-end-10 lg:row-start-2 lg:mt-16',
  ],
}
const NODE_METERS = [94, 79, 88, 100] as const
const SETUP_PLACEHOLDERS = [0, 1, 2, 3] as const

function SectionIntro({ index, kicker, title, sub, dark = false }: { index: string; kicker: string; title: string; sub: string; dark?: boolean }) {
  return (
    <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
      <span data-drift aria-hidden="true" className="font-display pointer-events-none absolute -top-16 end-0 text-[9rem] leading-none font-bold opacity-[0.055] select-none lg:text-[15rem]">
        {index}
      </span>
      <div className="relative lg:col-span-7">
        <p data-reveal className="kicker">
          <span className="font-display me-4" style={{ color: 'var(--gold)' }}>{index}</span>{kicker}
        </p>
        <h2 data-reveal className="architectural-heading mt-7 text-[clamp(2.3rem,5vw,5.2rem)]">
          {title}
        </h2>
      </div>
      <p data-reveal className="glass-ribbon relative max-w-xl p-6 leading-loose lg:col-span-4 lg:col-start-9 lg:mt-10 lg:p-7" style={{ color: dark ? 'rgba(247,240,227,.78)' : 'var(--muted)' }}>
        {sub}
      </p>
      <span className="data-meter relative lg:col-span-5 lg:col-start-8" aria-hidden="true">
        <span className="data-meter-fill" data-meter-fill style={{ width: '88%' }} />
      </span>
    </div>
  )
}

function SwissNodes({ items, variant, testId, dark = false }: { items: PairList; variant: keyof typeof NODE_LAYOUTS; testId: string; dark?: boolean }) {
  return (
    <div className="relative mt-10 grid gap-x-10 lg:grid-cols-12" data-editorial-layout={testId}>
      <span aria-hidden="true" className="absolute top-0 bottom-0 start-1/2 hidden w-px lg:block" style={{ background: 'linear-gradient(180deg,transparent,var(--line-strong),transparent)' }} />
      {items.map(([title, body], index) => (
        <article
          key={title}
          data-reveal
          data-strategy-node
          className={`swiss-node group ${NODE_LAYOUTS[variant][index]}`}
          style={{ '--meter': `${NODE_METERS[index]}%` } as CSSProperties}
        >
          <span className="swiss-node-sheen" aria-hidden="true" />
          <div className="flex items-start justify-between gap-6">
            <span className="swiss-node-index font-display text-7xl leading-none font-bold lg:text-8xl" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-display pt-3 text-[10px] tracking-[0.24em] tabular-nums" style={{ color: 'var(--gold)' }}>
              <span data-count={NODE_METERS[index]}>0</span> / 100
            </span>
          </div>
          <h3 className="architectural-subhead mt-7 text-xl leading-snug lg:text-2xl" style={{ color: dark ? '#F7F0E3' : 'var(--text)' }}>{title}</h3>
          <p className="mt-4 max-w-xl leading-loose" style={{ color: dark ? 'rgba(247,240,227,.68)' : 'var(--muted)' }}>{body}</p>
          <span className="data-meter mt-8 block" aria-hidden="true">
            <span className="data-meter-fill" data-meter-fill style={{ width: `${NODE_METERS[index]}%` }} />
          </span>
        </article>
      ))}
    </div>
  )
}

function CorridorAxis({ t }: { t: Dict }) {
  return (
    <div data-reveal className="glass-ribbon-dark mt-16 p-7 text-[#F7F0E3] lg:ms-[9%] lg:p-10" data-corridor-axis>
      <div className="grid items-start gap-5 text-[10px] font-bold tracking-[0.24em] uppercase sm:grid-cols-[1fr_auto_1fr]">
        <span style={{ color: 'rgba(247,240,227,.66)' }}>{t.compare_left}</span>
        <span className="font-display text-center text-xs" style={{ color: '#E5C98C' }}>{t.route_bidirectional}</span>
        <span className="sm:text-end" style={{ color: 'rgba(247,240,227,.66)' }}>{t.compare_right}</span>
      </div>
      <div className="relative my-8 h-6" aria-hidden="true">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2" style={{ background: 'rgba(232,213,168,.28)' }} />
        <span className="absolute top-1/2 start-0 h-[2px] w-full -translate-y-1/2" data-meter-fill style={{ background: 'linear-gradient(90deg,var(--maroon),var(--wine),var(--gold-2))', transformOrigin: 'left center' }} />
        {[0, 33, 66, 100].map((position) => (
          <span
            key={position}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border"
            style={{ left: `${position}%`, borderColor: 'var(--gold)', background: '#140A0F' }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-5" aria-hidden="true">
        <span className="font-display text-6xl leading-none font-bold" style={{ color: '#E5C98C' }}>04</span>
        <span className="data-meter mb-2 w-full max-w-sm flex-1"><span className="data-meter-fill" data-meter-fill style={{ width: '96%' }} /></span>
      </div>
    </div>
  )
}

export function WhyChooseUs({ lang }: { lang: Lang }) {
  const t = dict[lang]
  return (
    <section
      id="why-choose-us"
      data-strategic-section="why-choose-us"
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 52%, var(--bg) 100%)', borderTop: '1px solid var(--line)' }}
      aria-label={t.strategic_choose_title}
    >
      <div className="swiss-rules pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div data-orbit aria-hidden="true" className="corridor-orbit pointer-events-none absolute -top-36 -end-36 hidden h-[30rem] w-[30rem] lg:block" />
      <div className="relative mx-auto max-w-[88rem]">
        <SectionIntro index="03" kicker={t.strategic_choose_kicker} title={t.strategic_choose_title} sub={t.strategic_choose_sub} />
        <SwissNodes items={t.strategic_choose_cards} variant="standard" testId="why-choose-us" />
      </div>
    </section>
  )
}

export function ChinaGateway({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const isRtl = t.dir === 'rtl'
  return (
    <section
      id="china-gateway"
      data-strategic-section="china-gateway"
      className="film-grain relative scroll-mt-20 overflow-hidden px-5 py-20 text-[#f7f0e3] sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      style={{
        background:
          'radial-gradient(ellipse 70% 48% at 88% 0%, rgba(107,29,47,.52), transparent 62%), linear-gradient(180deg, #070709 0%, #140A0F 52%, #070709 100%)',
        borderTop: '1px solid rgba(197,160,89,.18)',
      }}
      aria-label={t.strategic_china_title}
    >
      <div aria-hidden="true" dir="ltr" data-drift className="font-display big-outline pointer-events-none absolute -top-5 end-0 text-[19vw] leading-none font-bold opacity-[0.13] select-none">
        CHINA
      </div>
      <div className="swiss-rules pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-[88rem]">
        <SectionIntro index="04" kicker={t.strategic_china_kicker} title={t.strategic_china_title} sub={t.strategic_china_sub} dark />
        <CorridorAxis t={t as Dict} />
        <SwissNodes items={t.strategic_china_steps} variant="reverse" testId="china-gateway" dark />
        <a href="#trade" data-reveal className="text-link mt-6 inline-flex py-2 text-sm font-bold text-[#E5C98C]">
          {t.trade_scroll_label} <span aria-hidden="true" className="ms-2">{isRtl ? '←' : '→'}</span>
        </a>
      </div>
    </section>
  )
}

export function WhyQatar({ lang }: { lang: Lang }) {
  const t = dict[lang]
  return (
    <section
      id="why-qatar"
      data-strategic-section="why-qatar"
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 48%, var(--bg) 100%)', borderTop: '1px solid var(--line)' }}
      aria-label={t.strategic_whyq_title}
    >
      <div className="swiss-rules pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div aria-hidden="true" dir="ltr" data-drift className="font-display big-outline pointer-events-none absolute -bottom-8 start-0 text-[20vw] leading-none font-bold opacity-[0.12] select-none">
        QATAR
      </div>
      <div data-orbit aria-hidden="true" className="corridor-orbit pointer-events-none absolute -bottom-44 -start-44 hidden h-[32rem] w-[32rem] lg:block" />
      <div className="relative mx-auto max-w-[88rem]">
        <SectionIntro index="07" kicker={t.strategic_whyq_kicker} title={t.strategic_whyq_title} sub={t.strategic_whyq_sub} />
        <SwissNodes items={t.strategic_whyq_cards} variant="data" testId="why-qatar" />
      </div>
    </section>
  )
}

export function CompanySetupServices({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const isRtl = t.dir === 'rtl'
  const slotLayouts = ['lg:me-[28%]', 'lg:ms-[20%] lg:me-[8%]', 'lg:ms-[4%] lg:me-[34%]', 'lg:ms-[34%]'] as const
  return (
    <section
      id="company-setup-services"
      data-strategic-section="company-setup-services"
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      style={{ background: 'var(--bg)', borderTop: '1px solid var(--line)' }}
      aria-label={t.strategic_setup_title}
    >
      <div className="swiss-rules pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-[88rem]">
        <SectionIntro index="08" kicker={t.strategic_setup_kicker} title={t.strategic_setup_title} sub={t.strategic_setup_sub} />
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="glass-ribbon h-fit p-8 lg:col-span-4 lg:mt-24 lg:p-10">
            <span className="font-display text-7xl leading-none font-bold" style={{ color: 'var(--wine)' }}>04</span>
            <p className="mt-6 leading-loose" style={{ color: 'var(--muted)' }}>{t.strategic_setup_note}</p>
            <span className="data-meter mt-8 block" aria-hidden="true"><span className="data-meter-fill" data-meter-fill style={{ width: '64%' }} /></span>
            <a href="#setup" className="text-link mt-8 inline-flex py-2 text-sm font-bold" style={{ color: 'var(--accent-ink)' }}>
              {t.setup_scroll_label} <span aria-hidden="true" className="ms-2">{isRtl ? '←' : '→'}</span>
            </a>
          </div>
          <div className="relative lg:col-span-8" data-company-setup-placeholders>
            <span aria-hidden="true" className="absolute top-0 bottom-0 start-[12%] hidden w-px lg:block" style={{ background: 'linear-gradient(180deg,transparent,var(--line-strong),transparent)' }} />
            {SETUP_PLACEHOLDERS.map((index) => (
              <article
                key={index}
                data-reveal
                data-company-setup-placeholder
                className={`setup-placeholder group ${slotLayouts[index]}`}
                aria-label={`${t.strategic_setup_placeholder} ${String(index + 1).padStart(2, '0')}`}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <p className="architectural-subhead text-sm" style={{ color: 'var(--gold)' }}>{t.strategic_setup_placeholder}</p>
                  <span className="font-display text-6xl leading-none font-bold opacity-20 transition-opacity duration-500 group-hover:opacity-45" style={{ color: 'var(--wine)' }} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-12 space-y-4" aria-hidden="true">
                  <span className="setup-placeholder-line w-4/5" />
                  <span className="setup-placeholder-line w-3/5" />
                  <span className="setup-placeholder-line w-2/5" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
