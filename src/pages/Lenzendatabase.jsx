import { useEffect, useMemo, useRef, useState } from 'react'
import Pagina from '../components/Pagina.jsx'
import Contextmenu from '../components/Contextmenu.jsx'
import LensEigenschappen from '../components/LensEigenschappen.jsx'
import vergrootglasIcoon from '../assets/iconen/vergrootglas2.png'
import Vraagteken from '../components/Vraagteken.jsx'
import StatusIcoon from '../components/StatusIcoon.jsx'
import LeesmijPlek from '../components/LeesmijPlek.jsx'
import KolomVinkjes from '../components/KolomVinkjes.jsx'
import { useKolommen } from '../hooks/useKolommen.js'
import DataVenster from '../components/DataVenster.jsx'
import Keuzelijst from '../components/Keuzelijst.jsx'
import databaseIcoon from '../assets/iconen/database.png'
import inBezitTegel from '../assets/iconen/in-bezit.png'
import kijklijstTegel from '../assets/iconen/kijklijst.png'
import { LEESMIJ } from '../data/lenzen.js'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { useTeBreed } from '../hooks/useTeBreed.js'
import { laadLenzen, prijsTekst, vergelijk, STATUS_LABEL } from '../lib/lenzendatabase.js'
import { ebayZoeklink } from '../lib/ebay.js'
import './Lenzendatabase.css'

const KOLOMMEN = [
  ['maker', 'merk'],
  ['model', 'model'],
  ['mount', 'vatting'],
  ['focal_mm', 'brandpunt'],
  ['laatste_prijs', 'prijs'],
  ['status', 'status'],
]

/* het model blijft altijd zichtbaar (daar zitten de ebay-link en het (?)),
   dus die krijgt geen vinkje */
const VASTE_KOLOM = 'model'
/* bij het openen van de pagina staan alleen merk, vatting en status (en het
   vaste model) aan; brandpunt en prijs zet je zelf aan met de vinkjes */
const STANDAARD_VERBORGEN = ['focal_mm', 'laatste_prijs']

const LAADTEKST = 'database wordt geladen…'

/* in bezit en kijklijst hebben een eigen getekend tegeltje (kroon, oog) */
const STATUS_TEGEL = { owned: inBezitTegel, wanted: kijklijstTegel }

/* alleen het pixelicoontje, zodat de tabel smal blijft; de tekst staat in
   de tooltip en in het eigenschappen-venster */
function StatusBadge({ status }) {
  const label = STATUS_LABEL[status]
  if (!label) return null
  if (STATUS_TEGEL[status]) {
    return <img className="status-tegel" src={STATUS_TEGEL[status]} title={label} alt={label} />
  }
  return (
    <span className={'status-' + status} title={label} role="img" aria-label={label}>
      <StatusIcoon status={status} />
    </span>
  )
}

function Rij({ r, toon, onContextMenu, onEigenschappen }) {
  const naam = r.maker + ' ' + r.model
  const focal = r.focal_mm ? Math.round(r.focal_mm) + 'mm' : ''
  const prijs = prijsTekst(r.laatste_prijs, r.laatste_valuta)
  const prijslink = r.prijsurl || ebayZoeklink(naam)
  /* modelnaam gaat altijd naar ebay: de advertentie zelf als de laatste prijs
     van ebay komt, anders een zoekopdracht op deze lens (de prijs kan ook van
     bv. pentaxforums komen, en daar hoort de modellink niet heen) */
  const ebaylink =
    r.prijsurl && String(r.prijsbron || '').startsWith('ebay') ? r.prijsurl : ebayZoeklink(naam)

  return (
    <tr onContextMenu={onContextMenu}>
      {toon.maker && <td>{r.maker || ''}</td>}
      <td className="knop-kolom">
        <span className="model-cel">
          <a href={ebaylink} target="_blank" rel="noopener noreferrer">
            {r.model || ''}
          </a>
          <button type="button" className="infoknop" title="eigenschappen" onClick={onEigenschappen}>
            <Vraagteken />
          </button>
        </span>
      </td>
      {toon.mount && <td>{r.mount || ''}</td>}
      {toon.focal_mm && <td className="niet-afbreken">{focal}</td>}
      {toon.laatste_prijs && (
        <td className="niet-afbreken">
          {prijs ? (
            <a href={prijslink} target="_blank" rel="noopener noreferrer">
              {prijs}
            </a>
          ) : (
            <a className="geen-data" href={prijslink} target="_blank" rel="noopener noreferrer">
              eBay
            </a>
          )}
        </td>
      )}
      {toon.status && (
        <td className="status-kolom">
          <StatusBadge status={r.status} />
        </td>
      )}
    </tr>
  )
}

/**
 * Doorzoekbare, sorteerbare tabel van alle lenzen uit lenzen.db.
 */
