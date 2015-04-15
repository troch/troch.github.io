var Metalsmith      = require('metalsmith');
var drafts          = require('metalsmith-drafts');
var markdown        = require('metalsmith-markdown');
var permalinks      = require('metalsmith-permalinks');
var templates       = require('metalsmith-templates');
var nunjucks        = require('nunjucks');
var _               = require('lodash');
var fs              = require('fs');

var noop = function(err) {
    if (err) throw err;
};

nunjucks.configure(__dirname + '/templates', {watch: false});

Metalsmith(__dirname)
  .use(drafts())
  .use(markdown())
  .use(permalinks('posts/:title'))
  .use(function (files, metalsmith, done) {
    for (file in files) {
        files[file].contents = new Buffer(
            nunjucks.render(__dirname + '/templates/index.html', {contents: files[file].contents.toString()})
        );
    };
    done();
  })
  .destination('../build')
  .build(noop);
