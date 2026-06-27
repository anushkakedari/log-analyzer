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

export default function AnalysisResult({ result }) {
  if (!result) return null

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard! ✅')
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold text-white">Analysis Result 🧠</h2>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${CLASS_COLORS[result.classification]}`}>
          {result.classification}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${SEVERITY_COLORS[result.severity]}`}>
          {result.severity} Severity
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
          {result.platform}
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium border bg-teal-500/20 text-teal-400 border-teal-500/30">
          {result.fix_confidence}% Confidence
        </span>
      </div>

      {/* Explanation */}
      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2a2a3e]">
        <h3 className="text-indigo-400 font-semibold mb-2">💡 What does this mean?</h3>
        <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
      </div>

      {/* Root Cause */}
      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2a2a3e]">
        <h3 className="text-orange-400 font-semibold mb-2">🔎 Root Cause</h3>
        <p className="text-gray-300 leading-relaxed">{result.root_cause}</p>
      </div>

      {/* Fix Suggestions */}
      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2a2a3e]">
        <h3 className="text-green-400 font-semibold mb-3">🔧 How to Fix It</h3>
        <ol className="space-y-2">
          {result.fix_suggestions.map((fix, index) => (
            <li key={index} className="flex gap-3 text-gray-300">
              <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{fix}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Fix Code */}
      {result.fix_code && (
        <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2a2a3e]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-purple-400 font-semibold">💻 Fix Code Snippet</h3>
            <button
              onClick={() => copyToClipboard(result.fix_code)}
              className="text-xs text-gray-400 hover:text-white bg-[#2a2a3e] px-3 py-1 rounded-lg transition-all"
            >
              Copy 📋
            </button>
          </div>
          <pre className="text-gray-300 text-sm overflow-x-auto bg-[#0f0f1a] p-4 rounded-lg">
            <code>{result.fix_code}</code>
          </pre>
        </div>
      )}



    {result.is_personalized && (
      <span className="px-3 py-1 rounded-full text-sm font-medium border bg-green-500/20 text-green-400 border-green-500/30">
        🧠 Personalized
      </span>
    )}

    {result.similar_logs && result.similar_logs.length > 0 && (
      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-green-500/30 mt-4">
        <h3 className="text-green-400 font-semibold mb-3">🔍 Similar Past Errors Found</h3>
          {result.similar_logs.map((log, index) => (
            <div key={index} className="mb-3 pb-3 border-b border-[#2a2a3e] last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-xs font-bold">
                  {Math.round(log.similarity * 100)}% match
                </span>
                <span className="text-gray-500 text-xs">{log.platform}</span>
              </div>
              <p className="text-gray-300 text-xs font-mono truncate">{log.raw_log}</p>
              <p className="text-gray-500 text-xs mt-1">{log.explanation}</p>
            </div>
          ))}
        </div>
    )}
  </div> 
  )
}