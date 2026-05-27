import { parseTimestamps } from '../utils/parseTimestamps'

const LEVEL_STYLES = {
  INFO: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    line: 'border-blue-500/30',
    icon: '🟢',
  },
  DEBUG: {
    dot: 'bg-gray-500',
    badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    line: 'border-gray-500/30',
    icon: '⚪',
  },
  WARNING: {
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    line: 'border-yellow-500/30',
    icon: '🟡',
  },
  ERROR: {
    dot: 'bg-red-500',
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    line: 'border-red-500/30',
    icon: '🔴',
  },
  FATAL: {
    dot: 'bg-purple-500',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    line: 'border-purple-500/30',
    icon: '💀',
  },
  CRITICAL: {
    dot: 'bg-red-600',
    badge: 'bg-red-600/20 text-red-300 border-red-600/30',
    line: 'border-red-600/30',
    icon: '🚨',
  },
}

export default function LogTimeline({ logText }) {
  const events = parseTimestamps(logText)

  if (events.length === 0) return null

  return (
    <div className="mt-6 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#2a2a3e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-semibold">📅 Log Timeline</span>
          <span className="text-gray-500 text-xs">— sequence of events</span>
        </div>
        <span className="text-gray-500 text-xs">{events.length} events detected</span>
      </div>

      {/* Timeline */}
      <div className="px-6 py-5 max-h-96 overflow-y-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#2a2a3e]"></div>

          <div className="space-y-4">
            {events.map((event, index) => {
              const style = LEVEL_STYLES[event.level] || LEVEL_STYLES['INFO']

              return (
                <div key={index} className="flex gap-4 relative">
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full ${style.dot} flex-shrink-0 mt-0.5 z-10 ring-2 ring-[#1a1a2e]`}></div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Timestamp */}
                      <span className="text-gray-500 text-xs font-mono">
                        {event.timestamp}
                      </span>
                      {/* Level badge */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${style.badge}`}>
                        {event.icon} {event.level}
                      </span>
                    </div>
                    {/* Message */}
                    <p className="text-gray-300 text-sm break-words">
                      {event.message}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-[#2a2a3e] flex flex-wrap gap-3">
        {Object.entries(LEVEL_STYLES).slice(0, 5).map(([level, style]) => (
          <span key={level} className={`px-2 py-0.5 rounded-full text-xs font-medium border ${style.badge}`}>
            {style.icon} {level}
          </span>
        ))}
      </div>
    </div>
  )
}