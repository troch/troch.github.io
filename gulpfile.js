var gulp = require('gulp');
var less = require('gulp-less');
var del  = require('rimraf')

gulp.task('build', ['less', 'copyPosts', 'copyAssets']);

gulp.task('less', function () {
    return gulp.src('_less/app.less')
        .pipe(less({paths: ['less']}))
        // .pipe(rename('dist.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('cleanDist', ['build'], function (done) {
    del('dist/', done);
});

gulp.task('copyAssets', function () {
    return gulp.src('./bower_components/kefir/dist/kefir.min.js')
        .pipe(gulp.dest('./'))
});

gulp.task('copyPosts', function () {
    return gulp.src('./dist/**/*.*')
        .pipe(gulp.dest('./'));
});

gulp.task('deploy', function (done) {
    del('posts/', function () {
        gulp.start('cleanDist', done);
    });
});
