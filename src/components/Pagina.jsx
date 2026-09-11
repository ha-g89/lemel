import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Taakbalk from './Taakbalk.jsx'
import Afsluitscherm from './Afsluitscherm.jsx'
import logo from '../assets/iconen/logo.png'
import instagramIcoon from '../assets/iconen/instagram.png'

/**
 * Gedeelde paginaschil: titel-logo, menu, inhoud, taakbalk en voettekst.
 *
 * @param {string}  titel     browsertitel
 * @param {string}  klasse    extra klasse op de wrapper voor paginaspecifieke stijlen
 * @param {boolean} metJaar   jaartal in de menubalk (alleen gallerij)
 * @param {{ basis: string, titel: string, onKlik: Function, actief: boolean }[]} [vensters]
 *   knoppen in de taakbalk voor open vensters (bv. de lightbox), één per geopende foto
 */
export default function Pagina({ titel, klasse, metJaar = false, vensters = [], children }) {
  const [afgesloten, zetAfgesloten] = useState(false)
  const [menuOpen, zetMenuOpen] = useState(false)

  useEffect(() => {
    document.title = titel
  }, [titel])

  /* klik buiten het menu (en buiten de Start-knop) sluit het,
     net als het echte Windows-95 Start-menu */
  useEffect(() => {
    if (!menuOpen) return
    function opDocumentKlik(e) {
      if (e.target.closest('.navbar') || e.target.closest('.startknop')) return
      zetMenuOpen(false)
    }
    document.addEventListener('mousedown', opDocumentKlik)
    return () => document.removeEventListener('mousedown', opDocumentKlik)
  }, [menuOpen])

  if (afgesloten) return <Afsluitscherm />

  return (
    <div className={klasse ? 'wrapper ' + klasse : 'wrapper'}>
      <Link className="titel-link" to="/">
        <img className="titel" src={logo} alt="le mel" />
      </Link>

      {children}

      <Taakbalk
        vensters={vensters}
        metJaar={metJaar}
        menuOpen={menuOpen}
        onToggleMenu={() => zetMenuOpen((o) => !o)}
        onSluitMenu={() => zetMenuOpen(false)}
        opAfsluiten={() => zetAfgesloten(true)}
      />

      <div className="footer" id="contact">
        <a
          href="https://www.instagram.com/meneermel/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src={instagramIcoon} alt="Instagram" />
        </a>
        <div className="copyright">&copy; 2026 mel cayci &mdash; foto's niet gebruiken zonder toestemming</div>
      </div>
    </div>
  )
}
