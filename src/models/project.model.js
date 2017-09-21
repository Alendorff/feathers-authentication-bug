const {PROJECT_SERVICE} = require('../constants');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const projectSchema = new Schema(
    {
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true,
        default: 'New project'
      },
      tables: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Table'
        }
      ],
      admins: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      index: {type: Number}
    },
    {timestamps: true}
  );

  return mongooseClient.model(PROJECT_SERVICE, projectSchema);
};
