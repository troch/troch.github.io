---
title: Building with Gulp 4 Part 4 Incremental builds
lunr: true
draft: false
date: 2015-05-01 15:00:00
author: Thomas Roch
metaTags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner,vinyl,vinyl-fs,npm,gulp 4,incremental build
tags: javascript,nodejs,build automation,gulpjs,incremental build
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp.png
---

# Building with Gulp 4: Incremental builds

When it comes to building an application, developers don't want to have to run a build script all the time a change is made. Build tools like Grunt, Gulp or Broccoli provide file watch capabilities to help rebuilding an application if a change is detected. But rebuilding can bring performance penalties and instead many file operations could be avoided by limiting build operations to a minimum. Sounds nice? That is what incremental builds are about.

If you are familiar with [ReactJs](https://facebook.github.io/react/), its virtual DOM performs incremental builds by applying the minimum set of changes needed to update the DOM rather than fully re-rendering an application each time something changes. ReactJs proceeds that way because DOM manipulations are expensive.

> The same logic applies for building applications: we want to reduce the number of operations needed to update a build to the minimum so we can do it faster.

Inremental builds will seek to limit:

- File **reading / writing**
- File **contents processing**


## Smarter pipelines

Limiting file operations and processing in Gulp means for `gulp.src()` to only create vinyl objects for recently modified files, for `.pipe()` to only stream files needing to be processed, and for `.dest()` to only have to write to disk files which need to be. In other words, we need to make our pipelines smarter.

In practice, incremental builds are confronted to two scenarios:

- `1:1` transformations (mapping a list of files: linting, copying, etc...)
- `MANY:1` transformations (reducing a list of files: concatenation, compilation, etc...)

The first case is quite straight forward: files can be transformed in isolation and we only need to process recently changed or created source files. The second case is different because we need all files (recently changed or not) in order to proceed. For example with concatenation, if one file changes the whole concatenation needs to be done again. So where can we optimise? When we concat files, we have to read all the files from disk, concat their contents into one buffer (or string) and then write the result to disk. We cannot avoid having to concatenate all files and write the result to disk, but we can avoid having to read all unchanged files from disk by **caching** them.


## In Gulp 3

In Gulp 3 incremental builds are possible using the following packages: [gulp-cached](https://www.npmjs.com/package/gulp-cached), [gulp-newer](https://www.npmjs.com/package/gulp-newer), [gulp-remember](https://www.npmjs.com/package/gulp-remember) or/and [gulp-changed](https://www.npmjs.com/package/gulp-changed). However, Gulp 3 is missing an essential feature we just talked about above: reading from disk only recently changed files. It is possible to overcome or work around this hurdle but we will focus instead on what Gulp 4 offers out of the box by the addition of `since`.


## Since last run

`vinyl-fs@1.0.0` (used by Gulp 4) introduced a new option in `.src()`: since. It tells `vinyl-fs` to only emit files which have been modified since the time specified (it can be a date or a number). [Undertaker](https://www.npmjs.com/package/undertaker) (see [Part 2: Gulp's anatomy](/posts/2015/04/28/building-with-gulp-3-and-4-part-3-writing-transformers)) exposes a new API function `lastRun(task, [timeResolution])` which returns a timestamp of the last time a task was run successfully (in milliseconds). `timeResolution` can be used to floor that timestamp to the specified resolution to match the resolution returned by fs.stat (according to Undertaker README, on node v0.10 or with file systems like HFS or FAT, file time attributes have a resolution of one second).

In Gulp 4 it is then possible to do the following:

```javascript
var gulp   = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('jshint', function () {
    return gulp.src('src/**/*.js', {since: gulp.lastRun('jshint')})
        .pipe(jshint());
});

gulp.task('watch', function () {
    return gulp.watch('src/**/*.js', gulp.series('jshint'));
});

gulp.task('build', gulp.series('jshint', 'watch'));
```

In the example above, our build task will lint all files using jshint. Then Gulp will watch changes and invoke jshint   if it detects a change on a javascript source. The jshint task only lints modified files since its last run: you can clearly think of the benefits for a code base containing a large number of files (or large files).

## Caching files

For `1:1` operations, that's all we need to do. However for MANY:1, we need to keep a cached copy of files to be re-used later. Let's consider the following example:

```javascript
gulp.task('buildJs', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build'));
});
```

From source to destination, this is a `MANY:1` pipeline, composed of a `1:1` (jshint) and a `MANY:1` (concat) operations. We want to only lint modified files, and then concat all files. [gulp-memory-cache](https://www.npmjs.com/package/gulp-memory-cache) or [gulp-remember](https://www.npmjs.com/package/gulp-remember) can perfectly handle this.

The example below is with `gulp-memory-cache` (**I am the author**, that's why I promote its use!):

```javascript
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var cache  = require('gulp-memory-cache');

gulp.task('buildJs', function () {
    return gulp.src('src/**/*.js', {since: cache.lastMtime('js')})
        .pipe(jshint())
        .pipe(cache('js'))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build'));
});
```

In this example, files streamed to cache are added or updated in their cache, and `cache()` will stream to concat all the files it has in cache. Simple!

## Invalidating cached files

With plugins like `gulp-memory-cache` or `gulp-remember`, recently modified files are added to cache or update their previous cache entry. When a file is deleted,
we need a way to invalidate their cache entry:

```javascript
var gulp = require('gulp');

gulp.task('buildJs', function () {
    // Task
});

gulp.watch('src/**/*.js', gulp.series('buildJs'))
    .on('change', function (evt) {
        if (evt.type === 'deleted') {
            // Invalidate cache for evt.path
        }
    });
```

[gulp-memory-cache](https://www.npmjs.org/package/gulp-memory-cache) has a `.update(cacheName)` method for dealing with file deletion and avoiding boilerplate code.
Be aware that if your file has been processed before being cached and if that processing has **altered its path name**, forgetting files won't work.

```javascript
gulp.watch('src/**/*.js', gulp.series('buildJs'))
    .on('change', cache.update('js'));
```

## New files

Newly created files are automatically added to cache. However, they are **added in last position** as opposed to other files which appear in cache in the order
set by `gulp.src()`. If order matters (for concatenation for example), you can use [gulp-order](https://www.npmjs.com/package/gulp-order).
