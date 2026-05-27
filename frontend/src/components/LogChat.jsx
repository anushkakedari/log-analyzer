import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'

export default function LogChat({ logText, analysisResult }) {
  const { user } = useUser()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I've analyzed your log! I found a **${analysisResult?.classification}** level issue with **${analysisResult?.severity}** severity on **${analysisResult?.platform}**. Ask me anything about it! 🧠`,
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        log_text: logText,
        analysis: analysisResult,
        messages: [...messages, userMessage],
        user_id: user.id,
      })

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.reply }
      ])
    }  catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Something went wrong. Please try again.' }
      ])
    }finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="mt-6 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#2a2a3e] flex items-center gap-2">
        <span className="text-teal-400 font-semibold">💬 Chat With Your Log</span>
        <span className="text-gray-500 text-xs">— ask follow-up questions</span>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-[#0f0f1a] text-gray-300 border border-[#2a2a3e] rounded-bl-none'
            }`}>
              {msg.role === 'assistant' && (
                <span className="text-teal-400 font-bold text-xs block mb-1">🤖 AI Assistant</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#0f0f1a] border border-[#2a2a3e] px-4 py-3 rounded-xl rounded-bl-none">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-5 py-2 flex gap-2 flex-wrap border-t border-[#2a2a3e]">
        {[
          'Why did this happen?',
          'How do I prevent this?',
          'Can you explain the fix?',
        ].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs bg-[#0f0f1a] text-gray-400 hover:text-white border border-[#2a2a3e] px-3 py-1 rounded-full transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-[#2a2a3e] flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your log..."
          className="flex-1 bg-[#0f0f1a] border border-[#2a2a3e] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium text-sm transition-all"
        >
          Send 🚀
        </button>
      </div>
    </div>
  )
}