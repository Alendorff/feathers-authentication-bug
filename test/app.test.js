const assert = require('assert');
const rp = require('request-promise');
const app = require('../src/app');

describe('Feathers application tests', () => {
  const port = app.get('port');

  before(function(done) {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  describe('404', function() {
    it('shows a 404 JSON error without stack trace', () => {
      return rp({
        url: `http://localhost:${port}/path/to/nowhere`,
        json: true
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.equal(res.error.code, 404);
        assert.equal(res.error.message, 'Page not found');
        assert.equal(res.error.name, 'NotFound');
      });
    });
  });
});
