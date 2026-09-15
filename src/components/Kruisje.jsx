/* het strakke kruisje voor sluitknoppen (lightbox, paasei-venster):
   twee vloeiende diagonale lijnen, geen pixel-trapjes */
export default function Kruisje() {
  return (
    <svg
      viewBox="0 0 10 10"
      width="14"
      height="14"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      strokeWidth="1.2"
      strokeLinecap="square"
    >
      <line x1="1" y1="1" x2="9" y2="9" />
      <line x1="9" y1="1" x2="1" y2="9" />
    </svg>
  )
}
