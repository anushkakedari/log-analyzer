const SEVERITY_COLORS = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const CLASS_COLORS = {
  INFO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DEBUG: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  WARNING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ERROR: 'bg-red-500/20 text-red-400 border-red-500/30',
  FATAL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export default function HistoryCard({ log, onDelete, onClick }) {
  const date = log.created_at
    ? new Date(log.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : 'Unknown date'

  return (
    <div
      onClick={() => onClick(log)}
      className="bg-[#1a1a2e] border border-[#2a2a3e] hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all hover:bg-[#1f1f35]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${CLASS_COLORS[log.classification] || 'bg-gray-500/20 text-gray-400'}`}>
              {log.classification}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[log.severity] || 'bg-gray-500/20 text-gray-400'}`}>
              {log.severity}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              {log.platform}
            </span>
          </div>

          {/* Log preview */}
          <p className="text-gray-300 text-sm font-mono truncate mb-2">
            {log.raw_log}
          </p>

          {/* Explanation */}
          <p className="text-gray-500 text-xs line-clamp-2">
            {log.explanation}
          </p>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-gray-500 text-xs whitespace-nowrap">{date}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(log.id)
            }}
            className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-lg transition-all"
          >
            Delete 🗑️
          </button>
        </div>
      </div>
    </div>
  )
}