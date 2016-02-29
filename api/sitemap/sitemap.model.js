var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SitemapSchema = new Schema({
  url: String
});

module.exports = mongoose.model('Sitemap', SitemapSchema);