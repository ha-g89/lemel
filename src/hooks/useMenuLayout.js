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

/* het weergave-icoontje (paasei) net naast de rechterkant van het doek
   zetten (niet erover heen), en de natuurlijke (document-)hoogte van de
   eerste foto's onthouden: dat is waar het icoontje hoort te staan, naast
   de bovenkant van de fotogrid */
function plaatsSchermIcoonHorizontaal() {
  const icoon = document.getElementById('scherminstellingen-icoon')
  const venster = document.getElementById('scherminstellingen-venster')
  const vlak = doek()
  if (!icoon || !vlak) return

  const doekRect = vlak.getBoundingClientRect()
  const links = Math.round(doekRect.right + ICOON_MARGE)
  icoon.dataset.natuurlijkeTop = Math.round(doekRect.top + window.scrollY)

  icoon.style.left = links + 'px'
  if (venster) venster.style.left = links + icoon.offsetWidth - 260 + 'px'
}

/* het icoontje staat op zijn natuurlijke plek naast de bovenkant van de
   fotogrid totdat je daaraan voorbij scrollt; daarna blijft het op een
   vaste afstand van de bovenkant van het scherm meescrollen, totdat de
   taakbalk eronder dat punt zou inhalen. Vanaf dat moment blijft het vlak
   boven de taakbalk hangen in plaats van erdoorheen te schuiven */
function plaatsSchermIcoonVerticaal() {
  const icoon = document.getElementById('scherminstellingen-icoon')
  const venster = document.getElementById('scherminstellingen-venster')
  if (!icoon) return

  const natuurlijkeTop = parseFloat(icoon.dataset.natuurlijkeTop) || 0
  let top = Math.max(natuurlijkeTop, window.scrollY + ICOON_MARGE)

  const balk = document.querySelector('.taakbalk')
  if (balk) {
    const vloer = balk.getBoundingClientRect().top + window.scrollY - icoon.offsetHeight - ICOON_MARGE
    top = Math.min(top, vloer)
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
      plaatsSchermIcoonHorizontaal()
      plaatsSchermIcoonVerticaal()
    }
    plaatsAlles()

    /* op elke scroll-tick herplaatsen kan een frame achterlopen op de
       paint; één keer per animatieframe is genoeg */
    let aangevraagd = null
    const opScroll = () => {
      if (aangevraagd !== null) return
      aangevraagd = requestAnimationFrame(() => {
        aangevraagd = null
        plaatsSchermIcoonVerticaal()
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
