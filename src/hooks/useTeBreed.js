import { useEffect, useState } from 'react'

/**
 * Of de inhoud van een element breder is dan het element zelf (dus of er
 * horizontaal gescrold moet worden). Meet opnieuw bij elke verandering van
 * afmetingen, ook van de inhoud (bv. als een filter de tabel smaller maakt).
 * @param {{ current: HTMLElement | null }} ref
 * @returns {boolean}
 */
export function useTeBreed(ref) {
  const [teBreed, zetTeBreed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const meet = () => zetTeBreed(el.scrollWidth > el.clientWidth + 1)
    const waarnemer = new ResizeObserver(meet)
    waarnemer.observe(el)
    if (el.firstElementChild) waarnemer.observe(el.firstElementChild)
    meet()
    return () => waarnemer.disconnect()
  }, [ref])

  return teBreed
}
