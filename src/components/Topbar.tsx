import { Search, Bell, Terminal } from 'lucide-react'
import { StatusDot } from './ui'

interface TopbarProps { onCmdK: () => void }

export function Topbar({ onCmdK }: TopbarProps) {
  return (
    <header className="col-span-2 bg-[#0E1520] border-b border-[rgba(255,255,255,.06)] flex items-center px-4 gap-0 z-50">
      {/* Logo */}
      <div className="pr-5 border-r border-[rgba(255,255,255,.06)] flex-shrink-0">
        <span className="font-mono text-[14px] font-semibold text-[#1D9E75] tracking-tight">
          nerve<span className="text-[#4A5568]">.idp</span>
        </span>
      </div>

      {/* Platform status */}
      <div className="flex items-center gap-2.5 ml-4 flex-1 font-mono text-[11px] text-[#8B9CB6] flex-wrap">
        <div className="flex items-center gap-1.5">
          <StatusDot status="healthy" />
          <span>platform <b className="text-[#E2E8F0]">healthy</b></span>
        </div>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <div className="flex items-center gap-1.5">
          <StatusDot status="healthy" />
          <span><b className="text-[#E2E8F0]">247</b> services</span>
        </div>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <div className="flex items-center gap-1.5">
          <StatusDot status="degraded" />
          <span><b className="text-[#E2E8F0]">3</b> degraded</span>
        </div>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <div className="flex items-center gap-1.5">
          <StatusDot status="frozen" />
          <span><b className="text-[#F85149]">1</b> frozen</span>
        </div>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <span>last deploy <b className="text-[#E2E8F0]">4m ago</b></span>
        <span className="w-px h-3.5 bg-[rgba(255,255,255,.06)]" />
        <span>cluster <b className="text-[#E2E8F0]">68%</b> CPU</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onCmdK}
          className="flex items-center gap-1.5 font-mono text-[11px] bg-[#141D2B] border border-[rgba(255,255,255,.11)] rounded-md px-2.5 py-1 text-[#8B9CB6] hover:border-[rgba(29,158,117,.4)] hover:text-[#3ECFA0] transition-all"
        >
          <Terminal size={11} />
          <span>⌘K</span>
        </button>
        <button className="relative p-1.5 text-[#8B9CB6] hover:text-[#E2E8F0] transition-colors">
          <Bell size={14} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#F85149] rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-[rgba(29,158,117,.15)] border border-[rgba(29,158,117,.3)] flex items-center justify-center font-mono text-[10px] font-semibold text-[#3ECFA0]">
          AO
        </div>
      </div>
    </header>
  )
}