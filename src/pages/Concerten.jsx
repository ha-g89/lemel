import { useMemo, useState } from 'react'
import Pagina from '../components/Pagina.jsx'
import ArtiestInfo from '../components/ArtiestInfo.jsx'
import Afspelen from '../components/Afspelen.jsx'
import SpotifySpeler from '../components/SpotifySpeler.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { CONCERTEN, LEESMIJ } from '../data/concerten.js'
import Leesmij from '../components/Leesmij.jsx'
import leesmijIcoon from '../assets/iconen/leesmij.png'
import DesktopIcoon from '../components/DesktopIcoon.jsx'
import './Lenzendatabase.css'
import './Concerten.css'

const KOLOMMEN = [
  ['datum', 'datum'],
  ['artiest', 'artiest'],
  ['locatie', 'locatie'],
  ['stad', 'stad'],
  ['liedje', 'favo'],
  ['geweest', 'geweest'],
  ['wil', 'wil heen'],
]

/* jjjj-mm-dd -> dd-mm-jjjj */
function datumNL(datum) {
  if (!datum) return ''
  const [j, m, d] = datum.split('-')
  return d + '-' + m + '-' + j
}

function vergelijk(a, b, kolom) {
  const x = a[kolom]
  const y = b[kolom]
  if (typeof x === 'boolean' || typeof y === 'boolean') return (y ? 1 : 0) - (x ? 1 : 0)
  if (!x && y) return 1
  if (x && !y) return -1
  return String(x || '').localeCompare(String(y || ''), 'nl')
}

/* een Windows-95-vinkvakje, alleen om te tonen */
function Vinkje({ aan, label }) {
  return (
    <span className="vinkvak" role="img" aria-label={label + (aan ? ': ja' : ': nee')}>
      {aan ? '✓' : ''}
    </span>
  )
}

/**
 * Tabel van concerten waar ik ben geweest en waar ik nog heen wil,
 * in dezelfde stijl als de lenzendatabase.
 */
export default function Concerten() {
  const [zoekterm, zetZoekterm] = useState('')
  const [filter, zetFilter] = useState('')
  const [sortering, zetSortering] = useState({ kolom: 'datum', omhoog: false })
  const [infoRij, zetInfoRij] = useState(null)
  const [speelRij, zetSpeelRij] = useState(null)
  const [leesmijOpen, zetLeesmijOpen] = useState(false)

  const rijen = useMemo(() => {
    const term = zoekterm.trim().toLowerCase()
    const gefilterd = CONCERTEN.filter((r) => {
      if (filter === 'geweest' && !r.geweest) return false
      if (filter === 'wil' && !r.wil) return false
      if (term) {
        const haystack = [r.artiest, r.locatie, r.stad].join(' ').toLowerCase()
        if (haystack.indexOf(term) === -1) return false
      }
      return true
    })
    gefilterd.sort((a, b) => {
      /* lege velden (nog geen datum/locatie) altijd onderaan, welke kant je ook op sorteert */
      const leegA = a[sortering.kolom] === '' || a[sortering.kolom] == null
      const leegB = b[sortering.kolom] === '' || b[sortering.kolom] == null
      if (leegA !== leegB) return leegA ? 1 : -1
      const r = vergelijk(a, b, sortering.kolom)
      return sortering.omhoog ? r : -r
    })
    return gefilterd
  }, [zoekterm, filter, sortering])

  function sorteerOp(kolom) {
    zetSortering((s) =>
      s.kolom === kolom ? { kolom, omhoog: !s.omhoog } : { kolom, omhoog: true },
    )
  }

  useMenuLayout()

  const aantalGeweest = CONCERTEN.filter((r) => r.geweest).length
  const aantalWil = CONCERTEN.filter((r) => r.wil).length

  return (
    <Pagina titel="le mel — concerten" klasse="database">
      <div className="databox concertenbox" data-doek>
        <div id="filterpaneel">
          <label>
            zoek{' '}
            <input
              type="text"
              id="zoekveld"
              placeholder="artiest, locatie, stad…"
              value={zoekterm}
              onChange={(e) => zetZoekterm(e.target.value)}
            />
          </label>
          <label>
            alleen
            <select id="statusfilter" value={filter} onChange={(e) => zetFilter(e.target.value)}>
              <option value="">alle {CONCERTEN.length}</option>
              <option value="geweest">geweest ({aantalGeweest})</option>
              <option value="wil">wil heen ({aantalWil})</option>
            </select>
          </label>
          <span id="aantalresultaten">
            {rijen.length} van {CONCERTEN.length} concerten
          </span>
        </div>

        <div className="tabel-omhulsel">
          <table className="datatable" id="concertentabel">
            <thead>
              <tr>
                {KOLOMMEN.map(([kolom, kop]) => (
                  <th
                    key={kolom}
                    data-kolom={kolom}
                    className={kolom === 'geweest' || kolom === 'wil' ? 'vinkkolom' : undefined}
                    onClick={() => sorteerOp(kolom)}
                  >
                    {kop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rijen.length === 0 && (
                <tr>
                  <td colSpan={KOLOMMEN.length}>geen concerten gevonden met dit filter.</td>
                </tr>
              )}
              {rijen.map((r) => (
                <tr key={r.artiest + r.datum + r.locatie}>
                  <td>{datumNL(r.datum) || <span className="geen-data">&mdash;</span>}</td>
                  <td>
                    {r.wiki ? (
                      <button
                        type="button"
                        className="artiest-link"
                        title={'info over ' + r.artiest}
                        onClick={() => zetInfoRij(r)}
                      >
                        {r.artiest}
                      </button>
                    ) : (
                      r.artiest
                    )}
                  </td>
                  <td>{r.locatie || <span className="geen-data">&mdash;</span>}</td>
                  <td>{r.stad || <span className="geen-data">&mdash;</span>}</td>
                  <td className="artiest-kolom">
                    {r.spotify ? (
                      <span className="liedje-cel">
                        <button
                          type="button"
                          className="infoknop"
                          title={'speel ' + (r.liedje || 'liedje') + ' af'}
                          onClick={() => zetSpeelRij(r)}
                        >
                          <Afspelen />
                        </button>
                        {r.liedje}
                      </span>
                    ) : (
                      <span className="geen-data">&mdash;</span>
                    )}
                  </td>
                  <td className="vinkkolom">
                    <Vinkje aan={r.geweest} label="geweest" />
                  </td>
                  <td className="vinkkolom">
                    <Vinkje aan={r.wil} label="wil heen" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="leesmij-plek">
          <DesktopIcoon
            icoon={leesmijIcoon}
            naam="leesmij.txt"
            onOpen={() => zetLeesmijOpen(true)}
            sleepbaar
            opslagSleutel="lemel-leesmij-plek"
          />
        </div>
      </div>

      {infoRij && <ArtiestInfo r={infoRij} onSluiten={() => zetInfoRij(null)} />}
      {leesmijOpen && <Leesmij tekst={LEESMIJ} onSluiten={() => zetLeesmijOpen(false)} />}
      {speelRij && <SpotifySpeler r={speelRij} onSluiten={() => zetSpeelRij(null)} />}
    </Pagina>
  )
}
