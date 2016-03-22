'use strict';

var electron = require('electron');
var os = require('os');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var appName = app.getName();
var autoUpdater = require('auto-updater');


var darwinTpl = [
  {
    label: appName,
    submenu: [
      {
        label: 'About ' + appName,
        role: 'about'
      },
      {
        label: 'Check for Update...',
        enabled: true,
        click: function () {
          console.log(' clicked updater ');
          autoUpdater.checkForUpdates();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + appName,
        accelerator: 'Cmd+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Cmd+Shift+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit ' + appName,
        accelerator: 'Cmd+Q',
        click: function () {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Cmd+F',
        click: function () {
          var window = BrowserWindow.getAllWindows()[0];
          window.setFullScreen(!window.isFullScreen());
        }
      }
    ]
  },
  {
    label: 'Help',
    role: 'help'
  }
];


var tpl;
if (process.platform === 'darwin') {
  tpl = darwinTpl;
}

module.exports = {
  mainMenu: Menu.buildFromTemplate(tpl)
};