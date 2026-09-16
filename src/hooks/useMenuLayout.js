import { useEffect } from 'react'

/* Het "doek" is het element waar de taakbalk onder hangt: de fotogrid,
   de databox of de tabel. Het krijgt in de pagina het attribuut data-doek. */
function doek() {
  return document.querySelector('[data-doek]')
}

/* taakbalk exact even breed maken als het doek, en er links mee laten
   uitlijnen */
function plaatsBalk() {
  const balk = document.querySelector('.taakbalk')
  const vlak = doek()
  if (!balk || !vlak) return

  balk.style.width = 'auto'
  balk.style.marginLeft = '0'
  balk.style.left = '0'

  const wrapper = balk.parentElement.getBoundingClientRect()
  const pad = parseFloat(getComputedStyle(balk.parentElement).paddingLeft) || 0
  const doekRect = vlak.getBoundingClientRect()

  balk.style.marginLeft = Math.round(doekRect.left - wrapper.left - pad) + 'px'
  balk.style.width = Math.round(doekRect.width) + 'px'
}

/**
 * Houdt de taakbalk even breed als het doek (de fotogrid, databox of
 * tabel) en er links mee uitgelijnd.
 *
 * @param {object} opties
 * @param {Array}  opties.deps  opnieuw uitlijnen als deze waarden veranderen
 */
export function useMenuLayout({ deps = [] } = {}) {
  useEffect(() => {
    plaatsBalk()

    window.addEventListener('load', plaatsBalk)
    window.addEventListener('resize', plaatsBalk)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(plaatsBalk)
    return () => {
      window.removeEventListener('load', plaatsBalk)
      window.removeEventListener('resize', plaatsBalk)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
