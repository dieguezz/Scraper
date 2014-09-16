// Node Modules
var express = require('express');
var Promise = require("bluebird");
var dedupe = require('dedupe');
var app = express();
    
    // Set view engine, views and public folders
    app.set('view engine', 'ejs');  
    app.set('views', __dirname + '/views');  
    app.use('/public', express.static(__dirname + '/public'));

// Path for each site scraper
var diotronic = './data/diotronic-results.json';
var bricogeek = './data/bricogeek-results.json';

// Home
app.get('/', function(req, res) {
    res.render('index');
});

// Diotronic home
app.get('/diotronic', function(req, res) {
    var functions = require("./functions.js");
    res.render('show', {data: functions.getData(diotronic), site: '/diotronic'});
});

// Bricogeek home
app.get('/bricogeek', function(req, res) {
    var functions = require("./functions.js");
    res.render('show', {data: functions.getData(bricogeek), site: '/bricogeek'});
});

app.get('/bricogeek/clean', function(req, res) {
    var functions = require("./functions.js");
    var _ = require('lodash');
    functions.changeFreq(bricogeek)

    .then(function(data){
        data.map(function(e){
            return e;
        });
    })
    .then(function(changes){
        var ordered = _.sortBy(changes, 'changes');
        return ordered;
    })
    .then(function(ordered){
        console.log(ordered)
    });


});

// Bricogeek /scan
app.get('/bricogeek/scan', function(req, res) {
    var functions = require("./functions.js");
    var scrape = require("./scrapers/bricogeek.js");
    scrape.scrapeBrico
    // Remove duplicates in array data
    .then(dedupe)
    // Save 
    .then(functions.bricoGeek)
    .then( function () { console.log("Guardado") })
    .then( function () { res.redirect('/') });
});

// Diotronic /scan
app.get('/diotronic/scan', function(req, res) {
    var functions = require("./functions.js");
    var scrape = require("./scrapers/diotronic.js");
    scrape.scrapeDio
    // Remove duplicates in array data
    .then(dedupe)
    // Save 
    .then (functions.dioTronic)
    .then( function () { console.log("Guardado") })
    .then( function () { res.redirect('/') });
});

app.listen(process.env.PORT);