export default function Lenzendatabase() {
  const [alleRijen, zetAlleRijen] = useState(null)
  const [status, zetStatus] = useState(LAADTEKST)
  const [zoekterm, zetZoekterm] = useState('')
  const [vatting, zetVatting] = useState('')
  const [statusfilter, zetStatusfilter] = useState('')
  const [sortering, zetSortering] = useState({ kolom: 'maker', omhoog: true })
  const [contextMenu, zetContextMenu] = useState(null) /* { x, y, r } */
  const [eigenschappenRij, zetEigenschappenRij] = useState(null)
  const { toon, zichtbareKolommen, wisselKolom } = useKolommen(KOLOMMEN, STANDAARD_VERBORGEN)

  useEffect(() => {
    let actief = true
    laadLenzen()
      .then((rijen) => {
        if (!actief) return
        if (!rijen.length) {
          zetStatus('de database bevat geen lenzen.')
          return
        }
        zetAlleRijen(rijen)
      })
      .catch((err) => {
        if (!actief) return
        zetStatus('kon de database niet laden: ' + err.message)
        console.error(err)
      })
    return () => {
      actief = false
    }
  }, [])

  const vattingen = useMemo(() => {
    if (!alleRijen) return []
    const set = {}
    alleRijen.forEach((r) => {
      if (r.mount) set[r.mount] = true
    })
    return Object.keys(set).sort()
  }, [alleRijen])

  const rijen = useMemo(() => {
    if (!alleRijen) return []
    const term = zoekterm.trim().toLowerCase()
    const gefilterd = alleRijen.filter((r) => {
      if (vatting && r.mount !== vatting) return false
      if (statusfilter && r.status !== statusfilter) return false
      if (term) {
        const haystack = [r.maker, r.model, r.mount].join(' ').toLowerCase()
        if (haystack.indexOf(term) === -1) return false
      }
      return true
    })
    gefilterd.sort((a, b) => {
      const r = vergelijk(a, b, sortering.kolom)
      return sortering.omhoog ? r : -r
    })
    return gefilterd
  }, [alleRijen, zoekterm, vatting, statusfilter, sortering])

  function sorteerOp(kolom) {
    zetSortering((s) =>
      s.kolom === kolom ? { kolom, omhoog: !s.omhoog } : { kolom, omhoog: true },
    )
  }

  const geladen = alleRijen !== null

  /* het menu opnieuw uitlijnen zodra de tabel er staat */
  useMenuLayout({ deps: [geladen] })

  /* te brede tabel (smal scherm): eigen schuifvenster, zie .te-breed */
  const omhulselRef = useRef(null)
  const teBreed = useTeBreed(omhulselRef)

  return (
    <Pagina titel="le mel — lenzen" klasse="database">
      <LeesmijPlek tekst={LEESMIJ} opslagSleutel="lemel-leesmij-plek-lenzen" />

      <DataVenster
        titel="lenzen.db - database"
        icoon={databaseIcoon}
        status={
          geladen && (
            <>
              <span>
                {rijen.length} van {alleRijen.length} lenzen
              </span>
              <span>{alleRijen.filter((r) => r.status === 'owned').length} in bezit</span>
            </>
          )
        }
      >
        {!geladen && (
          <div id="statusregel">
            <p>{status}</p>
            {status === LAADTEKST && (
              <div className="laadbalk-buiten">
                <div className="laadbalk-binnen"></div>
              </div>
            )}
          </div>
        )}

        {geladen && (
          <div id="filterpaneel">
            <label>
              zoek{' '}
              <input
                type="text"
                id="zoekveld"
                placeholder="merk, model, vatting…"
                value={zoekterm}
                onChange={(e) => zetZoekterm(e.target.value)}
              />
            </label>
            <label>
              vatting
              <Keuzelijst id="vattingfilter" value={vatting} onChange={(e) => zetVatting(e.target.value)}>
                <option value="">alle</option>
                {vattingen.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Keuzelijst>
            </label>
            <label>
              alleen
              <Keuzelijst
                id="statusfilter"
                value={statusfilter}
                onChange={(e) => zetStatusfilter(e.target.value)}
              >
                <option value="">alle {alleRijen.length}</option>
                {Object.entries(STATUS_LABEL).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </Keuzelijst>
            </label>
          </div>
        )}

        {geladen && <KolomVinkjes kolommen={KOLOMMEN} vast={VASTE_KOLOM} toon={toon} onWissel={wisselKolom} />}

        <div ref={omhulselRef} className={teBreed ? 'tabel-omhulsel te-breed' : 'tabel-omhulsel'}>
          <table className="datatable" id="lenzentabel">
            <thead>
              <tr>
                {zichtbareKolommen.map(([kolom, kop]) => (
                  <th key={kolom} data-kolom={kolom} onClick={() => sorteerOp(kolom)}>
                    {kop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="lenzenbody">
              {geladen && rijen.length === 0 && (
                <tr>
                  <td colSpan={zichtbareKolommen.length}>geen lenzen gevonden met dit filter.</td>
                </tr>
              )}
              {rijen.map((r) => (
                <Rij
                  key={r.id}
                  r={r}
                  toon={toon}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    zetContextMenu({ x: e.clientX, y: e.clientY, r })
                  }}
                  onEigenschappen={() => zetEigenschappenRij(r)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </DataVenster>

      {contextMenu && (
        <Contextmenu x={contextMenu.x} y={contextMenu.y} onSluiten={() => zetContextMenu(null)}>
          <button
            type="button"
            onClick={() => {
              zetEigenschappenRij(contextMenu.r)
              zetContextMenu(null)
            }}
          >
            <img src={vergrootglasIcoon} alt="" />
            eigenschappen
          </button>
        </Contextmenu>
      )}

      {eigenschappenRij && (
        <LensEigenschappen r={eigenschappenRij} onSluiten={() => zetEigenschappenRij(null)} />
      )}
    </Pagina>
  )
}
