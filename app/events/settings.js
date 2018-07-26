'use strict';
const electron = require('electron');
const { ipcMain } = electron;
const settings = require('../lib/settings');
const sendResponse = require('../lib/send-response');
const i18n = require('../../src/i18n');

module.exports = (menuBarApp, kubectl) => {
  // setup to save settings
  ipcMain.on('saveSettings', (evt, id, data) => {
    settings.saveSettings(data)
      .then(() => {
        sendResponse(evt, id, 'success', true);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });
};
