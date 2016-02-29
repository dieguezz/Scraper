(function() {
  'use strict';
  var Crawler = require('simplecrawler');

  exports.getLinksFromUrl = function() {
    // var crawler = new Crawler();
    return Crawler.crawl('www.mimetix.com');

  };

})();