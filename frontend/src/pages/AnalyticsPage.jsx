import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'

const SEVERITY_COLORS = {
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#f97316',
  Critical: '#ef4444',
  Unknown: '#6b7280',
}

const CLASS_COLORS = {
  INFO: '#3b82f6',
  DEBUG: '#6b7280',
  WARNING: '#eab308',
  ERROR: '#ef4444',
  FATAL: '#a855f7',
  Unknown: '#6b7280',
}

const PIE_COLORS = ['#6366f1', '#22c55e', '#f97316', '#ef4444', '#a855f7', '#eab308']

export default function AnalyticsPage() {
  const { user } = useUser()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/${user.id}`)
      setData(response.data)
    } catch {
      console.error('Failed to fetch analytics')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data || data.total === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">No data yet!</h2>
          <p className="text-gray-400">Analyze some logs first to see your analytics.</p>
        </div>
      </div>
    )
  }

  // Get most common platform
  const topPlatform = data.by_platform.reduce((a, b) => a.value > b.value ? a : b, {})
  // Get most common severity
  const topSeverity = data.by_severity.reduce((a, b) => a.value > b.value ? a : b, {})

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics 📈</h1>
          <p className="text-gray-400">Insights into your error patterns and debugging habits.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Analyzed"
            value={data.total}
            icon="🔍"
            color="text-indigo-400"
          />
          <StatCard
            title="Most Common"
            value={topSeverity.name || 'N/A'}
            icon="⚠️"
            color="text-orange-400"
          />
          <StatCard
            title="Top Platform"
            value={topPlatform.name || 'N/A'}
            icon="💻"
            color="text-teal-400"
          />
          <StatCard
            title="Error Types"
            value={data.by_classification.length}
            icon="🏷️"
            color="text-purple-400"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Severity Pie Chart */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Severity Breakdown 🎯</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.by_severity}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.by_severity.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={SEVERITY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Classification Bar Chart */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Log Classifications 🏷️</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.by_classification}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.by_classification.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={CLASS_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Activity Line Chart */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Activity Last 7 Days 📅</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.by_date}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Bar Chart */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Top Platforms 💻</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.by_platform} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}