'use strict';
const electron = require('electron');
const { ipcMain } = electron;
const Version = require('../lib/version');
const sendResponse = require('../lib/send-response');
const i18n = require('../../src/i18n');

module.exports = (menuBarApp, kubectl) => {
  const version = new Version(kubectl);
  // setup to get version
  ipcMain.on('getVersion', (evt, id) => {
    version.getVersion()
      .then((versionData) => {
        sendResponse(evt, id, 'version', versionData);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });
};
