import Pagina from '../components/Pagina.jsx'
import LenzenTabel from '../components/LenzenTabel.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { VERKOCHT } from '../data/verkocht.js'

export default function Verkocht() {
  useMenuLayout()
  return (
    <Pagina titel="verkocht" klasse="lijst">
      <LenzenTabel rijen={VERKOCHT} />
    </Pagina>
  )
}
