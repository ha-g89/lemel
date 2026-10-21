import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ProgrammaContext } from '../hooks/useProgrammas.js'

/* open programma's (pagina's) in de taakbalk, ook na verversen van de pagina */
const OPSLAG = 'meneermel-programmas'

function lees() {
  try {
    const lijst = JSON.parse(sessionStorage.getItem(OPSLAG))
    if (Array.isArray(lijst)) return lijst
  } catch {
    /* geen opslag beschikbaar */
  }
  return []
}

/**
 * Houdt bij welke pagina's als programma open staan, zodat ze in de taakbalk
 * blijven staan als je naar een andere pagina gaat. Elk programma:
 * { pad, url, titel, icoon, gemaximaliseerd, gebruikt }, in de volgorde
 * waarin ze geopend zijn. Past er in de taakbalk geen knop meer bij (zie
 * zetCapaciteit in Taakbalk), dan gaat het programma dat het langst niet
 * gebruikt is vanzelf dicht.
 */
export default function ProgrammaProvider({ children }) {
  const { pathname } = useLocation()
  const [programmas, zetProgrammas] = useState(lees)
  const [capaciteit, zetCapaciteit] = useState(Infinity)
  const teller = useRef(Math.max(0, ...programmas.map((p) => p.gebruikt)))

  useEffect(() => {
    try {
      sessionStorage.setItem(OPSLAG, JSON.stringify(programmas))
    } catch {
      /* geen opslag beschikbaar */
    }
  }, [programmas])

  useEffect(() => {
    if (programmas.length <= capaciteit) return
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- de capaciteit wordt pas na het tekenen van de taakbalk gemeten */
    zetProgrammas((lijst) => {
      const weg = lijst
        .filter((p) => p.pad !== pathname)
        .sort((a, b) => a.gebruikt - b.gebruikt)
        .slice(0, Math.max(0, lijst.length - capaciteit))
        .map((p) => p.pad)
      return weg.length ? lijst.filter((p) => !weg.includes(p.pad)) : lijst
    })
  }, [programmas, capaciteit, pathname])

  /* het programma van de huidige pagina toevoegen of bijwerken */
  const registreer = useCallback((pad, info) => {
    teller.current += 1
    const gebruikt = teller.current
    zetProgrammas((lijst) =>
      lijst.some((p) => p.pad === pad)
        ? lijst.map((p) => (p.pad === pad ? { ...p, ...info, gebruikt } : p))
        : [...lijst, { pad, gemaximaliseerd: false, ...info, gebruikt }],
    )
  }, [])
  const sluit = useCallback((pad) => {
    zetProgrammas((lijst) => lijst.filter((p) => p.pad !== pad))
  }, [])
  const zetMaximaal = useCallback((pad, waarde) => {
    zetProgrammas((lijst) => lijst.map((p) => (p.pad === pad ? { ...p, gemaximaliseerd: waarde } : p)))
  }, [])

  return (
    <ProgrammaContext.Provider value={{ programmas, registreer, sluit, zetMaximaal, zetCapaciteit }}>
      {children}
    </ProgrammaContext.Provider>
  )
}
