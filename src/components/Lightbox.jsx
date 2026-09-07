import { useEffect } from 'react'
import { LENS_NAAM } from '../data/lenzen.js'
import { ebayZoeklink } from '../lib/fotonamen.js'
import ebayLogo from '../assets/iconen/ebay.png'

/* het pixel-kruisje in de titelbalk */
function Kruisje() {
  const pixels = [
    [0, 0], [1, 0], [6, 0], [7, 0],
    [1, 1], [2, 1], [5, 1], [6, 1],
    [2, 2], [3, 2], [4, 2], [5, 2],
    [3, 3], [4, 3],
    [2, 4], [3, 4], [4, 4], [5, 4],
    [1, 5], [2, 5], [5, 5], [6, 5],
    [0, 6], [1, 6], [6, 6], [7, 6],
  ]
  return (
    <svg
      viewBox="0 0 8 7"
      width="16"
      height="14"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      {pixels.map(([x, y]) => (
        <rect key={x + '-' + y} x={x} y={y} width="1" height="1" />
      ))}
    </svg>
  )
}

/**
 * Windows-95-venster met de aangeklikte foto op volle grootte.
 * @param {object}   foto     item uit FOTOLIJST ({ url, naam, lens })
 * @param {Function} onSluit  sluit het venster
 */
export default function Lightbox({ foto, onSluit }) {
  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluit()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluit])

  if (!foto) return null

  const lensnaam = foto.lens ? LENS_NAAM[foto.lens] : null

  return (
    <div id="lightbox-overlay" onClick={onSluit}>
      <div id="lightbox-venster" onClick={(e) => e.stopPropagation()}>
        <div id="lightbox-titelbalk">
          <span id="lightbox-naam">
            {foto.naam}.jpg{lensnaam ? '  —  ' + lensnaam : ''}
          </span>
          <span id="lightbox-sluit" onClick={onSluit}>
            <Kruisje />
          </span>
        </div>
        <div id="lightbox-vlak">
          <img id="lightbox-img" src={foto.url} alt="" />
        </div>
        {lensnaam && (
          <div id="lightbox-onder">
            <a id="lightbox-ebay" href={ebayZoeklink(lensnaam)} target="_blank" rel="noopener noreferrer">
              <img src={ebayLogo} alt="eBay" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
