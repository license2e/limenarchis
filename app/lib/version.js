'use strict';

class Version {
  constructor(kubectl) {
    this.kubectl = kubectl;
  }

  getVersion() {
    return new Promise((resolve, reject) => {
      this.kubectl.command('version -o json')
        .then((version) => {
          resolve({
            version: version.data,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Version;
