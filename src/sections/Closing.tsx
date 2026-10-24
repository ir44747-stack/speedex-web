import { useState, type ChangeEvent, type FormEvent } from 'react'
import { dict, type Lang } from '../i18n'

const WHY_ICONS = ['🌍', '🧾', '📸']

export default function Closing({ lang, onReplay }: { lang: Lang; onReplay: () => void }) {
  const t = dict[lang]
  const [ref, setRef] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', company: '', contact: '', service: 'trade', details: '' })
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setRef(`SPX-2026-${Math.floor(1000 + Math.random() * 9000)}-${form.service === 'trade' ? 'TRD' : form.service === 'setup' ? 'SET' : 'ALL'}`)
  }
  const inputCls = 'glass w-full rounded-xl px-4 py-3 text-sm transition'
  const inputStyle = { color: 'var(--text)', background: 'var(--bg-2)' } as const

  return (
    <>
      {/* ---- Why ---- */}
      <section id="why" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="reveal img-zoom relative overflow-hidden rounded-[28px]" style={{ border: '1px solid var(--line)', boxShadow: 'var(--card-shadow)' }}>
            <img src="/assets/doha-waterfront.jpg" alt="Doha waterfront and skyline" className="aspect-[4/3] w-full object-cover object-[50%_30%]" />
            <span className="absolute bottom-4 start-4 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-bold tracking-[.2em] text-white backdrop-blur">QATAR · DOHA</span>
          </div>
          <div>
            <div className="reveal">
              <p className="kicker">{t.why_kicker}</p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">{t.why_title}</h2>
              <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>{t.why_sub}</p>
            </div>
            <div className="mt-7 space-y-3">
              {t.why_cards.map(([title, body], i) => (
                <div key={title} className="reveal glass card-hover flex gap-4 rounded-2xl p-5">
                  <span className="text-2xl">{WHY_ICONS[i]}</span>
                  <span><span className="font-display block font-bold">{title}</span><span className="mt-1 block text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{body}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Quote ---- */}
      <section id="quote" className="scroll-mt-24 px-4 pb-28 sm:px-6">
        <div className="noise reveal relative mx-auto max-w-7xl overflow-hidden rounded-[32px] p-7 sm:p-12" style={{ background: 'linear-gradient(135deg, #4a0a1e 0%, #8a1538 55%, #2b0712 110%)', boxShadow: 'var(--card-shadow)' }}>
          <div className="relative grid gap-10 text-white lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-[11px] font-semibold tracking-[.3em] text-[#e8d5a8] uppercase">{t.quote_kicker}</p>
              <h2 className="font-display mt-4 text-4xl leading-[1.05] font-bold sm:text-5xl">{t.quote_title}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{t.quote_sub}</p>
              <img src="/assets/doha-waterfront.jpg" alt="" className="mt-7 hidden h-44 w-full rounded-2xl object-cover object-[50%_25%] ring-1 ring-white/20 lg:block" />
            </div>
            {ref ? (
              <div className="grid place-items-center rounded-3xl bg-white/10 p-10 text-center backdrop-blur" role="status">
                <div>
                  <div className="text-5xl">🛬</div>
                  <p className="mt-4 text-sm text-white/75">{t.sent_title}</p>
                  <p className="font-display mt-2 text-4xl font-bold tracking-wider text-[#e8d5a8]">{ref}</p>
                  <p className="mx-auto mt-3 max-w-sm text-sm text-white/70">{t.sent_sub}</p>
                  <button onClick={() => setRef(null)} className="btn-ghost mt-6 rounded-full px-5 py-2.5 text-sm !text-white" style={{ borderColor: 'rgba(255,255,255,.35)' }}>+ {t.send}</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-3xl bg-white/10 p-6 backdrop-blur sm:p-8" style={{ color: 'var(--text)' }}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required value={form.name} onChange={set('name')} placeholder={t.f_name} className={inputCls} style={inputStyle} />
                  <input value={form.company} onChange={set('company')} placeholder={t.f_company} className={inputCls} style={inputStyle} />
                </div>
                <input required value={form.contact} onChange={set('contact')} placeholder={t.f_contact} className={`${inputCls} mt-3`} style={inputStyle} />
                <select value={form.service} onChange={set('service')} className={`${inputCls} mt-3`} style={inputStyle} aria-label={t.f_service}>
                  <option value="trade">✈ {t.svc_trade}</option>
                  <option value="setup">🏢 {t.svc_setup}</option>
                  <option value="both">✈ + 🏢 {t.svc_both}</option>
                </select>
                <textarea required rows={4} value={form.details} onChange={set('details')} placeholder={t.f_details} className={`${inputCls} mt-3 resize-none`} style={inputStyle} />
                <button type="submit" className="btn-gold mt-5 w-full rounded-full px-6 py-3.5 text-sm">{t.send} →</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="px-4 pb-10 sm:px-6" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 pt-7">
          <div className="flex items-center gap-3">
            <div className="leading-tight"><div className="font-display font-bold tracking-[.18em]">SPEEDEX</div><div className="text-[10px]" style={{ color: 'var(--faint)' }}>{t.footer_tag}</div></div>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{t.rights}</p>
          <button onClick={onReplay} className="btn-ghost rounded-full px-4 py-2 text-xs">{t.replay_flight}</button>
        </div>
      </footer>
    </>
  )
}
