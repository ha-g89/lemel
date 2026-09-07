import Pagina from '../components/Pagina.jsx'
import LenzenTabel from '../components/LenzenTabel.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { RUGZAK } from '../data/rugzak.js'

export default function Rugzak() {
  useMenuLayout()
  return (
    <Pagina titel="rugzak" klasse="lijst">
      <LenzenTabel rijen={RUGZAK} metFotos />
    </Pagina>
  )
}
