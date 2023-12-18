import { searchMusicBrainz } from './requests/musicbrainz'

window.onmessage = (event) => {
  if (event.source === window && event.data === 'ports') {
    const [port] = event.ports
    port.onmessage = async (event) => {
      const {
        id,
        query,
        pageIndex,
      } = event.data
      const result = await searchMusicBrainz(query, pageIndex)
      port.postMessage({
        id,
        result,
      })
    }
  }
}
