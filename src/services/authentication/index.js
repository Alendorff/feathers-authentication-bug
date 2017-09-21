const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');
const oauth2 = require('feathers-authentication-oauth2');
const GoogleStrategy = require('passport-google-oauth20');

const EmailFirstOAuth2Verifier = require('./googleVerifier');
const {AUTH_SERVICE } = require('../../constants');
// const googleAuthHandler = require('./google');

module.exports = function () {
  const app = this;
  const config = app.get(AUTH_SERVICE);

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  app.configure(oauth2(Object.assign({
    name: 'google',
    Strategy: GoogleStrategy,
    Verifier: EmailFirstOAuth2Verifier,
    successRedirect: '/',
    failureRedirect: '/signin',
  }, config.google)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service(AUTH_SERVICE).hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
