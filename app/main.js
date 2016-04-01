'use strict';

// electron stuff
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// misc dependencies
var windowStateKeeper = require('electron-window-state');
var os = require('os');

// basic window
var mainWindow = null;
var thePage = null;
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
  // app menu ==========================================================================================================
  electron.Menu.setApplicationMenu(appMenu.mainMenu);

  // mainWindow ========================================================================================================
  mainWindow = getMainWindow();

  // mainWindow events -------------------------------------------------------------------------------------------------
  mainWindow
    .on('closed', function () {
      mainWindow = null;
    })
    .on('page-title-updated', function (event, title) {
      updateTray(title);
    })
  ;

  // thePage ===========================================================================================================
  thePage = mainWindow.webContents;

  // thePage events ----------------------------------------------------------------------------------------------------
  thePage
    .on('dom-ready', function () {
    thePage.insertCSS('.pane-list-user {padding-left: 60px;}');
    mainWindow.show();
  })
  .on('did-finish-load', function () {
    mainWindow.setTitle(app.getName()); // ja, noch einmal - sonst ist es der Titel der Website
    // autoUpdater -----------------------------------------------------------------------------------------------------
    if (process.env.NODE_ENV !== 'development') {
      autoUpdater.setFeedURL(releaseUrl);
      autoUpdater
        .on('error', function (error) {
          console.log('auto-updater on error: ', error);
        })
        .on('checking-for-update', function () {
          console.log('checking-for-update');
          appMenu.mainMenu.items[0].submenu.items[1].enabled = false;
        })
        .on('update-available', function () {
          console.log('update-available');
          appMenu.mainMenu.items[0].submenu.items[1].label = 'Downloading update...';
        })
        .on('update-not-available', function () {
          console.log('update-not-available');
          appMenu.mainMenu.items[0].submenu.items[1].label = 'No Update available...';
          appMenu.mainMenu.items[0].submenu.items[1].enabled = true;
        })
        .on('update-downloaded', function () {
          console.log('update-downloaded');
          // autoUpdater.quitAndInstall();
          appMenu.mainMenu.items[0].submenu.items[1].label = 'Download update done...';
        });
      autoUpdater.checkForUpdates();
    }
    // autoUpdater -----------------------------------------------------------------------------------------------------
  })
  ;

});

// private methods /////////////////////////////////////////////////////////////////////////////////////////////////////

function getMainWindow() {
  var mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 550
  });

  var theMainWindow = new BrowserWindow({
    title: app.getName(),
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 650,
    resizable: true,
    center: true,
    show: false,
    autoHideMenuBar: true,
    //icon: 'assets/icon.png',  für linux nen png ... also später
    titleBarStyle: 'hidden-inset'
  });

  mainWindowState.manage(theMainWindow);

  theMainWindow.loadURL(appUrl, {userAgent: userAgent});

  if (process.env.NODE_ENV === 'development') {
    theMainWindow.openDevTools({detach: true});
  }

  return theMainWindow;
}

function updateTray(title) {
  if (os.platform() === 'darwin') {
    var messageCount = (/\(([0-9]+)\)/).exec(title);
    var badgeString = messageCount ? messageCount[1] : '';
    app.dock.setBadge(badgeString);
    if (messageCount) {
      app.dock.bounce('informational');
    }
  }
}
