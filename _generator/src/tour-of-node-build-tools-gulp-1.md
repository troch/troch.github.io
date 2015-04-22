---
title: Building with Gulp 3 and 4 Part 1 Examples
draft: false
date: 2015-04-22 23:00:00
author: Thomas Roch
tags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png
---


# Building with Gulp 3 and 4 (Part 1: examples)

## Who are you Gulp?

Like [Grunt](/posts/2015/04/18/building-with-grunt-part-1/), [Gulp](http://gulpjs.com) is also a task runner but is designed to build applications using streams:
Gulp is __"the streaming build system"__ to __"automate and enhance your workflow"__.

Gulp was first released in July 2013 (v0.0.1), v3.0.0 was released in December 2013. Current version is 3.8.x released in June 2014 and Gulp 4 is now almost ready.
Before talking about what Gulp is made of, let's look at a few examples to understand Gulp's syntax.

## Gulp 3

Providing you already have a package.json file:

    $ npm install -g gulp
    $ npm install --save-dev gulp gulp-jshint gulp-concat rimraf

We installed the following plugins; `gulp-concat`, `gulp-jshint` and `rimraf`.
Let's create a `gulpfile.js` alongside our `package.json`:

```javascript
////////////////////
// Gulp 3 example //
////////////////////

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var del    = require('rimraf');

gulp.task('clean', function (done) {
    del('build', done);
});

gulp.task('buildJs', ['clean'], function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(concat())
        .pipe(gulp.dest('/build'));
});

gulp.task('copyAssets', ['clean'], function () {
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest(build/assets));
});

gulp.registerTask('build', ['buildJs', 'copyAssets']);
```

## Gulp 3 with _run-sequence_

In Gulp 3, we have to specify task depencies so our tasks are executed in the right order (with maximum concurrency). In the above example, we want to clean our build
directory and then build our application. For each task, we have to add 'clean' as a dependency which makes are build repetitive and not so practical. What if
I want to re-compile JavaScript files without running _clean_? Rather than defining dependencies, it is preferable to define each task independently and then create _orchestration_
tasks. In Gulp 3, we could use `gulp.start()` but we would quickly enter a callback hell. Instead We can use [run-sequence](https://www.npmjs.com/package/run-sequence)
to avoid to have to specify dependencies and make our build more **maintainable** and **composable**.

    $ npm install --save-dev run-sequence


```javascript
//////////////////////////////////////
// Gulp 3 example with run-sequence //
//////////////////////////////////////

var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var concat      = require('gulp-concat');
var del         = require('rimraf');
var runSequence = require('run-sequence');

gulp.task('clean', function (done) {
    del('build', done);
});

gulp.task('buildJs', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(concat())
        .pipe(gulp.dest('/build'));
});

gulp.task('copyAssets', function () {
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('build/assets'));
});

gulp.registerTask('build', function(done) {
    runSequence('clean', ['buildJs', 'copyAssets'], done);
});
```

## Gulp 4

In Gulp 4, the above example would be:

```javascript
////////////////////
// Gulp 4 example //
////////////////////

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var del    = require('rimraf');

gulp.task('clean', function (done) {
    del('build', done);
});

gulp.task('buildJs', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(concat())
        .pipe(gulp.dest('/build'));
});

gulp.task('copyAssets', function () {
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('build/assets'));
});

gulp.registerTask('build', gulp.series(
    'clean',
    gulp.parallel('buildJs', 'copyAssets');
));
```

## Splitting the gulpfile

When a build increases in complexity and size, it is a good idea to leverage Node modules for spliting up our gulpfile. There are two ways one can split
a gulpfile: by tasks or by streams. For an idea of how to split by task, you can look at [how it can be done in Grunt](/posts/2015/04/18/building-with-grunt-part-1/),
the idea is the same. I prefer to split by streams so all the task registration is done in the gulpfile and it leaves room for reusing streams or parts of a stream.
It feels anyway a lot more functional:

```
├── src
|   └── ...
├── streams
|   ├── javascript.js
|   └── assets.js
├── gulpfile.js
└── package.json
```

__javascript.js__


```javascript
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

module.exports = function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(concat())
        .pipe(gulp.dest('/build'));
};
```

__assets.js__


```javascript
var gulp = require('gulp');

module.exports = function () {
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('build/assets'));
};
```

__gulpfile.js__


```javascript
var gulp         = require('gulp');
var del          = require('rimraf');
// Streams
var jsStream     = require('./streams/javascript');
var assetsStream = require('./streams/assets')

gulp.task('clean', function (done) {
    del('build', done);
});

gulp.task('buildJs', jsStream);
gulp.task('copyAssets', assetsStream);
```
