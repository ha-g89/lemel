import { useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Stand van een DataVenster met minimaliseren, maximaliseren en sluiten.
 * Dicht of geminimaliseerd geldt alleen zolang je op dezelfde plek blijft:
 * elke nieuwe navigatie (ook Start → gallerij op de gallerij zelf, die een
 * nieuwe location.key geeft) zet het venster weer open.
 * @param {object} taakbalk { titel, icoon } voor de knop in de taakbalk
 * @returns {{ venster: object, taakbalkVensters: object[] }}
 *   venster gaat naar DataVenster, taakbalkVensters naar Pagina
 */
export function useVensterStand({ titel, icoon }) {
  const { key } = useLocation()
  /* { stand: 'geminimaliseerd' | 'gesloten', key } */
  const [verstopt, zetVerstopt] = useState(null)
  const [gemaximaliseerd, zetGemaximaliseerd] = useState(false)
  const stand = verstopt?.key === key ? verstopt.stand : 'open'

  const venster = {
    zichtbaar: stand === 'open',
    gemaximaliseerd,
    minimaliseer: () => zetVerstopt({ stand: 'geminimaliseerd', key }),
    maximaliseer: () => zetGemaximaliseerd((m) => !m),
    sluit: () => {
      zetVerstopt({ stand: 'gesloten', key })
      zetGemaximaliseerd(false)
    },
  }
  /* zoals in windows: open en geminimaliseerd heeft een taakbalkknop, die
     wisselt tussen de twee; dicht heeft er geen */
  const taakbalkVensters =
    stand === 'gesloten'
      ? []
      : [
          {
            basis: 'venster',
            titel,
            icoon,
            actief: stand === 'open',
            onKlik: () => (stand === 'open' ? venster.minimaliseer() : zetVerstopt(null)),
          },
        ]

  return { venster, taakbalkVensters, stand }
}
