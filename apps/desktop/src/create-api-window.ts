import process from 'node:process'
import path from 'node:path'
import { BrowserWindow } from 'electron'

export function createAPIWindow() {
  const window = new BrowserWindow({
    width: 0,
    height: 0,
    show: false,
    titleBarStyle: undefined,
    webPreferences: {
      spellcheck: true,
      nodeIntegration: process.env.NODE_ENV === 'development',
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, './renderers/preloadAPI.js'),
    },
  })

  return window
}
