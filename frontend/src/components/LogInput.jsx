import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

export default function LogInput({ value, onChange }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2a3e]">
      <div className="bg-[#1a1a2e] px-4 py-2 flex items-center gap-2 border-b border-[#2a2a3e]">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 text-sm ml-2">Paste your log here</span>
      </div>
      <CodeMirror
        value={value}
        height="300px"
        theme={oneDark}
        onChange={(val) => onChange(val)}
        placeholder="Paste your error, log, or stack trace here..."
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
        }}
      />
    </div>
  )
}