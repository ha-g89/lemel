import { useCallback, useRef, useState } from 'react'

/**
 * Open lightbox-vensters bijhouden, voor de gallerij en de inspiratiepagina.
 * Elk venster: { id, basis, foto, geminimaliseerd }. Meerdere tegelijk kan,
 * ze komen dan ernaast in de overlay en krijgen elk hun eigen taakbalkknop.
 * id blijft gelijk bij vorige/volgende, zodat het venster niet opnieuw laadt.
 * @param {Function} bestandsnaam (foto) => naam in de taakbalk, bv. 'MCA_0194.jpg'
 */
export function useLightboxVensters(bestandsnaam) {
  const [vensters, zetVensters] = useState([])
  const vensterTeller = useRef(0)

  const open = useCallback((foto) => {
    zetVensters((lijst) => {
      const bestaat = lijst.some((v) => v.basis === foto.basis)
      if (bestaat) {
        return lijst.map((v) => (v.basis === foto.basis ? { ...v, geminimaliseerd: false } : v))
      }
      vensterTeller.current += 1
      return [...lijst, { id: vensterTeller.current, basis: foto.basis, foto, geminimaliseerd: false }]
    })
  }, [])
  const sluit = useCallback((basis) => {
    zetVensters((lijst) => lijst.filter((v) => v.basis !== basis))
  }, [])
  const wissel = useCallback((basis) => {
    zetVensters((lijst) =>
      lijst.map((v) => (v.basis === basis ? { ...v, geminimaliseerd: !v.geminimaliseerd } : v))
    )
  }, [])
  const minimaliseerAlles = useCallback(() => {
    zetVensters((lijst) => lijst.map((v) => ({ ...v, geminimaliseerd: true })))
  }, [])
  /* wisselt een open venster naar een andere foto (vorige/volgende), zonder
     het venster zelf te sluiten; doet niets als die foto al in een ander
     venster open staat */
  const navigeer = useCallback((huidigeBasis, nieuweFoto) => {
    zetVensters((lijst) => {
      if (lijst.some((v) => v.basis === nieuweFoto.basis && v.basis !== huidigeBasis)) return lijst
      return lijst.map((v) =>
        v.basis === huidigeBasis ? { ...v, basis: nieuweFoto.basis, foto: nieuweFoto, geminimaliseerd: false } : v
      )
    })
  }, [])

  const taakbalkVensters = vensters.map((v) => ({
    basis: v.basis,
    titel: bestandsnaam(v.foto),
    actief: !v.geminimaliseerd,
    onKlik: () => wissel(v.basis),
  }))

  return { vensters, open, sluit, wissel, minimaliseerAlles, navigeer, taakbalkVensters }
}
