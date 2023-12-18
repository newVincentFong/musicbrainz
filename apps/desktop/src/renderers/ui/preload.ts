import { initMessagePortAsPrimary } from '@/utilities/connect-renderers'

const windowLoaded = new Promise((resolve) => {
  window.onload = resolve
})

initMessagePortAsPrimary(async (ports) => {
  await windowLoaded
  window.postMessage('ports', '*', ports)
})
