import { NavLink, Link } from 'react-router-dom'
import gallerijIcoon from '../assets/iconen/gallerij.png'
import autosIcoon from '../assets/iconen/autos.png'
import kijklijstIcoon from '../assets/iconen/kijklijst.png'
import rugzakIcoon from '../assets/iconen/rugzak.png'
import verkochtIcoon from '../assets/iconen/verkocht.png'
import databaseIcoon from '../assets/iconen/database.png'
import homeIcoon from '../assets/iconen/home.png'
import afsluitenIcoon from '../assets/iconen/afsluiten.png'

const actief = ({ isActive }) => (isActive ? 'actief' : undefined)

/**
 * Het Windows-95 Start-menu: verborgen totdat er op Start wordt geklikt,
 * verschijnt dan als uitklapmenu boven de taakbalk.
 * @param {boolean}  metJaar       toont het jaartal in de groene balk (alleen op de gallerij)
 * @param {boolean}  open          staat het menu open
 * @param {Function} [onSluitMenu] sluit het menu (klik op een link erin)
 * @param {Function} [opAfsluiten] klik op "Shut Down..." onderaan het menu
 */
export default function Navbar({ metJaar = false, open = false, onSluitMenu, opAfsluiten }) {
  const jaarKort = String(new Date().getFullYear()).slice(-2)

  if (!open) return null

  return (
    <div className="navbar">
      <div className="balk" id="jaarbalk">
        <b>le</b>&nbsp;mel{metJaar && <>&nbsp;{jaarKort}</>}
      </div>
      <div className="items">
        <div className="menu-item">
          <NavLink to="/" end className={actief} onClick={onSluitMenu}>
            <img src={gallerijIcoon} alt="" />
            <span><u>g</u>allerij</span>
            <span className="pijl">&#9654;</span>
          </NavLink>
          <div className="submenu">
            <Link to="/?thema=autos" onClick={onSluitMenu}>
              <img src={autosIcoon} alt="" />
              <span><u>a</u>uto&#39;s</span>
            </Link>
          </div>
        </div>
        <NavLink to="/kijklijst" className={actief} onClick={onSluitMenu}>
          <img src={kijklijstIcoon} alt="" />
          <span><u>k</u>ijklijst</span>
        </NavLink>
        <NavLink to="/rugzak" className={actief} onClick={onSluitMenu}>
          <img src={rugzakIcoon} alt="" />
          <span><u>r</u>ugzak</span>
        </NavLink>
        <NavLink to="/verkocht" className={actief} onClick={onSluitMenu}>
          <img src={verkochtIcoon} alt="" />
          <span><u>v</u>erkocht</span>
        </NavLink>
        <NavLink to="/lenzendatabase" className={actief} onClick={onSluitMenu}>
          <img src={databaseIcoon} alt="" />
          <span><u>d</u>atabase</span>
        </NavLink>
        {opAfsluiten && (
          <>
            <div className="menu-scheiding"></div>
            <Link
              to="/"
              onClick={() => {
                if (onSluitMenu) onSluitMenu()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <img src={homeIcoon} alt="" className="home-icoon" />
              <span><u>h</u>ome</span>
            </Link>
            <a
              className="afsluiten-link"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (onSluitMenu) onSluitMenu()
                opAfsluiten()
              }}
            >
              <img src={afsluitenIcoon} alt="" />
              <span><u>s</u>hut down...</span>
            </a>
          </>
        )}
      </div>
    </div>
  )
}
