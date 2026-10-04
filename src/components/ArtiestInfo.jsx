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
 * Info-venster bij een artiest uit de concertentabel (het (?)-knopje),
 * in dezelfde stijl als het eigenschappen-venster van de lenzendatabase.
 * @param {object}   r         één concert ({ artiest, wiki })
 * @param {Function} onSluiten sluit het venster
 */
export default function ArtiestInfo({ r, onSluiten }) {
  const [wiki, zetWiki] = useState(null)
  const [fout, zetFout] = useState(null)

  useEffect(() => {
    let actief = true
    laadWiki(r.wiki)
      .then((data) => actief && zetWiki(data))
      .catch((err) => actief && zetFout(err.message))
    return () => {
      actief = false
    }
  }, [r.wiki])

  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluiten()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluiten])

  return (
    <div className="eigenschappen-overlay" onClick={onSluiten}>
      <div className="eigenschappen-venster artiest-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk">
          <img className="titelbalk-icoon" src={concertIcoon} alt="" />
          <span className="titelbalk-tekst">{r.artiest}</span>
          <span className="sluitknop" onClick={onSluiten}>
            <Kruisje />
          </span>
        </div>
        <div className="inhoud">
          {!wiki && !fout && <p className="artiest-laden">wikipedia wordt geladen…</p>}
          {fout && <p className="artiest-laden">kon wikipedia niet laden: {fout}</p>}
          {wiki && (
            <fieldset>
              {wiki.thumbnail && (
                <div className="artiest-foto">
                  <img src={wiki.thumbnail.source} alt={wiki.title} />
                </div>
              )}
              {wiki.description && <p className="artiest-omschrijving">{wiki.description}</p>}
              <p className="artiest-tekst">{wiki.extract}</p>
              <a
                className="artiest-verder"
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
