'use client'

import type { CSSProperties } from 'react'

const STARS = [
  { left: '12%', top: '20%', size: 5, delay: '0s' },
  { left: '25%', top: '58%', size: 3.5, delay: '.55s' },
  { left: '42%', top: '18%', size: 4, delay: '1.05s' },
  { left: '58%', top: '64%', size: 3, delay: '.3s' },
  { left: '70%', top: '25%', size: 4.5, delay: '1.35s' },
  { left: '84%', top: '55%', size: 3.5, delay: '.8s' },
] as const

interface DayNightToggleProps {
  theme: string
  onToggle: () => void
  label: string
  className?: string
}

/**
 * A miniature day-to-night scene, drawn entirely with CSS gradients.
 * `role="switch"` exposes the state semantically: checked means dark mode.
 */
export default function DayNightToggle({ theme, onToggle, label, className = '' }: DayNightToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={onToggle}
      dir="ltr"
      data-testid="day-night-toggle"
      data-state={isDark ? 'dark' : 'light'}
      className={`day-night-toggle ${className}`}
    >
      <span className="dnt-scene dnt-scene--day" aria-hidden="true">
        <svg className="dnt-birds" viewBox="0 0 48 16" fill="none" aria-hidden="true">
          <path d="M4 9c2.7-2.9 5.4-2.9 8 0 2.6-2.9 5.3-2.9 8 0" />
          <path d="M27 5c2.2-2.3 4.4-2.3 6.5 0 2.1-2.3 4.3-2.3 6.5 0" />
        </svg>
        <span className="dnt-cloud dnt-cloud--day-one" />
        <span className="dnt-cloud dnt-cloud--day-two" />
      </span>

      <span className="dnt-scene dnt-scene--night" aria-hidden="true">
        {STARS.map((star) => (
          <span
            key={`${star.left}-${star.top}`}
            className="dnt-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            } as CSSProperties}
          />
        ))}
        <span className="dnt-cloud dnt-cloud--night-one" />
        <span className="dnt-cloud dnt-cloud--night-two" />
      </span>

      <span className="dnt-thumb" aria-hidden="true">
        <span className="dnt-orb dnt-orb--sun" />
        <span className="dnt-orb dnt-orb--moon">
          <span className="dnt-crater dnt-crater--one" />
          <span className="dnt-crater dnt-crater--two" />
          <span className="dnt-crater dnt-crater--three" />
          <span className="dnt-crater dnt-crater--four" />
        </span>
      </span>

      <span className="dnt-sheen" aria-hidden="true" />
    </button>
  )
}
