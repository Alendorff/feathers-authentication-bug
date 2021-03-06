const createService = require('feathers-mongoose');

const {USER_SERVICE } = require('../../constants');
const createModel = require('../../models/user.model');
const hooks = require('./user.hooks');
const filters = require('./user.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: USER_SERVICE,
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service(USER_SERVICE);

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
