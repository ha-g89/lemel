import Pagina from '../components/Pagina.jsx'
import LenzenTabel from '../components/LenzenTabel.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { KIJKLIJST } from '../data/kijklijst.js'

export default function Kijklijst() {
  useMenuLayout()
  return (
    <Pagina titel="kijklijst" klasse="lijst">
      <LenzenTabel rijen={KIJKLIJST} stijl={{ width: '615px' }} />
    </Pagina>
  )
}
