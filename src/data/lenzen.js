/* ============================================================
   LENSCODES — zet de code achter de bestandsnaam van een foto in
   src/assets/kluis, gescheiden door een liggend streepje:

        MCA_0194_pentax-m-35.JPG

   De site haalt de lens dan automatisch uit de naam.
   Foto's zonder lenscode werken gewoon, die tonen alleen geen lens.
   ============================================================ */
export const LENS_NAAM = {
  'albinar-28': 'super albinar mc auto 28mm f2.8',
  'pentax-m-35': 'smc pentax-m 35mm f2',
  'pentax-a-50': 'smc pentax-a 50mm f2.8 (macro)',
  'pentax-k-50': 'smc pentax-k 50mm f4 (macro)',
  'pentax-m-85': 'smc pentax-m 85mm f2',
  'pentax-m-135': 'smc pentax-m 135mm f3.5',
  'pentax-200': 'smc pentax 200mm f4',
}

export const THEMA_NAAM = {
  autos: "auto's",
  jp26: 'jp26',
}

/* tekst van leesmij.txt op de lenzendatabase */
export const LEESMIJ = `dit is mijn lenzendatabase. hierin houd ik alle lenzen bij die ik heb, die ik wil hebben en die ik al verkocht heb.

functionaliteiten: zoek bovenin op merk, model of vatting, of filter op vatting en status (in bezit, kijklijst, verkocht). klik op een kolomkop om te sorteren, nog een keer klikken draait de volgorde om. klik op een modelnaam om 'm op ebay te zoeken, en op de prijs om te zien waar die vandaan komt. het (?) naast een model, of een rij rechtermuisen, opent de eigenschappen met alle specs van die lens.`
