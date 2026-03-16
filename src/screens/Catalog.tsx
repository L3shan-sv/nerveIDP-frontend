import { useState } from 'react'
import { Search, Plus, ShieldAlert } from 'lucide-react'
import { LangTag, StatusDot, BudgetBar, ScoreBar, Pill } from '../components/ui'
import { services } from '../data/mock'
import type { Service } from '../types'

const filters = ['all', 'degraded', 'frozen', 'score < 80', 'my team'] as const

export function Catalog() {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState<string>('all')

  const filtered = services.filter(svc => {
    const matchQuery = svc.name.includes(query) || svc.team.includes(query)
    const matchFilter =
      filter === 'all'         ? true :
      filter === 'degraded'    ? svc.health === 'degraded' :
      filter === 'frozen'      ? svc.health === 'frozen' :
      filter === 'score < 80'  ? svc.maturityScore < 80 :
      filter === 'my team'     ? svc.team === 'platform-team' : true
    return matchQuery && matchFilter
  })

  const healthyCount  = services.filter(s => s.health === 'healthy').length
  const degradedCount = services.filter(s => s.health === 'degraded').length
  const frozenCount   = services.filter(s => s.health === 'frozen').length
  const cveCount      = services.filter(s => s.hasCVE).length

  return (
    <div className="h-full overflow-y-auto p-5 space-y-3" style={{ animation: 'fadeUp .3s ease' }}>

      {/* Summary strip */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: `${services.length} services` },
          { label: `${healthyCount} healthy`,  color: 'text-[#3FB950]' },
          { label: `${degradedCount} degraded`, color: 'text-[#D29922]' },
          { label: `${frozenCount} frozen`,     color: 'text-[#F85149]' },
          { label: `avg maturity 71`,           color: 'text-[#D29922]' },
          { label: `${cveCount} critical CVEs`, color: 'text-[#F85149]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-md px-3 py-1.5 font-mono text-[11px] text-[#8B9CB6]">
            <span className={s.color}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="// search services, teams, tags..."
            className="w-full bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-md pl-8 pr-3 py-2 font-mono text-[11px] text-[#E2E8F0] placeholder-[#4A5568] outline-none focus:border-[rgba(29,158,117,.4)] transition-colors"
          />
        </div>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-[11px] px-3 py-2 rounded-md border transition-all ${
              filter === f
                ? 'bg-[rgba(29,158,117,.1)] border-[rgba(29,158,117,.3)] text-[#3ECFA0]'
                : 'bg-[#0E1520] border-[rgba(255,255,255,.06)] text-[#8B9CB6] hover:border-[rgba(255,255,255,.15)] hover:text-[#E2E8F0]'
            }`}
          >{f}</button>
        ))}
        <button className="flex items-center gap-1.5 font-mono text-[11px] px-3 py-2 bg-[rgba(29,158,117,.12)] border border-[rgba(29,158,117,.3)] rounded-md text-[#3ECFA0] hover:bg-[rgba(29,158,117,.2)] transition-all">
          <Plus size={12} />
          scaffold new
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid gap-0 px-4 py-2.5 bg-[#080C11] border-b border-[rgba(255,255,255,.06)]"
          style={{ gridTemplateColumns: '1fr 80px 90px 90px 110px 90px 80px' }}>
          {['service', 'lang', 'health', 'maturity', 'error budget', 'last deploy', 'action'].map(h => (
            <span key={h} className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map(svc => (
          <ServiceRow key={svc.id} svc={svc} />
        ))}

        {filtered.length === 0 && (
          <div className="py-8 text-center font-mono text-[11px] text-[#4A5568]">
            no services match · try a different filter
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceRow({ svc }: { svc: Service }) {
  const healthLabel: Record<string, string> = { healthy: 'healthy', degraded: 'warn', frozen: 'frozen' }
  const healthColor: Record<string, string> = {
    healthy: 'text-[#3FB950]', degraded: 'text-[#D29922]', frozen: 'text-[#F85149]'
  }

  return (
    <div
      className="grid items-center px-4 py-2.5 border-b border-[rgba(255,255,255,.04)] last:border-0 cursor-pointer hover:bg-[#141D2B] transition-colors"
      style={{ gridTemplateColumns: '1fr 80px 90px 90px 110px 90px 80px' }}
    >
      {/* Service info */}
      <div>
        <div className="font-mono text-[12px] text-[#E2E8F0] font-medium">{svc.name}</div>
        <div className="font-mono text-[10px] text-[#4A5568]">{svc.team} · {svc.version} · {svc.replicas} replicas</div>
      </div>

      {/* Lang */}
      <div><LangTag lang={svc.lang} /></div>

      {/* Health */}
      <div className="flex items-center gap-1.5">
        <StatusDot status={svc.health} />
        <span className={`font-mono text-[11px] ${healthColor[svc.health]}`}>{healthLabel[svc.health]}</span>
      </div>

      {/* Maturity */}
      <div><ScoreBar score={svc.maturityScore} /></div>

      {/* Budget */}
      <div><BudgetBar pct={svc.budgetPct} status={svc.budgetStatus} /></div>

      {/* Last deploy */}
      <div className="font-mono text-[11px] text-[#8B9CB6]">{svc.lastDeployAgo}</div>

      {/* Action */}
      <div>
        {svc.hasCVE ? (
          <button className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 bg-[rgba(248,81,73,.1)] border border-[rgba(248,81,73,.25)] rounded text-[#F85149]">
            <ShieldAlert size={10} />CVE
          </button>
        ) : svc.health === 'frozen' ? (
          <button className="font-mono text-[10px] px-2 py-1 bg-[rgba(248,81,73,.08)] border border-[rgba(248,81,73,.2)] rounded text-[#F85149] opacity-60 cursor-not-allowed">
            frozen
          </button>
        ) : (
          <button className="font-mono text-[10px] px-2 py-1 bg-[#141D2B] border border-[rgba(255,255,255,.1)] rounded text-[#8B9CB6] hover:border-[rgba(29,158,117,.4)] hover:text-[#3ECFA0] transition-all">
            deploy
          </button>
        )}
      </div>
    </div>
  )
}