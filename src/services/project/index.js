// Initializes the `project` service on path `/project`
const createService = require('feathers-mongoose');
const createModel = require('../../models/project.model');
const hooks = require('./project.hooks');
const filters = require('./project.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'project',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/project', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('project');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
