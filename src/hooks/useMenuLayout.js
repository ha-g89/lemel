import { useEffect } from 'react'

const MENU_MARGE = 20 /* afstand tussen bovenrand scherm en meelopend menu */
const BALK_MARGE = 40 /* standaardruimte boven de taakbalk */
const MENU_LUCHT = 60 /* extra lucht onder het menu */

/* Het "doek" is het element waar het menu naast staat en de taakbalk
   onder hangt: de fotogrid, de databox of de tabel. Het krijgt in de
   pagina het attribuut data-doek. */
function doek() {
  return document.querySelector('[data-doek]')
}

/* taakbalk laten beginnen waar het menu begint, zodat het menu er straks op rust */
function plaatsBalk() {
  const nav = document.querySelector('.navbar')
  const balk = document.querySelector('.taakbalk')
  const vlak = doek()
  if (!nav || !balk || !vlak) return

  balk.style.width = 'auto'
  balk.style.marginLeft = '0'
  balk.style.left = '0'

  const wrapper = balk.parentElement.getBoundingClientRect()
  const pad = parseFloat(getComputedStyle(balk.parentElement).paddingLeft) || 0
  const navL = nav.getBoundingClientRect().left
  const doekR = vlak.getBoundingClientRect().right

  balk.style.marginLeft = Math.round(navL - wrapper.left - pad) + 'px'
  balk.style.width = Math.round(doekR - navL) + 'px'
}

/* Korte pagina? Dan de taakbalk omlaag duwen zodat het menu er
   altijd ruim onder past en nergens overheen valt. */
function ruimteVoorMenu() {
  const nav = document.querySelector('.navbar')
  const balk = document.querySelector('.taakbalk')
  if (!nav || !balk || !nav.dataset.start) return

  balk.style.marginTop = BALK_MARGE + 'px'
  const start = parseInt(nav.dataset.start, 10)
  const balkTop = balk.getBoundingClientRect().top + window.scrollY
  const nodig = start + nav.offsetHeight + MENU_LUCHT

  if (balkTop < nodig) {
    balk.style.marginTop = BALK_MARGE + (nodig - balkTop) + 'px'
  }
}

/* icoon + venster rechts volgen dezelfde hoogte/scroll als het menu links */
function plaatsSchermIcoon() {
  const nav = document.querySelector('.navbar')
  const icoon = document.getElementById('scherminstellingen-icoon')
  const venster = document.getElementById('scherminstellingen-venster')
  if (!nav) return

  const top = nav.style.top || '0px'
  if (icoon) icoon.style.top = top
  if (venster) {
    const iconHoogte = icoon ? icoon.offsetHeight : 0
    venster.style.top = parseFloat(top) + iconHoogte + 8 + 'px'
  }
}

function plaatsMenu() {
  const nav = document.querySelector('.navbar')
  if (!nav || !nav.dataset.start) return

  const start = parseInt(nav.dataset.start, 10)
  const volgTop = window.scrollY + MENU_MARGE /* meelopend met de scroll */
  let top = Math.max(start, volgTop)

  /* laatste stuk: het menu zakt naar de taakbalk en landt er precies op */
  const balk = document.querySelector('.taakbalk')
  if (balk) {
    const rustTop = balk.getBoundingClientRect().top + window.scrollY - nav.offsetHeight
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const restant = maxScroll - window.scrollY /* nog te scrollen */
    const zone = 300 /* over welke afstand het zakt */
    if (rustTop > top && restant < zone) {
      const f = 1 - restant / zone /* 0 aan het begin, 1 helemaal onderaan */
      top = top + (rustTop - top) * f
    }
  }

  nav.style.position = 'absolute'
  nav.style.top = Math.round(top) + 'px'
  plaatsSchermIcoon()
}

function alignMenu(metRuimte) {
  const nav = document.querySelector('.navbar')
  const anchor = doek()
  if (!nav || !anchor) return
  nav.dataset.start = Math.round(anchor.getBoundingClientRect().top + window.scrollY)
  plaatsBalk()
  if (metRuimte) ruimteVoorMenu()
  plaatsMenu()
  plaatsSchermIcoon()
}

/**
 * Laat het navigatiemenu meelopen met de scroll, zet de taakbalk op
 * dezelfde linkerkant als het menu en laat het menu onderaan op de
 * taakbalk landen.
 *
 * @param {object}  opties
 * @param {boolean} opties.metRuimte  taakbalk omlaag duwen op korte pagina's
 * @param {Array}   opties.deps       opnieuw uitlijnen als deze waarden veranderen
 */
export function useMenuLayout({ metRuimte = true, deps = [] } = {}) {
  useEffect(() => {
    const align = () => alignMenu(metRuimte)
    align()
    window.addEventListener('load', align)
    window.addEventListener('resize', align)
    window.addEventListener('scroll', plaatsMenu, { passive: true })
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align)
    return () => {
      window.removeEventListener('load', align)
      window.removeEventListener('resize', align)
      window.removeEventListener('scroll', plaatsMenu)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metRuimte, ...deps])
}
