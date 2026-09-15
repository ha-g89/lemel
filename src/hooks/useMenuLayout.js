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

const ICOON_MARGE = 20 /* afstand tussen het icoontje en de taakbalk zodra die eronder komt, en tussen het icoontje en de fotogrid */

/* een icoontje (paasei-icoon of de "naar start"-knop) naast het doek
   zetten (niet erover heen) aan de gevraagde kant, op de natuurlijke
   hoogte naast de bovenkant van de fotogrid. De (document-)hoogte wordt
   ook onthouden: dat is waar het paasei-icoon vandaan begint mee te
   scrollen (zie plaatsIcoonVerticaal) */
function plaatsIcoonHorizontaal(icoonId, kant, vensterId) {
  const icoon = document.getElementById(icoonId)
  const venster = vensterId ? document.getElementById(vensterId) : null
  const vlak = doek()
  if (!icoon || !vlak) return

  const doekRect = vlak.getBoundingClientRect()
  const positie =
    kant === 'links'
      ? Math.round(doekRect.left - ICOON_MARGE - icoon.offsetWidth)
      : Math.round(doekRect.right + ICOON_MARGE)
  const natuurlijkeTop = Math.round(doekRect.top + window.scrollY)
  icoon.dataset.natuurlijkeTop = natuurlijkeTop

  icoon.style.left = positie + 'px'
  icoon.style.top = natuurlijkeTop + 'px'
  if (venster) venster.style.left = positie + icoon.offsetWidth - 260 + 'px'
}

/* het paasei-icoontje staat op zijn natuurlijke plek naast de bovenkant
   van de fotogrid totdat je daaraan voorbij scrollt; daarna blijft het op
   een vaste afstand van de bovenkant van het scherm meescrollen, totdat
   de taakbalk eronder dat punt zou inhalen. Vanaf dat moment blijft het
   vlak boven de taakbalk hangen in plaats van erdoorheen te schuiven.
   (De "naar start"-knop blijft juist gewoon boven staan, zie
   plaatsIcoonHorizontaal, anders staan er twee start-achtige knoppen
   tegelijk in beeld zodra je bij de taakbalk bent) */
function plaatsIcoonVerticaal(icoonId, vensterId) {
  const icoon = document.getElementById(icoonId)
  const venster = vensterId ? document.getElementById(vensterId) : null
  if (!icoon) return

  const natuurlijkeTop = parseFloat(icoon.dataset.natuurlijkeTop) || 0
  let top = Math.max(natuurlijkeTop, window.scrollY + ICOON_MARGE)

  const balk = document.querySelector('.taakbalk')
  if (balk) {
    const grens = balk.getBoundingClientRect().top + window.scrollY - icoon.offsetHeight - ICOON_MARGE
    top = Math.min(top, grens)
  }

  icoon.style.top = Math.round(top) + 'px'
  if (venster) venster.style.top = Math.round(top) + icoon.offsetHeight + 8 + 'px'
}

/**
 * Houdt de taakbalk even breed als het doek (de fotogrid, databox of
 * tabel) en laat het paasei-icoontje meescrollen totdat de taakbalk
 * eronder er tegenaan komt.
 *
 * @param {object} opties
 * @param {Array}  opties.deps  opnieuw uitlijnen als deze waarden veranderen
 */
export function useMenuLayout({ deps = [] } = {}) {
  useEffect(() => {
    function plaatsAlles() {
      plaatsBalk()
      plaatsIcoonHorizontaal('scherminstellingen-icoon', 'rechts', 'scherminstellingen-venster')
      plaatsIcoonVerticaal('scherminstellingen-icoon', 'scherminstellingen-venster')
      plaatsIcoonHorizontaal('naar-start-knop', 'links')
    }
    plaatsAlles()

    /* op elke scroll-tick herplaatsen kan een frame achterlopen op de
       paint; één keer per animatieframe is genoeg */
    let aangevraagd = null
    const opScroll = () => {
      if (aangevraagd !== null) return
      aangevraagd = requestAnimationFrame(() => {
        aangevraagd = null
        plaatsIcoonVerticaal('scherminstellingen-icoon', 'scherminstellingen-venster')
      })
    }

    window.addEventListener('load', plaatsAlles)
    window.addEventListener('resize', plaatsAlles)
    window.addEventListener('scroll', opScroll, { passive: true })
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(plaatsAlles)
    return () => {
      window.removeEventListener('load', plaatsAlles)
      window.removeEventListener('resize', plaatsAlles)
      window.removeEventListener('scroll', opScroll)
      if (aangevraagd !== null) cancelAnimationFrame(aangevraagd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
