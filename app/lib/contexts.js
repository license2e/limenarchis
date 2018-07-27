'use strict';
const settings = require('./settings');
const i18n = require('../../src/i18n');

class Contexts {
  constructor(kubectl) {
    this.kubectl = kubectl;
  }

  getContexts() {
    return new Promise((resolve, reject) => {
      const contextCmds = [];

      // get the current context
      contextCmds.push(this.kubectl.command('config current-context'));
      // get a list of all the contexts
      contextCmds.push(this.kubectl.command('config get-contexts -o name'));
      // get the labels for the contexts
      contextCmds.push(settings.getSettings());

      // process all of the promises
      Promise.all(contextCmds)
        .then(([currentContext, contextsOutput, settings]) => {
          const contextsList = [];
          // split the context list by carriage return
          const contexts = contextsOutput.data.split('\n');

          try {
            // process the contexts and labels
            contexts.forEach((name) => {
              let contextSettings = {};
              if (
                {}.hasOwnProperty.call(settings, 'contexts') === true
                && {}.hasOwnProperty.call(settings.contexts, name) === true
              ) {
                contextSettings = settings.contexts[name];
              }
              contextsList.push(Object.assign({}, contextSettings, {
                name,
              }));
            });
          } catch (err) {
            // console.log(err);
            reject(err);
          }
          resolve({
            current: currentContext.data,
            list: contextsList,
            settings,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  useContext(ctx) {
    return new Promise((resolve, reject) => {
      this.kubectl.command('config get-contexts -o name')
        .then((contextsOutput) => {
          // split the context list by carriage return
          const contexts = contextsOutput.data.split('\n');
          // double check the context name
          if (contexts.indexOf(ctx) > -1) {
            return this.kubectl.command(`config use-context ${ctx}`);
          }
          return reject(i18n.errorInvalidContextName);
        })
        .then(() => {
          return this.kubectl.command('config current-context')
        })
        .then((res) => {
          resolve({
            current: res.data,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Contexts;
