import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

const SEVERITY_COLORS = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function PatternDetection() {
  const { user } = useUser()
  const [patterns, setPatterns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchPatterns()
  }, [])

  const fetchPatterns = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/patterns/${user.id}`)
      setPatterns(response.data.patterns)
    } catch {
      console.error('Failed to fetch patterns')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || patterns.length === 0) return null

  return (
    <div className="mb-8">
      {/* Warning Banner */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-orange-500/15 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-orange-400 font-semibold">
              {patterns.length} Recurring {patterns.length === 1 ? 'Error' : 'Errors'} Detected This Week!
            </p>
            <p className="text-orange-300/70 text-sm">
              These errors are repeating — you should fix them permanently.
            </p>
          </div>
        </div>
        <span className="text-orange-400 text-lg">
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Pattern Cards */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[pattern.severity] || 'bg-gray-500/20 text-gray-400'}`}>
                      {pattern.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                      {pattern.platform}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-orange-500/20 text-orange-400 border-orange-500/30">
                      🔁 Recurring
                    </span>
                  </div>

                  {/* Error preview */}
                  <p className="text-gray-300 text-sm font-mono truncate mb-2">
                    {pattern.sample_log}
                  </p>

                  {/* Explanation */}
                  <p className="text-gray-500 text-xs">
                    {pattern.explanation}
                  </p>
                </div>

                {/* Count Badge */}
                <div className="flex-shrink-0 text-center">
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold text-orange-400">{pattern.count}x</div>
                    <div className="text-orange-300/70 text-xs">this week</div>
                  </div>
                </div>
              </div>

              {/* Last seen */}
              {pattern.last_seen && (
                <p className="text-gray-600 text-xs mt-3">
                  Last seen: {new Date(pattern.last_seen).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}