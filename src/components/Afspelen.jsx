/* het afspeel-driehoekje voor de speelknop bij een liedje, in dezelfde
   strakke lijnstijl als Kruisje.jsx en Vraagteken.jsx, maar dan gevuld;
   de kleur komt van de knop (currentColor) */
export default function Afspelen() {
  return (
    <svg viewBox="0 0 10 10" width="9" height="9" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M2.5,1 L8.5,5 L2.5,9 Z" />
    </svg>
  )
}
