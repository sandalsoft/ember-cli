'use strict';

var assert           = require('../../../helpers/assert');
var LiveReloadServer = require('../../../../lib/tasks/server/livereload-server');
var MockUI           = require('../../../helpers/mock-ui');

describe('livereload-server', function() {
  var subject;

  beforeEach(function() {
    subject = new LiveReloadServer({
      ui: new MockUI()
    });
  });

  it('returns immediately if `liveReload` option is false', function() {
    return subject.start({
        liveReload: false
      })
      .then(function(result) {
        assert.equal('live-reload is disabled', result);
      });
  });
});
