/* het vierkantje voor maximaliseer/herstel-knoppen: één kader voor
   "maximaliseren", twee overlappende kaders voor "herstellen" */
export default function Vergroten({ hersteld = false }) {
  if (hersteld) {
    return (
      <svg
        viewBox="0 0 10 10"
        width="10"
        height="10"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
      >
        <rect x="3" y="1" width="6" height="6" />
        <line x1="3" y1="3" x2="9" y2="3" />
        <rect x="1" y="3" width="6" height="6" fill="#C0C0C0" />
        <line x1="1" y1="5" x2="7" y2="5" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 10 10"
      width="10"
      height="10"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      strokeWidth="1.2"
      fill="none"
    >
      <rect x="1" y="1" width="8" height="8" />
      <line x1="1" y1="3" x2="9" y2="3" />
    </svg>
  )
}
