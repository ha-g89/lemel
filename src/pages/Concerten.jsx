import { useMemo, useRef, useState } from 'react'
import Pagina from '../components/Pagina.jsx'
import WikiInfo from '../components/WikiInfo.jsx'
import DagInfo from '../components/DagInfo.jsx'
import Afspelen from '../components/Afspelen.jsx'
import SpotifySpeler from '../components/SpotifySpeler.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { useVensterStand } from '../hooks/useVensterStand.js'
import { useTeBreed } from '../hooks/useTeBreed.js'
import { spotifyAppLink } from '../lib/spotify.js'
import { CONCERTEN, DAG_NIEUWS, LEESMIJ, LOCATIE_WIKI } from '../data/concerten.js'
import LeesmijPlek from '../components/LeesmijPlek.jsx'
import KolomVinkjes from '../components/KolomVinkjes.jsx'
import { useKolommen } from '../hooks/useKolommen.js'
import DataVenster from '../components/DataVenster.jsx'
import Keuzelijst from '../components/Keuzelijst.jsx'
import concertIcoon from '../assets/iconen/concert.png'
import './Lenzendatabase.css'
import './Concerten.css'

const KOLOMMEN = [
  ['datum', 'datum'],
  ['artiest', 'artiest'],
  ['locatie', 'locatie'],
  ['liedje', 'favo'],
  ['geweest', 'geweest'],
  ['wil', 'wil heen'],
]

/* kolommen die bij het openen uit staan; via de vinkjes weer aan te zetten */
const STANDAARD_VERBORGEN = ['datum']

/* de artiest blijft altijd zichtbaar, dus die krijgt geen vinkje */
const VASTE_KOLOM = 'artiest'

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
  /* lege velden zet de sortering zelf al onderaan */
  return String(x).localeCompare(String(y), 'nl')
}

/* lichtkrant in de statusbalk, zoals een pager: de tekst staat er twee keer
   achter elkaar en schuift precies één lengte op, zodat hij naadloos rondloopt.
   de duur groeit mee met de tekst, zodat lange en korte titels even snel gaan */
function NuSpeelt({ tekst }) {
  return (
    <span className="nu-speelt" title={tekst}>
      <span className="lichtkrant" style={{ '--duur': Math.max(6, tekst.length * 0.25) + 's' }}>
        <span>{tekst}</span>
        <span aria-hidden="true">{tekst}</span>
      </span>
    </span>
  )
}

/* een Windows-95-vinkvakje, alleen om te tonen */
function Vinkje({ aan, label }) {
  return (
    <span className="vinkvak" role="img" aria-label={label + (aan ? ': ja' : ': nee')}>
      {aan ? '✓' : ''}
    </span>
  )
}

/* naam als groene link die het wikipedia-infovenster opent; zonder
   wikipedia-artikel gewoon platte tekst */
