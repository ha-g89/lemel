import { useEffect } from 'react'

/**
 * Sluit een venster met Escape.
 * @param {Function} onSluiten
 */
export function useEscape(onSluiten) {
  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluiten()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluiten])
}
