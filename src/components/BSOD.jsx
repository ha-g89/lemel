/**
 * Paasei: het klassieke blauwe scherm. Er is geen zichtbare knop of hint —
 * typ ergens op de site "bsod" en het verschijnt, net zo onopvallend als
 * de "F5" bij het afsluitscherm. Verdwijnt ook alleen door de pagina
 * daadwerkelijk te verversen (F5), zelfde afspraak als daar.
 */
export default function BSOD() {
  return (
    <div id="bsod">
      <p>le mel</p>
      <p>
        A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
        00010E36. The current application will be terminated.
      </p>
      <p>&nbsp;</p>
      <p>* Druk op een willekeurige toets om le mel opnieuw te starten.</p>
      <p>* Druk op CTRL+ALT+DEL om je computer opnieuw op te starten. Je</p>
      <p>&nbsp;&nbsp;verliest hierbij niet-opgeslagen gegevens in alle geopende</p>
      <p>&nbsp;&nbsp;programma&#39;s.</p>
      <p>&nbsp;</p>
      <p>Druk op F5 om door te gaan _</p>
    </div>
  )
}
