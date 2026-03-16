import { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw, FileText, Bot, AlertTriangle } from 'lucide-react'
import { activeIncident, similarIncidents } from '../data/mock'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  chips?: { label: string; primary?: boolean }[]
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'payment-service error budget hit 0%. Getting a flood of 500s. What happened and what do I do?',
    timestamp: '09:38',
  },
  {
    id: 'm2',
    role: 'ai',
    content: `Root cause (high confidence): Error rate spiked from 0.3% to 18% at 09:12 UTC following deploy v1.8.1. The spike correlates with a dependency on stripe-client v4.2.0 — identical pattern to INC-2791 three weeks ago.

Immediate action: Rollback to v1.8.0 will restore service. Estimated MTTR: ~4 minutes. The error budget will not recover until the 30-day window resets (23 days remaining).

Similar incidents found:
· INC-2791 — same stripe-client issue, resolved by rollback (22d ago)
· INC-2654 — budget exhaustion, different root cause, MTTR 47min (41d ago)`,
    chips: [
      { label: 'rollback to v1.8.0 →', primary: true },
      { label: 'view logs' },
      { label: 'draft post-mortem' },
      { label: 'view INC-2791' },
    ],
    timestamp: '09:38',
  },
  {
    id: 'm3',
    role: 'user',
    content: 'rollback approved. what do we need to fix before we can deploy v1.9.0?',
    timestamp: '09:41',
  },
  {
    id: 'm4',
    role: 'ai',
    content: `Two blockers for v1.9.0 production deploy:

1. CVE-2024-3094 — Critical in openssl:3.0.1 (CVSS 9.8). Fix: upgrade to openssl:3.0.2 in your Dockerfile. Trivy will re-scan automatically on next push to main.

2. Missing runbook doc — TechDocs page was deleted last sprint. You're losing 15 compliance points. Fix: add /docs/runbook.md to the repo. I can generate a template for you.

Once both are resolved, compliance score should reach ~87/100. Production deploy will be unblocked.`,
    chips: [
      { label: 'show Dockerfile fix' },
      { label: 'generate runbook template →', primary: true },
    ],
    timestamp: '09:41',
  },
]

