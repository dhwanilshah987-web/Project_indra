'use client'

import { useState } from 'react'
import { CommandHeader } from '@/components/command-header'
import { ThreatRadarSidebar } from '@/components/threat-radar-sidebar'
import { TacticalMap } from '@/components/tactical-map'

export default function CommandCenterPage() {
  const [activeId, setActiveId] = useState<string | null>('1')

  const handleSelect = (id: string) =>
    setActiveId((cur) => (cur === id ? null : id))

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-slate-950 text-slate-100">
      <CommandHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* 35% left sidebar */}
        <div className="h-1/2 lg:h-auto lg:w-[35%]">
          <ThreatRadarSidebar activeId={activeId} onSelect={handleSelect} />
        </div>
        {/* 65% main map area */}
        <div className="min-h-0 flex-1 lg:w-[65%]">
          <TacticalMap activeId={activeId} onSelect={handleSelect} />
        </div>
      </div>
    </main>
  )
}
