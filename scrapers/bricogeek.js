// Modules
var Promise = require("bluebird");
var request = Promise.promisify(require('request'));
var cheerio = require('cheerio');
var flatten = function(xs){return xs.reduce(function(a, b){return a.concat(b)}, []);}
var urls = ['http://www.bricogeek.com/shop/14-o?n=5000',
'http://www.bricogeek.com/shop/14-o?n=5000',
'http://www.bricogeek.com/shop/5-o?n=5000',
'http://www.bricogeek.com/shop/26-o?n=5000',
];

// Scraping urls
function scrapeBrico(urls) {
    var data = [];
    var urlPromises = urls.map(function(url) {
        return request(url).spread(function(response, html){
            if (response.statusCode == 200) {
                var $ = cheerio.load(html);
                var elements = $('li.ajax_block_product').toArray();
                // Items to scrape
                return elements.map(function(el, index){
                    var title = $(el).find('h3 a').text();
                    var stock = $(el).find('h3').next().attr('alt');
                    var price = parseFloat($(el).find('span.price').text().replace(/\€|,/g, '.'));
                    // Push items into data array
                    return {Title: title, Stock: stock, Price: price};
                });
            }
            else {
                return [];
            }
        }, function(error){
            console.log("Error");
            return [];
        });
    });
    return Promise.all(urlPromises).then(flatten);
}

module.exports.scrapeBrico = scrapeBrico(urls);