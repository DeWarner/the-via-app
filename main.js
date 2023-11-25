const { app, BrowserWindow, protocol, globalShortcut } = require('electron')
const path = require('path')
const serve_dir = `${__dirname}/dist`
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 1000,
  })

  win.loadFile(path.join(serve_dir, 'index.html'))
  return win
}
//app.commandLine.appendSwitch('disable-hid-blocklist')
app.whenReady().then(() => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7) // 'file://{url}'
    let file_path
    file_path = path.join(serve_dir, url)
    if (url.startsWith(serve_dir)) {
      file_path = url
    }
    if (url == "/") {
      file_path = path.join(serve_dir, 'index.html')
    }
    callback({ path: file_path })
    console.error({__dirname, url, original: request.url, file_path })
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })

  win = createWindow()
  ///*
  globalShortcut.register('f5', function() {
    console.log('f5 is pressed')
    win.reload()
  })
  globalShortcut.register('CommandOrControl+R', function() {
    console.log('CommandOrControl+R is pressed')
    win.reload()
  })
  //*/	

  
  /*
  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'hid' && details.securityOrigin === 'file:///') {
      return true
    }
  })
  */
  win.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid' && details.origin === 'file://') {
      return true
    }
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

