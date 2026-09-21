/* het liggende streepje voor minimaliseer-knoppen, in dezelfde strakke
   lijnstijl als Kruisje.jsx */
export default function Streepje() {
  return (
    <svg
      viewBox="0 0 10 10"
      width="10"
      height="10"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      strokeWidth="1.2"
      strokeLinecap="square"
      shapeRendering="crispEdges"
    >
      <line x1="1" y1="8" x2="9" y2="8" />
    </svg>
  )
}
