/* klein pixelicoontje in het statusvakje van de lenzendatabase: stapeltje
   munten (verkocht); in bezit en kijklijst hebben een eigen tegeltje */
const ICOON = {
  sold: (
    <>
      <path d="M1,5 H8 V7 H1 Z M2,3 H9 V5 H2 Z M0,1 H7 V3 H0 Z" fill="#E0A800" />
      <path d="M1,5 H8 V6 H1 Z M2,3 H9 V4 H2 Z M0,1 H7 V2 H0 Z" fill="#FFD700" />
      <path d="M1,1 H3 V2 H1 Z M3,3 H5 V4 H3 Z M2,5 H4 V6 H2 Z" fill="#FFF6B0" />
    </>
  ),
}

export default function StatusIcoon({ status }) {
  if (!ICOON[status]) return null
  return (
    <svg
      className="status-icoon"
      viewBox="0 0 9 7"
      width="9"
      height="7"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {ICOON[status]}
    </svg>
  )
}
