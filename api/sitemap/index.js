(function() {
  'use strict';

  var express = require('express');
  var controller = require('./sitemap.controller');

  var router = express.Router();

  router.get('/', controller.index);
  router.get('/:url', controller.getSitemap);

  module.exports = router;
})();