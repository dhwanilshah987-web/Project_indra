'use client'

import { type ThreatAlert, formatINR } from '@/lib/threats'
import { cn } from '@/lib/utils'

const severityStyles: Record<
  ThreatAlert['severity'],
  { ring: string; text: string; dot: string; label: string }
> = {
  CRITICAL: {
    ring: 'border-rose-500/40 hover:border-rose-400/70',
    text: 'text-rose-400 text-glow-rose',
    dot: 'bg-rose-500 shadow-[0_0_10px_2px] shadow-rose-500/70',
    label: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
  HIGH: {
    ring: 'border-amber-500/30 hover:border-amber-400/60',
    text: 'text-amber-300',
    dot: 'bg-amber-400 shadow-[0_0_10px_2px] shadow-amber-400/60',
    label: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  },
  ELEVATED: {
    ring: 'border-cyan-500/25 hover:border-cyan-400/50',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400 shadow-[0_0_10px_2px] shadow-cyan-400/60',
    label: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/40',
  },
}

interface Props {
  alert: ThreatAlert
  active: boolean
  onSelect: (id: string) => void
}

export function ThreatAlertCard({ alert, active, onSelect }: Props) {
  const s = severityStyles[alert.severity]

  return (
    <button
      type="button"
      onClick={() => onSelect(alert.id)}
      aria-pressed={active}
      className={cn(
        'group w-full animate-alert-slide-in rounded-md border bg-slate-900/40 p-3 text-left transition-all duration-200',
        'hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60',
        s.ring,
        active && 'bg-slate-800/70 ring-1 ring-cyan-400/50',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 shrink-0 rounded-full', s.dot)} />
          <span className="font-mono text-[13px] font-semibold tracking-wide text-slate-100">
            {alert.txnId}
          </span>
        </div>
        <span
          className={cn(
            'rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest',
            s.label,
          )}
        >
          {alert.severity}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
        <Field label="AMOUNT" value={formatINR(alert.amount)} valueClass={s.text} />
        <Field
          label="DIST. DISCREPANCY"
          value={`${alert.distanceKm.toFixed(1)} km`}
        />
        <div className="col-span-2">
          <Field label="PREDICTED ATM TARGET" value={alert.atmTarget} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
          <span className="text-cyan-400/80">{alert.sector}</span>
          <span>·</span>
          <span>+{alert.timestamp}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-slate-500">ML CONF</span>
          <span className="font-mono text-[11px] font-bold text-cyan-300">
            {alert.confidence}%
          </span>
        </div>
      </div>
    </button>
  )
}

function Field({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div
        className={cn(
          'truncate font-mono text-[12px] font-medium text-slate-200',
          valueClass,
        )}
      >
        {value}
      </div>
    </div>
  )
}
