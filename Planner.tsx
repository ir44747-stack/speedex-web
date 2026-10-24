'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { dict, type Lang } from '@/lib/i18n'

const CHINA_ORIGINS = [
  { id: 'ningbo', label: 'Ningbo · 宁波 · نينغبو', sea: [22, 30], air: [5, 8], seaRate: 385 },
  { id: 'shanghai', label: 'Shanghai · 上海 · شنغهاي', sea: [22, 30], air: [4, 7], seaRate: 390 },
  { id: 'guangzhou', label: 'Guangzhou · 广州 · قوانغتشو', sea: [20, 28], air: [4, 6], seaRate: 365 },
  { id: 'shenzhen', label: 'Shenzhen · 深圳 · شنتشن', sea: [20, 27], air: [4, 6], seaRate: 365 },
  { id: 'yiwu', label: 'Yiwu · 义乌 · إيوو', sea: [24, 32], air: [5, 8], seaRate: 405 },
] as const

const QATAR_ORIGINS = [
  { id: 'hamad-port', label: 'Hamad Port · ميناء حمد · 哈马德港', sea: [22, 30], air: [5, 8], seaRate: 410 },
  { id: 'hamad-airport', label: 'Hamad International Airport · مطار حمد الدولي · 哈马德国际机场', sea: [24, 32], air: [4, 7], seaRate: 425 },
  { id: 'mesaieed', label: 'Mesaieed Industrial City · مدينة مسيعيد الصناعية · 梅赛义德工业城', sea: [23, 31], air: [5, 8], seaRate: 415 },
  { id: 'ras-laffan', label: 'Ras Laffan Industrial City · مدينة راس لفان الصناعية · 拉斯拉凡工业城', sea: [24, 33], air: [5, 8], seaRate: 430 },
] as const

type PlannerOrigin = (typeof CHINA_ORIGINS)[number] | (typeof QATAR_ORIGINS)[number]

