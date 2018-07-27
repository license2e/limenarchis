'use strict';
const electron = require('electron');
const { ipcMain } = electron;
const sendResponse = require('../lib/send-response');
const PortForward = require('../lib/port-forward');
const i18n = require('../../src/i18n');

module.exports = (menuBarApp, kubectl) => {
  const portForward = new PortForward(kubectl);

  // setup to start the port-forward server
  ipcMain.on('portForwardStart', (evt, id, data) => {
    portForward.start()
      .then(() => {
        sendResponse(evt, id, 'success', true);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });

  // setup to start the port-forward server
  ipcMain.on('portForwardServices', (evt, id, data) => {
    portForward.portForward()
      .then(() => {
        sendResponse(evt, id, 'success', true);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });

  // setup to start the port-forward server
  ipcMain.on('portForwardStop', (evt, id, data) => {
    portForward.stop()
      .then(() => {
        sendResponse(evt, id, 'success', true);
      })
      .catch((err) => {
        sendResponse(evt, id, 'error', err);
      });
  });
};
