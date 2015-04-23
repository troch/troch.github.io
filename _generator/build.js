var Metalsmith      = require('metalsmith');
//  Metalsmith plugins
var drafts          = require('metalsmith-drafts');
var markdown        = require('metalsmith-markdown');
var permalinks      = require('metalsmith-permalinks');
var collections     = require('metalsmith-collections');
var feed            = require('metalsmith-feed');
var excerpts        = require('metalsmith-excerpts');
var minify          = require("metalsmith-html-minifier");
var beautify        = require('metalsmith-beautify');
// Other modules
var nunjucks        = require('nunjucks');
var _               = require('lodash');
var fs              = require('fs');

// Build
Metalsmith(__dirname)
    .metadata({
        site: {
            title:  'React and be thankful',
            description: 'A blog about building (reactive) web applications',
            url:    'http://blog.reactandbethankful.com',
            author: 'Thomas Roch'
        }
    })
    .use(drafts())
    .use(githubLink())
    .use(collections({posts: '*.md'}))
    .use(fileStats())
    .use(markdown({gfm: true}))
    .use(excerpts())
    .use(replaceCodeLanguage())
    .use(formatDate())
    .use(permalinks('posts/:year/:month/:day/:title'))
    .use(template())
    .use(feed({collection: 'posts'}))
    .use(generateIndex())
    .use(minify({removeAttributeQuotes: false, removeComments: false}))
    .use(beautify())
    .use(debug())
    .destination('../dist')
    .build(noop);



// Configure nunjucks
var env = nunjucks.configure(__dirname + '/templates', {watch: false});
env.addFilter('maxLength', function(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 9) + '&hellip;';
});
// Template Data
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
var siteTitle = 'React and be thankful';
var siteDescription = 'A blog about building reactive web applications';
var siteUrl = 'http://blog.reactandbethankful.com';

// Functions
function noop(err) {
    if (err) throw err;
}

function githubLink() {
    return function (files, metalsmith, done) {
        for (file in files) {
            files[file].mdLink = 'https://github.com/troch/troch.github.io/tree/master/_generator/src/' + file;
        }
        done();
    };
}

function replaceCodeLanguage() {
    return function (files, metalsmith, done) {
        for (file in files) {
            files[file].contents = new Buffer(
                files[file].contents.toString()
                    .replace(/<code>/g, '<code class="nohighlight">')
                    .replace(/<code class="lang-/g, '\<code class="')
            );
        };
        done();
    };
}

function formatDate() {
    return function (files, metalsmith, done) {
        for (file in files) {
            files[file].year = files[file].date.getFullYear().toString();
            files[file].month = formatNumber(files[file].date.getMonth() + 1);
            files[file].day = formatNumber(files[file].date.getDate());
        };
        done();
    };
}

function template() {
    return function (files, metalsmith, done) {
        for (file in files) {
            if (files[file].collection && files[file].collection.indexOf('posts') !== -1) {
                files[file].contents = new Buffer(
                    nunjucks.render(__dirname + '/templates/article.html', {
                        styleSheets: styleSheets,
                        scriptsSrc: scriptsSrc,
                        scripts: scripts,
                        contents: files[file].contents.toString(),
                        title: files[file].title + ' | ' + siteTitle,
                        description: files[file].excerpt.replace(/<\/?[^>]+(>|$)/g, "").trim().replace('\n', ''),
                        url: siteUrl + '/' + files[file].path,
                        isArticle: true,
                        modifiedTime: files[file].modifiedTime.toISOString(),
                        publishedTime: files[file].date.toISOString(),
                        tags: (files[file].tags || '').split(','),
                        sections: files[file].sections || [],
                        image: files[file].image,
                        mdLink: files[file].mdLink,
                        next: files[file].next,
                        previous: files[file].previous
                    })
                );
            }
        };
        done();
    };
}

function formatNumber(number) {
    if (number.toString().length === 2) {
        return number.toString();
    }
    return "0" + number.toString();
}

function fileStats() {
    return function (files, metalsmith, done) {
        for (file in files) {
            if (files[file].collection && files[file].collection.indexOf('posts') !== -1) {
                files[file].modifiedTime = fs.statSync(__dirname + '/' + metalsmith._source + '/' + file).mtime;
            }
        }
        done();
    }
}

function generateIndex() {
    return function (files, metalsmith, done) {
        var indexPage = nunjucks.render(__dirname + '/templates/index.html', {
            styleSheets: styleSheets,
            scriptsSrc: scriptsSrc,
            scripts: scripts,
            posts: _.sortBy(files, 'date').reverse(),
            title: siteTitle,
            description: siteDescription,
            url: siteUrl,
            isArticle: false
        });
        files['index.html'] = {
            mode: '0666',
            contents: new Buffer(indexPage),
            path: ''
        };
        done();
    };
}

function debug() {
    return function (files, metalsmith, done) {
        for (file in files) {
            // console.log(files[file].previous.path);
            console.log(file);
        }
        done();
    }
}
