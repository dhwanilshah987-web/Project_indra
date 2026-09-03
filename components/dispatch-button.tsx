'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DispatchButton() {
  const [dispatched, setDispatched] = useState(false)

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 p-5">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-rose-500/30 bg-slate-950/70 px-3 py-1 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-ticker-blink rounded-full bg-rose-500" />
        <span className="font-mono text-[10px] tracking-widest text-rose-300/90">
          {dispatched ? 'UNIT EN ROUTE · ETA 04:12' : 'INTERCEPTION UNIT ON STANDBY'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setDispatched((d) => !d)}
        aria-pressed={dispatched}
        className={cn(
          'group pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-lg border-2 px-8 py-5 transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/40',
          dispatched
            ? 'border-cyan-400/60 bg-cyan-500/10'
            : 'animate-dispatch-pulse border-rose-500/70 bg-gradient-to-b from-rose-600/30 to-rose-800/20 hover:from-rose-500/40 hover:to-rose-700/30',
        )}
      >
        {/* moving sheen */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative flex items-center justify-center gap-3">
          <span
            className={cn(
              'text-2xl leading-none',
              dispatched ? 'text-cyan-300' : 'text-rose-200',
            )}
            aria-hidden="true"
          >
            {dispatched ? '✓' : '⚠️'}
          </span>
          <span
            className={cn(
              'font-mono text-lg font-black uppercase tracking-[0.2em]',
              dispatched
                ? 'text-cyan-200 text-glow-cyan'
                : 'text-rose-100 text-glow-rose',
            )}
          >
            {dispatched ? 'INTERCEPTION DISPATCHED' : 'DISPATCH INTERCEPTION UNIT'}
          </span>
        </span>

        <span
          className={cn(
            'relative mt-1 block text-center font-mono text-[10px] tracking-widest',
            dispatched ? 'text-cyan-400/70' : 'text-rose-300/70',
          )}
        >
          {dispatched
            ? 'TAP TO RECALL · AUTHORIZATION LEVEL-5 GRANTED'
            : 'CRITICAL ACTION · REQUIRES LEVEL-5 CLEARANCE'}
        </span>
      </button>
    </div>
  )
}
