const mongoose = require('mongoose');

const log = require('./utils/logger');
const RETRY_TIMEOUT = 3000;

module.exports = function () {
  const app = this;
  mongoose.Promise = global.Promise;
  const options = {
    autoReconnect: true,
    useMongoClient: true,
    keepAlive: 30000,
    reconnectInterval: RETRY_TIMEOUT,
    reconnectTries: 10000
  };

  let isConnectedBefore = false;

  const connect = function () {
    return mongoose.connect(app.get('mongodb'), options)
      .catch(err => log.error('Mongoose connect(...) failed with err: ', err));
  };

  connect();

  mongoose.connection.on('error', function () {
    log.error('Could not connect to MongoDB');
  });

  mongoose.connection.on('disconnected', function () {
    log.error('Lost MongoDB connection...');
    if (!isConnectedBefore) {
      setTimeout(connect, RETRY_TIMEOUT);
    }
  });
  mongoose.connection.on('connected', function () {
    isConnectedBefore = true;
    log.info('Connection established to MongoDB');
  });

  mongoose.connection.on('reconnected', function () {
    log.info('Reconnected to MongoDB');
  });

  app.set('mongooseClient', mongoose);
};
