import { useEffect, useRef } from 'react'

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

/**
 * Onzichtbare spotify-speler: speelt het favoriete liedje af zolang hij
 * gemount is, en stopt zodra hij verdwijnt. De iframe staat doorzichtig in
 * een hoek van het scherm: buiten beeld of met display:none legt de browser
 * hem stil.
 * @param {object}   r        één concert ({ artiest, liedje, spotify })
 * @param {Function} onKlaar  het liedje is afgelopen
 */
export default function SpotifySpeler({ r, onKlaar }) {
  const id = spotifyId(r.spotify)
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
      api.createController(doel, { uri: 'spotify:track:' + id, width: 300, height: 80 }, (s) => {
        if (!actief) return s.destroy()
        speler = s
        s.addListener('ready', () => s.play())
        /* er is geen pauzeknop in beeld: pauzeert hij nadat hij gespeeld
           heeft, dan is het liedje (of de preview) afgelopen */
        let gespeeld = false
        s.addListener('playback_update', (e) => {
          if (!e.data.isPaused) gespeeld = true
          else if (gespeeld && !e.data.isBuffering) klaarRef.current?.()
        })
      })
    })
    return () => {
      actief = false
      speler?.destroy()
    }
  }, [id])

  return <div className="spotify-onzichtbaar" ref={vakRef} aria-hidden="true" />
}
