import process from 'node:process'
import path from 'node:path'
import { BrowserWindow } from 'electron'

export function createUIWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    show: false,
    // TODO
    // icon: path.join(__dirname, '/icon/Icon-512x512.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
    frame: process.platform !== 'darwin',
    webPreferences: {
      spellcheck: true,
      nodeIntegration: process.env.NODE_ENV === 'development',
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, './renderers/preloadUI.js'),
    },
  })

  window.on('close', (e) => {
    if (process.platform === 'darwin') {
      e.preventDefault()
      if (!window.isDestroyed())
        window.hide()
    }
  })

  return window
}
