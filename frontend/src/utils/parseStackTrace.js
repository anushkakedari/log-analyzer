export function parseStackTrace(logText) {
  const nodes = []
  const edges = []

  // Python stack trace pattern
  const pythonPattern = /File "(.+?)", line (\d+), in (\S+)/g
  // JavaScript/Node.js stack trace pattern  
  const jsPattern = /at (\S+)\s+\((.+?):(\d+):\d+\)/g
  // Java stack trace pattern
  const javaPattern = /at ([\w.]+)\.([\w]+)\((.+?):(\d+)\)/g

  let matches = []
  let match

  // Try Python pattern
  while ((match = pythonPattern.exec(logText)) !== null) {
    matches.push({
      file: match[1],
      line: match[2],
      function: match[3],
    })
  }

  // Try JavaScript pattern if no Python matches
  if (matches.length === 0) {
    while ((match = jsPattern.exec(logText)) !== null) {
      matches.push({
        file: match[2],
        line: match[3],
        function: match[1],
      })
    }
  }

  // Try Java pattern if still no matches
  if (matches.length === 0) {
    while ((match = javaPattern.exec(logText)) !== null) {
      matches.push({
        file: match[3],
        line: match[4],
        function: `${match[1]}.${match[2]}`,
      })
    }
  }

  if (matches.length === 0) return { nodes: [], edges: [] }

  // Extract error message (last line of log)
  const lines = logText.trim().split('\n')
  const errorLine = lines[lines.length - 1]

  // Build nodes
  matches.forEach((m, index) => {
    nodes.push({
      id: `node-${index}`,
      type: 'custom',
      position: { x: 250, y: index * 120 },
      data: {
        file: m.file.split('/').pop().split('\\').pop(), // just filename
        function: m.function,
        line: m.line,
        isError: false,
      },
    })
  })

  // Add error node at the bottom
  nodes.push({
    id: 'error-node',
    type: 'custom',
    position: { x: 250, y: matches.length * 120 },
    data: {
      file: '',
      function: errorLine,
      line: '',
      isError: true,
    },
  })

  // Build edges connecting nodes
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      source: `node-${i}`,
      target: i === nodes.length - 2 ? 'error-node' : `node-${i + 1}`,
      animated: true,
      style: { stroke: '#6366f1' },
    })
  }

  return { nodes, edges }
}