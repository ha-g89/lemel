import { Routes, Route, Navigate } from 'react-router-dom'
import Gallerij from './pages/Gallerij.jsx'
import Lenzendatabase from './pages/Lenzendatabase.jsx'
import Concerten from './pages/Concerten.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallerij />} />
      <Route path="/lenzendatabase" element={<Lenzendatabase />} />
      <Route path="/concerten" element={<Concerten />} />
      {/* onbekende of oude adressen (bv. /rugzak) gaan naar de gallerij */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
