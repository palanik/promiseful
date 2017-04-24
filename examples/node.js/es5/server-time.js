// var Promise = require('bluebird');
var Promise = require('es6-promise');
// var Promise = require('pinkie-promise');

// var promiseful = require('../../../lib/');
// promiseful.promise(Promise);
var promiseful = require('../../../lib/').promise(Promise);

var https = require('https');

var sites = {
  'Google': 'www.google.com',
  'Bing': 'www.bing.com',
  'Yahoo': 'www.yahoo.com'
};

var funcs = Object.keys(sites).map(function (s) {
  return function () {
    return new Promise(function (resolve, reject) {
      var req = https.request({
        hostname: sites[s],
        port: 443,
        path: '/',
        method: 'HEAD'
      }, function (response) {
        var result = {};
        result[s] = response.headers['date'];
        return resolve(result);
      });

      req.on('error', reject);
      req.end();
    });
  };
});

promiseful.parallelLimit(funcs, 2)
.then(console.log)
.catch(console.error);
