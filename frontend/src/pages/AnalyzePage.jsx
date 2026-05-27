import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import LogInput from '../components/LogInput'
import FileUpload from '../components/FileUpload'
import AnalysisResult from '../components/AnalysisResult'
import StackTraceVisualizer from '../components/StackTraceVisualizer'
import LogTimeline from '../components/LogTimeline'
import LogChat from '../components/LogChat'

const INPUT_TABS = ['Paste Log', 'Upload File', 'Screenshot']
const RESULT_TABS = ['🔍 Analysis', '📊 Stack Trace', '📅 Timeline', '💬 Chat']

export default function AnalyzePage() {
  const { user } = useUser()
  const [activeInputTab, setActiveInputTab] = useState('Paste Log')
  const [activeResultTab, setActiveResultTab] = useState('🔍 Analysis')
  const [logText, setLogText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileAccepted = (filename, content) => {
    setLogText(content)
    setActiveInputTab('Paste Log')
  }

  const handleAnalyze = async () => {
    if (!logText.trim()) return
    setIsAnalyzing(true)
    setResult(null)
    setError(null)
    setActiveResultTab('🔍 Analysis')

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        log_text: logText,
        user_id: user.id,
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analyze Your Log 🔍</h1>
          <p className="text-gray-400">
            Paste your log, upload a file, or drop a screenshot — get instant AI analysis.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5 mb-6">
          {/* Input Tabs */}
          <div className="flex gap-2 mb-4">
            {INPUT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveInputTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeInputTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0f0f1a] text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Input Content */}
          {activeInputTab === 'Paste Log' && (
            <LogInput value={logText} onChange={setLogText} />
          )}
          {activeInputTab === 'Upload File' && (
            <FileUpload onFilesAccepted={handleFileAccepted} />
          )}
          {activeInputTab === 'Screenshot' && (
            <div className="border-2 border-dashed border-[#2a2a3e] rounded-xl p-10 text-center">
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-white font-medium mb-1">Upload a terminal screenshot</p>
              <p className="text-gray-400 text-sm">OCR will extract the text automatically</p>
              <input
                type="file"
                accept="image/*"
                className="mt-4 text-gray-400 text-sm"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setLogText(`[Screenshot uploaded: ${file.name} — OCR coming soon]`)
                    setActiveInputTab('Paste Log')
                  }
                }}
              />
            </div>
          )}

          {/* Character count + Buttons */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-500 text-xs">
              {logText ? `${logText.length} characters · ${logText.split('\n').length} lines` : ''}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => { setLogText(''); setResult(null); setError(null) }}
                className="bg-[#0f0f1a] hover:bg-[#2a2a3e] text-gray-400 font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!logText.trim() || isAnalyzing}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm"
              >
                {isAnalyzing ? '🔄 Analyzing...' : '🚀 Analyze Log'}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
            ❌ {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div>
            {/* Analysis Result — always visible on top */}
            <AnalysisResult result={result} />

            {/* Result Tabs */}
            <div className="flex gap-2 mt-8 mb-4 border-b border-[#2a2a3e] pb-0">
              {RESULT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveResultTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                    activeResultTab === tab
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-2">
              {activeResultTab === '🔍 Analysis' && (
                <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5 text-gray-400 text-sm">
                  ✅ Analysis shown above — scroll up to review explanation, root cause, and fix suggestions.
                </div>
              )}
              {activeResultTab === '📊 Stack Trace' && (
                <StackTraceVisualizer logText={logText} />
              )}
              {activeResultTab === '📅 Timeline' && (
                <LogTimeline logText={logText} />
              )}
              {activeResultTab === '💬 Chat' && (
                <LogChat logText={logText} analysisResult={result} />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}


