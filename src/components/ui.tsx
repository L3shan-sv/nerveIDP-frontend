import { clsx } from 'clsx'
import type { ServiceHealth, ServiceLang, BurnRateStatus, DoraRating } from '../types'

// ── Status dot ────────────────────────────────────────────────────────────
interface DotProps { status: ServiceHealth | 'info'; className?: string }
export function StatusDot({ status, className }: DotProps) {
  const colors: Record<string, string> = {
    healthy: 'bg-[#3FB950]', degraded: 'bg-[#D29922]',
    frozen: 'bg-[#F85149]', info: 'bg-[#58A6FF]',
  }
  return <span className={clsx('inline-block w-1.5 h-1.5 rounded-full flex-shrink-0', colors[status] ?? 'bg-[#4A5568]', className)} />
}

// ── Pill ─────────────────────────────────────────────────────────────────
type PillVariant = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'teal' | 'gray'
interface PillProps { children: React.ReactNode; variant?: PillVariant; className?: string }
export function Pill({ children, variant = 'gray', className }: PillProps) {
  const variants: Record<PillVariant, string> = {
    green:  'bg-[rgba(63,185,80,.1)]   text-[#3FB950] border-[rgba(63,185,80,.2)]',
    amber:  'bg-[rgba(210,153,34,.1)]  text-[#D29922] border-[rgba(210,153,34,.2)]',
    red:    'bg-[rgba(248,81,73,.1)]   text-[#F85149] border-[rgba(248,81,73,.2)]',
    blue:   'bg-[rgba(88,166,255,.1)]  text-[#58A6FF] border-[rgba(88,166,255,.2)]',
    purple: 'bg-[rgba(188,140,255,.1)] text-[#BC8CFF] border-[rgba(188,140,255,.2)]',
    teal:   'bg-[rgba(29,158,117,.1)]  text-[#3ECFA0] border-[rgba(29,158,117,.3)]',
    gray:   'bg-[rgba(255,255,255,.05)] text-[#8B9CB6] border-[rgba(255,255,255,.1)]',
  }
  return (
    <span className={clsx('font-mono text-[10px] px-2 py-0.5 rounded-full border inline-block', variants[variant], className)}>
      {children}
    </span>
  )
}

// ── Budget bar ────────────────────────────────────────────────────────────
interface BudgetBarProps { pct: number; status: BurnRateStatus; showLabel?: boolean }
export function BudgetBar({ pct, status, showLabel = true }: BudgetBarProps) {
  const color: Record<BurnRateStatus, string> = {
    frozen: '#F85149', fast: '#D29922', slow: '#D29922',
    watch: '#D29922', healthy: '#3FB950',
  }
  const textColor: Record<BurnRateStatus, string> = {
    frozen: 'text-[#F85149]', fast: 'text-[#D29922]', slow: 'text-[#D29922]',
    watch: 'text-[#D29922]', healthy: 'text-[#3FB950]',
  }
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-1 bg-[#1A2436] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(pct, 100)}%`, background: color[status] }} />
      </div>
      {showLabel && (
        <span className={clsx('font-mono text-[10px]', textColor[status])}>
          {status === 'frozen' ? 'FROZEN' : `${100 - pct}%`}
        </span>
      )}
    </div>
  )
}

// ── Score bar ─────────────────────────────────────────────────────────────
interface ScoreBarProps { score: number }
export function ScoreBar({ score }: ScoreBarProps) {
  const color = score >= 80 ? '#3FB950' : score >= 60 ? '#D29922' : '#F85149'
  const textCls = score >= 80 ? 'text-[#3FB950]' : score >= 60 ? 'text-[#D29922]' : 'text-[#F85149]'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-10 h-0.5 bg-[#1A2436] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className={clsx('font-mono text-[11px] font-medium', textCls)}>{score}</span>
    </div>
  )
}

// ── Language tag ─────────────────────────────────────────────────────────
interface LangTagProps { lang: ServiceLang }
export function LangTag({ lang }: LangTagProps) {
  const styles: Record<ServiceLang, string> = {
    Python:     'bg-[rgba(88,166,255,.1)]   text-[#58A6FF]',
    Go:         'bg-[rgba(63,185,80,.1)]    text-[#3FB950]',
    TypeScript: 'bg-[rgba(188,140,255,.1)]  text-[#BC8CFF]',
    Rust:       'bg-[rgba(240,128,80,.1)]   text-[#F08050]',
    Java:       'bg-[rgba(210,153,34,.1)]   text-[#D29922]',
  }
  const short: Record<ServiceLang, string> = { Python: 'PY', Go: 'GO', TypeScript: 'TS', Rust: 'RS', Java: 'JV' }
  return (
    <span className={clsx('font-mono text-[10px] px-2 py-0.5 rounded', styles[lang])}>
      {short[lang]}
    </span>
  )
}

// ── DORA rating badge ─────────────────────────────────────────────────────
interface DoraBadgeProps { rating: DoraRating }
export function DoraBadge({ rating }: DoraBadgeProps) {
  const styles: Record<DoraRating, string> = {
    elite:  'bg-[rgba(63,185,80,.1)]   text-[#3FB950]  border-[rgba(63,185,80,.2)]',
    high:   'bg-[rgba(88,166,255,.1)]  text-[#58A6FF]  border-[rgba(88,166,255,.2)]',
    medium: 'bg-[rgba(210,153,34,.1)]  text-[#D29922]  border-[rgba(210,153,34,.2)]',
    low:    'bg-[rgba(248,81,73,.1)]   text-[#F85149]  border-[rgba(248,81,73,.2)]',
  }
  return (
    <span className={clsx('font-mono text-[9px] px-1.5 py-0.5 rounded border', styles[rating])}>
      {rating}
    </span>
  )
}

// ── Section label ─────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest mb-2">
      {children}
    </p>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  action?: { label: string; onClick: () => void }
}
export function Card({ children, className, title, action }: CardProps) {
  return (
    <div className={clsx('bg-[#0E1520] border border-[rgba(255,255,255,.06)] rounded-lg p-3.5', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && <span className="font-mono text-[10px] text-[#4A5568] uppercase tracking-wider">{title}</span>}
          {action && (
            <button onClick={action.onClick} className="font-mono text-[10px] text-[#1D9E75] hover:text-[#3ECFA0] transition-colors">
              {action.label}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ── Alert severity dot ────────────────────────────────────────────────────
export function AlertDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    P0: 'bg-[#F85149]', P1: 'bg-[#D29922]', P2: 'bg-[#58A6FF]', info: 'bg-[#3FB950]'
  }
  return <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', colors[severity] ?? 'bg-[#4A5568]')} />
}