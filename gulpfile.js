var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('build', ['less', 'copy']);

gulp.task('less', function () {
    return gulp.src('_less/app.less')
        .pipe(less({paths: ['less']}))
        // .pipe(rename('dist.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('copy', ['less'], function () {
    return gulp.src('assets/**/*.*')
        .pipe(gulp.dest('dist/assets'));
});
