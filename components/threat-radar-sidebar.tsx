'use client'

import { THREAT_ALERTS } from '@/lib/threats'
import { ThreatAlertCard } from './threat-alert-card'

interface Props {
  activeId: string | null
  onSelect: (id: string) => void
}

export function ThreatRadarSidebar({ activeId, onSelect }: Props) {
  const criticalCount = THREAT_ALERTS.filter(
    (a) => a.severity === 'CRITICAL',
  ).length

  return (
    <aside className="flex h-full w-full flex-col border-r border-cyan-500/15 glass">
      {/* Header */}
      <div className="border-b border-cyan-500/15 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping-marker rounded-full bg-rose-500" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_2px] shadow-rose-500/70" />
            </span>
            <h2 className="font-mono text-sm font-bold tracking-[0.18em] text-rose-400 text-glow-rose">
              LIVE THREAT RADAR
            </h2>
          </div>
        </div>
        <p className="mt-1.5 font-mono text-[10px] tracking-wider text-slate-500">
          REAL-TIME CYBERCRIME INTERCEPT FEED
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="INCOMING" value={THREAT_ALERTS.length} tone="cyan" />
          <Stat label="CRITICAL" value={criticalCount} tone="rose" />
          <Stat label="TRACKED" value={THREAT_ALERTS.length} tone="slate" />
        </div>
      </div>

      {/* Scrolling feed */}
      <div className="scrollbar-thin flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
        <div className="flex items-center gap-2 px-1 pb-1">
          <span className="h-1.5 w-1.5 animate-ticker-blink rounded-full bg-cyan-400" />
          <span className="font-mono text-[10px] tracking-widest text-cyan-400/70">
            STREAMING · {THREAT_ALERTS.length} ACTIVE SIGNALS
          </span>
        </div>
        {THREAT_ALERTS.map((alert) => (
          <ThreatAlertCard
            key={alert.id}
            alert={alert}
            active={activeId === alert.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'cyan' | 'rose' | 'slate'
}) {
  const toneClass =
    tone === 'cyan'
      ? 'text-cyan-300 text-glow-cyan'
      : tone === 'rose'
        ? 'text-rose-400 text-glow-rose'
        : 'text-slate-300'
  return (
    <div className="rounded border border-white/5 bg-slate-950/50 px-2 py-1.5">
      <div className={`font-mono text-lg font-bold leading-none ${toneClass}`}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="mt-1 font-mono text-[8px] tracking-widest text-slate-500">
        {label}
      </div>
    </div>
  )
}