const aiResponses: Record<string, string> = {
  default: `I'm analysing the current platform state. Based on active metrics, payment-service remains the highest-risk service right now. The 14× burn rate before exhaustion suggests a systemic issue rather than a transient spike. I'd recommend prioritising the stripe-client version pin before re-deploying.`,
  rollback: `Initiating rollback workflow for payment-service → v1.8.0.\n\nTemporal workflow started: rollback-payment-svc-20260316-0941\nSteps: drain traffic → scale down v1.8.1 → deploy v1.8.0 → verify health\nEstimated completion: ~4 minutes\n\nI'll notify you when the service is back to healthy.`,
  postmortem: `Here's a post-mortem draft for INC-2841:\n\n**Summary**: payment-service experienced 18.4% error rate for 29 minutes following deploy v1.8.1, exhausting the 30-day error budget.\n\n**Root cause**: stripe-client v4.2.0 introduced a breaking change in the webhook validation API. The change was not caught in staging due to mocked payment responses.\n\n**Action items**:\n1. Pin stripe-client to v4.1.x until v4.2.x is validated\n2. Add real payment flow tests to staging environment\n3. Update runbook to document stripe-client version requirements`,
  logs: `Fetching payment-service logs from the last 30 minutes...\n\n[09:12:04] ERROR stripe_webhook: signature validation failed — invalid secret format\n[09:12:04] ERROR handler: unhandled exception in /api/v1/payment/webhook\n[09:12:05] ERROR stripe_webhook: signature validation failed — invalid secret format\n[09:12:05] WARN  circuit_breaker: opening circuit for stripe-client after 5 failures\n\nPattern: All 500s originate from /api/v1/payment/webhook. The stripe-client v4.2.0 webhook signature format changed — your Vault secret is formatted for v4.1.x.`,
}

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = {
      id: `m${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const key = text.toLowerCase().includes('rollback') ? 'rollback'
        : text.toLowerCase().includes('post') ? 'postmortem'
        : text.toLowerCase().includes('log') ? 'logs'
        : 'default'
      const aiMsg: Message = {
        id: `m${Date.now() + 1}`,
        role: 'ai',
        content: aiResponses[key],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      }
      setMessages(prev => [...prev, aiMsg])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="h-full overflow-hidden p-5" style={{ animation: 'fadeUp .3s ease' }}>
      <div className="grid grid-cols-[1fr_280px] gap-3 h-full">

        {/* Chat panel */}
        <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,.06)] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[rgba(188,140,255,.1)] border border-[rgba(188,140,255,.2)] flex items-center justify-center">
                <Bot size={12} className="text-[#BC8CFF]" />
              </div>
              <span className="font-mono text-[11px] text-[#4A5568] uppercase tracking-wider">// nerve ai ops co-pilot</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] bg-[rgba(248,81,73,.08)] border border-[rgba(248,81,73,.2)] rounded-full px-2.5 py-1 text-[#F85149]">
              <AlertTriangle size={10} />
              INC-2841 · payment-service · P0
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={msg.role === 'user' ? 'flex flex-col items-start' : 'flex flex-col items-start'}>
                <div className={`font-mono text-[10px] mb-1.5 ${msg.role === 'user' ? 'text-[#3ECFA0]' : 'text-[#BC8CFF]'}`}>
                  {msg.role === 'user' ? '@james.odhiambo' : 'nerve co-pilot · context: last 3h + similar incidents'} · {msg.timestamp}
                </div>
                <div className={`rounded-lg px-3.5 py-2.5 font-mono text-[12px] leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[rgba(29,158,117,.08)] border border-[rgba(29,158,117,.2)] text-[#3ECFA0]'
                    : 'bg-[#141D2B] border border-[rgba(255,255,255,.06)] text-[#E2E8F0]'
                }`}>
                  {msg.content}
                </div>
                {msg.chips && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.chips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(chip.label.replace(' →', ''))}
                        className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-all ${
                          chip.primary
                            ? 'bg-[rgba(29,158,117,.1)] border-[rgba(29,158,117,.3)] text-[#3ECFA0] hover:bg-[rgba(29,158,117,.2)]'
                            : 'bg-[#141D2B] border-[rgba(255,255,255,.08)] text-[#8B9CB6] hover:border-[rgba(255,255,255,.18)] hover:text-[#E2E8F0]'
                        }`}
                      >{chip.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start">
                <div className="font-mono text-[10px] text-[#BC8CFF] mb-1.5">nerve co-pilot · thinking...</div>
                <div className="bg-[#141D2B] border border-[rgba(255,255,255,.06)] rounded-lg px-3.5 py-2.5 flex gap-1 items-center">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-1.5 h-1.5 bg-[#BC8CFF] rounded-full animate-pulse" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 px-4 py-3 border-t border-[rgba(255,255,255,.06)] flex-shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="// ask about this incident, request a runbook, query logs..."
              className="flex-1 bg-[#080C11] border border-[rgba(255,255,255,.08)] rounded-lg px-3 py-2 font-mono text-[11px] text-[#E2E8F0] placeholder-[#4A5568] outline-none focus:border-[rgba(29,158,117,.4)] transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex items-center gap-1.5 font-mono text-[11px] px-3.5 py-2 bg-[rgba(29,158,117,.12)] border border-[rgba(29,158,117,.3)] rounded-lg text-[#3ECFA0] hover:bg-[rgba(29,158,117,.22)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={11} />
              send
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {/* Incident context */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-3.5 flex-shrink-0">
            <p className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider mb-3">// incident context</p>
            <div className="space-y-0">
              {[
                { key: 'incident',   val: activeIncident.id,          color: 'text-[#F85149]' },
                { key: 'severity',   val: activeIncident.severity,     color: 'text-[#F85149]' },
                { key: 'service',    val: activeIncident.service,      color: 'text-[#E2E8F0]' },
                { key: 'error rate', val: `${activeIncident.errorRate}%`, color: 'text-[#F85149]' },
                { key: 'started',    val: activeIncident.startedAt,    color: 'text-[#E2E8F0]' },
                { key: 'budget',     val: '0% remaining',              color: 'text-[#F85149]' },
                { key: 'trigger',    val: activeIncident.trigger,      color: 'text-[#E2E8F0]' },
              ].map(row => (
                <div key={row.key} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,.04)] last:border-0">
                  <span className="font-mono text-[11px] text-[#4A5568]">{row.key}</span>
                  <span className={`font-mono text-[11px] ${row.color}`}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-3.5 flex-shrink-0">
            <p className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider mb-3">// quick actions</p>
            <div className="space-y-1.5">
              {[
                { icon: <RotateCcw size={11} />, label: 'rollback payment-service',  primary: true },
                { icon: <FileText size={11} />,   label: 'draft post-mortem',         primary: false },
                { icon: <Bot size={11} />,         label: 'explain root cause',        primary: false },
                { icon: <AlertTriangle size={11}/>, label: 'escalate to on-call',     primary: false },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(a.label)}
                  className={`w-full flex items-center gap-2 font-mono text-[11px] px-3 py-2 rounded-md border text-left transition-all ${
                    a.primary
                      ? 'bg-[rgba(29,158,117,.1)] border-[rgba(29,158,117,.3)] text-[#3ECFA0] hover:bg-[rgba(29,158,117,.2)]'
                      : 'bg-[#141D2B] border-[rgba(255,255,255,.06)] text-[#8B9CB6] hover:border-[rgba(255,255,255,.15)] hover:text-[#E2E8F0]'
                  }`}
                >
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Similar incidents */}
          <div className="bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-3.5 flex-shrink-0">
            <p className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider mb-3">// similar incidents</p>
            <div className="space-y-2">
              {similarIncidents.map(inc => (
                <button
                  key={inc.id}
                  onClick={() => sendMessage(`show me ${inc.id}`)}
                  className="w-full text-left bg-[#080C11] rounded-lg p-2.5 border border-[rgba(255,255,255,.04)] hover:border-[rgba(255,255,255,.1)] transition-all"
                >
                  <div className="font-mono text-[11px] text-[#E2E8F0] font-medium">{inc.id} · {inc.service}</div>
                  <div className="font-mono text-[10px] text-[#4A5568] mt-1">{inc.daysAgo}d ago · MTTR {inc.mttrMin}min · {inc.resolution}</div>
                  <div className="font-mono text-[10px] text-[#BC8CFF] mt-1">match: {inc.matchReason} · {inc.matchPct}% similar</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}