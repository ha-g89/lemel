import { useNavigate } from 'react-router-dom'
import DesktopIcoon from './DesktopIcoon.jsx'
import { useStartVenster } from '../hooks/useStartVenster.js'
import { THEMA_NAAM } from '../data/lenzen.js'
import mapIcoon from '../assets/iconen/map2.png'
import leesmijIcoon from '../assets/iconen/leesmij.png'
import patchnotesIcoon from '../assets/iconen/patchnotes.png'

/**
 * Iconen op het bureaublad als het venster van een pagina dicht of
 * geminimaliseerd is (zie DataVenster), onder elkaar links zoals op een echt bureaublad:
 * een mapje per fotogallerij, daaronder leesmij en patchnotes.
 */
export default function Bureaublad() {
  const navigate = useNavigate()
  const openVenster = useStartVenster()
  return (
    <div className="bureaublad-iconen">
      <DesktopIcoon icoon={mapIcoon} naam="gallerij" onOpen={() => navigate('/')} />
      {Object.entries(THEMA_NAAM).map(([code, label]) => (
        <DesktopIcoon key={code} icoon={mapIcoon} naam={label} onOpen={() => navigate(`/?thema=${code}`)} />
      ))}
      <DesktopIcoon icoon={leesmijIcoon} naam="leesmij.txt" onOpen={() => openVenster('leesmij')} />
      <DesktopIcoon icoon={patchnotesIcoon} naam="patchnotes.txt" onOpen={() => openVenster('patchnotes')} />
    </div>
  )
}
