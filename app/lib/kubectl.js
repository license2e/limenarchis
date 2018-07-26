'use strict';
const { spawnSync } = require('child_process');

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

      cmdSpawn = spawnSync(this.binary, args)

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
}

module.exports = Kubectl;
