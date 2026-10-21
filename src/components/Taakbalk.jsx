import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar from './Navbar.jsx'
import Contextmenu from './Contextmenu.jsx'
import { useProgrammas } from '../hooks/useProgrammas.js'
import logo from '../assets/iconen/logo.png'
import vensterIcoon from '../assets/iconen/venster.png'
import boomIcoon from '../assets/iconen/boom.png'
import netwerkIcoon from '../assets/iconen/netwerk.png'
import smileyIcoon from '../assets/iconen/smiley.png'

/* knopjes in het systeemvak rechts, elk een link naar buiten */
const LADE = [
  { href: 'https://www.linkedin.com/in/melcayci/', icoon: netwerkIcoon, titel: 'netwerk: linkedin' },
  { href: 'https://youtu.be/RUsUQ9tRHHQ', icoon: smileyIcoon, titel: ':)' },
  { href: 'https://www.natuurmonumenten.nl/doneer', icoon: boomIcoon, titel: 'doneer aan natuurmonumenten' },
]

/* smaller dan dit wordt een vensterknop niet; past er dan geen knop meer
   bij, dan gaat het oudste programma dicht (zie useProgrammas) */
const MIN_KNOPBREEDTE = 90
const KNOPRUIMTE = 4 /* gap van .taakbalk */

/* items in het rechtermuismenu van een vensterknop, in windows-volgorde */
const MENU_ITEMS = [
  ['herstellen', <><u>h</u>erstellen</>],
  ['minimaliseren', <>mi<u>n</u>imaliseren</>],
  ['maximaliseren', <>m<u>a</u>ximaliseren</>],
  null,
  ['sluiten', <><u>s</u>luiten</>],
]

/**
 * Rechtermuismenu op een vensterknop in de taakbalk (zie lib/vensterMenu.js).
 * Klapt omhoog open, de taakbalk staat onderaan.
 * @param {object}   menu      { herstellen, minimaliseren, maximaliseren, sluiten }, null = grijs
 * @param {number}   x
 * @param {number}   y
 * @param {Function} onSluiten
 */
function VensterknopMenu({ menu, x, y, onSluiten }) {
  return (
    <Contextmenu x={x} y={y} omhoog onSluiten={onSluiten}>
      {MENU_ITEMS.map((item, i) =>
        item ? (
          <button
            key={item[0]}
            type="button"
            disabled={!menu[item[0]]}
            onClick={() => {
              menu[item[0]]()
              onSluiten()
            }}
          >
            <span>{item[1]}</span>
          </button>
        ) : (
          <div key={i} className="menu-scheiding"></div>
        ),
      )}
    </Contextmenu>
  )
}

function tijdNu() {
  const d = new Date()
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
}

function Klok() {
  const [tijd, zetTijd] = useState(tijdNu)
  useEffect(() => {
    const timer = setInterval(() => zetTijd(tijdNu()), 1000)
    return () => clearInterval(timer)
  }, [])
  return <span id="klok">{tijd}</span>
}

/**
 * De Windows-95-taakbalk onder de inhoud, met Start-knop, klok en
 * (optioneel) een knop per open venster, zoals bij de lightbox: elke
 * geopende foto krijgt zijn eigen knop, ingedrukt als hij zichtbaar is
 * en "opgetild" als hij geminimaliseerd is.
 * Het Start-menu (Navbar) hangt hier positioneel aan vast: het klapt
 * open vlak boven de Start-knop.
 * @param {boolean}  menuOpen      staat het Start-menu open
 * @param {Function} onToggleMenu  klik op Start: menu open/dicht
 * @param {Function} onSluitMenu   sluit het Start-menu (klik op een link erin)
 * @param {boolean}  metJaar       doorgegeven aan Navbar
 * @param {Function} opAfsluiten   doorgegeven aan Navbar
 * @param {Function} onOpenVenster doorgegeven aan Navbar
 * @param {{ basis: string, titel: string, onKlik: Function, actief: boolean, icoon?: string, menu?: object, menuTekst?: string }[]} [vensters]
 *   icoon valt terug op het vensterpictogram; met menu (zie lib/vensterMenu.js)
 *   krijgt de knop een rechtermuismenu, met menuTekst een geel briefje met
 *   die tekst
 */
export default function Taakbalk({
  vensters = [],
  menuOpen,
  onToggleMenu,
  onSluitMenu,
  metJaar,
  opAfsluiten,
  onOpenVenster,
}) {
  /* { basis, x, y } van de knop waarop rechts is geklikt */
  const [knopMenu, zetKnopMenu] = useState(null)
  const menuVenster = knopMenu && vensters.find((v) => v.basis === knopMenu.basis)
  const sluitKnopMenu = useCallback(() => zetKnopMenu(null), [])

  /* hoeveel programmaknoppen er passen tussen de greep en het systeemvak,
     naast de andere knoppen (naar boven, foto's) */
  const { zetCapaciteit } = useProgrammas()
  const balkRef = useRef(null)
  const andereKnoppen = vensters.filter((v) => !v.basis.startsWith('programma:')).length
  useLayoutEffect(() => {
    function meet() {
      const balk = balkRef.current
      const greep = balk.querySelector('.greep').getBoundingClientRect()
      const lade = balk.querySelector('.lade').getBoundingClientRect()
      const ruimte = lade.left - greep.right
      const knoppen = Math.floor(ruimte / (MIN_KNOPBREEDTE + KNOPRUIMTE))
      zetCapaciteit(Math.max(1, knoppen - andereKnoppen))
    }
    meet()
    window.addEventListener('resize', meet)
    return () => window.removeEventListener('resize', meet)
  }, [andereKnoppen, zetCapaciteit])

  return (
    <div className="taakbalk" ref={balkRef}>
      <Navbar
        metJaar={metJaar}
        open={menuOpen}
        onSluitMenu={onSluitMenu}
        opAfsluiten={opAfsluiten}
        onOpenVenster={onOpenVenster}
      />
      <button
        type="button"
        className={menuOpen ? 'startknop actief' : 'startknop'}
        onClick={onToggleMenu}
      >
        <img src={logo} alt="" />
        <span>Start</span>
      </button>
      <div className="greep"></div>
      {vensters.map((v) => (
        <button
          key={v.basis}
          type="button"
          className={v.actief ? 'taakvenster actief' : 'taakvenster'}
          onClick={v.onKlik}
          onContextMenu={(e) => {
            if (!v.menu && !v.menuTekst) return
            e.preventDefault()
            /* een briefje staat net boven de knop, een menu bij de muis */
            const y = v.menuTekst ? e.currentTarget.getBoundingClientRect().top - 2 : e.clientY
            zetKnopMenu({ basis: v.basis, x: e.clientX, y })
          }}
        >
          <img src={v.icoon ?? vensterIcoon} alt="" />
          <span>{v.titel}</span>
        </button>
      ))}
      {menuVenster?.menu && (
        <VensterknopMenu menu={menuVenster.menu} x={knopMenu.x} y={knopMenu.y} onSluiten={sluitKnopMenu} />
      )}
      {menuVenster?.menuTekst && (
        <Contextmenu x={knopMenu.x} y={knopMenu.y} omhoog klasse="notitie" onSluiten={sluitKnopMenu}>
          {menuVenster.menuTekst}
        </Contextmenu>
      )}
      <div className="lade">
        {LADE.map((l) => (
          <a key={l.href} className="lade-knop" href={l.href} target="_blank" rel="noopener noreferrer" title={l.titel}>
            <img src={l.icoon} alt="" />
          </a>
        ))}
        <Klok />
      </div>
    </div>
  )
}
