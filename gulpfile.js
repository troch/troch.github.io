var gulp = require('gulp');
var less = require('gulp-less');
var del  = require('rimraf');
var html2js = require('gulp-ng-html2js');
var concat = require('gulp-concat');

gulp.task('less', function () {
    return gulp.src('_less/app.less')
        .pipe(less({paths: ['less']}))
        // .pipe(rename('dist.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('cleanDist', function (done) {
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

gulp.task('cleanPosts', function (done) {
    del('posts/', done);
});

gulp.task('deploy', gulp.series(
    'cleanPosts',
    gulp.parallel('less', 'copyPosts', 'copyAssets'),
    'cleanDist'
));

gulp.task('html2js', function () {
    return gulp.src('./angular-multi-step-form/*/**/*.html')
        .pipe(html2js({
            moduleName: 'msfDemo',
            declareModule: false,
            prefix: "/angular-multi-step-form/"
        }))
        .pipe(concat('partials.js'))
        .pipe(gulp.dest('angular-multi-step-form/scripts'));
});
