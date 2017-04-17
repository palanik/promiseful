const promiseful = require('./promiseful');

export default promiseful;
module.exports = promiseful.default;

/*
console.log(
  Object.getOwnPropertyNames(Promiseful)
  .filter(prop => typeof Promiseful[prop] === "function")
);
*/
