import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { deployChecks } from '../data/mock'

export function Deploy() {
  const totalScore  = deployChecks.reduce((a, c) => a + c.score, 0)
  const maxScore    = deployChecks.reduce((a, c) => a + c.maxScore, 0)
  const pct         = Math.round((totalScore / maxScore) * 100)
  const passing     = pct >= 80
  const fillColor   = pct >= 80 ? '#3FB950' : pct >= 60 ? '#D29922' : '#F85149'
  const scoreColor  = pct >= 80 ? 'text-[#3FB950]' : pct >= 60 ? 'text-[#D29922]' : 'text-[#F85149]'

  return (
    <div className="h-full overflow-y-auto p-5" style={{ animation: 'fadeUp .3s ease' }}>
      <div className="grid grid-cols-[1fr_300px] gap-4 h-full">

        {/* Left — policy checks */}
        <div className="space-y-3">
          {/* Block banner */}
          <div className={`border rounded-lg px-4 py-3 flex items-center justify-between ${
            passing
              ? 'bg-[rgba(63,185,80,.06)] border-[rgba(63,185,80,.25)]'
              : 'bg-[rgba(248,81,73,.06)] border-[rgba(248,81,73,.25)]'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${passing ? 'bg-[#3FB950]' : 'bg-[#F85149]'}`} />
              <div>
                <div className={`font-mono text-[12px] font-medium ${passing ? 'text-[#3FB950]' : 'text-[#F85149]'}`}>
                  {passing ? 'deploy approved' : 'deploy blocked'} — compliance score {totalScore}/{maxScore}
                </div>
                <div className="font-mono text-[10px] text-[#8B9CB6] mt-0.5">
                  payment-service · v1.9.0 → production · minimum required: 80
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-[32px] font-semibold ${scoreColor}`}>{totalScore}</div>
              <div className="font-mono text-[10px] text-[#4A5568]">/ {maxScore}</div>
            </div>
          </div>

          {/* Score progress */}
          <div className="h-1.5 bg-[#141D2B] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: fillColor }} />
          </div>

          {/* Checks */}
          <div className="space-y-2">
            {deployChecks.map(check => (
              <div
                key={check.key}
                className={`bg-[#080C11] rounded-lg p-3 border-l-[3px] ${
                  check.status === 'pass' ? 'border-l-[#3FB950]' :
                  check.status === 'fail' ? 'border-l-[#F85149]' : 'border-l-[#D29922]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {check.status === 'pass' && <CheckCircle size={13} className="text-[#3FB950] flex-shrink-0" />}
                    {check.status === 'fail' && <XCircle size={13} className="text-[#F85149] flex-shrink-0" />}
                    {check.status === 'warn' && <AlertTriangle size={13} className="text-[#D29922] flex-shrink-0" />}
                    <span className="font-mono text-[12px] text-[#E2E8F0] font-medium">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[11px] font-medium ${
                      check.status === 'pass' ? 'text-[#3FB950]' :
                      check.status === 'fail' ? 'text-[#F85149]' : 'text-[#D29922]'
                    }`}>{check.score}/{check.maxScore}</span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                      check.status === 'pass' ? 'bg-[rgba(63,185,80,.1)] text-[#3FB950] border-[rgba(63,185,80,.2)]' :
                      check.status === 'fail' ? 'bg-[rgba(248,81,73,.1)] text-[#F85149] border-[rgba(248,81,73,.2)]' :
                                                'bg-[rgba(210,153,34,.1)] text-[#D29922] border-[rgba(210,153,34,.2)]'
                    }`}>{check.status}</span>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-[#8B9CB6] mt-2 leading-relaxed">{check.detail}</div>
                {check.fixable && check.status !== 'pass' && (
                  <button className="font-mono text-[10px] text-[#58A6FF] mt-1.5 flex items-center gap-1 hover:text-[#85C1F5] transition-colors">
                    <ExternalLink size={10} /> view fix instructions →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — deploy form + history */}
        <div className="space-y-3">
          {/* Deploy form */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-4 space-y-3">
            <p className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider mb-1">// deploy request</p>
            {[
              { label: '// service',      value: 'payment-service' },
              { label: '// image tag',    value: 'v1.9.0-rc.4' },
              { label: '// requested by', value: '@james.odhiambo' },
            ].map(f => (
              <div key={f.label}>
                <p className="font-mono text-[9px] text-[#4A5568] mb-1 tracking-wider">{f.label}</p>
                <div className="bg-[#080C11] border border-[rgba(255,255,255,.06)] rounded-md px-3 py-2 font-mono text-[12px] text-[#E2E8F0]">{f.value}</div>
              </div>
            ))}
            <div>
              <p className="font-mono text-[9px] text-[#4A5568] mb-1.5 tracking-wider">// environment</p>
              <div className="flex gap-2">
                {['dev', 'staging', 'production'].map(env => (
                  <button key={env} className={`flex-1 font-mono text-[11px] py-1.5 rounded-md border transition-all ${
                    env === 'production'
                      ? 'bg-[rgba(248,81,73,.08)] border-[rgba(248,81,73,.3)] text-[#F85149]'
                      : 'bg-[#141D2B] border-[rgba(255,255,255,.08)] text-[#8B9CB6] hover:border-[rgba(255,255,255,.15)]'
                  }`}>{env}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button disabled className="flex-1 font-mono text-[11px] py-2 bg-[rgba(248,81,73,.08)] border border-[rgba(248,81,73,.2)] rounded-md text-[#F85149] opacity-50 cursor-not-allowed">
                prod blocked
              </button>
              <button className="flex-1 font-mono text-[11px] py-2 bg-[rgba(29,158,117,.1)] border border-[rgba(29,158,117,.3)] rounded-md text-[#3ECFA0] hover:bg-[rgba(29,158,117,.2)] transition-all">
                deploy staging →
              </button>
            </div>
            <p className="font-mono text-[10px] text-[#4A5568] text-center">fix 2 issues to unlock production</p>
          </div>

          {/* Deploy history */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-4">
            <p className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider mb-3">// deploy history</p>
            <div className="space-y-0">
              {[
                { env: 'staging',    version: 'v1.8.0', ago: '2h ago',  actor: '@maya',  score: 82,   ok: true },
                { env: 'production', version: 'v1.8.1', ago: '5h ago',  actor: '@james', score: null, ok: false },
                { env: 'production', version: 'v1.8.0', ago: '3d ago',  actor: '@maya',  score: 86,   ok: true },
                { env: 'production', version: 'v1.7.9', ago: '5d ago',  actor: '@james', score: 71,   ok: true },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,.04)] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${d.ok ? 'bg-[#3FB950]' : 'bg-[#F85149]'}`} />
                    <div>
                      <span className="font-mono text-[11px] text-[#E2E8F0]">{d.version} → {d.env}</span>
                      <div className="font-mono text-[10px] text-[#4A5568]">{d.ago} · {d.actor}</div>
                    </div>
                  </div>
                  <span className={`font-mono text-[11px] font-medium ${
                    d.ok ? (d.score && d.score >= 80 ? 'text-[#3FB950]' : 'text-[#D29922]') : 'text-[#F85149]'
                  }`}>{d.ok ? d.score : 'blocked'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}