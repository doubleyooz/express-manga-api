const fs = require('fs');

const messages = JSON.parse(fs.readFileSync(__dirname + '/message.json'));

const getMessage = (path) => {
  return messages[path] || null;
};

module.exports = { getMessage };