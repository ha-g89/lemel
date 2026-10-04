import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import concertIcoon from '../assets/iconen/concert.png'
import Kruisje from './Kruisje.jsx'

/* haalt het track-id uit een spotify-link ("delen → link naar nummer
   kopiëren"), of accepteert een kaal id */
function spotifyId(link) {
  if (!link) return null
  const m = link.match(/track[/:]([A-Za-z0-9]+)/)
  return m ? m[1] : link
}

/* spotify's iframe-api (eenmalig geladen): daarmee kan de pagina zelf op
   "play" drukken, zodat het liedje meteen begint na een klik op de speelknop */
let apiBelofte = null
function laadSpotifyApi() {
  if (!apiBelofte) {
    apiBelofte = new Promise((klaar) => {
      window.onSpotifyIframeApiReady = klaar
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      document.body.appendChild(script)
    })
  }
  return apiBelofte
}

/* laatste plek waar het venster naartoe is gesleept, onthouden (ook na
   herladen) zodat het volgende liedje daar weer opent */
const POSITIE_SLEUTEL = 'lemel-spotify-positie'
function leesPositie() {
  try {
    const p = JSON.parse(localStorage.getItem(POSITIE_SLEUTEL))
    if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) return p
  } catch {
    /* geen opslag beschikbaar: gewoon rechtsonder openen */
  }
  return { x: 0, y: 0 }
}
function bewaarPositie(p) {
  try {
    localStorage.setItem(POSITIE_SLEUTEL, JSON.stringify(p))
  } catch {
    /* geen opslag beschikbaar */
  }
}

/**
 * Zwevend Windows-95-venstertje rechtsonder met de spotify-speler van het
 * favoriete liedje; begint meteen met afspelen. Bewust zonder donkere
 * overlay, zodat je door de tabel kunt blijven klikken terwijl het speelt.
 * @param {object}   r         één concert ({ artiest, liedje, spotify })
 * @param {Function} onSluiten sluit het venster (en stopt het liedje)
 */
export default function SpotifySpeler({ r, onSluiten }) {
  const id = spotifyId(r.spotify)
  const vakRef = useRef(null)
  const spelerRef = useRef(null)

  /* slepen aan de titelbalk, net als de lightbox-vensters van de gallerij:
     verschuiving t.o.v. de vaste plek rechtsonder */
  const [positie, zetPositie] = useState(leesPositie)
  const sleepRef = useRef(null)
  const vensterRef = useRef(null)

  /* bewaarde plek valt (deels) buiten beeld, bv. na een kleiner venster:
     dan toch gewoon rechtsonder openen */
  useLayoutEffect(() => {
    const r = vensterRef.current?.getBoundingClientRect()
    if (!r) return
    if (r.left < 0 || r.top < 0 || r.right > window.innerWidth || r.bottom > window.innerHeight) {
      zetPositie({ x: 0, y: 0 })
    }
  }, [])
  function opSleepStart(e) {
    if (e.button !== 0 || e.target.closest('.sluitknop')) return
    sleepRef.current = { startX: e.clientX, startY: e.clientY, vanaf: positie }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function opSleepBeweeg(e) {
    if (!sleepRef.current) return
    const { startX, startY, vanaf } = sleepRef.current
    zetPositie({ x: vanaf.x + (e.clientX - startX), y: vanaf.y + (e.clientY - startY) })
  }
  function opSleepEind(e) {
    if (!sleepRef.current) return
    sleepRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    bewaarPositie(positie)
  }

  /* speler aanmaken (opnieuw bij elk ander liedje: loadUri zou het donkere
     thema kwijtraken); de api vervangt het doel-element door een iframe,
     dus dat element maken we zelf (buiten react om) in het vak */
  useEffect(() => {
    let actief = true
    laadSpotifyApi().then((api) => {
      if (!actief || !vakRef.current) return
      const doel = document.createElement('div')
      vakRef.current.appendChild(doel)
      const opties = { uri: 'spotify:track:' + id, width: '100%', height: 80 }
      api.createController(doel, opties, (speler) => {
        if (!actief) return speler.destroy()
        spelerRef.current = speler
        /* altijd het donkere thema (theme=0), anders kleurt de kaart mee met de
           albumhoes en vallen de ronde hoekjes niet meer weg in .spotify-vak */
        const iframe = vakRef.current.querySelector('iframe')
        if (iframe && !iframe.src.includes('theme=0')) iframe.src += '&theme=0'
        speler.addListener('ready', () => speler.play())
      })
    })
    return () => {
      actief = false
      spelerRef.current?.destroy()
      spelerRef.current = null
    }
  }, [id])

  return (
    <div
      ref={vensterRef}
      className="eigenschappen-venster artiest-venster spotify-venster"
      style={positie.x || positie.y ? { transform: `translate(${positie.x}px, ${positie.y}px)` } : undefined}
    >
      <div
        className="titelbalk venster-titelbalk"
        onPointerDown={opSleepStart}
        onPointerMove={opSleepBeweeg}
        onPointerUp={opSleepEind}
        onPointerCancel={opSleepEind}
      >
        <img className="titelbalk-icoon" src={concertIcoon} alt="" />
        <span className="titelbalk-tekst">
          {r.artiest}
          {r.liedje ? ' — ' + r.liedje : ''}
        </span>
        <span className="sluitknop" onClick={onSluiten}>
          <Kruisje />
        </span>
      </div>
      <div className="spotify-vak" ref={vakRef} />
    </div>
  )
}
