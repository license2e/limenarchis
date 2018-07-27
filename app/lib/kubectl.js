'use strict';
const { spawnSync, spawn } = require('child_process');

class Kubectl {
  constructor(options = {}) {
    this.binary = options.binary || 'kubectl';
  }

  command(argsInput) {
    let args = argsInput;
    let cmdSpawn = null;
    // if a string is passed in, split into array
    if (typeof(argsInput) === 'string') {
      args = argsInput.split(' ')
    }

    return new Promise((resolve, reject) => {
      let error = null;

      cmdSpawn = spawnSync(this.binary, args);

      if (cmdSpawn.error) {
        const err = new Error(cmdSpawn.error);
        err.code = cmdSpawn.status;
        return reject(err);
      }

      const stdout = cmdSpawn.stdout.toString();
      const stderr = cmdSpawn.stderr.toString();

      if (stderr === '') {
        let data = stdout.trim();
        if (data.indexOf('command not found') > -1) {
          const err = new Error(data);
          err.code = cmdSpawn.status;
          return reject(err);
        }

        try {
          const checkArgs = args.join(' ');
          if (
            checkArgs.indexOf('--output=json') > -1
            || checkArgs.indexOf('-o json') > -1
          ) {
            data = JSON.parse(data);
          }
          return resolve({data, code: cmdSpawn.status});
        } catch(err) {
          err.code = cmdSpawn.status;
          return reject(err);
        }
      }

      const err = new Error(stderr);
      err.code = cmdSpawn.status;
      return reject(err);
    })
  }

  portForward(svcs) {
    const ret = [];
    svcs.forEach(svc => {
      let args = ['port-forward', svc.pod, `${svc.to}:${svc.from}`];
      if ({}.hasOwnProperty.call(svc, 'namespace') === true) {
        args.push('-n');
        args.push(svc.namespace);
      }
      if ({}.hasOwnProperty.call(svc, 'context') === true) {
        args.push('--context');
        args.push(svc.context);
      }
      const pf = spawn(this.binary, args);
      pf.stdout.on('data', (data) => {
        console.log(`[${pf.pid}] stdout: ${data}`);
      });
      pf.stderr.on('data', (data) => {
        console.log(`[${pf.pid}] stderr: ${data}`);
      });
      pf.on('close', (code) => {
        console.log(`[${pf.pid}] child process exited with code ${code}`);
      });
      ret.push(pf);
    });
    return ret;
  }
}

module.exports = Kubectl;
