var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var nunjucks = require('nunjucks');
var map = require('map-stream');

gulp.task('build', ['less', 'index']);

gulp.task('less', function () {
    return gulp.src('less/app.less')
        .pipe(less({paths: ['less']}))
        // .pipe(rename('dist.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('index', function () {
    nunjucks.configure('templates');

    return gulp.src('templates/index.html')
        .pipe(map(function(file, cb) {
            nunjucks.renderString(file.contents.toString(), function (err, res) {
                file.contents = new Buffer(res);
                cb(null, file);
            });
        }))
        .pipe(gulp.dest(''));
});
