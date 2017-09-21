const authentication = require('./authentication');
const user = require('./user');
const project = require('./project');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(user);
  app.configure(authentication);
  app.configure(project);
};
