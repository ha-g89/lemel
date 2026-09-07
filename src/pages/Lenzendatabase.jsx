import { useEffect, useMemo, useState } from 'react'
import Pagina from '../components/Pagina.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { laadLenzen, euro, ebayZoeklink, vergelijk } from '../lib/lenzendatabase.js'
import './Lenzendatabase.css'

const KOLOMMEN = [
  ['maker', 'merk'],
  ['model', 'model'],
  ['mount', 'vatting'],
  ['focal_mm', 'brandpunt'],
  ['aperture_max', 'f-stop'],
  ['laatste_prijs', 'laatste prijs'],
  ['rating', 'beoordeling'],
  ['status', 'status'],
]

function StatusBadge({ status }) {
  if (status === 'owned') return <span className="status-owned">in bezit</span>
  if (status === 'wanted') return <span className="status-wanted">kijklijst</span>
  if (status === 'sold') return <span className="status-sold">verkocht</span>
  return null
}

function Rij({ r }) {
  const naam = r.maker + ' ' + r.model
  const focal = r.focal_mm ? Math.round(r.focal_mm) + 'mm' : ''
  const fstop = r.aperture_max ? 'f/' + r.aperture_max : ''
  const prijs = euro(r.laatste_prijs, r.laatste_valuta)
  const prijslink = r.prijsurl || ebayZoeklink(naam)

  return (
    <tr>
      <td>{r.maker || ''}</td>
      <td>
        <a href={prijslink} target="_blank" rel="noopener noreferrer">
          {r.model || ''}
        </a>
      </td>
      <td>{r.mount || ''}</td>
      <td>{focal}</td>
      <td>{fstop}</td>
      <td>
        {prijs ? (
          <a href={prijslink} target="_blank" rel="noopener noreferrer">
            {prijs}
          </a>
        ) : (
          <a className="geen-data" href={prijslink} target="_blank" rel="noopener noreferrer">
            zoek op eBay
          </a>
        )}
      </td>
      <td>
        {r.rating ? (
          r.reviewurl ? (
            <a href={r.reviewurl} target="_blank" rel="noopener noreferrer">
              {r.rating} / {r.rating_max}
            </a>
          ) : (
            <>
              {r.rating} / {r.rating_max}
            </>
          )
        ) : (
          <span className="geen-data">&mdash;</span>
        )}
      </td>
      <td>
        <StatusBadge status={r.status} />
      </td>
    </tr>
  )
}

/**
 * Doorzoekbare, sorteerbare tabel van alle lenzen uit lenzen.db.
 */
export default function Lenzendatabase() {
  const [alleRijen, zetAlleRijen] = useState(null)
  const [status, zetStatus] = useState('database wordt geladen…')
  const [zoekterm, zetZoekterm] = useState('')
  const [vatting, zetVatting] = useState('')
  const [statusfilter, zetStatusfilter] = useState('')
  const [sortering, zetSortering] = useState({ kolom: 'maker', omhoog: true })

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
  useMenuLayout({ metRuimte: false, deps: [geladen] })

  return (
    <Pagina titel="le mel — lenzen" klasse="database">
      <div className="databox" data-doek>
        {!geladen && <div id="statusregel">{status}</div>}

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
              <select id="vattingfilter" value={vatting} onChange={(e) => zetVatting(e.target.value)}>
                <option value="">alle</option>
                {vattingen.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label>
              alleen
              <select
                id="statusfilter"
                value={statusfilter}
                onChange={(e) => zetStatusfilter(e.target.value)}
              >
                <option value="">alle 175</option>
                <option value="owned">in bezit</option>
                <option value="wanted">op kijklijst</option>
                <option value="sold">verkocht</option>
              </select>
            </label>
            <span id="aantalresultaten">
              {rijen.length} van {alleRijen.length} lenzen
            </span>
          </div>
        )}

        <div className="tabel-omhulsel">
          <table className="datatable" id="lenzentabel">
            <thead>
              <tr>
                {KOLOMMEN.map(([kolom, kop]) => (
                  <th key={kolom} data-kolom={kolom} onClick={() => sorteerOp(kolom)}>
                    {kop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="lenzenbody">
              {geladen && rijen.length === 0 && (
                <tr>
                  <td colSpan="8">geen lenzen gevonden met dit filter.</td>
                </tr>
              )}
              {rijen.map((r) => (
                <Rij key={r.id} r={r} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Pagina>
  )
}