export default function Planner({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const isRtl = t.dir === 'rtl'
  const [mode, setMode] = useState<'sea' | 'air'>('sea')
  const [direction, setDirection] = useState<'cn-qa' | 'qa-cn'>('cn-qa')
  const [originId, setOriginId] = useState<string>('guangzhou')
  const [cbm, setCbm] = useState(12)
  const [kg, setKg] = useState(1800)
  const origins: readonly PlannerOrigin[] = direction === 'cn-qa' ? CHINA_ORIGINS : QATAR_ORIGINS
  const origin = origins.find((item) => item.id === originId) ?? origins[0]
  const destination = direction === 'cn-qa' ? t.planner_destination_qa : t.planner_destination_cn

  const selectDirection = (next: 'cn-qa' | 'qa-cn') => {
    setDirection(next)
    setOriginId(next === 'cn-qa' ? 'guangzhou' : 'hamad-port')
  }

  const calc = useMemo(() => {
    const chargeable = Math.max(kg, Math.round(cbm * 167))
    const base = mode === 'sea' ? Math.max(cbm, 1) * origin.seaRate + 650 : chargeable * 4.9 + 380
    const lo = Math.round((base * 0.85) / 10) * 10
    const hi = Math.round((base * 1.2) / 10) * 10
    const transit = mode === 'sea' ? origin.sea : origin.air
    const equip = mode === 'air'
      ? 'ULD / palletised air freight'
      : cbm <= 10
        ? t.container_lcl
        : cbm <= 28
          ? t.container_20
          : cbm <= 58
            ? t.container_40
            : t.container_40hq
    const fill = mode === 'sea' ? Math.min(100, (cbm / 68) * 100) : Math.min(100, (chargeable / 5000) * 100)
    return { chargeable, lo, hi, transit, equip, fill }
  }, [cbm, kg, mode, origin, t])

  const outputs: [string, string][] = [
    [t.planner_destination, destination],
    [t.transit, `${calc.transit[0]}–${calc.transit[1]} ${t.days}`],
    [t.indicative, `$${calc.lo.toLocaleString('en-US')} – $${calc.hi.toLocaleString('en-US')}`],
    [t.equipment, calc.equip],
    [t.chargeable, `${calc.chargeable.toLocaleString('en-US')} kg`],
  ]

  return (
    <section id="planner" className="film-grain relative isolate scroll-mt-20 overflow-hidden bg-[#070709] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10">
      <div className="absolute inset-0 -z-20 opacity-24" data-parallax-wrap>
        <div className="absolute inset-[-8%_0]" data-parallax>
          <Image
            src="/assets/doha-west-bay-real.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_42%]"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(115deg, rgba(7,3,8,.97) 0%, rgba(53,6,20,.9) 52%, rgba(7,3,8,.78) 100%)' }}
      />

      <div className="relative mx-auto max-w-[88rem]">
        <div className="reveal grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="kicker"><span className="font-display me-4" style={{ color: 'var(--gold)' }}>06</span>{t.calc_kicker}</p>
            <h3 className="architectural-heading mt-5 text-4xl sm:text-6xl">{t.calc_title}</h3>
            <p className="mt-5 max-w-2xl leading-8 text-white/66">{t.calc_sub}</p>
          </div>

          <div className="flex gap-8 pb-2" role="group" aria-label={t.mode}>
            {(['sea', 'air'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                aria-pressed={mode === item}
                data-active={mode === item}
                className="tab-underline font-display py-2 text-base font-bold sm:text-lg"
                style={{ color: mode === item ? '#E5C98C' : 'rgba(255,255,255,.52)' }}
              >
                {item === 'sea' ? t.sea : t.air}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="reveal glass-ribbon-dark space-y-10 p-7 lg:p-9" data-planner-controls>
            <div>
              <span className="text-[10px] font-bold tracking-[0.26em] text-white/62 uppercase">{t.planner_direction}</span>
              <div className="mt-3 flex flex-wrap gap-x-7 gap-y-3" role="group" aria-label={t.planner_direction}>
                {(['cn-qa', 'qa-cn'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectDirection(item)}
                    aria-pressed={direction === item}
                    data-active={direction === item}
                    data-planner-direction={item}
                    className="tab-underline py-2 text-sm font-bold"
                    style={{ color: direction === item ? '#E5C98C' : 'rgba(255,255,255,.54)' }}
                  >
                    {item === 'cn-qa' ? t.planner_cn_qa : t.planner_qa_cn}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-white/48">{t.route_scope}</p>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold tracking-[0.26em] text-white/62 uppercase">{t.origin}</span>
              <span className="relative block">
                <select
                  value={originId}
                  onChange={(event) => setOriginId(event.target.value)}
                  data-planner-origin
                  className="underline-field mt-1 pe-8 text-lg font-semibold text-white"
                  style={{ borderBottomColor: 'rgba(255,255,255,.28)' }}
                >
                  {origins.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
                <span aria-hidden="true" className="pointer-events-none absolute end-1 top-1/2 -translate-y-1/3 text-[#E5C98C]">⌄</span>
              </span>
            </label>

            <label className="block">
              <span className="flex items-end justify-between gap-6">
                <span className="text-[10px] font-bold tracking-[0.26em] text-white/62 uppercase">{t.cbm}</span>
                <span className="font-display text-3xl font-bold text-[#E5C98C] tabular-nums">{cbm}<span className="ms-1 text-sm text-white/50">CBM</span></span>
              </span>
              <input type="range" min={1} max={80} value={cbm} onChange={(event) => setCbm(Number(event.target.value))} className="lux-range mt-3" />
            </label>

            <label className="block">
              <span className="flex items-end justify-between gap-6">
                <span className="text-[10px] font-bold tracking-[0.26em] text-white/62 uppercase">{t.weight}</span>
                <span className="font-display text-3xl font-bold text-[#E5C98C] tabular-nums">{kg.toLocaleString('en-US')}<span className="ms-1 text-sm text-white/50">kg</span></span>
              </span>
              <input type="range" min={50} max={24000} step={50} value={kg} onChange={(event) => setKg(Number(event.target.value))} className="lux-range mt-3" />
            </label>

            <div>
              <div className="flex items-end gap-1.5" aria-hidden="true">
                {Array.from({ length: 30 }).map((_, index) => {
                  const active = (index / 30) * 100 < calc.fill
                  return (
                    <span
                      key={index}
                      className="flex-1 transition-[transform,opacity,background] duration-500"
                      style={{
                        height: `${26 + Math.sin(index * 0.72) * 6}px`,
                        background: active ? 'linear-gradient(180deg,#E5C98C,#84314A)' : 'rgba(255,255,255,.12)',
                        opacity: active ? 1 : 0.55,
                        transform: `scaleY(${active ? 1.32 : 0.72})`,
                        transformOrigin: 'bottom center',
                      }}
                    />
                  )
                })}
              </div>
              <div className="mt-3 flex justify-between text-[10px] tracking-[0.2em] text-white/58 uppercase">
                <span>{mode === 'sea' ? 'Container / consolidation fill' : 'Chargeable load'}</span>
                <span className="tabular-nums">{Math.round(calc.fill)}%</span>
              </div>

              {/* Live container-fill volume simulator — fill scales on transform only. */}
              <div className="mt-5" data-container-simulator aria-hidden="true">
                <div className="relative h-16 overflow-hidden" style={{ border: '1px solid rgba(232,213,168,.38)', background: 'rgba(7,3,8,.42)' }}>
                  <div
                    className="absolute inset-0 transition-transform duration-700"
                    style={{
                      background: 'linear-gradient(90deg, rgba(107,29,47,.92), rgba(200,58,93,.58) 58%, rgba(229,201,140,.85))',
                      transform: `scaleX(${Math.max(0, Math.min(100, calc.fill)) / 100})`,
                      transformOrigin: isRtl ? 'right center' : 'left center',
                    }}
                  />
                  <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 22px, rgba(255,255,255,.07) 22px 23px)' }} />
                  <div className="absolute inset-0 grid grid-cols-12">
                    {Array.from({ length: 12 }).map((_, index) => {
                      const active = (index / 12) * 100 < calc.fill
                      return (
                        <span
                          key={index}
                          className="transition-opacity duration-500"
                          style={{
                            borderInlineEnd: '1px solid rgba(232,213,168,.22)',
                            background: active ? 'rgba(229,201,140,.12)' : 'transparent',
                            opacity: active ? 1 : 0.35,
                          }}
                        />
                      )
                    })}
                  </div>
                  <span className="font-display absolute inset-y-0 end-3 flex items-center text-xl font-bold text-white tabular-nums" style={{ textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>
                    {Math.round(calc.fill)}%
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-[9px] tracking-[0.22em] text-white/44 uppercase">
                  <span>0 CBM</span>
                  <span>{mode === 'sea' ? '40HQ envelope' : 'ULD envelope'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal glass-ribbon-dark p-7 lg:mt-20 lg:p-9" data-planner-results>
            <dl>
              {outputs.map(([label, value], index) => (
                <div key={label} data-planner-output className="group grid gap-2 py-6 transition-transform duration-500 motion-safe:hover:-translate-y-0.5 sm:grid-cols-[0.72fr_1.28fr] sm:items-end" style={{ borderTop: index === 0 ? undefined : '1px solid rgba(232,213,168,.22)' }}>
                  <dt className="text-[10px] font-bold tracking-[0.26em] text-white/62 uppercase">
                    <span className="me-3 text-[#C5A059]">0{index + 1}</span>{label}
                  </dt>
                  <dd className="font-display text-2xl leading-tight font-bold text-white sm:text-end sm:text-[2rem]">
                    {value}
                    <span className="data-meter mt-3 block max-w-[220px] sm:ms-auto" aria-hidden="true">
                      <span className="data-meter-fill" data-meter-fill style={{ width: `${[88, 72, 94, 81][index]}%` }} />
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6" style={{ borderTop: '1px solid rgba(232,213,168,.22)' }}>
              <a href="#quote" className="btn-gold inline-flex min-h-12 items-center rounded-full px-7 text-sm">
                {t.get_quote} <span aria-hidden="true" className="ms-2">{isRtl ? '←' : '→'}</span>
              </a>
              <p className="max-w-md text-[11px] leading-5 text-white/44">{t.calc_note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
