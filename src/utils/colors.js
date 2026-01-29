export const getColorForLabel = (label) => {
    const l = (label || '').toLowerCase()
    const colors = {
      // Standard Colors
      green: '#10b981',  // Emerald
      blue:  '#3b82f6',  // Blue
      red:   '#ef4444',  // Red
      left:  '#f59e0b',  // Amber
      right: '#8b5cf6',  // Violet
      
      // New Specific Scenario Colors
      'ferris-wheel': '#ec4899', // Pink
      'carousel':     '#06b6d4', // Cyan
      'lights':       '#eab308', // Yellow
      'no-lights':    '#64748b', // Slate
      'wide':         '#6366f1', // Indigo
      'narrow':       '#d946ef', // Fuchsia
      'unknown':      '#cbd5e1'  // Grey
    }
    return colors[l] || '#94a3b8' // Default fallback
  }