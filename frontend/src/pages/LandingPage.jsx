import { useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center text-white px-4">
      <div className="text-center max-w-2xl">
        {/* <div className="text-6xl mb-6">🔍</div> */}
        <img src="/Logo.jpeg" alt="Log Analyzer" className="w-24 h-24 mx-auto mb-6 rounded-2xl object-contain" />
        <h1 className="text-5xl font-bold mb-4 text-white">
          Log Analyzer
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Paste your logs, errors, and bugs — get instant plain English explanations, root cause analysis, and step-by-step fixes.
        </p>
        <SignedOut>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
          >
            Get Started — It's Free
          </button>
        </SignedOut>
        <SignedIn>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
          >
            Go to Dashboard →
          </button>
        </SignedIn>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-8 text-center">
        <div className="bg-[#1a1a2e] p-6 rounded-xl">
          <div className="text-3xl mb-2">🧠</div>
          <h3 className="font-semibold text-white mb-1">AI Powered</h3>
          <p className="text-gray-400 text-sm">Understands any log format instantly</p>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-xl">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-white mb-1">Instant Analysis</h3>
          <p className="text-gray-400 text-sm">Root cause + fix in seconds</p>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-xl">
          <div className="text-3xl mb-2">🔧</div>
          <h3 className="font-semibold text-white mb-1">Actionable Fixes</h3>
          <p className="text-gray-400 text-sm">Step-by-step solutions with code</p>
        </div>
      </div>
    </div>
  )
}