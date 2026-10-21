import Bureaublad from './Bureaublad.jsx'
import Kruisje from './Kruisje.jsx'
import Streepje from './Streepje.jsx'
import Vergroten from './Vergroten.jsx'
import './Venster.css'

/**
 * Windows-95-programmavenster om een databasetabel of de foto's heen:
 * titelbalk met icoon en knoppen om te minimaliseren, maximaliseren en
 * sluiten, de inhoud (filterpaneel en tabel) en onderaan een statusbalk die
 * in beeld blijft terwijl je door de tabel scrolt.
 * Dicht of geminimaliseerd blijft het venster gemount (alleen verborgen),
 * zodat filters, sortering en een spelend liedje bewaard blijven; er staat
 * dan een bureaublad met iconen (zie Bureaublad), zodat de taakbalk op zijn
 * plek blijft.
 * @param {string}    titel   tekst in de titelbalk, bv. 'lenzen.db'
 * @param {string}    icoon   url van het icoon in de titelbalk
 * @param {ReactNode} status  inhoud van de statusbalk (één vakje per element)
 * @param {object}    venster stand uit useVensterStand: { zichtbaar, gemaximaliseerd,
 *                            minimaliseer, maximaliseer, sluit }
 */
export default function DataVenster({ titel, icoon, status, venster, children }) {
  const { zichtbaar, gemaximaliseerd: max } = venster
  const klassen = ['databox', 'data-venster']
  if (max) klassen.push('gemaximaliseerd')
  if (!zichtbaar) klassen.push('verborgen')

  return (
    <>
      {!zichtbaar && (
        <div className="databox leeg-bureaublad" data-doek>
          <Bureaublad />
        </div>
      )}
      <div className={klassen.join(' ')} data-doek={zichtbaar || undefined}>
        <div className="titelbalk venster-titelbalk">
          <img className="titelbalk-icoon" src={icoon} alt="" />
          <span className="titelbalk-tekst">{titel}</span>
          <span className="titelbalk-knoppen">
            <button type="button" className="vensterknop" title="minimaliseren" onClick={venster.minimaliseer}>
              <Streepje />
            </button>
            <button type="button" className="vensterknop" title={max ? 'vorig formaat' : 'maximaliseren'} onClick={venster.maximaliseer}>
              <Vergroten hersteld={max} />
            </button>
            <button type="button" className="vensterknop" title="sluiten" onClick={venster.sluit}>
              <Kruisje />
            </button>
          </span>
        </div>
        {children}
        {status && <div className="statusbalk">{status}</div>}
      </div>
    </>
  )
}
