(function() {
  'use strict';

  var request = require('request-promise');
  var cheerio = require('cheerio');
  var Q = require('bluebird');

  function isInternalLink(domain, url, protocol) {
    if (url.indexOf(domain) > -1 || isSameProtocol(url, protocol) === true && url.substring(0, 1) !== '#' && url.substring(0, 4) !== 'tel:' && url.substring(0, 7) !== 'mailto:') {
      return true;
    } else {
      return false;
    }
  }

  function isSameProtocol(url, protocol) {
    var httpsGuess = url.substring(0, 5);
    var httpGuess = url.substring(0, 4);
    if (httpsGuess === 'https') {
      return protocol === httpsGuess;
    } else if (httpGuess === 'http') {
      return protocol === httpsGuess;
    } else {
      return true;
    }
  }

  function cleanUrl(url) {
    function _removeInitialSlashes() {
      if (url.substring(0, 1) === '/' | url.substring(0, 1) === ':') {
        url = url.substring(1);
        _removeInitialSlashes();
      }
    }

    function _removeProtocol(protocol) {
      var protocolLength = protocol.length + 1;
      if (url.substring(0, protocolLength) === protocol) {
        url = url.substring(0, protocolLength);
      }
    }

    _removeProtocol('https');
    _removeProtocol('http');
    _removeInitialSlashes();

    return url;
  }

  function normalizeUrl(url, domain, protocol) {

    url = cleanUrl(url);

    url = protocol += '://' + domain + '/' + url;

    return url;
  }

  function findHrefs(html, domain, protocol) {
    var dfd = Q.defer();
    var $ = cheerio.load(html);
    var linkElments = $('a');
    var hrefs = [];
    linkElments.each(function(i) {
      var href = $(this).attr('href');

      if (hrefs.indexOf(href) === -1 && isInternalLink(domain, href, protocol)) {
        hrefs.push(href);
      }
      if (i === linkElments.length - 1) {
        dfd.resolve(hrefs);
      }
    });
    return dfd.promise;
  }

  function normalizeUrlList(list, domain, protocol) {
    var urlList = [];
    var length = list.length;
    var dfd = Q.defer();
    for (var i = 0; i < length; i++) {
      var url = normalizeUrl(list[i], domain, protocol);
      urlList.push(url);
      if (i === length - 1) {
        dfd.resolve(urlList);
      }
    }
    return dfd.promise;
  }

  function crawlSingleUrl(domain, url, protocol) {
    return request(url).then(function(html) {
      var allUrls = [];
      return findHrefs(html, domain, protocol).then(function(hrefs) {
        return normalizeUrlList(hrefs, domain, protocol);
      });
    }, function(err) {
      throw 'There was an error requesting url: ' + err;
    });
  }

  function crawlFullSite(domain, protocol) {
    var crawledUrls = [];
    var linkList = [];
    return crawlSingleUrl(domain, url, protocol).then(function(linkList) {
      return Q.map(linkList, function(link) {
        if (crawledUrls.indexOf(link) === -1) {
          crawledUrls.push(link);
          return crawlSingleUrl(domain, link, protocol);
        }
      });
    });
  }

  exports.getLinksFromUrl = function(req, res) {
    var domain = 'mimetix.com';
    var protocol = 'http';
    return crawlSingleUrl(domain, protocol + '://' + domain, protocol).then(function(data) {
      return data;
    });
  };

})();