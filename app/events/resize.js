'use strict';
const electron = require('electron');
const { ipcMain } = electron;
const sendResponse = require('../lib/send-response');
const i18n = require('../../src/i18n');

module.exports = (menuBarApp, kubectl) => {
  // setup to resize the window
  ipcMain.on('resizeWindow', (evt, id, size) => {
    menuBarApp.window.setContentSize(size.width, size.height);
    sendResponse(evt, id, 'success', i18n.windowResized);
  });
};
