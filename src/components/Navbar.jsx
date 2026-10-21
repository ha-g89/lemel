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
import patchnotesIcoon from '../assets/iconen/patchnotes.png'
import leesmijIcoon from '../assets/iconen/leesmij.png'
import overmijIcoon from '../assets/iconen/overmij.png'

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
 * @param {boolean}  open                staat het menu open
 * @param {Function} onSluitMenu         sluit het menu (klik op een link erin)
 * @param {Function} opAfsluiten         klik op "Shut Down..." onderaan het menu
 * @param {Function} onOpenVenster       (naam) => void, opent een venster uit het menu:
 *   'scherminstellingen', 'overmij', 'leesmij' of 'patchnotes' (zie Pagina)
 */
export default function Navbar({ open = false, ...rest }) {
  if (!open) return null
  return <StartMenu {...rest} />
}

/* het opengeklapte menu zelf; los component zodat het open submenu bij
   elke keer openen weer dicht begint */
function StartMenu({ onSluitMenu, opAfsluiten, onOpenVenster }) {
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
  /* menu-item dat geen pagina opent maar een venster (zie Pagina) */
  const vensterItem = (naam, icoon, label, klasse) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        onSluitMenu()
        onOpenVenster(naam)
      }}
    >
      <img src={icoon} alt="" className={klasse} />
      <span>{label}</span>
    </a>
  )

  return (
    <div
      className="navbar"
      onPointerDown={(e) => {
        aanraking.current = e.pointerType === 'touch'
      }}
    >
      <div className="balk" id="jaarbalk">
        <b>meneer</b>mel&nbsp;{jaarKort}
      </div>
      <div className="items">
        <div className={itemKlasse('gallerij')}>
          <NavLink
            to="/"
            end
            className={actief}
            onClick={(e) => {
              if (!klapOpen(e, 'gallerij')) onSluitMenu()
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
        {vensterItem('overmij', overmijIcoon, <><u>o</u>ver mij</>)}
        <div className="menu-scheiding"></div>
        <Link
          to="/"
          onClick={(e) => {
            onSluitMenu()
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
        {/* onderaan het menu: submenu klapt omhoog open, anders hangt het over de taakbalk */}
        <div className={itemKlasse('instellingen') + ' omhoog'}>
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
            {vensterItem('scherminstellingen', weergaveIcoon, <>s<u>c</u>herminstellingen</>, 'weergave-icoon')}
            {vensterItem('leesmij', leesmijIcoon, <><u>l</u>eesmij</>)}
            {vensterItem('patchnotes', patchnotesIcoon, <><u>p</u>atchnotes</>)}
          </div>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSluitMenu()
            opAfsluiten()
          }}
        >
          <img src={afsluitenIcoon} alt="" className="afsluiten-icoon" />
          <span><u>s</u>hut down...</span>
        </a>
      </div>
    </div>
  )
}
