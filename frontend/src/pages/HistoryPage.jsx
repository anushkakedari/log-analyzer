import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import HistoryCard from '../components/HistoryCard'

const SEVERITY_FILTERS = ['All', 'Low', 'Medium', 'High', 'Critical']
const PLATFORM_FILTERS = ['All', 'Python', 'Node.js', 'Java', 'React.js', 'Docker']

export default function HistoryPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [filtered, setFiltered] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [platformFilter, setPlatformFilter] = useState('All')

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [search, severityFilter, platformFilter, history])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/history/${user.id}`)
      setHistory(response.data)
    } catch {
      console.error('Failed to fetch history')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...history]

    if (search.trim()) {
      result = result.filter(log =>
        log.raw_log.toLowerCase().includes(search.toLowerCase()) ||
        log.explanation?.toLowerCase().includes(search.toLowerCase()) ||
        log.platform?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (severityFilter !== 'All') {
      result = result.filter(log => log.severity === severityFilter)
    }

    if (platformFilter !== 'All') {
      result = result.filter(log => log.platform === platformFilter)
    }

    setFiltered(result)
  }

  const handleDelete = async (logId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/history/${logId}`)
      setHistory(prev => prev.filter(log => log.id !== logId))
    } catch {
      console.error('Failed to delete')
    }
  }

  const handleClick = (log) => {
    navigate('/analyze', { state: { historyLog: log } })
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your History 📁</h1>
          <p className="text-gray-400">All your past log analyses — click any to revisit.</p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by keyword, platform, or error..."
          className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all mb-4"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <span className="text-gray-400 text-sm self-center">Severity:</span>
            {SEVERITY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setSeverityFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  severityFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-gray-400 text-sm self-center">Platform:</span>
            {PLATFORM_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setPlatformFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  platformFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-4">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
        </p>

        {/* History List */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading your history...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">No history found</p>
            <p className="text-gray-500 text-sm mt-1">
              {history.length === 0
                ? 'Analyze your first log to see it here!'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(log => (
              <HistoryCard
                key={log.id}
                log={log}
                onDelete={handleDelete}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}