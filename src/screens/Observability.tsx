import { useState } from 'react'
import { services, burnRateAlerts, dora } from '../data/mock'
import { DoraBadge } from '../components/ui'

const tabs = ['error budgets', 'DORA metrics', 'cost intelligence', 'service maturity'] as const
type Tab = typeof tabs[number]

export function Observability() {
  const [tab, setTab] = useState<Tab>('error budgets')

  return (
    <div className="h-full overflow-y-auto p-5 space-y-3" style={{ animation: 'fadeUp .3s ease' }}>
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[11px] px-3.5 py-1.5 rounded-md border transition-all ${
              tab === t
                ? 'bg-[#0E1520] border-[rgba(29,158,117,.35)] text-[#3ECFA0]'
                : 'bg-transparent border-[rgba(255,255,255,.06)] text-[#8B9CB6] hover:border-[rgba(255,255,255,.12)] hover:text-[#E2E8F0]'
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 'error budgets' && <ErrorBudgets />}
      {tab === 'DORA metrics' && <DoraView />}
      {tab === 'cost intelligence' && <CostView />}
      {tab === 'service maturity' && <MaturityView />}
    </div>
  )
}

function ErrorBudgets() {
  const budgetServices = services.map(s => ({
    ...s,
    budgetMinutes: 43.2,
    consumedMinutes: parseFloat(((s.budgetPct / 100) * 43.2).toFixed(1)),
  }))

  return (
    <div className="space-y-3">
      <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest">// error budget health · all services · 30-day window</p>

      <div className="grid grid-cols-3 gap-3">
        {budgetServices.slice(0, 6).map(svc => (
          <div key={svc.id} className={`bg-[#0E1520] border rounded-lg p-3.5 transition-all ${
            svc.budgetStatus === 'frozen' ? 'border-[rgba(248,81,73,.35)] bg-[rgba(248,81,73,.03)]' :
            svc.budgetStatus === 'fast'   ? 'border-[rgba(210,153,34,.35)] bg-[rgba(210,153,34,.03)]' :
            'border-[rgba(255,255,255,.06)]'
          }`}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[11px] text-[#E2E8F0] font-medium">{svc.name}</span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                svc.budgetStatus === 'frozen' ? 'bg-[rgba(248,81,73,.1)] text-[#F85149] border-[rgba(248,81,73,.2)]' :
                svc.budgetStatus === 'fast'   ? 'bg-[rgba(210,153,34,.1)] text-[#D29922] border-[rgba(210,153,34,.2)]' :
                'bg-[rgba(63,185,80,.1)] text-[#3FB950] border-[rgba(63,185,80,.2)]'
              }`}>{
                svc.budgetStatus === 'frozen' ? 'frozen' :
                svc.budgetStatus === 'fast' ? 'fast burn' :
                svc.budgetStatus === 'slow' ? 'slow burn' :
                svc.budgetStatus === 'watch' ? 'watch' : 'healthy'
              }</span>
            </div>
            <div className="h-1.5 bg-[#141D2B] rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full transition-all duration-300" style={{
                width: `${svc.budgetPct}%`,
                background: svc.budgetStatus === 'frozen' ? '#F85149' : svc.budgetStatus === 'fast' || svc.budgetStatus === 'slow' ? '#D29922' : '#3FB950'
              }} />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-[#8B9CB6] mb-1.5">
              <span className={svc.budgetStatus === 'frozen' ? 'text-[#F85149]' : svc.budgetStatus !== 'healthy' ? 'text-[#D29922]' : 'text-[#3FB950]'}>
                {svc.budgetStatus === 'frozen' ? '0%' : `${100 - svc.budgetPct}%`} remaining
              </span>
              <span>{svc.consumedMinutes}/{svc.budgetMinutes} min</span>
            </div>
            <div className={`font-mono text-[10px] ${
              svc.budgetStatus === 'frozen' ? 'text-[#F85149]' :
              svc.budgetStatus !== 'healthy' && svc.budgetStatus !== 'watch' ? 'text-[#D29922]' : 'text-[#4A5568]'
            }`}>
              burn rate: {svc.burnRate}× · {
                svc.budgetStatus === 'frozen' ? 'page fired · deploy frozen' :
                svc.budgetStatus === 'fast' ? 'ticket created · monitoring' :
                svc.budgetStatus === 'watch' ? 'watch only' : 'on pace · no action'
              }
            </div>
          </div>
        ))}
      </div>

      {/* Burn rate table */}
      <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest pt-1">// multi-window burn rate alerts · active</p>
      <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg overflow-hidden">
        <div className="grid px-4 py-2 bg-[#080C11] border-b border-[rgba(255,255,255,.06)]"
          style={{ gridTemplateColumns: '160px 70px 100px 1fr 120px' }}>
          {['service', 'burn rate', 'window', 'time to exhaustion', 'action taken'].map(h => (
            <span key={h} className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {burnRateAlerts.map((a, i) => (
          <div key={i} className="grid items-center px-4 py-2.5 border-b border-[rgba(255,255,255,.04)] last:border-0"
            style={{ gridTemplateColumns: '160px 70px 100px 1fr 120px' }}>
            <span className={`font-mono text-[11px] font-medium ${
              a.action === 'page+freeze' || a.action === 'page' ? 'text-[#F85149]' :
              a.action === 'ticket' ? 'text-[#D29922]' : 'text-[#8B9CB6]'
            }`}>{a.service}</span>
            <span className={`font-mono text-[11px] font-semibold ${
              a.rate >= 14 ? 'text-[#F85149]' : a.rate >= 6 ? 'text-[#D29922]' : a.rate >= 3 ? 'text-[#D29922]' : 'text-[#8B9CB6]'
            }`}>{a.rate}×</span>
            <span className="font-mono text-[11px] text-[#8B9CB6]">{a.window}</span>
            <span className="font-mono text-[11px] text-[#8B9CB6]">{a.timeToExhaustion}</span>
            <span className={`font-mono text-[10px] px-2 py-0.5 rounded self-center ${
              a.action === 'page+freeze' ? 'bg-[rgba(248,81,73,.1)] text-[#F85149]' :
              a.action === 'page'        ? 'bg-[rgba(248,81,73,.1)] text-[#F85149]' :
              a.action === 'ticket'      ? 'bg-[rgba(210,153,34,.1)] text-[#D29922]' :
              'bg-[rgba(255,255,255,.05)] text-[#8B9CB6]'
            }`}>{a.action}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DoraView() {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest">// DORA metrics · platform · last 30 days</p>
      <div className="grid grid-cols-4 gap-3">
        {[
          { val: '6.2', unit: '/day', label: 'deploy frequency',    rating: dora.deployFreqRating, trend: '+12%' },
          { val: '1.4', unit: 'h',   label: 'lead time',           rating: dora.leadTimeRating,   trend: '-8%' },
          { val: '48',  unit: 'min', label: 'MTTR',                rating: dora.mttrRating,       trend: '+4%' },
          { val: '3.1', unit: '%',   label: 'change failure rate',  rating: dora.cfrRating,        trend: '-2%' },
        ].map((d, i) => (
          <div key={i} className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-4">
            <div className="font-mono text-[28px] font-semibold text-[#E2E8F0]">
              {d.val}<span className="text-[14px] text-[#8B9CB6] font-normal">{d.unit}</span>
            </div>
            <div className="font-mono text-[11px] text-[#8B9CB6] mt-1 mb-3">{d.label}</div>
            <div className="flex items-center gap-2">
              <DoraBadge rating={d.rating as any} />
              <span className={`font-mono text-[10px] ${d.trend.startsWith('-') ? 'text-[#3FB950]' : 'text-[#D29922]'}`}>{d.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Simple bar chart visual using divs */}
      <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-4">
        <p className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider mb-4">// deploy frequency · last 14 days</p>
        <div className="flex items-end gap-2 h-24">
          {[4,6,5,8,7,9,6,10,8,7,9,11,8,6].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm transition-all duration-300 hover:opacity-80"
                style={{ height: `${(v / 11) * 80}px`, background: i >= 12 ? '#D29922' : '#1D9E75', opacity: i >= 12 ? 0.7 : 0.6 }}
              />
              <span className="font-mono text-[9px] text-[#4A5568]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CostView() {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest">// cloud spend · per service · last 30 days</p>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'total spend',     val: '$18,420', delta: '+8%',  deltaColor: 'text-[#F85149]',  anomaly: true },
          { label: 'vs last month',   val: '+$1,340', delta: 'above', deltaColor: 'text-[#F85149]', anomaly: false },
          { label: 'largest service', val: 'data-pipeline', delta: '$4.2k', deltaColor: 'text-[#D29922]', anomaly: false },
          { label: 'cost per deploy', val: '$24.30', delta: '-3%',  deltaColor: 'text-[#3FB950]',   anomaly: false },
        ].map((c, i) => (
          <div key={i} className={`bg-[#0E1520] border rounded-lg p-3.5 ${c.anomaly ? 'border-[rgba(210,153,34,.35)]' : 'border-[rgba(255,255,255,.06)]'}`}>
            {c.anomaly && <div className="font-mono text-[9px] text-[#D29922] mb-1.5">// anomaly detected</div>}
            <div className="font-mono text-[9px] text-[#4A5568] mb-1.5">{c.label}</div>
            <div className="font-mono text-[20px] font-semibold text-[#E2E8F0]">{c.val}</div>
            <div className={`font-mono text-[11px] mt-1 ${c.deltaColor}`}>{c.delta}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg overflow-hidden">
        <div className="grid px-4 py-2.5 bg-[#080C11] border-b border-[rgba(255,255,255,.06)]"
          style={{ gridTemplateColumns: '1fr 100px 120px 80px 100px' }}>
          {['service', 'team', 'monthly cost', 'vs last mo', 'status'].map(h => (
            <span key={h} className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {[
          { name: 'data-pipeline',  team: 'data-team',     cost: '$4,210', delta: '+340%', status: 'anomaly' },
          { name: 'order-service',  team: 'commerce-team', cost: '$3,840', delta: '+12%',  status: 'normal' },
          { name: 'api-gateway',    team: 'platform-team', cost: '$2,910', delta: '-3%',   status: 'normal' },
          { name: 'auth-service',   team: 'identity-team', cost: '$2,140', delta: '+1%',   status: 'normal' },
          { name: 'search-service', team: 'discovery-team', cost: '$1,880', delta: '-8%',  status: 'normal' },
        ].map((row, i) => (
          <div key={i} className="grid items-center px-4 py-2.5 border-b border-[rgba(255,255,255,.04)] last:border-0 hover:bg-[#141D2B] cursor-pointer"
            style={{ gridTemplateColumns: '1fr 100px 120px 80px 100px' }}>
            <span className="font-mono text-[11px] text-[#E2E8F0]">{row.name}</span>
            <span className="font-mono text-[11px] text-[#8B9CB6]">{row.team}</span>
            <span className="font-mono text-[11px] text-[#E2E8F0]">{row.cost}</span>
            <span className={`font-mono text-[11px] ${row.delta.startsWith('+') ? (row.status === 'anomaly' ? 'text-[#F85149]' : 'text-[#D29922]') : 'text-[#3FB950]'}`}>{row.delta}</span>
            <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${row.status === 'anomaly' ? 'bg-[rgba(248,81,73,.1)] text-[#F85149]' : 'bg-[rgba(255,255,255,.04)] text-[#4A5568]'}`}>{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MaturityView() {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest">// service maturity scores · 6-pillar model</p>
      <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg overflow-hidden">
        <div className="grid px-4 py-2.5 bg-[#080C11] border-b border-[rgba(255,255,255,.06)]"
          style={{ gridTemplateColumns: '1fr 70px 70px 70px 70px 70px 70px 70px' }}>
          {['service', 'overall', 'observe', 'reliability', 'security', 'docs', 'cost', 'budget'].map(h => (
            <span key={h} className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {services.slice(0, 7).map(svc => {
          const pillars = [85, 90, svc.hasCVE ? 20 : 80, 60, 75, 80]
          const overall = Math.round(pillars.reduce((a, b) => a + b) / pillars.length)
          return (
            <div key={svc.id} className="grid items-center px-4 py-2.5 border-b border-[rgba(255,255,255,.04)] last:border-0 hover:bg-[#141D2B]"
              style={{ gridTemplateColumns: '1fr 70px 70px 70px 70px 70px 70px 70px' }}>
              <span className="font-mono text-[11px] text-[#E2E8F0]">{svc.name}</span>
              <span className={`font-mono text-[11px] font-semibold ${svc.maturityScore >= 80 ? 'text-[#3FB950]' : svc.maturityScore >= 60 ? 'text-[#D29922]' : 'text-[#F85149]'}`}>{svc.maturityScore}</span>
              {pillars.map((p, i) => (
                <span key={i} className={`font-mono text-[11px] ${p >= 80 ? 'text-[#3FB950]' : p >= 60 ? 'text-[#D29922]' : 'text-[#F85149]'}`}>{p}</span>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}