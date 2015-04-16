var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('build', ['less']);

gulp.task('less', function () {
    return gulp.src('_less/app.less')
        .pipe(less({paths: ['less']}))
        // .pipe(rename('dist.css'))
        .pipe(gulp.dest('assets'));
});
