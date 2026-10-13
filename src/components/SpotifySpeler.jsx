import { useEffect, useRef, useState } from 'react'
import Kruisje from './Kruisje.jsx'
import concertIcoon from '../assets/iconen/concert.png'

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

/* telefoon of tablet (geen muis): daar mag een onzichtbare speler niet zelf
   geluid starten, dat mag alleen na een tik in de spotify-speler zelf */
function isTouchscherm() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

/**
 * Spotify-speler voor het favoriete liedje: speelt zolang hij gemount is en
 * stopt zodra hij verdwijnt.
 * Op de computer is hij onzichtbaar en begint hij meteen: de iframe staat
 * doorzichtig in een hoek van het scherm (buiten beeld of met display:none
 * legt de browser hem stil).
 * Op een touchscherm staat hij in een klein venster onderaan het scherm,
 * waarin je zelf op play tikt; het kruisje zet het liedje uit.
 * @param {object}   r          één concert ({ artiest, liedje, spotify })
 * @param {Function} onKlaar    het liedje is afgelopen
 * @param {Function} onSluiten  het venster is dichtgeklikt (alleen touchscherm)
 */
export default function SpotifySpeler({ r, onKlaar, onSluiten }) {
  const id = spotifyId(r.spotify)
  const [zichtbaar] = useState(isTouchscherm)
  const vakRef = useRef(null)
  const klaarRef = useRef(onKlaar)
  useEffect(() => {
    klaarRef.current = onKlaar
  })

  /* speler aanmaken (opnieuw bij elk ander liedje); de api vervangt het
     doel-element door een iframe, dus dat element maken we zelf (buiten
     react om) in het vak */
  useEffect(() => {
    let actief = true
    let speler = null
    laadSpotifyApi().then((api) => {
      if (!actief || !vakRef.current) return
      const doel = document.createElement('div')
      vakRef.current.appendChild(doel)
      api.createController(doel, { uri: 'spotify:track:' + id, width: zichtbaar ? '100%' : 300, height: 80 }, (s) => {
        if (!actief) return s.destroy()
        speler = s
        s.addListener('ready', () => s.play())
        /* onzichtbaar is er geen pauzeknop: pauzeert hij nadat hij gespeeld
           heeft, dan is het liedje (of de preview) afgelopen. in het venster
           kun je zelf pauzeren, dus daar telt alleen pauze aan het eind */
        let gespeeld = false
        s.addListener('playback_update', (e) => {
          const { isPaused, isBuffering, position, duration } = e.data
          if (!isPaused) gespeeld = true
          else if (gespeeld && !isBuffering && (!zichtbaar || (duration && position >= duration - 1500)))
            klaarRef.current?.()
        })
      })
    })
    return () => {
      actief = false
      speler?.destroy()
    }
  }, [id, zichtbaar])

  if (!zichtbaar) return <div className="spotify-onzichtbaar" ref={vakRef} aria-hidden="true" />

  return (
    <div className="eigenschappen-venster info-venster speler-venster">
      <div className="titelbalk venster-titelbalk">
        <img className="titelbalk-icoon" src={concertIcoon} alt="" />
        <span className="titelbalk-tekst">
          &#9834; {r.liedje} &ndash; {r.artiest}
        </span>
        <span className="sluitknop" onClick={onSluiten}>
          <Kruisje />
        </span>
      </div>
      <div className="speler-vak" ref={vakRef} />
    </div>
  )
}
