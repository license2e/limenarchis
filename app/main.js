const path = require('path');
const fs = require('fs');
const electron = require('electron');
const { app, ipcMain } = electron;
const { Menubar } = require('electron-menubar');
// const yaml = require('js-yaml');
const i18n = require('../src/i18n');
const Kubectl = require('./lib/kubectl');

// instantiate the local variables
const kubectl = new Kubectl();
const menuBarApp = new Menubar({
  tooltip: `${i18n.name} - ${i18n.description}`,
  icon: path.join(app.getAppPath(), 'iconTemplate.png'),
  // index: `file://${path.join(app.getAppPath(), '..', 'build', 'index.html')}`,
  index: 'http://localhost:3000',
  window: {
    transparent: true,
    width: 480,
    height: 380,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'addIpc.js'),
    },
  },
});
const eventsDir = path.join(__dirname, 'events');

// read in all the events files
fs.readdirSync(eventsDir).forEach((file) => {
  if (file !== '.gitkeep') {
    let eventsModule = require(path.join(eventsDir, file));
    eventsModule(menuBarApp, kubectl);
  }
});

// menuBarApp.once('after-create-window', () => {
//   menuBarApp.window.once('ready-to-show', () => {
//     wmenuBarApp.window.show();
//   });
// });
menuBarApp.on('after-create-window', () => {
  menuBarApp.window.setResizable(false);
  // menuBarApp.window.webContents.openDevTools();
});
