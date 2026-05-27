import { UserButton, useUser } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bg-[#0f0f1a] border-b border-[#2a2a3e] px-8 py-4 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        {/* <span className="text-2xl">🔍</span> */}
        <img src="/Logo.jpeg" alt="Log Analyzer" className="w-8 h-8 rounded-lg object-contain" />
        <span className="text-white font-bold text-xl">Log Analyzer</span>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/dashboard')}
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/dashboard'
              ? 'text-indigo-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/analyze')}
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/analyze'
              ? 'text-indigo-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Analyze Log
        </button>

        <button
          onClick={() => navigate('/history')}
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/history'
              ? 'text-indigo-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          History
        </button>

        <button
        onClick={() => navigate('/analytics')}
        className={`text-sm font-medium transition-colors ${
          location.pathname === '/analytics'
            ? 'text-indigo-400'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Analytics
      </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm">Hey, {user?.firstName}! 👋</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}