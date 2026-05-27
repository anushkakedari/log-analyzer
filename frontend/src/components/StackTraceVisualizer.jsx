import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { parseStackTrace } from '../utils/parseStackTrace'

// Custom Node Component
function CustomNode({ data }) {
  return (
    <div className={`px-4 py-3 rounded-xl border-2 shadow-lg min-w-[280px] ${
      data.isError
        ? 'bg-red-500/20 border-red-500 text-red-300'
        : 'bg-[#1a1a2e] border-indigo-500/50 text-white'
    }`}>
      {data.isError ? (
        <div>
          <div className="text-xs font-bold text-red-400 mb-1">💥 ERROR</div>
          <div className="text-sm font-medium break-words">{data.function}</div>
        </div>
      ) : (
        <div>
          <div className="text-xs text-indigo-400 font-bold mb-1">
            📄 {data.file} — Line {data.line}
          </div>
          <div className="text-sm font-medium text-white">
            🔧 {data.function}()
          </div>
        </div>
      )}
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

export default function StackTraceVisualizer({ logText }) {
  const { nodes: initialNodes, edges: initialEdges } = parseStackTrace(logText)

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  if (initialNodes.length === 0) return null

  return (
    <div className="mt-6 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#2a2a3e] flex items-center gap-2">
        <span className="text-purple-400 font-semibold">📊 Stack Trace Visualizer</span>
        <span className="text-gray-500 text-xs">— click and drag to explore</span>
      </div>
      <div style={{ height: `${Math.min((initialNodes.length + 1) * 140, 500)}px` }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#2a2a3e" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}