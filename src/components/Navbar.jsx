import { NavLink, Link } from 'react-router-dom'
import gallerijIcoon from '../assets/iconen/gallerij.png'
import autosIcoon from '../assets/iconen/autos.png'
import kijklijstIcoon from '../assets/iconen/kijklijst.png'
import rugzakIcoon from '../assets/iconen/rugzak.png'
import verkochtIcoon from '../assets/iconen/verkocht.png'
import databaseIcoon from '../assets/iconen/database.png'

const actief = ({ isActive }) => (isActive ? 'actief' : undefined)

/**
 * Het Windows-95-menu links van de inhoud.
 * @param {boolean} metJaar  toont het jaartal in de groene balk (alleen op de gallerij)
 */
export default function Navbar({ metJaar = false }) {
  const jaarKort = String(new Date().getFullYear()).slice(-2)
  return (
    <div className="navbar">
      <div className="balk" id="jaarbalk">
        <b>le</b>&nbsp;mel{metJaar && <>&nbsp;{jaarKort}</>}
      </div>
      <div className="items">
        <div className="menu-item">
          <NavLink to="/" end className={actief}>
            <img src={gallerijIcoon} alt="" />
            <span>gallerij</span>
            <span className="pijl">&#9654;</span>
          </NavLink>
          <div className="submenu">
            <Link to="/?thema=autos">
              <img src={autosIcoon} alt="" />
              <span>auto&#39;s</span>
            </Link>
          </div>
        </div>
        <NavLink to="/kijklijst" className={actief}>
          <img src={kijklijstIcoon} alt="" />
          <span>kijklijst</span>
        </NavLink>
        <NavLink to="/rugzak" className={actief}>
          <img src={rugzakIcoon} alt="" />
          <span>rugzak</span>
        </NavLink>
        <NavLink to="/verkocht" className={actief}>
          <img src={verkochtIcoon} alt="" />
          <span>verkocht</span>
        </NavLink>
        <NavLink to="/lenzendatabase" className={actief}>
          <img src={databaseIcoon} alt="" />
          <span>database</span>
        </NavLink>
      </div>
    </div>
  )
}
