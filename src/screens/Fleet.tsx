import { useState } from 'react'
import { collections, services } from '../data/mock'
import { StatusDot, BudgetBar, ScoreBar, LangTag } from '../components/ui'
import type { Collection } from '../types'

export function Fleet() {
  const [activeCollection, setActiveCollection] = useState<Collection>(collections[0])
  const [selected, setSelected]                 = useState<Set<string>>(new Set())
  const [confirmed, setConfirmed]               = useState(false)

  const toggleSelect = (id: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const collectionServices = services.slice(0, 7)
  const selectedCount = selected.size

  return (
    <div className="h-full overflow-hidden p-5" style={{ animation: 'fadeUp .3s ease' }}>
      <div className="grid grid-cols-[220px_1fr] gap-3 h-full">

        {/* Sidebar — collections */}
        <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(255,255,255,.06)]">
            <span className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider">// collections</span>
            <button className="font-mono text-[10px] text-[#1D9E75] hover:text-[#3ECFA0] transition-colors">+ new</button>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {collections.map(coll => (
              <button
                key={coll.id}
                onClick={() => { setActiveCollection(coll); setSelected(new Set()) }}
                className={`w-full text-left px-2.5 py-2 rounded-md border transition-all ${
                  activeCollection.id === coll.id
                    ? 'bg-[rgba(29,158,117,.08)] border-[rgba(29,158,117,.25)]'
                    : 'border-transparent hover:bg-[#141D2B] hover:border-[rgba(255,255,255,.06)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#E2E8F0] font-medium">{coll.name}</span>
                  <span className="font-mono text-[10px] text-[#4A5568]">{coll.count}</span>
                </div>
                <div className="font-mono text-[10px] text-[#4A5568] mt-0.5">{coll.filter}</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <StatusDot status={coll.status} />
                  <div className="flex-1 h-1 bg-[#141D2B] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${coll.healthPct}%`,
                      background: coll.status === 'healthy' ? '#3FB950' : '#D29922'
                    }} />
                  </div>
                  <span className={`font-mono text-[10px] ${coll.status === 'healthy' ? 'text-[#3FB950]' : 'text-[#D29922]'}`}>
                    {coll.healthPct}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Collection header */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-3.5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-mono text-[14px] text-[#E2E8F0] font-medium">{activeCollection.name}</h2>
                <p className="font-mono text-[10px] text-[#4A5568] mt-0.5">{activeCollection.count} services · {activeCollection.filter}</p>
              </div>
              <span className="font-mono text-[11px] text-[#8B9CB6]">{selectedCount} selected</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { val: String(collectionServices.filter(s => s.health === 'healthy').length), label: 'healthy', color: 'text-[#3FB950]' },
                { val: String(collectionServices.filter(s => s.health !== 'healthy').length), label: 'issues',  color: 'text-[#D29922]' },
                { val: '74', label: 'avg maturity', color: 'text-[#E2E8F0]' },
                { val: '$4.2k', label: 'monthly cost', color: 'text-[#E2E8F0]' },
              ].map((s, i) => (
                <div key={i} className="bg-[#080C11] border border-[rgba(255,255,255,.06)] rounded-md px-3 py-2 text-center">
                  <div className={`font-mono text-[16px] font-semibold ${s.color}`}>{s.val}</div>
                  <div className="font-mono text-[10px] text-[#4A5568] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bulk op buttons */}
            <div className="flex items-center gap-2">
              {['bulk deploy', 'bulk rollback', 'bulk rescan', 'bulk patch'].map((op, i) => (
                <button
                  key={op}
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-md border transition-all ${
                    i === 1
                      ? 'border-[rgba(210,153,34,.3)] text-[#D29922] bg-[rgba(210,153,34,.06)] hover:bg-[rgba(210,153,34,.12)]'
                      : 'border-[rgba(255,255,255,.08)] text-[#8B9CB6] bg-[#141D2B] hover:border-[rgba(29,158,117,.3)] hover:text-[#3ECFA0]'
                  }`}
                >{op}</button>
              ))}
              <div className="ml-auto font-mono text-[10px] text-[#8B9CB6]">
                blast radius: <span className="text-[#D29922]">medium (3 deps)</span>
              </div>
            </div>
          </div>

          {/* Services table */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="grid px-4 py-2.5 bg-[#080C11] border-b border-[rgba(255,255,255,.06)] flex-shrink-0"
              style={{ gridTemplateColumns: '28px 1fr 80px 80px 110px 100px 80px' }}>
              {['', 'service', 'health', 'maturity', 'error budget', 'blast radius', 'version'].map((h, i) => (
                <span key={i} className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            <div className="overflow-y-auto flex-1">
              {collectionServices.map(svc => (
                <div
                  key={svc.id}
                  className="grid items-center px-4 py-2.5 border-b border-[rgba(255,255,255,.04)] last:border-0 hover:bg-[#141D2B] cursor-pointer transition-colors"
                  style={{ gridTemplateColumns: '28px 1fr 80px 80px 110px 100px 80px' }}
                  onClick={() => toggleSelect(svc.id)}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                    selected.has(svc.id)
                      ? 'bg-[rgba(29,158,117,.2)] border-[rgba(29,158,117,.5)]'
                      : 'bg-[#141D2B] border-[rgba(255,255,255,.1)]'
                  }`}>
                    {selected.has(svc.id) && <span className="w-2 h-2 bg-[#1D9E75] rounded-sm block" />}
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-[#E2E8F0] font-medium">{svc.name}</div>
                    <div className="font-mono text-[10px] text-[#4A5568]">{svc.team}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={svc.health} />
                    <span className={`font-mono text-[11px] ${svc.health === 'healthy' ? 'text-[#3FB950]' : svc.health === 'frozen' ? 'text-[#F85149]' : 'text-[#D29922]'}`}>
                      {svc.health}
                    </span>
                  </div>
                  <ScoreBar score={svc.maturityScore} />
                  <BudgetBar pct={svc.budgetPct} status={svc.budgetStatus} />
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                    svc.health === 'frozen' ? 'bg-[rgba(248,81,73,.1)] text-[#F85149]' :
                    svc.health !== 'healthy' ? 'bg-[rgba(210,153,34,.1)] text-[#D29922]' :
                    'bg-[rgba(63,185,80,.1)] text-[#3FB950]'
                  }`}>{svc.health === 'frozen' ? 'high' : svc.health !== 'healthy' ? 'medium' : 'low'}</span>
                  <span className="font-mono text-[11px] text-[#8B9CB6]">{svc.version}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm banner */}
          {selectedCount > 0 && (
            <div className="bg-[rgba(210,153,34,.06)] border border-[rgba(210,153,34,.3)] rounded-lg px-4 py-2.5 flex items-center justify-between flex-shrink-0">
              <span className="font-mono text-[11px] text-[#D29922]">
                {selectedCount} service{selectedCount > 1 ? 's' : ''} selected · bulk rescan will re-evaluate golden path compliance · est. ~{selectedCount * 3}s
              </span>
              <div className="flex gap-2">
                <button onClick={() => setSelected(new Set())} className="font-mono text-[11px] px-3 py-1.5 bg-transparent border border-[rgba(255,255,255,.1)] rounded-md text-[#8B9CB6] hover:border-[rgba(255,255,255,.2)] transition-all">
                  cancel
                </button>
                <button onClick={() => setConfirmed(true)} className="font-mono text-[11px] px-3 py-1.5 bg-[rgba(210,153,34,.1)] border border-[rgba(210,153,34,.3)] rounded-md text-[#D29922] hover:bg-[rgba(210,153,34,.2)] transition-all">
                  {confirmed ? 'running...' : 'confirm rescan →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}