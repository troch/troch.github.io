var Metalsmith      = require('metalsmith');
//  Metalsmith plugins
var drafts          = require('metalsmith-drafts');
var markdown        = require('metalsmith-markdown');
var permalinks      = require('metalsmith-permalinks');
var templates       = require('metalsmith-templates');
var metallic        = require('metalsmith-metallic');
// Other modules
var nunjucks        = require('nunjucks');
var _               = require('lodash');
var fs              = require('fs');

// Configure nunjucks
nunjucks.configure(__dirname + '/templates', {watch: false});
var styleSheets = [
    'assets/app.css',
    'http://fonts.googleapis.com/css?family=PT+Sans:400,700',
    'http://yandex.st/highlightjs/8.0/styles/default.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.5/styles/github.min.css'
    // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css.map'
];
var scriptsSrc = [
    'https://cdnjs.cloudflare.com/ajax/libs/lunr.js/0.5.7/lunr.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.5/highlight.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.5/languages/javascript.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.5/languages/css.min.js'
];
var scripts = [
    'hljs.initHighlightingOnLoad();'
];

// Build
Metalsmith(__dirname)
    .use(drafts())
    .use(markdown({
        gfm: true
    }))
    .use(replaceCodeLanguage())
    .use(permalinks('posts/:title'))
    .use(template())
    .destination('../build')
    .build(noop);

// Functions
function noop(err) {
    if (err) throw err;
}

function replaceCodeLanguage() {
    return function (files, metalsmith, done) {
        for (file in files) {
            files[file].contents = new Buffer(
                files[file].contents.toString().replace('class="lang-', 'class="')
            );
        };
        done();
    };
}

function template() {
    return function (files, metalsmith, done) {
        for (file in files) {
            files[file].contents = new Buffer(
                nunjucks.render(__dirname + '/templates/index.html', {
                    styleSheets: styleSheets,
                    scriptsSrc: scriptsSrc,
                    scripts: scripts,
                    contents: files[file].contents.toString()
                })
            );
        };
        done();
    };
}
