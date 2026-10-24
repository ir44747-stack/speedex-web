import type { CSSProperties } from 'react'
import { dict, type Lang } from '@/lib/i18n'

type InsightArticle = readonly [string, string, string]
const BRIEFING_LAYOUTS = ['lg:me-[42%]', 'lg:ms-[35%] lg:me-[8%] lg:mt-4', 'lg:ms-[10%] lg:me-[30%] lg:mt-4'] as const
const BRIEFING_METERS = [82, 91, 76] as const

function ArticleMeta({ category, label, index }: { category: string; label: string; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold tracking-[0.24em] uppercase">
      <span className="font-display" style={{ color: 'var(--gold)' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span style={{ color: 'var(--accent-ink)' }}>{category}</span>
      <span aria-hidden="true" className="h-px w-8" style={{ background: 'var(--line-strong)' }} />
      <span style={{ color: 'var(--faint)' }}>{label}</span>
    </div>
  )
}

export default function Insights({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const articles = t.insights_articles as readonly InsightArticle[]
  const [featured, ...briefings] = articles

  return (
    <section
      id="insights"
      data-insights-section
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      style={{
        background:
          'radial-gradient(ellipse 58% 34% at 8% 0%, rgba(107,29,47,.16), transparent 64%), linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 52%, var(--bg) 100%)',
        borderTop: '1px solid var(--line)',
      }}
      aria-label={t.insights_title}
    >
      <div className="swiss-rules pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div
        aria-hidden="true"
        dir="ltr"
        data-drift
        className="font-display big-outline pointer-events-none absolute -top-5 end-0 text-[17vw] leading-none font-bold opacity-[0.1] select-none"
      >
        EDITORIAL
      </div>

      <div className="relative mx-auto max-w-[88rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kicker reveal"><span className="font-display me-4" style={{ color: 'var(--gold)' }}>10</span>{t.insights_kicker}</p>
            <h2 className="architectural-heading reveal mt-6 max-w-4xl text-[clamp(2.3rem,5vw,5.2rem)]">
              {t.insights_title}
            </h2>
          </div>
          <div className="reveal glass-ribbon p-6 lg:col-span-4 lg:col-start-9 lg:mt-10 lg:p-7">
            <span className="data-meter mb-6 block" aria-hidden="true"><span className="data-meter-fill" data-meter-fill style={{ width: '86%' }} /></span>
            <p className="max-w-xl leading-8" style={{ color: 'var(--muted)' }}>
              {t.insights_sub}
            </p>
          </div>
        </div>

        <article
          className="reveal glass-ribbon group mt-16 grid gap-8 p-8 lg:ms-[8%] lg:grid-cols-[0.72fr_1.45fr_1fr] lg:items-start lg:p-12"
          data-insight-article
          data-insight-featured
        >
          <div>
            <ArticleMeta category={featured[0]} label={t.insights_featured_label} index={0} />
            <span className="font-display mt-10 block text-8xl leading-none font-bold opacity-15 transition-opacity duration-500 group-hover:opacity-30" style={{ color: 'var(--wine)' }} aria-hidden="true">01</span>
          </div>
          <h3 className="architectural-subhead max-w-3xl text-3xl sm:text-4xl">{featured[1]}</h3>
          <div>
            <p className="max-w-xl leading-8" style={{ color: 'var(--muted)' }}>{featured[2]}</p>
            <span className="data-meter mt-8 block" aria-hidden="true"><span className="data-meter-fill" data-meter-fill style={{ width: '96%' }} /></span>
          </div>
        </article>

        <div className="relative mt-12" data-editorial-briefings>
          <span aria-hidden="true" className="absolute top-0 bottom-0 start-[58%] hidden w-px lg:block" style={{ background: 'linear-gradient(180deg,transparent,var(--line-strong),transparent)' }} />
          {briefings.map(([category, title, summary], index) => (
            <article
              key={title}
              className={`reveal swiss-node group ${BRIEFING_LAYOUTS[index]}`}
              data-insight-article
              style={{ '--meter': `${BRIEFING_METERS[index]}%` } as CSSProperties}
            >
              <span className="swiss-node-sheen" aria-hidden="true" />
              <div className="flex items-start justify-between gap-6">
                <ArticleMeta category={category} label={t.insights_briefing_label} index={index + 1} />
                <span className="swiss-node-index font-display text-6xl leading-none font-bold" aria-hidden="true">
                  {String(index + 2).padStart(2, '0')}
                </span>
              </div>
              <h3 className="architectural-subhead mt-8 max-w-2xl text-2xl lg:text-3xl">{title}</h3>
              <p className="mt-4 max-w-2xl leading-7" style={{ color: 'var(--muted)' }}>{summary}</p>
              <span className="data-meter mt-8 block" aria-hidden="true">
                <span className="data-meter-fill" data-meter-fill style={{ width: `${BRIEFING_METERS[index]}%` }} />
              </span>
            </article>
          ))}
        </div>

        <div className="reveal glass-ribbon mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 p-6 text-[11px] leading-6 lg:me-[22%]" style={{ color: 'var(--faint)' }}>
          <span className="font-display font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--gold)' }}>
            {t.route_scope}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t.insights_note}</span>
        </div>
      </div>
    </section>
  )
}