function InfoLink({ tekst, wiki, onOpen }) {
  if (!wiki) return tekst
  return (
    <button
      type="button"
      className="info-link"
      title={'info over ' + tekst}
      onClick={() => onOpen({ titel: tekst, wiki })}
    >
      {tekst}
    </button>
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
  const [info, zetInfo] = useState(null) /* { titel, wiki } */
  const [dagInfo, zetDagInfo] = useState(null) /* datum 'jjjj-mm-dd' */
  const [speelRij, zetSpeelRij] = useState(null)
  /* aangeklikte rij, zoals een geselecteerde regel in verkenner */
  const [gekozenRij, zetGekozenRij] = useState(null)
  const { toon, zichtbareKolommen, wisselKolom } = useKolommen(KOLOMMEN, STANDAARD_VERBORGEN)

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

  const venster = useVensterStand({ titel: 'concerten.db', icoon: concertIcoon })
  useMenuLayout({ deps: [venster.stand, venster.venster.gemaximaliseerd] })

  /* te brede tabel (smal scherm): eigen schuifvenster, zie .te-breed */
  const omhulselRef = useRef(null)
  const teBreed = useTeBreed(omhulselRef)

  const aantalGeweest = CONCERTEN.filter((r) => r.geweest).length
  const aantalWil = CONCERTEN.filter((r) => r.wil).length

  return (
    <Pagina
      titel={speelRij ? '♪ ' + speelRij.liedje + ' – le mel' : 'le mel — concerten'}
      klasse="database"
      vensters={venster.taakbalkVensters}
    >
      <LeesmijPlek tekst={LEESMIJ} opslagSleutel="lemel-leesmij-plek-concerten" />

      <DataVenster
        titel="concerten.db"
        icoon={concertIcoon}
        venster={venster.venster}
        status={
          <>
            <span>
              {rijen.length} van {CONCERTEN.length} concerten
            </span>
            {/* zolang er een liedje speelt loopt dat hier als een lichtkrant
                voorbij, anders staan hier de tellingen */}
            {speelRij ? (
              <NuSpeelt tekst={'♪ nu speelt: ' + speelRij.liedje + ' – ' + speelRij.artiest} />
            ) : (
              <span>
                {aantalGeweest} geweest, {aantalWil} op de lijst
              </span>
            )}
          </>
        }
      >
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
            <Keuzelijst id="statusfilter" value={filter} onChange={(e) => zetFilter(e.target.value)}>
              <option value="">alle {CONCERTEN.length}</option>
              <option value="geweest">geweest ({aantalGeweest})</option>
              <option value="wil">wil heen ({aantalWil})</option>
            </Keuzelijst>
          </label>
        </div>

        <KolomVinkjes kolommen={KOLOMMEN} vast={VASTE_KOLOM} toon={toon} onWissel={wisselKolom} />

        <div ref={omhulselRef} className={teBreed ? 'tabel-omhulsel te-breed' : 'tabel-omhulsel'}>
          <table className="datatable" id="concertentabel">
            <thead>
              <tr>
                {zichtbareKolommen.map(([kolom, kop]) => (
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
                  <td colSpan={zichtbareKolommen.length}>geen concerten gevonden met dit filter.</td>
                </tr>
              )}
              {rijen.map((r) => (
                <tr
                  key={r.artiest + r.datum + r.locatie}
                  className={[speelRij === r && 'speelt-rij', gekozenRij === r && 'gekozen-rij'].filter(Boolean).join(' ') || undefined}
                  onClick={() => zetGekozenRij(gekozenRij === r ? null : r)}
                >
                  {toon.datum && (
                    <td className="niet-afbreken">
                      {!r.datum ? (
                        <span className="geen-data">&mdash;</span>
                      ) : DAG_NIEUWS[r.datum] ? (
                        <button
                          type="button"
                          className="info-link"
                          title="wat gebeurde er die dag in de wereld?"
                          onClick={() => zetDagInfo(r.datum)}
                        >
                          {datumNL(r.datum)}
                        </button>
                      ) : (
                        datumNL(r.datum)
                      )}
                    </td>
                  )}
                  <td>
                    <InfoLink tekst={r.artiest} wiki={r.wiki} onOpen={zetInfo} />
                  </td>
                  {toon.locatie && (
                    /* stad onder de locatie in plaats van een eigen kolom, zodat de
                       tabel in de breedte van het doek past */
                    <td>
                      {r.locatie ? (
                        <>
                          <InfoLink tekst={r.locatie} wiki={LOCATIE_WIKI[r.locatie]} onOpen={zetInfo} />
                          {r.stad && <div className="stad">{r.stad}</div>}
                        </>
                      ) : (
                        <span className="geen-data">&mdash;</span>
                      )}
                    </td>
                  )}
                  {toon.liedje && (
                    <td className="knop-kolom">
                      {r.spotify ? (
                        /* de speelknop speelt het liedje hier af (nog een keer
                           klikken zet het uit), de titel opent het in de spotify-app */
                        <span className="liedje-cel">
                          <button
                            type="button"
                            className={speelRij === r ? 'infoknop speelknop speelt' : 'infoknop speelknop'}
                            title={
                              (speelRij === r ? 'zet ' : 'speel ') +
                              (r.liedje || 'liedje') +
                              (speelRij === r ? ' uit' : ' af')
                            }
                            onClick={() => zetSpeelRij(speelRij === r ? null : r)}
                          >
                            {/* het liedje dat speelt: ingedrukte knop met een dansende equalizer */}
                            {speelRij === r ? (
                              <span className="equalizer" aria-label="speelt nu">
                                <span />
                                <span />
                                <span />
                              </span>
                            ) : (
                              <Afspelen />
                            )}
                          </button>
                          <a className="liedje-titel" href={spotifyAppLink(r.spotify)} title="open in spotify">
                            {r.liedje}
                          </a>
                        </span>
                      ) : (
                        <span className="geen-data">&mdash;</span>
                      )}
                    </td>
                  )}
                  {toon.geweest && (
                    <td className="vinkkolom">
                      <Vinkje aan={r.geweest} label="geweest" />
                    </td>
                  )}
                  {toon.wil && (
                    <td className="vinkkolom">
                      <Vinkje aan={r.wil} label="wil heen" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataVenster>

      {info && <WikiInfo titel={info.titel} wiki={info.wiki} onSluiten={() => zetInfo(null)} />}
      {dagInfo && <DagInfo datum={dagInfo} nieuws={DAG_NIEUWS[dagInfo]} onSluiten={() => zetDagInfo(null)} />}
      {speelRij && (
        <SpotifySpeler r={speelRij} onKlaar={() => zetSpeelRij(null)} onSluiten={() => zetSpeelRij(null)} />
      )}
    </Pagina>
  )
}
