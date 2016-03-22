'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var windowStateKeeper = require('electron-window-state');
var os = require('os');

// basic window
var mainWindow = null;
var appUrl = 'https://web.whatsapp.com';
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36';

// autoUpdater
var autoUpdater = require('auto-updater');
var platform = os.platform() + '_' + os.arch();
var version = app.getVersion();
var releaseUrl = 'https://tox-electron-whatsapp-nuts.herokuapp.com/update/' + platform + '/' + version;

var appMenu = require('./menu');


app.on('window-all-closed', function () {
  app.quit();
});

app.on('ready', function () {
  electron.Menu.setApplicationMenu(appMenu.mainMenu);
  
  var mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });
  mainWindow = new BrowserWindow({
    title: app.getName(),
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    resizable: true,
    center: true,
    show: true // später auf false und das ganze managen
    // frame: true,
    // autoHideMenuBar: true,
    //icon: 'assets/icon.png',
    // titleBarStyle: 'hidden-inset'
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(appUrl, {userAgent: userAgent});

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools({detach: true});
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', function () {
    // autoUpdater -----------------------------------------------------------------------------------------------------
    if (process.env.NODE_ENV !== 'development') {
      autoUpdater.setFeedURL(releaseUrl);
      autoUpdater
        .on('error', function (error) {
          // console.log('auto-updater on error: ', error);
        })
        .on('checking-for-update', function () {
          // console.log('checking-for-update');
        })
        .on('update-available', function () {
          // console.log('update-available');
        })
        .on('update-not-available', function () {
          // console.log('update-not-available');
        })
        .on('update-downloaded', function () {
          // console.log('update-downloaded');
          // autoUpdater.quitAndInstall();
        });
      autoUpdater.checkForUpdates();
    }
    // autoUpdater -----------------------------------------------------------------------------------------------------
  });

});
