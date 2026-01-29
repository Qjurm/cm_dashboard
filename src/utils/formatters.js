import { formatDistanceToNow } from 'date-fns'

export const formatTime = (ms) => {
  if (!ms && ms !== 0) return '-'
  return (ms / 1000).toFixed(2) + 's'
}

export const formatTimestamp = (isoString) => {
  if (!isoString) return ''
  try {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true })
  } catch (e) {
    return ''
  }
}