(function() {
  'use strict';
  var crawler = require('../../components/crawler');
  var Sitemap = require('./sitemap.model');

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
    // var testCrawler = crawler.getLinksFromUrl();
    var Crawler = require('simplecrawler');
    var myCrawler = new Crawler('www.zentorrents.com');
    myCrawler.initialProtocol = 'http';
    myCrawler.initialPort = 80;
    myCrawler.maxConcurrency = 1;
    myCrawler.interval = 120;
    myCrawler.timeout = 1000;
    myCrawler.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36';
    myCrawler.filterByDomain = true;
    myCrawler.initialPath = '/series';
    // var conditionID = myCrawler.addFetchCondition(function(parsedURL, queueItem) {
    //   if (parsedURL.path.match('publicidad-sem')) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    var urls = [];
    var i = 0;
    myCrawler.on("fetchcomplete", function(link) {
      if (link.url.match('series/')) {
        urls.push(link.url);
        i++;
        console.log('URL:', i, link.url);
      }

      // res.send(link);
    });

    myCrawler.on('queueerror', function(err) {
      console.log('error', err);
    });

    myCrawler.on('complete', function() {
      res.send(urls);
    });
    myCrawler.start();
  };
})();