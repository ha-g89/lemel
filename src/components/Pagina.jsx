import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Taakbalk from './Taakbalk.jsx'
import logo from '../assets/iconen/logo.png'
import instagramIcoon from '../assets/iconen/instagram.png'

/**
 * Gedeelde paginaschil: titel-logo, menu, inhoud, taakbalk en voettekst.
 *
 * @param {string}  titel     browsertitel
 * @param {string}  klasse    extra klasse op de wrapper voor paginaspecifieke stijlen
 * @param {boolean} metJaar   jaartal in de menubalk (alleen gallerij)
 */
export default function Pagina({ titel, klasse, metJaar = false, children }) {
  useEffect(() => {
    document.title = titel
  }, [titel])

  return (
    <div className={klasse ? 'wrapper ' + klasse : 'wrapper'}>
      <Link className="titel-link" to="/">
        <img className="titel" src={logo} alt="le mel" />
      </Link>

      <Navbar metJaar={metJaar} />

      {children}

      <Taakbalk />

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
