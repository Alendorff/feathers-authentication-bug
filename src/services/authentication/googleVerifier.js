const {Verifier} = require('feathers-authentication-oauth2');
const {MONGOOSE_CLIENT, USER_SERVICE} = require('../../constants');

class EmailFirstOAuth2Verifier extends Verifier {

  constructor (app, options = {}) {
    super(app, options);
  }

  verify (req, accessToken, refreshToken, profile, done) {
    const mongooseClient = this.app.get(MONGOOSE_CLIENT);
    const User = mongooseClient.model(USER_SERVICE);

    if (req.user) {
      User.findOne({googleId: profile.id}, (err, existingUser) => {
        if (err) return done(err);
        if (existingUser) {
          done(new Error(
            'There is already a Google account that belongs to you.'
          ));
        } else {
          User.findById(req.user.id, (err, user) => {
            if (err) return done(err);
            user.googleId = profile.id;
            user.save((err) => {
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({googleId: profile.id}, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({email: profile.emails[0].value},
          (err, existingEmailUser) => {
            if (err) { return done(err); }

            if (existingEmailUser) {
              existingEmailUser.googleId = profile.id;
              existingEmailUser.save((err) => {
                done(err, existingEmailUser);
              });
            } else {
              User.create({
                email: profile.emails[0].value,
                googleId: profile.id
              })
                .then(user => done(null, user))
                .catch(done);
            }
          });
      });
    }
  }
}

module.exports = EmailFirstOAuth2Verifier;
