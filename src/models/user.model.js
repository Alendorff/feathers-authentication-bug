const {isEmail} = require('validator');
const {USER_SERVICE} = require('../constants');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const userSchema = new mongooseClient.Schema(
    {
      email: {
        type: String,
        required: true,
        validate: {
          isAsync: false,
          validator: isEmail,
          message: '{VALUE} is not a valid email'
        }
      },
      password: {type: String},
      photo: {type: String},
      googleId: {type: Number}
    },
    {timestamps: true}
  );

  userSchema.index({email: 1}, {unique: true});
  userSchema.index({google: 1}, {unique: true, sparse: true});

  return mongooseClient.model(USER_SERVICE, userSchema);
};
