import Pagina from '../components/Pagina.jsx'
import DataVenster from '../components/DataVenster.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { useVensterStand } from '../hooks/useVensterStand.js'
import { useLightboxVensters } from '../hooks/useLightboxVensters.js'
import { INSPIRATIE_TEKST } from '../data/inspiratie.js'
import inspiratieIcoon from '../assets/iconen/inspiratie.png'
import './Inspiratie.css'

/* elk plaatje, gifje of filmpje in src/assets/inspiratie komt vanzelf op de
   pagina, op bestandsnaam gesorteerd. grote gifs liever als mp4 (h.264): die
   lopen hier net zo rond (zonder geluid), maar zijn vele malen kleiner. geen
   webm: safari op de iphone loopt die niet en blijft op het laatste beeld hangen */
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
  const venster = useVensterStand({ titel: 'inspiratie', icoon: inspiratieIcoon })
  useMenuLayout({ deps: [venster.stand, venster.venster.gemaximaliseerd] })
  const lightbox = useLightboxVensters((p) => p.bestand)

  return (
    <Pagina titel="le mel — inspiratie" klasse="database" vensters={[...venster.taakbalkVensters, ...lightbox.taakbalkVensters]}>
      <DataVenster
        titel="inspiratie"
        icoon={inspiratieIcoon}
        venster={venster.venster}
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
        onMaximaliseer={lightbox.maximaliseer}
        onMinimaliseerAlles={lightbox.minimaliseerAlles}
        onNavigeer={lightbox.navigeer}
      />
    </Pagina>
  )
}
