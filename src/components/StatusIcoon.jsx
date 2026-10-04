/* kleine pixelicoontjes in de statuslabels van de lenzendatabase:
   kroontje (in bezit), oog (kijklijst) en stapeltje munten (verkocht) */
const ICOON = {
  owned: (
    <>
      <path d="M0,1 H1 V2 H2 V3 H3 V1 H4 V0 H5 V1 H6 V3 H7 V2 H8 V1 H9 V7 H0 Z" fill="#FFD700" />
      <path d="M0,5 H9 V7 H0 Z" fill="#E0A800" />
      <path d="M4,5 H5 V6 H4 Z M1,5 H2 V6 H1 Z M7,5 H8 V6 H7 Z" fill="#FFF6B0" />
    </>
  ),
  wanted: (
    <>
      <path d="M2,1 H7 V2 H8 V3 H9 V4 H8 V5 H7 V6 H2 V5 H1 V4 H0 V3 H1 V2 H2 Z" fill="#000000" />
      <path d="M2,2 H7 V3 H8 V4 H7 V5 H2 V4 H1 V3 H2 Z" fill="#FFFFFF" />
      <path d="M3,2 H6 V5 H3 Z" fill="#000080" />
      <path d="M4,3 H5 V4 H4 Z" fill="#000000" />
      <path d="M3,2 H4 V3 H3 Z" fill="#FFFFFF" />
    </>
  ),
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
