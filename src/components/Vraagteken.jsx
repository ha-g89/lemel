/* het vraagteken voor de "verhaal achter de foto"-knop, als open lijntje
   (geen dikke vulling) in dezelfde strakke lijnstijl als Kruisje.jsx en
   Streepje.jsx, iets groter dan de andere titelbalk-knopjes zodat hij goed
   leesbaar blijft */
export default function Vraagteken() {
  return (
    <svg
      viewBox="0 0 10 11"
      width="10"
      height="11"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#000000"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M3,3.2 C3,1.8 4.2,1 5,1 C6.1,1 7,1.8 7,3 C7,4.3 6,4.6 5.4,5.3 C5,5.7 5,6.1 5,6.8" />
      <circle cx="5" cy="9.3" r="0.65" fill="#000000" stroke="none" />
    </svg>
  )
}
