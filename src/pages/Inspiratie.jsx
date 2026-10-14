import Pagina from '../components/Pagina.jsx'
import DataVenster from '../components/DataVenster.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import inspiratieIcoon from '../assets/iconen/inspiratie.png'
import './Lenzendatabase.css'
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
    const naam = pad.split('/').pop()
    return { naam, url, filmpje: /\.(webm|mp4)$/i.test(naam) }
  })
  .sort((a, b) => a.naam.localeCompare(b.naam, 'nl', { numeric: true }))

export default function Inspiratie() {
  useMenuLayout()

  return (
    <Pagina titel="le mel — inspiratie" klasse="database">
      <DataVenster
        titel="inspiratie"
        icoon={inspiratieIcoon}
        status={<span>{PLAATJES.length} {PLAATJES.length === 1 ? 'object' : 'objecten'}</span>}
      >
        <div className="inspiratie-inhoud">
          {PLAATJES.length === 0 && 'binnenkort meer.'}
          {PLAATJES.map((p) => (
            <a key={p.naam} className="inspiratie-plaatje" href={p.url} target="_blank" rel="noreferrer" title={p.naam}>
              {p.filmpje ? (
                <video src={p.url} autoPlay muted loop playsInline />
              ) : (
                <img src={p.url} alt="" loading="lazy" />
              )}
            </a>
          ))}
        </div>
      </DataVenster>
    </Pagina>
  )
}
