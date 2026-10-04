import { useEffect } from 'react'
import concertIcoon from '../assets/iconen/concert.png'
import Kruisje from './Kruisje.jsx'

const MAANDEN_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/* wikipedia's nieuwsoverzicht van die dag (alleen voor dagen die al geweest zijn) */
function wikiLink(datum) {
  const [j, m, d] = datum.split('-').map(Number)
  return `https://en.wikipedia.org/wiki/Portal:Current_events/${j}_${MAANDEN_EN[m - 1]}_${d}`
}

/**
 * Info-venster bij een concertdatum: wat er die dag in de wereld gebeurde,
 * in dezelfde stijl als het wikipedia-infovenster van artiesten en venues.
 * @param {string}   datum     'jjjj-mm-dd'
 * @param {{ kop: string, ook?: string[] }} nieuws  zie DAG_NIEUWS in concerten.js
 * @param {Function} onSluiten sluit het venster
 */
export default function DagInfo({ datum, nieuws, onSluiten }) {
  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluiten()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluiten])

  const dag = new Date(datum + 'T12:00:00')
  const titel = dag.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const geweest = dag < new Date()

  return (
    <div className="eigenschappen-overlay" onClick={onSluiten}>
      <div className="eigenschappen-venster artiest-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk venster-titelbalk">
          <img className="titelbalk-icoon" src={concertIcoon} alt="" />
          <span className="titelbalk-tekst">{titel}</span>
          <span className="sluitknop" onClick={onSluiten}>
            <Kruisje />
          </span>
        </div>
        <div className="inhoud">
          <fieldset>
            <p className="artiest-omschrijving">{geweest ? 'in het nieuws' : 'in het nieuws (straks)'}</p>
            <p className="artiest-tekst">{nieuws.kop}</p>
            {nieuws.ook?.length > 0 && (
              <>
                <p className="artiest-omschrijving">ook die dag</p>
                <ul className="dag-ook">
                  {nieuws.ook.map((regel) => (
                    <li key={regel}>{regel}</li>
                  ))}
                </ul>
              </>
            )}
            {geweest && (
              <a className="artiest-verder" href={wikiLink(datum)} target="_blank" rel="noopener noreferrer">
                al het nieuws van die dag op wikipedia
              </a>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  )
}
