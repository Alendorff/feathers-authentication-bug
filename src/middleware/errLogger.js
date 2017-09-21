const logger = require('../utils/logger');

module.exports = function () {
  return function (err, req, res, next) {
    if (err.code && err.code < 500) return next(err, req, res);

    const hook = err.hook;

    if (hook) {
      let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`;
      if (hook.error) {
        logger.error(hook.error);
      }
      if (hook.type === 'error') {
        message += `: ${hook.error.message}`;
      }
      logger.debug('hook.data', hook.data);
      logger.debug('hook.params', hook.params);
      if (hook.result) {
        logger.debug('hook.result', hook.result);
      }
      logger.error(message);
    }

    logger.error(err);
    next(err, req, res);
  };
};
