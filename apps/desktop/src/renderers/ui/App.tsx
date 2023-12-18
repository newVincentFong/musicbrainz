import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@primer/react'
import SearchPage from './components/SearchPage'

declare global {
  interface Window {
    postToWorker: MessagePort['postMessage']
    queryMusicBrainz: (searchText: string, pageIndex: number) => Promise<any>
  }
}

const queue = [] as any[]
const map = new Map()

window.onmessage = (event) => {
  if (event.source === window && event.data === 'ports') {
    const [port] = event.ports
    window.queryMusicBrainz = async (searchText: string, pageIndex: number) => {
      return new Promise((resolve, reject) => {
        const id = Date.now()
        const callback = (result: any | null) => {
          if (result)
            resolve(result)
          else
            reject(new Error('Response is out-of-date'))
        }
        queue.push(callback)
        map.set(id, callback)
        port.postMessage({
          id,
          query: searchText,
          type: 'artist',
          pageIndex,
        })
      })
    }
    window.postToWorker = port.postMessage.bind(port)
    port.onmessage = (event) => {
      const {
        id,
        result,
      } = event.data
      if (!map.has(id)) {
        // Newer result has been responded
        // Callback has been clearer
        return
      }
      const callback = map.get(id)
      const index = queue.indexOf(callback)
      if (index === -1)
        return

      let i = 0
      while (i < index) {
        const outOfDateCallback = queue.pop()
        outOfDateCallback(null)
        i++
      }
      const currentCallback = queue.pop()
      currentCallback(result)
    }
  }
}

function App() {
  return (
    <ThemeProvider>
      <SearchPage />
    </ThemeProvider>
  )
}

const root = createRoot(
  document.getElementById('app')!,
)

root.render(<App />)

export default App
