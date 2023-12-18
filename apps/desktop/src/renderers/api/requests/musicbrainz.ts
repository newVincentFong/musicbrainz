export async function searchMusicBrainz(query: string, pageIndex: number) {
  const pageSize = 10
  const response = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&fmt=json&limit=${pageSize}&offset=${pageIndex * pageSize}`)
  const json = await response.json()
  return json
}
