'use strict';

var Promise = require('../../ext/promise');
var tinylr  = require('tiny-lr');
var chalk   = require('chalk');
var Task    = require('../../models/task');

module.exports = Task.extend({
  init: function() {
    this.liveReloadServer = new tinylr.Server();
    var bound = this.liveReloadServer.listen.bind(this.liveReloadServer);
    this.listen = Promise.denodeify(bound);
  },

  start: function(options) {
    if (!options.liveReload) {
      return Promise.resolve('live-reload is disabled');
    }

    // Reload on file changes
    this.watcher.on('change', this.didChange.bind(this)).
                 on('error',  this.didError.bind(this));

    // Start LiveReload server
    return this.listen(options.liveReloadPort)
      .then(this.writeBanner.bind(this, options));
  },

  writeBanner: function(options) {
    this.ui.write('Livereload server on port ' + options.liveReloadPort + '\n');
  },

  didChange: function() {
    this.liveReloadServer.changed({
      body: {
        files: ['LiveReload files']
      }
    });

    this.analytics.track({
      name:    'broccoli watcher',
      message: 'live-reload'
    });
  },

  didError: function(error) {
    this.ui.write(chalk.red(error.message) + '\n' + error.stack + '\n');

    this.analytics.trackError({
      description: error.message + ' ' + error.stack,
      isFatal:     false
    });
  }
});
