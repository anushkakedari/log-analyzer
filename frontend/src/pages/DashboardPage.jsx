// import { useUser } from '@clerk/clerk-react'
// import { useNavigate } from 'react-router-dom'
// import Navbar from '../components/Navbar'

// export default function DashboardPage() {
//   const { user } = useUser()
//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen bg-[#0f0f1a] text-white">
//       <Navbar />
//       <div className="max-w-4xl mx-auto px-6 py-10">
//         <h1 className="text-3xl font-bold mb-2">
//           Welcome back, {user?.firstName}! 👋
//         </h1>
//         <p className="text-gray-400 mb-8">
//           Ready to debug? Paste a log and get instant answers.
//         </p>

//         <button
//           onClick={() => navigate('/analyze')}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
//         >
//           🔍 Analyze a Log
//         </button>
//       </div>
//     </div>
//   )
// }








// // import { UserButton, useUser } from '@clerk/clerk-react'

// // export default function DashboardPage() {
// //   const { user } = useUser()

// //   return (
// //     <div className="min-h-screen bg-[#0f0f1a] text-white p-8">
// //       <div className="flex items-center justify-between mb-8">
// //         <h1 className="text-2xl font-bold">🔍 Log Analyzer</h1>
// //         <div className="flex items-center gap-3">
// //           <span className="text-gray-400">Hey, {user?.firstName}! 👋</span>
// //           <UserButton afterSignOutUrl="/" />
// //         </div>
// //       </div>
// //       <div className="flex items-center justify-center h-64">
// //         <p className="text-gray-500 text-lg">Dashboard coming in Phase 3... 🚀</p>
// //       </div>
// //     </div>
// //   )
// // }

import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PatternDetection from '../components/PatternDetection'

export default function DashboardPage() {
  const { user } = useUser()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-400">
            Ready to debug? Paste a log and get instant answers.
          </p>
        </div>

        {/* Pattern Detection */}
        <PatternDetection />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/analyze')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-5 rounded-xl text-left transition-all"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold">Analyze a Log</div>
            <div className="text-indigo-300 text-sm mt-1">Paste or upload your log</div>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="bg-[#1a1a2e] hover:bg-[#2a2a3e] border border-[#2a2a3e] text-white font-semibold px-6 py-5 rounded-xl text-left transition-all"
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-semibold">View History</div>
            <div className="text-gray-400 text-sm mt-1">Revisit past analyses</div>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="bg-[#1a1a2e] hover:bg-[#2a2a3e] border border-[#2a2a3e] text-white font-semibold px-6 py-5 rounded-xl text-left transition-all"
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold">Analytics</div>
            <div className="text-gray-400 text-sm mt-1">See your error patterns</div>
          </button>
        </div>

        {/* Tips */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">💡 Pro Tips</h3>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">→ Upload <span className="text-indigo-400">.log, .txt, .json</span> files directly for bulk analysis</p>
            <p className="text-gray-400 text-sm">→ Take a <span className="text-indigo-400">screenshot</span> of your terminal and upload it</p>
            <p className="text-gray-400 text-sm">→ Use <span className="text-indigo-400">Chat With Your Log</span> to ask follow-up questions after analysis</p>
            <p className="text-gray-400 text-sm">→ Check <span className="text-indigo-400">Analytics</span> regularly to spot your most common errors</p>
          </div>
        </div>

      </div>
    </div>
  )
}