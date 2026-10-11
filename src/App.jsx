import { useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Gallerij from './pages/Gallerij.jsx'
import Lenzendatabase from './pages/Lenzendatabase.jsx'
import Concerten from './pages/Concerten.jsx'

/* elke keer dat je via het menu (of een andere link) naar een pagina gaat,
   begint die bovenaan, ook als je al op die pagina was */
function NaarBoven() {
  const { key } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [key])
  return null
}

export default function App() {
  return (
    <>
      <NaarBoven />
      <Routes>
        <Route path="/" element={<Gallerij />} />
        <Route path="/lenzendatabase" element={<Lenzendatabase />} />
        <Route path="/concerten" element={<Concerten />} />
        {/* onbekende of oude adressen (bv. /rugzak) gaan naar de gallerij */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
