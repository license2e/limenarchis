'use strict';
const electron = require('electron');
const { ipcMain, shell } = electron;
const sendResponse = require('../lib/send-response');
const i18n = require('../../src/i18n');

module.exports = (menuBarApp, kubectl) => {
  // setup to open external link
  ipcMain.on('openExternalLink', (evt, id, url) => {
    shell.openExternal(url);
    sendResponse(evt, id, 'success', i18n.linkOpened);
  });
};
