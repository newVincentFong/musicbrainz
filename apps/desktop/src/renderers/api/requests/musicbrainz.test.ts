import { expect, it } from 'vitest'
import { searchMusicBrainz } from './musicbrainz'

const nativeFetch = globalThis.fetch

function wrappedFetch(url: Parameters<typeof fetch>[0], options: Parameters<typeof fetch>[1]) {
  const defaultOptions = {
    headers: {
      // Set default user-agent to avoid being blocked from Musicbrainz server
      'User-Agent': 'Node/18',
    },
  }
  return nativeFetch(url, { ...defaultOptions, ...options })
}

globalThis.fetch = wrappedFetch

it('escape characters special to Musicbrainz Lucene', async () => {
  const result = await searchMusicBrainz('AC/DC', 0)
  expect(result.error).toBe(undefined)
})
