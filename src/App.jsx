/**
 * Root layout component that arranges all panels.
 * Wraps CircuitCanvas with ReactFlowProvider which is
 * REQUIRED for useReactFlow() hook to work inside canvas.
 */

import { ReactFlowProvider } from 'reactflow'
import CircuitCanvas          from './components/canvas/CircuitCanvas'
import Toolbar                from './components/ui/Toolbar'

export default function App() {
  return (
    // WHY h-screen w-screen: canvas must fill entire viewport
    // WHY overflow-hidden: prevents scrollbars on the root element
    <div className="h-screen w-screen flex overflow-hidden bg-slate-950">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      {/* WHY outside ReactFlowProvider: Toolbar does not use useReactFlow   */}
      {/* Moving it inside would work but is unnecessary                      */}
      <Toolbar />

      {/* ── Canvas Area ──────────────────────────────────────────────────── */}
      {/* WHY flex-1: takes all remaining space after Toolbar                 */}
      <div className="flex-1 h-full">

        {/* WHY ReactFlowProvider: provides React Flow context to children   */}
        {/* CircuitCanvas uses useReactFlow() which requires this context    */}
        <ReactFlowProvider>
          <CircuitCanvas />
        </ReactFlowProvider>

      </div>
    </div>
  )
}