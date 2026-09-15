import { useEffect } from 'react'

/**
 * Generiek Win98-contextmenu: verschijnt op (x, y), sluit bij een klik
 * ernaast of Escape. De aanroeper levert de menu-items als children
 * (meestal <button>'s met de "contextmenu"-knopstijl uit Gallerij.css).
 * @param {number}   x
 * @param {number}   y
 * @param {Function} onSluiten
 */
export default function Contextmenu({ x, y, onSluiten, children }) {
  useEffect(() => {
    function opDocumentKlik(e) {
      if (e.target.closest('.contextmenu')) return
      onSluiten()
    }
    function opToets(e) {
      if (e.key === 'Escape') onSluiten()
    }
    document.addEventListener('mousedown', opDocumentKlik)
    document.addEventListener('keydown', opToets)
    return () => {
      document.removeEventListener('mousedown', opDocumentKlik)
      document.removeEventListener('keydown', opToets)
    }
  }, [onSluiten])

  return (
    <div className="contextmenu" style={{ left: x, top: y }}>
      {children}
    </div>
  )
}
