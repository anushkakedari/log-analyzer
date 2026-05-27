import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

export default function FileUpload({ onFilesAccepted }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        onFilesAccepted(file.name, reader.result)
      }
      reader.readAsText(file)
    })
  }, [onFilesAccepted])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.log', '.txt'],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-[#2a2a3e] hover:border-indigo-500/50 bg-[#1a1a2e]'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-4xl mb-3">📂</div>
      {isDragActive ? (
        <p className="text-indigo-400 font-medium">Drop your files here...</p>
      ) : (
        <>
          <p className="text-white font-medium mb-1">Drag & drop your log files here</p>
          <p className="text-gray-400 text-sm">or click to browse</p>
          <p className="text-gray-500 text-xs mt-2">
            Supports .log, .txt, .json, .csv, .png, .jpg
          </p>
        </>
      )}

      {acceptedFiles.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {acceptedFiles.map((file) => (
            <span
              key={file.name}
              className="bg-indigo-600/20 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/30"
            >
              ✅ {file.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}