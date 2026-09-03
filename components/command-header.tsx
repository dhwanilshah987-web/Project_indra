'use client'

import { useEffect, useState } from 'react'

export function CommandHeader() {
  const [time, setTime] = useState('--:--:--')

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', { hour12: false }) + ' IST',
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-cyan-500/15 glass px-5 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-400/40 bg-cyan-500/10">
          <span className="font-mono text-sm font-black text-cyan-300 text-glow-cyan">
            M
          </span>
        </div>
        <div>
          <h1 className="font-mono text-sm font-bold tracking-[0.15em] text-slate-100">
            MINISTRY OF HOME AFFAIRS
          </h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/70">
            CYBER COMMAND &amp; INTERCEPTION CENTER
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-5 md:flex">
        <Indicator label="SYSTEM" value="OPERATIONAL" tone="cyan" pulse />
        <Indicator label="THREAT LEVEL" value="SEVERE" tone="rose" pulse />
        <div className="flex flex-col items-end">
          <span className="font-mono text-[9px] tracking-widest text-slate-500">
            SECURE UPLINK
          </span>
          <span className="font-mono text-[13px] font-semibold text-cyan-300">
            {time}
          </span>
        </div>
      </div>
    </header>
  )
}

function Indicator({
  label,
  value,
  tone,
  pulse,
}: {
  label: string
  value: string
  tone: 'cyan' | 'rose'
  pulse?: boolean
}) {
  const color = tone === 'cyan' ? 'text-cyan-300' : 'text-rose-400 text-glow-rose'
  const dot = tone === 'cyan' ? 'bg-cyan-400' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${dot} ${pulse ? 'animate-ticker-blink' : ''}`}
      />
      <div className="flex flex-col">
        <span className="font-mono text-[9px] tracking-widest text-slate-500">
          {label}
        </span>
        <span className={`font-mono text-[12px] font-bold tracking-wider ${color}`}>
          {value}
        </span>
      </div>
    </div>
  )
}
