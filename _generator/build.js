var Metalsmith      = require('metalsmith');
var drafts          = require('metalsmith-drafts');
var markdown        = require('metalsmith-markdown');
var permalinks      = require('metalsmith-permalinks');
var templates       = require('metalsmith-templates');

var noop = function(err) {
    if (err) throw err;
};

Metalsmith(__dirname)
  .use(drafts())
  .use(markdown())
  .use(permalinks('posts/:title'))
  .use(templates({
    engine: 'nunjucks',
    directory: 'templates'
  }))
  .destination('../build')
  .build(noop);
