import { Link } from 'react-router-dom'
import Kruisje from './Kruisje.jsx'

/**
 * Windows-95-programmavenster om een databasetabel heen: titelbalk met
 * icoon, de inhoud (filterpaneel en tabel) en onderaan een statusbalk die
 * in beeld blijft terwijl je door de tabel scrolt. Het kruisje sluit het
 * "programma" en brengt je terug naar de startpagina.
 * @param {string}    titel   tekst in de titelbalk, bv. 'lenzen.db - database'
 * @param {string}    icoon   url van het icoon in de titelbalk
 * @param {ReactNode} status  inhoud van de statusbalk (één vakje per element)
 */
export default function DataVenster({ titel, icoon, status, children }) {
  return (
    <div className="databox data-venster" data-doek>
      <div className="titelbalk venster-titelbalk">
        <img className="titelbalk-icoon" src={icoon} alt="" />
        <span className="titelbalk-tekst">{titel}</span>
        <Link className="sluitknop" to="/" title="sluiten" aria-label="sluiten">
          <Kruisje />
        </Link>
      </div>
      {children}
      {status && <div className="statusbalk">{status}</div>}
    </div>
  )
}
