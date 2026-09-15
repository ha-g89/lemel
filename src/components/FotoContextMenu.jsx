import Contextmenu from './Contextmenu.jsx'

/**
 * Win98-rechtermuisknopmenu op een foto: hergebruikt dezelfde
 * bevel/hover-stijl als het Start-menu (.navbar/.navbar a).
 * @param {object}   foto      item uit FOTOLIJST ({ url, naam, lens })
 * @param {number}   x         positie in pixels (clientX)
 * @param {number}   y         positie in pixels (clientY)
 * @param {Function} onOpenen  open de lightbox met deze foto
 * @param {Function} onSluiten sluit het contextmenu
 */
export default function FotoContextMenu({ foto, x, y, onOpenen, onSluiten }) {
  function achtergrondInstellen() {
    /* klassiek Windows-wallpaper-grapje: als tegel, net als vroeger bij een te kleine afbeelding.
       geen reset-knop nodig, ververs de pagina (F5) om het weer weg te halen */
    document.body.style.backgroundImage = 'url(' + foto.url + ')'
    document.body.style.backgroundRepeat = 'repeat'
    document.body.style.backgroundSize = '160px auto'
    onSluiten()
  }

  async function linkKopieren() {
    const volledigeUrl = new URL(foto.url, window.location.href).href
    try {
      await navigator.clipboard.writeText(volledigeUrl)
    } catch {
      /* geen klembordtoegang; niet erg, menu gaat toch dicht */
    }
    onSluiten()
  }

  return (
    <Contextmenu x={x} y={y} onSluiten={onSluiten}>
      <button
        type="button"
        onClick={() => {
          onOpenen()
          onSluiten()
        }}
      >
        openen
      </button>
      <div className="menu-scheiding"></div>
      <button type="button" onClick={achtergrondInstellen}>
        instellen als achtergrond
      </button>
      <button type="button" onClick={linkKopieren}>
        kopieer afbeeldingslink
      </button>
    </Contextmenu>
  )
}
