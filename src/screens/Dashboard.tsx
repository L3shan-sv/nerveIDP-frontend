import { AlertTriangle, TrendingUp, Activity, DollarSign, ShieldAlert } from 'lucide-react'
import { Card, StatusDot, BudgetBar, ScoreBar, AlertDot, SectionLabel, DoraBadge } from '../components/ui'
import { services, alerts, dora, activityFeed } from '../data/mock'

export function Dashboard() {
  const healthyCount = services.filter(s => s.health === 'healthy').length
  const frozenCount  = services.filter(s => s.health === 'frozen').length

  return (
    <div className="h-full overflow-y-auto p-5 space-y-3 animate-[fadeUp_.3s_ease]"
      style={{ animation: 'fadeUp .3s ease' }}>

      {/* Freeze banner */}
      <div className="bg-[rgba(248,81,73,.06)] border border-[rgba(248,81,73,.25)] rounded-lg px-3.5 py-2 flex items-center gap-2.5 font-mono text-[11px] text-[#F85149]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F85149] animate-pulse flex-shrink-0" />
        <span>deploy freeze active — <b>payment-service</b> error budget exhausted (0% remaining)</span>
        <span className="ml-auto text-[#FF7B72] underline cursor-pointer hover:text-[#F85149]">view budget →</span>
      </div>

      {/* Platform status bar */}
      <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg px-3.5 py-2 flex items-center gap-2 font-mono text-[11px] text-[#8B9CB6] flex-wrap">
        <StatusDot status="healthy" />
        <span>platform <b className="text-[#E2E8F0]">operational</b></span>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <StatusDot status="healthy" />
        <span><b className="text-[#E2E8F0]">247</b> services</span>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <StatusDot status="degraded" />
        <span><b className="text-[#E2E8F0]">3</b> degraded</span>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <StatusDot status="frozen" />
        <span><b className="text-[#F85149]">1</b> frozen</span>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <span>last deploy <b className="text-[#E2E8F0]">4m ago</b></span>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <span>cluster <b className="text-[#E2E8F0]">68%</b> CPU</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: '// services healthy', value: `${healthyCount}`, sub: `of ${services.length} total`, color: 'text-[#3FB950]', subColor: 'text-[#4A5568]', icon: <Activity size={12}/> },
          { label: '// deploys today',    value: '38',  sub: '▲ 12% vs yesterday',  color: 'text-[#E2E8F0]',  subColor: 'text-[#3FB950]',  icon: <TrendingUp size={12}/> },
          { label: '// avg maturity',     value: '71',  sub: 'target: 80 · 34 below', color: 'text-[#D29922]', subColor: 'text-[#4A5568]', icon: <Activity size={12}/> },
          { label: '// monthly spend',    value: '$18.4k', sub: '▲ 8% anomaly',     color: 'text-[#E2E8F0]',  subColor: 'text-[#F85149]',  icon: <DollarSign size={12}/> },
          { label: '// critical CVEs',    value: '2',   sub: 'blocking 2 deploys',  color: 'text-[#F85149]',  subColor: 'text-[#F85149]',  icon: <ShieldAlert size={12}/> },
        ].map((m, i) => (
          <div key={i} className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">{m.label}</span>
              <span className="text-[#4A5568]">{m.icon}</span>
            </div>
            <div className={`font-mono text-[22px] font-medium ${m.color}`}>{m.value}</div>
            <div className={`font-mono text-[10px] mt-1 ${m.subColor}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Service health */}
        <Card title="// service health" action={{ label: 'view all →', onClick: () => {} }}>
          <div className="space-y-0">
            {services.slice(0, 5).map(svc => (
              <div key={svc.id} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,.04)] last:border-0 cursor-pointer hover:bg-[rgba(255,255,255,.02)] rounded px-1 transition-colors">
                <div className="flex items-center gap-2">
                  <StatusDot status={svc.health} />
                  <div>
                    <div className="font-mono text-[11px] text-[#E2E8F0] font-medium">{svc.name}</div>
                    <div className="font-mono text-[10px] text-[#4A5568]">{svc.team}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <BudgetBar pct={svc.budgetPct} status={svc.budgetStatus} />
                  <ScoreBar score={svc.maturityScore} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card title="// active alerts" action={{ label: 'ai triage →', onClick: () => {} }}>
          <div className="space-y-0">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-2 py-2 border-b border-[rgba(255,255,255,.04)] last:border-0 cursor-pointer hover:bg-[rgba(255,255,255,.02)] rounded px-1 transition-colors">
                <div className={`mt-1 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                  alert.severity === 'P0' ? 'bg-[rgba(248,81,73,.1)]' :
                  alert.severity === 'P1' ? 'bg-[rgba(210,153,34,.1)]' : 'bg-[rgba(63,185,80,.1)]'
                }`}>
                  <AlertDot severity={alert.severity} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-[#E2E8F0] truncate">{alert.title}</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                      alert.severity === 'P0' ? 'bg-[rgba(248,81,73,.15)] text-[#F85149]' :
                      alert.severity === 'P1' ? 'bg-[rgba(210,153,34,.15)] text-[#D29922]' : 'bg-[rgba(63,185,80,.1)] text-[#3FB950]'
                    }`}>{alert.severity}</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#8B9CB6] mt-0.5">{alert.service} · {alert.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-3">
        {/* DORA */}
        <div className="col-span-2">
          <Card title="// DORA metrics · last 30 days" action={{ label: 'drill down →', onClick: () => {} }}>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: '6.2', unit: '/day', label: 'deploy frequency', rating: dora.deployFreqRating },
                { val: '1.4', unit: 'h',    label: 'lead time',        rating: dora.leadTimeRating },
                { val: '48',  unit: 'min',  label: 'MTTR',             rating: dora.mttrRating },
                { val: '3.1', unit: '%',    label: 'change fail rate',  rating: dora.cfrRating },
              ].map((d, i) => (
                <div key={i} className="bg-[#080C11] border border-[rgba(255,255,255,.06)] rounded-lg p-2.5">
                  <div className="font-mono text-[18px] font-semibold text-[#E2E8F0]">
                    {d.val}<span className="text-[12px] text-[#8B9CB6] font-normal">{d.unit}</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#8B9CB6] mt-1">{d.label}</div>
                  <div className="mt-1.5"><DoraBadge rating={d.rating as any} /></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity feed */}
        <Card title="// recent activity" action={{ label: 'audit log →', onClick: () => {} }}>
          <div className="space-y-0">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[rgba(255,255,255,.04)] last:border-0">
                <span className="font-mono text-[10px] text-[#4A5568] w-9 flex-shrink-0">{item.time}</span>
                <span className="font-mono text-[11px] text-[#8B9CB6] truncate">
                  <span className={item.actor === '@nerve' ? 'text-[#1D9E75]' : 'text-[#58A6FF]'}>{item.actor}</span>
                  {' '}{item.msg}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}