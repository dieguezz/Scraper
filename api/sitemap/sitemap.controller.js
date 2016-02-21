(function() {
  'use strict';
  var crawler = require('../../components/crawler');

  function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
      res.status(statusCode).send(err);
    };
  }


  /**
   * Get list of users
   * restriction: 'admin'
   */
  exports.index = function(req, res) {
    console.log('whoooo');
    res.status(200).send('wooooo');
  };
  exports.getSitemap = function(req, res) {
    var url = req.url;
    crawler.getLinksFromUrl().then(function(data) {
      console.log('data', data);
      res.send(data);
    });

  };
})();