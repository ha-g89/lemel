import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { vensterMenu } from '../lib/vensterMenu.js'
import { useProgrammas } from './useProgrammas.js'

/**
 * Stand van het DataVenster van een pagina, met minimaliseren, maximaliseren
 * en sluiten, plus de taakbalkknoppen van alle open programma's (zie
 * useProgrammas): een andere pagina die nog open staat houdt zijn knop, en
 * klikken daarop gaat terug naar die pagina.
 * Dicht of geminimaliseerd geldt alleen zolang je op dezelfde plek blijft:
 * elke nieuwe navigatie (ook Start → gallerij op de gallerij zelf, die een
 * nieuwe location.key geeft) zet het venster weer open.
 * @param {object} taakbalk { titel, icoon } voor de knop in de taakbalk
 * @returns {{ venster: object, taakbalkVensters: object[], stand: string }}
 *   venster gaat naar DataVenster, taakbalkVensters naar Pagina
 */
export function useVensterStand({ titel, icoon }) {
  const { key, pathname, search } = useLocation()
  const navigate = useNavigate()
  const { programmas, registreer, sluit, zetMaximaal } = useProgrammas()
  /* { stand: 'geminimaliseerd' | 'gesloten', key } */
  const [verstopt, zetVerstopt] = useState(null)
  const stand = verstopt?.key === key ? verstopt.stand : 'open'
  const gemaximaliseerd = programmas.find((p) => p.pad === pathname)?.gemaximaliseerd ?? false
  const url = pathname + search

  useEffect(() => {
    if (stand === 'gesloten') sluit(pathname)
    else registreer(pathname, { url, titel, icoon })
  }, [stand, pathname, url, titel, icoon, registreer, sluit])

  const venster = {
    zichtbaar: stand === 'open',
    gemaximaliseerd,
    minimaliseer: () => zetVerstopt({ stand: 'geminimaliseerd', key }),
    maximaliseer: () => zetMaximaal(pathname, !gemaximaliseerd),
    sluit: () => zetVerstopt({ stand: 'gesloten', key }),
  }

  /* zoals in windows: elk open programma heeft een taakbalkknop. die van deze
     pagina wisselt tussen open en geminimaliseerd, die van een andere pagina
     gaat daarheen. een gesloten venster heeft geen knop */
  const taakbalkVensters = programmas
    .filter((p) => p.pad !== pathname || stand !== 'gesloten')
    .map((p) => {
      if (p.pad !== pathname) {
        return {
          basis: 'programma:' + p.pad,
          titel: p.titel,
          icoon: p.icoon,
          actief: false,
          onKlik: () => navigate(p.url),
          menu: vensterMenu({
            zichtbaar: false,
            gemaximaliseerd: p.gemaximaliseerd,
            toon: () => navigate(p.url),
            minimaliseer: null,
            zetMaximaal: (waarde) => zetMaximaal(p.pad, waarde),
            sluit: () => sluit(p.pad),
          }),
        }
      }
      return {
        basis: 'programma:' + p.pad,
        titel,
        icoon,
        actief: stand === 'open',
        onKlik: () => (stand === 'open' ? venster.minimaliseer() : zetVerstopt(null)),
        menu: vensterMenu({
          zichtbaar: stand === 'open',
          gemaximaliseerd,
          toon: () => zetVerstopt(null),
          minimaliseer: venster.minimaliseer,
          zetMaximaal: (waarde) => zetMaximaal(pathname, waarde),
          sluit: venster.sluit,
        }),
      }
    })

  return { venster, taakbalkVensters, stand }
}
