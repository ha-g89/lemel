import { euro } from '../lib/lenzendatabase.js'
import { ebayZoeklink } from '../lib/ebay.js'
import databaseIcoon from '../assets/iconen/database.png'
import Kruisje from './Kruisje.jsx'
import fisheyeIcoon from '../assets/iconen/lens-fisheye.png'
import ultragroothoekIcoon from '../assets/iconen/lens-ultragroothoek.png'
import groothoekIcoon from '../assets/iconen/lens-groothoek.png'
import standaardIcoon from '../assets/iconen/lens-standaard.png'
import portretIcoon from '../assets/iconen/lens-portret.png'
import teleIcoon from '../assets/iconen/lens-tele.png'
import superteleIcoon from '../assets/iconen/lens-supertele.png'

const STATUS_LABEL = { owned: 'in bezit', wanted: 'op kijklijst', sold: 'verkocht' }

/* soort lens aan de hand van het brandpunt (kleinbeeld), met een pictogram
   waaraan je het meteen ziet: kort en breed voor groothoek, lang voor tele */
function lensSoort(r) {
  const mm = r.focal_mm
  if (/fish/i.test(r.model)) return { naam: 'fisheye', icoon: fisheyeIcoon }
  if (!mm) return null
  if (mm < 21) return { naam: 'ultragroothoek', icoon: ultragroothoekIcoon }
  if (mm < 40) return { naam: 'groothoek', icoon: groothoekIcoon }
  if (mm <= 60) return { naam: 'standaard', icoon: standaardIcoon }
  if (mm <= 135) return { naam: 'portret', icoon: portretIcoon }
  if (mm <= 300) return { naam: 'tele', icoon: teleIcoon }
  return { naam: 'supertele', icoon: superteleIcoon }
}

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
  const soort = lensSoort(r)

  return (
    <div className="eigenschappen-overlay" onClick={onSluiten}>
      <div className="eigenschappen-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk venster-titelbalk">
          <img className="titelbalk-icoon" src={databaseIcoon} alt="" />
          <span className="titelbalk-tekst">eigenschappen: {r.model}</span>
          <span className="sluitknop" onClick={onSluiten}>
            <Kruisje />
          </span>
        </div>
        <div className="inhoud">
          {/* kop zoals bij eigenschappen in Windows: groot pictogram met de naam */}
          {soort && (
            <div className="lens-kop">
              <img src={soort.icoon} alt="" />
              <div>
                <div className="lens-kop-naam">{r.model}</div>
                <div>{soort.naam}</div>
              </div>
            </div>
          )}
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
