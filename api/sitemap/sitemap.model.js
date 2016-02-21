var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SitemapSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Sitemap', SitemapSchema);