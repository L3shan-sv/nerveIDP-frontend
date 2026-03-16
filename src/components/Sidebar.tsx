import { LayoutDashboard, BookOpen, Rocket, Activity, Layers, FileText, Bot, Settings, GitBranch } from 'lucide-react'
import { clsx } from 'clsx'
import type { NavScreen } from '../types'

interface SidebarProps {
  active: NavScreen
  onChange: (screen: NavScreen) => void
}

const navItems: { id: NavScreen; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
  { id: 'dashboard',     label: 'dashboard',     icon: <LayoutDashboard size={13} /> },
  { id: 'catalog',       label: 'catalog',        icon: <BookOpen size={13} />,  badge: '3',  badgeColor: 'amber' },
  { id: 'deploy',        label: 'deploy',         icon: <Rocket size={13} />,    badge: '2',  badgeColor: 'red' },
  { id: 'observability', label: 'observability',  icon: <Activity size={13} /> },
  { id: 'fleet',         label: 'fleet ops',      icon: <Layers size={13} /> },
  { id: 'ai',            label: 'ai co-pilot',    icon: <Bot size={13} /> },
]

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="bg-[#0E1520] border-r border-[rgba(255,255,255,.06)] flex flex-col overflow-y-auto">
      <div className="pt-2">
        <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-[0.1em] px-4 py-2">// platform</p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={clsx(
              'w-full flex items-center gap-2.5 px-4 py-2 font-mono text-[11px] border-l-2 transition-all duration-150 text-left',
              active === item.id
                ? 'bg-[rgba(29,158,117,.1)] border-l-[#1D9E75] text-[#3ECFA0]'
                : 'border-l-transparent text-[#8B9CB6] hover:bg-[#141D2B] hover:text-[#E2E8F0]'
            )}
          >
            <span className={clsx('flex-shrink-0', active === item.id ? 'opacity-100' : 'opacity-60')}>
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={clsx(
                'font-mono text-[9px] px-1.5 py-0.5 rounded-full',
                item.badgeColor === 'red'
                  ? 'bg-[#F85149] text-white'
                  : 'bg-[#D29922] text-[#080C11]'
              )}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-[0.1em] px-4 py-2">// infra</p>
        {[
          { label: 'pipelines',  icon: <GitBranch size={13} /> },
          { label: 'docs',       icon: <FileText size={13} /> },
        ].map(item => (
          <button
            key={item.label}
            className="w-full flex items-center gap-2.5 px-4 py-2 font-mono text-[11px] border-l-2 border-l-transparent text-[#8B9CB6] hover:bg-[#141D2B] hover:text-[#E2E8F0] transition-all duration-150"
          >
            <span className="opacity-60 flex-shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto border-t border-[rgba(255,255,255,.06)] p-4">
        <button className="w-full flex items-center gap-2 font-mono text-[11px] text-[#4A5568] hover:text-[#8B9CB6] transition-colors">
          <Settings size={12} />
          settings
        </button>
        <p className="font-mono text-[9px] text-[#4A5568] mt-2">v2.0.0 · 247 services</p>
      </div>
    </aside>
  )
}