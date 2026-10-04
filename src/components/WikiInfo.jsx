import { useEffect, useState } from 'react'
import concertIcoon from '../assets/iconen/concert.png'
import Kruisje from './Kruisje.jsx'

/* samenvatting + foto van een wikipedia-artikel; eerst de nederlandse
   wikipedia, valt terug op de engelse als het artikel daar niet bestaat */
async function laadWiki(titel) {
  for (const taal of ['nl', 'en']) {
    const res = await fetch(
      `https://${taal}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titel)}`,
    )
    if (!res.ok) continue
    const data = await res.json()
    /* een doorverwijspagina is geen artikel over de artiest */
    if (data.type === 'standard') return data
  }
  throw new Error('geen wikipedia-artikel gevonden')
}

/**
 * Info-venster met wikipedia-uitleg en foto, bij een artiest of venue uit
 * de concertentabel, in dezelfde stijl als het eigenschappen-venster van
 * de lenzendatabase.
 * @param {string}   titel     tekst in de titelbalk (artiest- of venuenaam)
 * @param {string}   wiki      titel van het wikipedia-artikel
 * @param {Function} onSluiten sluit het venster
 */
export default function WikiInfo({ titel, wiki: wikiTitel, onSluiten }) {
  const [wiki, zetWiki] = useState(null)
  const [fout, zetFout] = useState(null)

  useEffect(() => {
    let actief = true
    laadWiki(wikiTitel)
      .then((data) => actief && zetWiki(data))
      .catch((err) => actief && zetFout(err.message))
    return () => {
      actief = false
    }
  }, [wikiTitel])

  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluiten()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluiten])

  return (
    <div className="eigenschappen-overlay" onClick={onSluiten}>
      <div className="eigenschappen-venster info-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk venster-titelbalk">
          <img className="titelbalk-icoon" src={concertIcoon} alt="" />
          <span className="titelbalk-tekst">{titel}</span>
          <span className="sluitknop" onClick={onSluiten}>
            <Kruisje />
          </span>
        </div>
        <div className="inhoud">
          {!wiki && !fout && <p className="info-laden">wikipedia wordt geladen…</p>}
          {fout && <p className="info-laden">kon wikipedia niet laden: {fout}</p>}
          {wiki && (
            <fieldset>
              {wiki.thumbnail && (
                <div className="info-foto">
                  <img src={wiki.thumbnail.source} alt={wiki.title} />
                </div>
              )}
              {wiki.description && <p className="info-omschrijving">{wiki.description}</p>}
              <p className="info-tekst">{wiki.extract}</p>
              <a
                className="info-verder"
                href={wiki.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
              >
                lees verder op wikipedia
              </a>
            </fieldset>
          )}
        </div>
      </div>
    </div>
  )
}
