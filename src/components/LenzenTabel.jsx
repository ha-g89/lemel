import { Link } from 'react-router-dom'
import './LenzenTabel.css'

/**
 * De lenzentabel van kijklijst, rugzak en verkocht.
 *
 * @param {Array}   rijen      lenzen ({ model, ebay, mount, focal, fstop, waarde, lens? })
 * @param {boolean} metFotos   extra kolom "foto's" met een link naar de gallerij per lens
 * @param {object}  stijl      inline stijl op de tabel (kijklijst heeft een vaste breedte)
 */
export default function LenzenTabel({ rijen, metFotos = false, stijl }) {
  return (
    <table className="datatable" style={stijl} data-doek>
      <tbody>
        <tr>
          <th>model</th>
          <th>mount</th>
          <th>focall</th>
          <th>f-stop</th>
          <th>waarde</th>
          {metFotos && <th>foto&#39;s</th>}
        </tr>
        {rijen.map((r) => (
          <tr key={r.model}>
            <td>
              <a href={r.ebay} target="_blank" rel="noopener noreferrer">
                {r.model}
              </a>
            </td>
            <td>{r.mount}</td>
            <td>{r.focal}</td>
            <td>{r.fstop}</td>
            <td>{r.waarde}</td>
            {metFotos && (
              <td>
                <Link to={'/?lens=' + r.lens}>bekijk</Link>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
