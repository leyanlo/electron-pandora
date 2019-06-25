const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const Menu = electron.Menu;
const windowStateKeeper = require('electron-window-state');
const {shell} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 720
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
    }
  });

  mainWindowState.manage(mainWindow);
  // and load the index.html of the app.
  mainWindow.loadURL("https://www.pandora.com");

  // Only register Mac specific listeners if on Mac
  if(process.platform === 'darwin') {
    var wasForceQuit = false;

    // Called before an app is quit. Should only be called when the app is actually quit ( https://electronjs.org/docs/api/app#event-before-quit )
    app.on('before-quit', function(event) {
      wasForceQuit = true;
    })

    mainWindow.on('close', function (event) {
      // On macOS, most users are used to an application continuing to run
      // in the background when the window is closed. This emulates the
      // same behavior and allows closing the window to continue playing the
      // radio.
        if(!wasForceQuit) {
          event.preventDefault();
        }
        mainWindow.hide();
    });
  }


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  globalShortcut.register('mediaplaypause', function () {
    // When the playpause function key is pressed, toggle playback by
    // using Pandora's spacebar shortcut.
    mainWindow.webContents.sendInputEvent({
      type: "keyDown",
      keyCode: "\u0020"
    });
    mainWindow.webContents.sendInputEvent({
      type: "keyUp",
      keyCode: "\u0020"
    });
  });

  globalShortcut.register('medianexttrack', function () {
    // When the nexttrack function key is pressed, skip to the next
    // track using Pandora's right arrow key shortcut.
    mainWindow.webContents.sendInputEvent({
      type: "keyDown",
      keyCode: "right"
    });
    mainWindow.webContents.sendInputEvent({
      type: "keyUp",
      keyCode: "right"
    });
  });

  createDefaultMenu();
}

function createDefaultMenu() {
  if (Menu.getApplicationMenu()) return;

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://github.com/leyanlo/electron-pandora')
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://github.com/leyanlo/electron-pandora/blob/master/README.md')
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/leyanlo/electron-pandora/issues')
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Electron',
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    });
    template[1].submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Speech',
          submenu: [
            {
              role: 'startspeaking'
            },
            {
              role: 'stopspeaking'
            }
          ]
        }
    );
    template[3].submenu = [
      {
        role: 'close'
      },
      {
        role: 'minimize'
      },
      {
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      }
    ];
  } else {
    template.unshift({
      label: 'File',
      submenu: [
        {
          role: 'quit'
        }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

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
  if (mainWindow === null) {
    // On macOS, reopen the app if there are no windows open but
    // the application is running.
    createWindow()
  } else if (!mainWindow.isVisible()) {
    // If the window is open but hidden (i.e. closed by a macOS
    // user and running in the background), show it.
    mainWindow.show();
  } else {
    // If the window is already open, bring it to the forefront.
    mainWindow.focus();
  }
});
