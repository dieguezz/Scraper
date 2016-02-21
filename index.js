var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var Sitemap = require('./api/sitemap/sitemap.model');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

var port = process.env.PORT || 8000;

require('./routes')(app);

mongoose.connect('mongodb://localhost/scraper-dev'); // connect to our database

mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

app.listen(port);