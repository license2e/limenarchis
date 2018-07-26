'use strict';
const electron = require('electron');
const { app } = electron;
const path = require('path');
const fs = require('fs');

const SETTINGS_PATH = path.join(app.getPath('home'), `.${app.getName()}`);
const SETTINGS_FILE_PATH = path.join(SETTINGS_PATH, 'settings.json');

const saveSettings = (data) => {
  return new Promise((resolve, reject) => {
    // make the settings directory
    try {
      fs.statSync(SETTINGS_PATH);
    } catch (err) {
      console.log(err);
      fs.mkdirSync(SETTINGS_PATH);
    }

    // save the file
    try {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(data), 'utf8');
      return resolve({
        success: true,
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const getSettings = () => {
  return new Promise((resolve) => {
    let settingsContent = {};
    try {
      settingsContent = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
      resolve(settingsContent);
    } catch (err) {
      console.log(err);
      return saveSettings({})
        .then(() => {
          resolve('{}')
        });
    }
  })
    .then((settingsContent) => {
      try {
        return Promise.resolve(JSON.parse(settingsContent));
      } catch (err) {
        return Promise.reject(err);
      }
    });
};

module.exports = {
  SETTINGS_PATH,
  SETTINGS_FILE_PATH,
  getSettings,
  saveSettings,
};
