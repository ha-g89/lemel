import { useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { THEMA_NAAM } from '../data/lenzen.js'
import gallerijIcoon from '../assets/iconen/gallerij.png'
import autosIcoon from '../assets/iconen/autos.png'
import jp26Icoon from '../assets/iconen/jp26.png'
import databaseIcoon from '../assets/iconen/database.png'
import concertIcoon from '../assets/iconen/concert.png'
import inspiratieIcoon from '../assets/iconen/inspiratie.png'
import homeIcoon from '../assets/iconen/home.png'
import afsluitenIcoon from '../assets/iconen/afsluiten.png'
import settingIcoon from '../assets/iconen/setting.png'
import weergaveIcoon from '../assets/iconen/weergave.png'

const actief = ({ isActive }) => (isActive ? 'actief' : undefined)

/* icoon per album-thema (zie THEMA_NAAM in lenzen.js); een thema zonder
   eigen icoontje hier valt terug op het gallerij-icoontje */
const THEMA_ICOON = {
  autos: autosIcoon,
  jp26: jp26Icoon,
}

/**
 * Het Windows-95 Start-menu: verborgen totdat er op Start wordt geklikt,
 * verschijnt dan als uitklapmenu boven de taakbalk.
 * @param {boolean}  metJaar             toont het jaartal in de groene balk (alleen op de gallerij)
 * @param {boolean}  open                staat het menu open
 * @param {Function} [onSluitMenu]       sluit het menu (klik op een link erin)
 * @param {Function} [opAfsluiten]       klik op "Shut Down..." onderaan het menu
 * @param {Function} [onOpenInstellingen] klik op "scherminstellingen" in het instellingen-submenu
 */
export default function Navbar({ open = false, ...rest }) {
  if (!open) return null
  return <StartMenu {...rest} />
}

/* het opengeklapte menu zelf; los component zodat het open submenu bij
   elke keer openen weer dicht begint */
function StartMenu({ metJaar = false, onSluitMenu, opAfsluiten, onOpenInstellingen }) {
  const jaarKort = String(new Date().getFullYear()).slice(-2)
  const { pathname, search } = useLocation()
  /* op een touchscreen bestaat geen hover: de eerste tik op een item met een
     pijltje klapt het submenu open, een tweede tik volgt pas de link */
  const [openSubmenu, zetOpenSubmenu] = useState(null)
  const aanraking = useRef(false)
  function klapOpen(e, naam) {
    if (!aanraking.current || openSubmenu === naam) return false
    e.preventDefault()
    zetOpenSubmenu(naam)
    return true
  }
  const itemKlasse = (naam) => (openSubmenu === naam ? 'menu-item open' : 'menu-item')

  return (
    <div
      className="navbar"
      onPointerDown={(e) => {
        aanraking.current = e.pointerType === 'touch'
      }}
    >
      <div className="balk" id="jaarbalk">
        <b>le</b>&nbsp;mel{metJaar && <>&nbsp;{jaarKort}</>}
      </div>
      <div className="items">
        <div className={itemKlasse('gallerij')}>
          <NavLink
            to="/"
            end
            className={actief}
            onClick={(e) => {
              if (!klapOpen(e, 'gallerij') && onSluitMenu) onSluitMenu()
            }}
          >
            <img src={gallerijIcoon} alt="" />
            <span><u>g</u>allerij</span>
            <span className="pijl">&#9654;</span>
          </NavLink>
          <div className="submenu">
            {Object.entries(THEMA_NAAM).map(([code, label]) => (
              <Link key={code} to={`/?thema=${code}`} onClick={onSluitMenu}>
                <img src={THEMA_ICOON[code] || gallerijIcoon} alt="" />
                <span>
                  <u>{label[0]}</u>
                  {label.slice(1)}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <NavLink to="/lenzendatabase" className={actief} onClick={onSluitMenu}>
          <img src={databaseIcoon} alt="" />
          <span><u>d</u>atabase</span>
        </NavLink>
        <NavLink to="/concerten" className={actief} onClick={onSluitMenu}>
          <img src={concertIcoon} alt="" />
          <span><u>c</u>oncerten</span>
        </NavLink>
        <NavLink to="/inspiratie" className={actief} onClick={onSluitMenu}>
          <img src={inspiratieIcoon} alt="" />
          <span><u>i</u>nspiratie</span>
        </NavLink>
        {opAfsluiten && (
          <>
            <div className="menu-scheiding"></div>
            <Link
              to="/"
              onClick={(e) => {
                if (onSluitMenu) onSluitMenu()
                /* al op de startpagina: rustig naar boven rollen in plaats van
                   opnieuw navigeren (dat springt meteen naar boven) */
                if (pathname === '/' && !search) {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            >
              <img src={homeIcoon} alt="" className="home-icoon" />
              <span><u>h</u>ome</span>
            </Link>
            <div className={itemKlasse('instellingen')}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (aanraking.current) zetOpenSubmenu(openSubmenu === 'instellingen' ? null : 'instellingen')
                }}
              >
                <img src={settingIcoon} alt="" />
                <span><u>i</u>nstellingen</span>
                <span className="pijl">&#9654;</span>
              </a>
              <div className="submenu">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onSluitMenu) onSluitMenu()
                    if (onOpenInstellingen) onOpenInstellingen()
                  }}
                >
                  <img src={weergaveIcoon} alt="" className="weergave-icoon" />
                  <span>s<u>c</u>herminstellingen</span>
                </a>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (onSluitMenu) onSluitMenu()
                opAfsluiten()
              }}
            >
              <img src={afsluitenIcoon} alt="" className="afsluiten-icoon" />
              <span><u>s</u>hut down...</span>
            </a>
          </>
        )}
      </div>
    </div>
  )
}
