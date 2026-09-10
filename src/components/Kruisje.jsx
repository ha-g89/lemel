/* het pixel-kruisje voor sluitknoppen (lightbox, paasei-venster) */
export default function Kruisje() {
  const pixels = [
    [0, 0], [1, 0], [6, 0], [7, 0],
    [1, 1], [2, 1], [5, 1], [6, 1],
    [2, 2], [3, 2], [4, 2], [5, 2],
    [3, 3], [4, 3],
    [2, 4], [3, 4], [4, 4], [5, 4],
    [1, 5], [2, 5], [5, 5], [6, 5],
    [0, 6], [1, 6], [6, 6], [7, 6],
  ]
  return (
    <svg
      viewBox="0 0 8 7"
      width="16"
      height="14"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      {pixels.map(([x, y]) => (
        <rect key={x + '-' + y} x={x} y={y} width="1" height="1" />
      ))}
    </svg>
  )
}
