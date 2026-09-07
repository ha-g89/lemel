import { Routes, Route } from 'react-router-dom'
import Gallerij from './pages/Gallerij.jsx'
import Kijklijst from './pages/Kijklijst.jsx'
import Rugzak from './pages/Rugzak.jsx'
import Verkocht from './pages/Verkocht.jsx'
import Lenzendatabase from './pages/Lenzendatabase.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallerij />} />
      <Route path="/kijklijst" element={<Kijklijst />} />
      <Route path="/rugzak" element={<Rugzak />} />
      <Route path="/verkocht" element={<Verkocht />} />
      <Route path="/lenzendatabase" element={<Lenzendatabase />} />
    </Routes>
  )
}
