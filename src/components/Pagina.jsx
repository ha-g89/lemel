import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Taakbalk from './Taakbalk.jsx'
import Afsluitscherm from './Afsluitscherm.jsx'
import BSOD from './BSOD.jsx'
import SchermInstellingen from './SchermInstellingen.jsx'
import Leesmij from './Leesmij.jsx'
import patchnotesIcoon from '../assets/iconen/patchnotes.png'
import { patchnotesTekst } from '../data/patchnotes.js'
import { LEESMIJ, OVERMIJ } from '../data/fotos.js'
import overmijIcoon from '../assets/iconen/overmij.png'
import logo from '../assets/iconen/logo.png'
import instagramIcoon from '../assets/iconen/instagram.png'
import naarBovenIcoon from '../assets/iconen/naar-boven.png'

/* versie in de voettekst: commitcode + builddatum, ingevuld door
   vite.config.js bij elke build (zie commitCode daar) */
const VERSIE = import.meta.env.VITE_VERSIE
const BUILDDATUM = new Date(import.meta.env.VITE_BUILDDATUM).toLocaleDateString('nl-NL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/**
 * Gedeelde paginaschil: titel-logo, menu, inhoud, taakbalk en voettekst,
 * plus de vensters die vanuit het start-menu opengaan (over mij, leesmij,
 * patchnotes, scherminstellingen).
 *
 * @param {string}  titel     browsertitel
 * @param {string}  klasse    extra klasse op de wrapper voor paginaspecifieke stijlen
 * @param {boolean} metJaar   jaartal in de menubalk (alleen gallerij)
 * @param {{ basis: string, titel: string, onKlik: Function, actief: boolean }[]} [vensters]
 *   knoppen in de taakbalk voor open vensters (bv. de lightbox), één per geopende foto,
 *   na de vaste knop "naar boven"
 */
export default function Pagina({
  titel,
  klasse,
  metJaar = false,
  vensters = [],
  children,
}) {
  const [afgesloten, zetAfgesloten] = useState(false)
  const [menuOpen, zetMenuOpen] = useState(false)
  const [bsod, zetBsod] = useState(false)
  const [instellingenOpen, zetInstellingenOpen] = useState(false)
  const [overmijOpen, zetOvermijOpen] = useState(false)
  const [leesmijOpen, zetLeesmijOpen] = useState(false)
  const [patchnotesOpen, zetPatchnotesOpen] = useState(false)
  const [naarBovenIngedrukt, zetNaarBovenIngedrukt] = useState(false)

  /* "naar boven" in de taakbalk blijft ingedrukt zodra je erop klikt, ook
     als je boven bent aangekomen. pas als de pagina weer ergens anders tot
     stilstand komt (zelf omlaag gescrold, of via de wereldbol naar beneden)
     springt hij terug, zodat je hem onderaan weer omhoog ziet komen */
  function naarBoven() {
    zetNaarBovenIngedrukt(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    if (!naarBovenIngedrukt) return
    let timer
    function opScroll() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (window.scrollY > 50) zetNaarBovenIngedrukt(false)
      }, 150)
    }
    window.addEventListener('scroll', opScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', opScroll)
    }
  }, [naarBovenIngedrukt])

  useEffect(() => {
    document.title = titel
  }, [titel])

  /* hoe ver de slijmdruppels vallen: van de klodder (12px onder de bovenkant
     van de knop) tot de bovenrand van de foto's of het venster eronder.
     opnieuw meten als de pagina van vorm verandert */
  const houderRef = useRef(null)
  useLayoutEffect(() => {
    const houder = houderRef.current
    if (!houder) return
    function meet() {
      const doek = document.querySelector('[data-doek]')
      if (!doek) return
      const val = doek.getBoundingClientRect().top - houder.getBoundingClientRect().top - 12
      houder.style.setProperty('--slijm-val', Math.max(20, Math.round(val)) + 'px')
    }
    meet()
    const waarnemer = new ResizeObserver(meet)
    waarnemer.observe(document.body)
    return () => waarnemer.disconnect()
  }, [afgesloten, bsod])

  /* paasei zonder knop: typ ergens op de site "bsod" (niet terwijl je in
     een tekstveld typt, anders triggert het per ongeluk bij het zoeken) */
  useEffect(() => {
    let buffer = ''
    function opToets(e) {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key.length !== 1) return
      buffer = (buffer + e.key).slice(-4).toLowerCase()
      if (buffer === 'bsod') zetBsod(true)
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [])

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
  if (bsod) return <BSOD />

  return (
    <div className={klasse ? 'wrapper ' + klasse : 'wrapper'}>
      {/* de wereldbol brengt je naar de taakbalk onderaan, zolang de
          naar-start-knop onzichtbaar is */}
      <button
        type="button"
        className="titel-link"
        title="naar de taakbalk"
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
      >
        <img className="titel" src={logo} alt="le mel" />
      </button>

      {/* houder zodat het slijm buiten de knop kan hangen (de knop zelf heeft
          overflow: hidden voor het glimeffect) */}
      <div className="naar-start-houder" ref={houderRef}>
        <button
          type="button"
          id="naar-start-knop"
          className="naar-start-knop"
          onClick={() =>
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
          }
        >
          <span>naar start</span>
        </button>
        <span className="slijm slijm-links" aria-hidden="true" />
        <span className="slijm slijm-rechts" aria-hidden="true" />
        <span className="slijm-baan slijm-baan-links" aria-hidden="true">
          <span className="slijm-drup">
            <span className="slijm-drup-vorm" />
          </span>
        </span>
        <span className="slijm-baan slijm-baan-rechts" aria-hidden="true">
          <span className="slijm-drup">
            <span className="slijm-drup-vorm" />
          </span>
        </span>
      </div>

      {children}

      <Taakbalk
        /* "naar boven" staat altijd als geminimaliseerd venster vooraan in de
           taakbalk; klikken rolt de pagina rustig terug naar boven */
        vensters={[
          {
            basis: 'naar-boven',
            titel: 'naar boven',
            icoon: naarBovenIcoon,
            actief: naarBovenIngedrukt,
            onKlik: naarBoven,
          },
          ...vensters,
        ]}
        metJaar={metJaar}
        menuOpen={menuOpen}
        onToggleMenu={() => zetMenuOpen((o) => !o)}
        onSluitMenu={() => zetMenuOpen(false)}
        opAfsluiten={() => zetAfgesloten(true)}
        onOpenInstellingen={() => zetInstellingenOpen(true)}
        onOpenOvermij={() => zetOvermijOpen(true)}
        onOpenLeesmij={() => zetLeesmijOpen(true)}
        onOpenPatchnotes={() => zetPatchnotesOpen(true)}
      />

      <SchermInstellingen open={instellingenOpen} onClose={() => zetInstellingenOpen(false)} />
      {/* overmij.txt, via "over mij" in het start-menu */}
      {overmijOpen && (
        <Leesmij
          tekst={OVERMIJ}
          naam="overmij.txt"
          icoon={overmijIcoon}
          onSluiten={() => zetOvermijOpen(false)}
        />
      )}
      {/* leesmij.txt van de site (hoe alles werkt), via instellingen in het start-menu */}
      {leesmijOpen && <Leesmij tekst={LEESMIJ} onSluiten={() => zetLeesmijOpen(false)} />}
      {patchnotesOpen && (
        <Leesmij
          tekst={patchnotesTekst()}
          naam="patchnotes.txt"
          icoon={patchnotesIcoon}
          onSluiten={() => zetPatchnotesOpen(false)}
        />
      )}

      <div className="footer" id="contact">
        <a
          href="https://www.instagram.com/meneermel/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src={instagramIcoon} alt="Instagram" />
        </a>
        <div className="copyright">&copy; 2026 mel cayci &mdash; foto's niet gebruiken zonder toestemming please</div>
        <div className="versie" title="commitcode van deze versie op github">
          versie {VERSIE} &middot; {BUILDDATUM}
        </div>
      </div>
    </div>
  )
}
