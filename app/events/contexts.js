'use strict';
const electron = require('electron');
const { ipcMain, shell } = electron;
const Contexts = require('../lib/contexts');
const sendResponse = require('../lib/send-response');
const i18n = require('../../src/i18n');

module.exports = (menuBarApp, kubectl) => {
  const contexts = new Contexts(kubectl);

  // setup to open external link
  ipcMain.on('getContexts', (evt, id) => {
    contexts.getContexts()
      .then((contextsData) => {
        sendResponse(evt, id, 'contexts', contextsData);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });

  // setup to open external link
  ipcMain.on('useContext', (evt, id, ctx) => {
    contexts.useContext(ctx)
      .then((contextsData) => {
        sendResponse(evt, id, 'contexts', contextsData);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });
};
