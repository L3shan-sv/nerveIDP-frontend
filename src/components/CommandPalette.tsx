import { useEffect, useState } from 'react'
import { Terminal, Rocket, RotateCcw, Search, Layers, Activity, GitBranch, Bot } from 'lucide-react'

interface CmdItem {
  icon: React.ReactNode
  name: string
  desc: string
  kbd?: string
  action?: string
}

const allCommands: CmdItem[] = [
  { icon: <Rocket size={12} />,       name: 'deploy service',           desc: 'trigger a deploy for any service',     kbd: 'D' },
  { icon: <RotateCcw size={12} />,    name: 'rollback payment-service', desc: 'to previous stable · v1.8.0',          kbd: '↵' },
  { icon: <Search size={12} />,       name: 'view blast radius',        desc: 'dependency impact visualizer' },
  { icon: <Activity size={12} />,     name: 'error budget · payment',   desc: 'burn rate · 30d window' },
  { icon: <Layers size={12} />,       name: 'fleet bulk rescan',        desc: 'run compliance scan across collection' },
  { icon: <GitBranch size={12} />,    name: 'view pipeline runs',       desc: 'latest CI/CD status' },
  { icon: <Bot size={12} />,          name: 'open ai co-pilot',         desc: 'start incident triage session' },
  { icon: <Terminal size={12} />,     name: 'scaffold new service',     desc: 'golden path template wizard' },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onNavigate: (screen: string) => void
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)

  const filtered = query
    ? allCommands.filter(c => c.name.includes(query.toLowerCase()) || c.desc.includes(query.toLowerCase()))
    : allCommands

  useEffect(() => {
    if (!open) { setQuery(''); setSelected(0) }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0))
      if (e.key === 'Enter') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, filtered.length, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[1000] flex items-start justify-center pt-28"
      onClick={onClose}
    >
      <div
        className="w-[520px] bg-[#0E1520] border border-[rgba(29,158,117,.35)] rounded-xl overflow-hidden animate-[dropIn_.15s_ease]"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'dropIn .15s ease' }}
      >
        {/* Search row */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[rgba(255,255,255,.06)]">
          <span className="font-mono text-[13px] text-[#1D9E75] font-medium">⌘</span>
          <input
            autoFocus
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            placeholder="type a command or search..."
            className="flex-1 bg-transparent border-none font-mono text-[13px] text-[#E2E8F0] placeholder-[#4A5568] outline-none"
          />
          <span className="font-mono text-[10px] bg-[#141D2B] border border-[rgba(255,255,255,.1)] rounded px-1.5 py-0.5 text-[#4A5568]">esc</span>
        </div>

        {/* Results */}
        <div className="py-1.5 max-h-80 overflow-y-auto">
          <p className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest px-4 py-1.5">
            {query ? `${filtered.length} results` : '// quick actions'}
          </p>
          {filtered.map((item, i) => (
            <button
              key={i}
              onMouseEnter={() => setSelected(i)}
              onClick={onClose}
              className={`w-full flex items-center justify-between px-4 py-2 transition-colors text-left ${
                i === selected ? 'bg-[rgba(29,158,117,.1)]' : 'hover:bg-[#141D2B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#080C11] border border-[rgba(255,255,255,.06)] rounded-md flex items-center justify-center text-[#8B9CB6]">
                  {item.icon}
                </div>
                <div>
                  <p className="font-mono text-[12px] text-[#E2E8F0]">{item.name}</p>
                  <p className="font-mono text-[10px] text-[#8B9CB6] mt-0.5">{item.desc}</p>
                </div>
              </div>
              {item.kbd && (
                <span className="font-mono text-[10px] bg-[#141D2B] border border-[rgba(255,255,255,.1)] rounded px-1.5 py-0.5 text-[#4A5568]">
                  {item.kbd}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-4 py-2 border-t border-[rgba(255,255,255,.06)] font-mono text-[10px] text-[#4A5568]">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}