const morgan = require('morgan');

const log = require('../utils/logger');

module.exports = function restLogger () {
  return morgan('dev', {
    stream: {
      write: (msg) => log.info(msg)
    }
  });
};
