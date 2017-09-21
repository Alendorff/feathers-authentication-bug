const restLogger = require('./restLogger');
module.exports = function () {
  const app = this;
  app.use(restLogger());
};
