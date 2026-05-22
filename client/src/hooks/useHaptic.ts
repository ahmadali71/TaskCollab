export function useHaptic() {
  const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    if (!('vibrate' in navigator)) return

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 30, 10],
      warning: [30, 10, 30],
      error: [50, 30, 50],
    }

    navigator.vibrate(patterns[pattern])
  }

  return { triggerHaptic }
}