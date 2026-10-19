/* haalt het track-id uit een spotify-link ("delen → link naar nummer
   kopiëren"), of accepteert een kaal id */
export function spotifyId(link) {
  if (!link) return null
  const m = link.match(/track[/:]([A-Za-z0-9]+)/)
  return m ? m[1] : link
}

/* opent het nummer in de spotify-app (computer of telefoon) */
export function spotifyAppLink(link) {
  const id = spotifyId(link)
  return id ? 'spotify:track:' + id : null
}
