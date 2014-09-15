var db = require('somewhere');
// Path for each site scraper
var diotronic = './data/diotronic-results.json';
var bricogeek = './data/bricogeek-results.json';



module.exports = {
    // Save results scraped to JSON database
    saveJSON: function (products, site) {
        // Date
        var currentTime = new Date();
        var date = currentTime.getDate() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getFullYear() + ":" + currentTime.getHours() + ":" + currentTime.getMinutes();

        var Promise = require("bluebird");
        // Map products
        var productsPromises = products.map(function(product) {
            var title = product['Title'];
            var stock = product['Stock'];
            var price = product['Price'];
            
            if (stock == "Disponible") {
                stock = 1;
            } else {
                stock = 0;
            }
            // Contents to push to results
            var toPush = {Stock: stock, Price: price, Fecha: date};
            
            // Final results to save
            var results = {Title: title, Results: [toPush]};
            
            // Connecto to database
            db.connect(site);
            
            // Find title match between already saved and new scrape
            var find = db.find('Productos', {Title: title});
            
            return find.map(function(el){
                // Get data already stored and update it with new
                el.Results.push(toPush);
                // update database.
                return db.update('Productos', el.id ,el);
            });
        });
        return Promise.all(productsPromises);
    },

    // Pass site to saveJSON
    bricoGeek: function (prevParam){
        module.exports.saveJSON(prevParam, bricogeek);
    },
    dioTronic: function (prevParam){
        module.exports.saveJSON(prevParam, diotronic);
    },
    
    // Get data from databa
    getData: function (site) {
        db.connect(site);
        var find = db.find('Productos', null);
        if (find) {
            return find.map(function(el){
                    return el;
                });
            } 
    },
    
    cleanData: function (site) {
        var data = module.exports.getData(site);
        if (data) {
            return console.log(data);
        }
    }
};