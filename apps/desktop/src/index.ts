import process from 'node:process'
import { app } from 'electron'
import type { BrowserWindow } from 'electron'
import { createUIWindow } from './create-ui-window'
import { createAPIWindow } from './create-api-window'
import { connectRenderers } from './utilities/connect-renderers'

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err)
})

app.name = 'MusicBrainz'

let window: BrowserWindow
let apiWindow: BrowserWindow

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('activate', () => {
  window.show()
})

app.on('ready', async () => {
  apiWindow = createAPIWindow()
  await apiWindow.loadFile('api.html')

  window = createUIWindow()
  window.loadFile('ui.html')
  window.once('ready-to-show', () => {
    window.show()
  })

  connectRenderers(window, apiWindow)
})
