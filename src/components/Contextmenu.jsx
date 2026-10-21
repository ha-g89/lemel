import { useEffect } from 'react'
import './Contextmenu.css'

/**
 * Generiek Win98-contextmenu: verschijnt op (x, y), sluit bij een klik
 * ernaast of Escape. De aanroeper levert de menu-items als children
 * (meestal <button>'s met de "contextmenu"-knopstijl uit Gallerij.css).
 * @param {number}   x
 * @param {number}   y
 * @param {Function} onSluiten
 * @param {boolean}  [omhoog] menu boven (x, y) in plaats van eronder, bv. vanuit de taakbalk
 * @param {string}   [klasse] extra klasse, bv. 'notitie' voor een geel briefje i.p.v. een menu
 */
export default function Contextmenu({ x, y, omhoog = false, klasse, onSluiten, children }) {
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
    <div className={klasse ? 'contextmenu ' + klasse : 'contextmenu'} style={omhoog ? { left: x, bottom: window.innerHeight - y } : { left: x, top: y }}>
      {children}
    </div>
  )
}
