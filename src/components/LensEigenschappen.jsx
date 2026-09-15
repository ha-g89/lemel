import { euro } from '../lib/lenzendatabase.js'
import { ebayZoeklink } from '../lib/ebay.js'
import databaseIcoon from '../assets/iconen/database.png'
import Kruisje from './Kruisje.jsx'

const STATUS_LABEL = { owned: 'in bezit', wanted: 'op kijklijst', sold: 'verkocht' }

function Veld({ label, waarde }) {
  if (waarde === null || waarde === undefined || waarde === '') return null
  return (
    <>
      <dt>{label}</dt>
      <dd>{waarde}</dd>
    </>
  )
}

/**
 * "Eigenschappen"-venster voor één lens uit de database — net als
 * rechtsklik → eigenschappen in Windows: alle specs op een rijtje in
 * plaats van verspreid over tabelkolommen.
 * @param {object}   r         één rij uit laadLenzen()
 * @param {Function} onSluiten sluit het venster
 */
export default function LensEigenschappen({ r, onSluiten }) {
  const naam = r.maker + ' ' + r.model
  const diafragma = r.aperture_max
    ? 'f/' + r.aperture_max + (r.aperture_min ? ' – f/' + r.aperture_min : '')
    : null
  const jaren = r.year_from ? r.year_from + '–' + (r.year_to || 'heden') : null
  const constructie = r.elements ? r.elements + ' elementen in ' + (r.groups_ || '?') + ' groepen' : null
  const prijslink = r.prijsurl || ebayZoeklink(naam)
  const prijs = euro(r.laatste_prijs, r.laatste_valuta)

  return (
    <div className="eigenschappen-overlay" onClick={onSluiten}>
      <div className="eigenschappen-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk">
          <img className="titelbalk-icoon" src={databaseIcoon} alt="" />
          <span className="titelbalk-tekst">eigenschappen: {r.model}</span>
          <span className="sluitknop" onClick={onSluiten}>
            <Kruisje />
          </span>
        </div>
        <div className="inhoud">
          <fieldset>
            <legend>algemeen</legend>
            <dl>
              <Veld label="merk" waarde={r.maker} />
              <Veld label="model" waarde={r.model} />
              <Veld label="vatting" waarde={r.mount} />
              <Veld label="brandpunt" waarde={r.focal_mm ? Math.round(r.focal_mm) + 'mm' : null} />
              <Veld label="diafragma" waarde={diafragma} />
              <Veld label="jaren" waarde={jaren} />
            </dl>
          </fieldset>
          <fieldset>
            <legend>optiek</legend>
            <dl>
              <Veld label="constructie" waarde={constructie} />
              <Veld label="lamellen" waarde={r.blades} />
              <Veld label="filtermaat" waarde={r.filter_mm ? r.filter_mm + 'mm' : null} />
              <Veld label="min. scherpstel" waarde={r.min_focus_m ? r.min_focus_m + 'm' : null} />
              <Veld label="gewicht" waarde={r.weight_g ? r.weight_g + 'g' : null} />
            </dl>
          </fieldset>
          <fieldset>
            <legend>markt</legend>
            <dl>
              <Veld label="status" waarde={STATUS_LABEL[r.status] || null} />
              <Veld
                label="laatste prijs"
                waarde={
                  prijs && (
                    <a href={prijslink} target="_blank" rel="noopener noreferrer">
                      {prijs}
                      {r.prijsbron ? ' (' + r.prijsbron + ')' : ''}
                    </a>
                  )
                }
              />
              <Veld
                label="beoordeling"
                waarde={
                  r.rating &&
                  (r.reviewurl ? (
                    <a href={r.reviewurl} target="_blank" rel="noopener noreferrer">
                      {r.rating} / {r.rating_max}
                    </a>
                  ) : (
                    r.rating + ' / ' + r.rating_max
                  ))
                }
              />
            </dl>
          </fieldset>

          <div className="loze-knoppenrij">
            <button type="button" className="loze-knop ok-knop" onClick={onSluiten}>
              <span>OK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
