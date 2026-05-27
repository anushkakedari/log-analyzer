export function parseTimestamps(logText) {
  const events = []

  const patterns = [
    // 2024-01-15 10:23:01 LEVEL message
    /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(INFO|WARNING|WARN|ERROR|FATAL|DEBUG|CRITICAL)\s+(.*)/gi,
    // [2024-01-15 10:23:01] LEVEL message
    /\[(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\]\s+(INFO|WARNING|WARN|ERROR|FATAL|DEBUG|CRITICAL)\s+(.*)/gi,
    // 10:23:01 LEVEL message (time only)
    /(\d{2}:\d{2}:\d{2})\s+(INFO|WARNING|WARN|ERROR|FATAL|DEBUG|CRITICAL)\s+(.*)/gi,
    // LEVEL: 2024-01-15 10:23:01 message
    /(INFO|WARNING|WARN|ERROR|FATAL|DEBUG|CRITICAL):\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(.*)/gi,
  ]

  const lines = logText.split('\n')

  lines.forEach((line) => {
    for (const pattern of patterns) {
      pattern.lastIndex = 0
      const match = pattern.exec(line)
      if (match) {
        const isLevelFirst = ['INFO', 'WARNING', 'WARN', 'ERROR', 'FATAL', 'DEBUG', 'CRITICAL']
          .includes(match[1]?.toUpperCase())

        events.push({
          timestamp: isLevelFirst ? match[2] : match[1],
          level: (isLevelFirst ? match[1] : match[2]).toUpperCase().replace('WARN', 'WARNING'),
          message: isLevelFirst ? match[3] : match[3],
          raw: line.trim(),
        })
        break
      }
    }
  })

  return events
}