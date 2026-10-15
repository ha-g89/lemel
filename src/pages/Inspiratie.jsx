import Pagina from '../components/Pagina.jsx'
import DataVenster from '../components/DataVenster.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { useLightboxVensters } from '../hooks/useLightboxVensters.js'
import { INSPIRATIE_TEKST } from '../data/inspiratie.js'
import inspiratieIcoon from '../assets/iconen/inspiratie.png'
import './Lenzendatabase.css'
import './Gallerij.css'
import './Inspiratie.css'

/* elk plaatje, gifje of filmpje in src/assets/inspiratie komt vanzelf op de
   pagina, op bestandsnaam gesorteerd. grote gifs liever als webm of mp4: die
   lopen hier net zo rond (zonder geluid), maar zijn vele malen kleiner */
const bestanden = import.meta.glob('../assets/inspiratie/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP,webm,WEBM,mp4,MP4}', {
  eager: true,
  import: 'default',
})
const PLAATJES = Object.entries(bestanden)
  .map(([pad, url]) => {
    const bestand = pad.split('/').pop()
    const basis = bestand.replace(/\.[^.]+$/, '')
    return {
      basis,
      bestand,
      url,
      filmpje: /\.(webm|mp4)$/i.test(bestand),
      verhaal: INSPIRATIE_TEKST[basis] ?? null,
    }
  })
  .sort((a, b) => a.bestand.localeCompare(b.bestand, 'nl', { numeric: true }))

export default function Inspiratie() {
  useMenuLayout()
  const lightbox = useLightboxVensters((p) => p.bestand)

  return (
    <Pagina titel="le mel — inspiratie" klasse="database" vensters={lightbox.taakbalkVensters}>
      <DataVenster
        titel="inspiratie"
        icoon={inspiratieIcoon}
        status={<span>{PLAATJES.length} {PLAATJES.length === 1 ? 'object' : 'objecten'}</span>}
      >
        <div className="inspiratie-inhoud">
          {PLAATJES.length === 0 && 'binnenkort meer.'}
          {PLAATJES.map((p) => (
            <div key={p.basis} className="inspiratie-plaatje" title={p.bestand} onClick={() => lightbox.open(p)}>
              {p.filmpje ? (
                <video src={p.url} autoPlay muted loop playsInline />
              ) : (
                <img src={p.url} alt="" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </DataVenster>

      <Lightbox
        vensters={lightbox.vensters}
        fotolijst={PLAATJES}
        onSluit={lightbox.sluit}
        onMinimaliseer={lightbox.wissel}
        onMinimaliseerAlles={lightbox.minimaliseerAlles}
        onNavigeer={lightbox.navigeer}
      />
    </Pagina>
  )
}
