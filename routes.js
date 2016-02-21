(function() {
  'use strict';

  var path = require('path');

  module.exports = function(app) {

    app.use(function(req, res, next) {
      console.log('Something is going on...');
      next();
    });

    app.use('/api/sitemap', require('./api/sitemap'));
  };
})();