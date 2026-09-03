'use client'

import { THREAT_ALERTS, formatINR } from '@/lib/threats'
import { cn } from '@/lib/utils'
import { DispatchButton } from './dispatch-button'
import { MapboxMap } from "./mapbox-map"

interface Props {
  activeId: string | null
  onSelect: (id: string) => void
}

export function TacticalMap({ activeId, onSelect }: Props) {
  const active = THREAT_ALERTS.find((a) => a.id === activeId) ?? null

  return (
    <section className="relative h-full w-full overflow-hidden bg-slate-950">
      {/* Mapbox GL placeholder — grid background */}
    <MapboxMap
  latitude={active?.latitude}
  longitude={active?.longitude}
  atmLatitude={active?.atmLatitude}
  atmLongitude={active?.atmLongitude}
  transactionId={active?.txnId}
  severity={active?.severity}
/>
      {/* radial depth glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,oklch(0.145_0_0/0.7)_100%)]" />

      {/* Rotating radar sweep centered */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
        <div className="absolute inset-[15%] rounded-full border border-cyan-500/10" />
        <div className="absolute inset-[32%] rounded-full border border-cyan-500/10" />
        <div className="absolute inset-[48%] rounded-full border border-cyan-500/10" />
        <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left animate-radar-sweep bg-[conic-gradient(from_0deg,oklch(0.82_0.15_195/0.18),transparent_38%)]" />
      </div>

      {/* Map label overlay */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded border border-cyan-500/20 glass px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_2px] shadow-cyan-400/70" />
        <span className="font-mono text-[10px] tracking-widest text-cyan-300/90">
          MAPBOX GL · NATIONAL GRID · LIVE
        </span>
      </div>

      <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1 rounded border border-white/5 glass px-3 py-1.5 text-right">
        <span className="font-mono text-[9px] tracking-widest text-slate-500">
          COORD LOCK
        </span>
        <span className="font-mono text-[11px] text-cyan-300">
          18.5204° N, 73.8567° E
        </span>
      </div>

      {/* Threat markers */}
      {THREAT_ALERTS.map((a) => {
        const isActive = a.id === activeId
        const isCritical = a.severity === 'CRITICAL'
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            aria-label={`Threat ${a.txnId} at ${a.atmTarget}`}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          >
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span
                className={cn(
                  'absolute inline-flex h-3 w-3 animate-ping-marker rounded-full',
                  isCritical ? 'bg-rose-500' : 'bg-cyan-400',
                )}
              />
              <span
                className={cn(
                  'relative inline-flex rounded-full transition-all',
                  isActive ? 'h-4 w-4' : 'h-2.5 w-2.5',
                  isCritical
                    ? 'bg-rose-500 shadow-[0_0_12px_3px] shadow-rose-500/70'
                    : 'bg-cyan-400 shadow-[0_0_12px_3px] shadow-cyan-400/60',
                )}
              />
            </span>
            {isActive && (
              <span
                className={cn(
                  'absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded border px-2 py-1 font-mono text-[10px]',
                  'glass',
                  isCritical
                    ? 'border-rose-500/40 text-rose-300'
                    : 'border-cyan-500/40 text-cyan-300',
                )}
              >
                {a.txnId}
              </span>
            )}
          </button>
        )
      })}

      {/* Active target readout */}
      {active && (
        <div className="absolute bottom-32 left-4 z-10 w-64 rounded-md border border-cyan-500/25 glass p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-cyan-400/80">
              TARGET LOCKED
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              {active.sector}
            </span>
          </div>
          <div className="mt-2 font-mono text-sm font-bold text-slate-100">
            {active.txnId}
          </div>
          <div className="mt-1 font-mono text-[11px] text-slate-400">
            {active.atmTarget}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
            <span className="font-mono text-[11px] text-rose-400 text-glow-rose">
              {formatINR(active.amount)}
            </span>
            <span className="font-mono text-[11px] text-cyan-300">
              {active.distanceKm.toFixed(1)} km off
            </span>
          </div>
        </div>
      )}

      {/* Dispatch button anchored to bottom */}
      <DispatchButton />
    </section>
  )
}
