import { useState, useEffect, useCallback } from 'react'
import { Topbar } from './components/Topbar'
import { Sidebar } from './components/Sidebar'
import { CommandPalette } from './components/CommandPalette'
import { Dashboard }     from './screens/Dashboard'
import { Catalog }       from './screens/Catalog'
import { Deploy }        from './screens/Deploy'
import { Observability } from './screens/Observability'
import { Fleet }         from './screens/Fleet'
import { AICopilot }     from './screens/AICopilot'
import type { NavScreen } from './types'

export default function App() {
  const [screen, setScreen] = useState<NavScreen>('dashboard')
  const [cmdOpen, setCmdOpen] = useState(false)

  // ⌘K / Ctrl+K global shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCmdOpen(prev => !prev)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const screenMap: Record<NavScreen, React.ReactNode> = {
    dashboard:     <Dashboard />,
    catalog:       <Catalog />,
    deploy:        <Deploy />,
    observability: <Observability />,
    fleet:         <Fleet />,
    ai:            <AICopilot />,
  }

  return (
    <div
      className="h-full grid"
      style={{ gridTemplateRows: '44px 1fr', gridTemplateColumns: '200px 1fr' }}
    >
      {/* Top bar — spans full width */}
      <Topbar onCmdK={() => setCmdOpen(true)} />

      {/* Sidebar */}
      <Sidebar active={screen} onChange={setScreen} />

      {/* Main content area */}
      <main className="overflow-hidden bg-[#080C11]" key={screen}>
        {screenMap[screen]}
      </main>

      {/* Command palette overlay */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={(s) => { setScreen(s as NavScreen); setCmdOpen(false) }}
      />
    </div>
  )
}