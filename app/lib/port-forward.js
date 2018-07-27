'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const { app } = electron;
const { spawn } = require('child_process');
const dgram = require('dgram');
const settings = require('./settings');
const i18n = require('../../src/i18n');

let boundPort = null;

class PortForward {
  constructor(kubectl) {
    this.kubectl = kubectl;
  }

  start() {
    return new Promise((resolve, reject) => {
      // get the port number from the settings then start the server
      settings.getSettings()
        .then(settings => {
          // console.log(settings);
          boundPort = settings['port-forward'].server.port;
          try {
            const args = [];
            // add the path to the port-forward server
            args.push(`${path.join(app.getAppPath(), 'scripts', 'port-forward-server.js')}`);
            // add base64 encoded data
            args.push(Buffer(JSON.stringify({
              port: settings['port-forward'].server.port,
            })).toString('base64'));
            const log = fs.openSync(`${path.join(app.getPath('home'), `.${app.getName()}`, 'out.log')}`, 'a');
            const pf = spawn(process.execPath, args, {
              detached: true,
              stdio: ['ignore', log, log],
            });
            // console.log(`Pid: ${pf.pid} for cmd: ${process.execPath} ${args}`);
            pf.unref();
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  portForward() {
    return new Promise((resolve, reject) => {
      if (boundPort === null) {
        return reject(new Error(i18n.errorServerNotStarted));
      }
      const client = dgram.createSocket('udp4');

      client.on('message', (msg, rinfo) => {
        const data = JSON.parse(msg);
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        client.close();
        boundPort = null;
        resolve();
      });
      client.bind();

      const message = Buffer.from(JSON.stringify({
        command: 'start',
        svcs: [{
          pod: 'service-update-deployment-3540069026-k7qr9',
          to: 9999,
          from: 80,
        }],
      }));
      client.send(message, boundPort, 'localhost', (err) => {
        if (err) {
          console.log(err);
          client.close();
          boundPort = null;
          reject(err);
        }
      });
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (boundPort === null) {
        return reject(new Error(i18n.errorServerNotStarted));
      }
      const client = dgram.createSocket('udp4');

      client.on('message', (msg, rinfo) => {
        const data = JSON.parse(msg);
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        client.close();
        boundPort = null;
        resolve();
      });
      client.bind();

      const message = Buffer.from(JSON.stringify({
        command: 'shutdown',
      }));
      client.send(message, boundPort, 'localhost', (err) => {
        if (err) {
          console.log(err);
          client.close();
          boundPort = null;
          reject(err);
        }
      });
    });
  }
}

module.exports = PortForward;
