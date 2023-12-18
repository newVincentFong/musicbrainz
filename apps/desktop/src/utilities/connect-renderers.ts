import { MessageChannelMain, ipcRenderer } from 'electron'
import type { BrowserWindow } from 'electron'

/** Run in Main process */
export function connectRenderers(primary: BrowserWindow, secondary: BrowserWindow) {
  primary.webContents.mainFrame.ipc.on('request-channel', (event) => {
    const { port1, port2 } = new MessageChannelMain()
    secondary.webContents.postMessage('new-client', null, [port1])
    event.senderFrame.postMessage('provide-channel', null, [port2])
  })
}

/** Run in Renderer process */
export function initMessagePortAsPrimary(callback: (ports: MessagePort[]) => void) {
  ipcRenderer.send('request-channel')

  ipcRenderer.once('provide-channel', (event) => {
    callback(event.ports)
  })
}

/** Run in Renderer process */
export function initMessagePortAsSecondary(callback: (port: MessagePort[]) => void) {
  ipcRenderer.on('new-client', (event) => {
    callback(event.ports)
  })
}
