var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var markdown = require('gulp-markdown');
var nunjucks = require('nunjucks');
var map = require('map-stream');
var argv = require('yargs').argv;
var slug = require('slug');
var fs = require('fs');
var _ = require('lodash');

gulp.task('build', ['less', 'index']);

gulp.task('less', function () {
    return gulp.src('_less/app.less')
        .pipe(less({paths: ['less']}))
        // .pipe(rename('dist.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('index', function () {
    nunjucks.configure('_templates');

    return gulp.src('_templates/index.html')
        .pipe(map(function(file, cb) {
            nunjucks.renderString(file.contents.toString(), function (err, res) {
                file.contents = new Buffer(res);
                cb(null, file);
            });
        }))
        .pipe(gulp.dest(''));
});

gulp.task('articles', function () {
    var articles = require('./_articles.json');

    return gulp.src('_articles/published/*.md')
        .pipe(markdown({gfm: true}))
        .pipe(map(function (file, cb) {
            // _.
            console.log(file.cwd);
            cb(null, file);
        }));
});

gulp.task('createArticle', function (done) {
    if (!argv.name) {
        done("Missing article name");
        return;
    }

    var articles = require('./_articles.json');
    var slugName = slug(argv.name).toLowerCase();

    if(_.find(articles, {name: slugName})) {
        done("Article name already exists");
        return;
    }

    articles.push({
        name: slugName,
        published: false
    });

    fs.writeFile('_articles/unpublished/' + slugName + '.md', '#' + argv.name, function (err) {
        if (err) done(err);
        fs.writeFile('_articles.json', JSON.stringify(articles), done);
    });
});

gulp.task('deleteArticle', function (done) {
    if (!argv.name) {
        done("Missing article name");
        return;
    }

    var articles = require('./_articles.json');
    var slugName = slug(argv.name).toLowerCase();

    if(!_.find(articles, {name: slugName})) {
        done("Article name not found");
        return;
    }

    // Delete article
});
