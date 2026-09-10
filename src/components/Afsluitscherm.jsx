import achtergrond from '../assets/iconen/afsluitscherm-achtergrond.jpg'

/**
 * Het klassieke Windows-95 afsluitscherm: volledig scherm, met de
 * bekende blauwe dithered achtergrond, "It's now safe to turn off
 * your computer." Verschijnt na een klik op "Shut Down..." in het menu.
 */
export default function Afsluitscherm() {
  return (
    <div id="afsluitscherm" style={{ backgroundImage: `url(${achtergrond})` }}>
      <div id="afsluitscherm-tekst">
        <p>F5</p>
      </div>
    </div>
  )
}
