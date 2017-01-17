const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      plugins: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://www.pandora.com");

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  globalShortcut.register('mediaplaypause', function () {
    // console.log('mediaplaypause pressed');
    mainWindow.webContents.sendInputEvent({
      type: "keyDown",
      keyCode: "\u0020"
    });
    mainWindow.webContents.sendInputEvent({
      type: "keyUp",
      keyCode: "\u0020"
    });
  });

  globalShortcut.register('medianexttrack', function() {
    // console.log('medianexttrack pressed');
    mainWindow.webContents.sendInputEvent({
      type: "keyDown",
      keyCode: "right"
    });
    mainWindow.webContents.sendInputEvent({
      type: "keyUp",
      keyCode: "right"
    });
  });

}

app.commandLine.appendSwitch('ppapi-flash-path',
    path.join(__dirname, 'lib/24.0.0.194/PepperFlashPlayer.plugin'));

app.commandLine.appendSwitch('ppapi-flash-version', '24.0.0.194');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
