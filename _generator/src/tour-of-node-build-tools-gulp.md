---
title: Building with Gulp
draft: true
date: 2015-04-18 14:00:00
author: Thomas Roch
tags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner
image: http://gruntjs.com/img/grunt-logo.png
---

# Building with Gulp

Like [Grunt](/posts/2015/04/18/building-with-grunt-part-1/), [Gulp](http://gulpjs.com) is also a task runner but is designed to build applications using streams:
Gulp is __"The streaming build system"__ to __"Automate and enhance your workflow"__. So who are you Gulp?

Gulp was first released in July 2013 (v0.0.1), v3.0.0 was released in December 2013. Current version is 3.8.x released in June 2014 and Gulp 4 is now almost ready.

## First, an example

Gulp (like Grunt) needs to be locally and globally installed. Providing you already have a package.json file:

    $ npm install -g gulp
    $ npm install --save-dev gulp gulp-jshint gulp-concat

Example of a `gulpfile.js`:

    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var concat = require('gulp-concat');

    gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(concat())
        .pipe(gulp.dest('/build'));


## Orchestrator (Gulp 3) and Undertaker (Gulp 4)

[Orchestrator](https://www.npmjs.com/package/orchestrator) is a module for registring tasks, specifying their dependencies and running them in maximum concurrency.
Tasks created with Orchestrator can return a Promise or a stream, or invoke a done callback to ensure completion. Synchronous tasks are not supported and will have to
invoke a callback too.

[Undertaker](https://www.npmjs.com/package/undertaker): `undertaker` is more powerful than Orchestrator as it can run tasks in series `.series()` and parallel `.parallel()`,
providing an easier way to explicitely define in which order tasks should be exectued. Undertaker will create a `tree` of tasks, and like Orchestrator can
handle promises, streams or invoke a callback when done. Undertaker has also


## Vinyl and vinyl-fs

[Vinyl](https://www.npmjs.org/package/vinyl) is an object used by Gulp for modelling files: its path and its content. It has four properties (`cwd`, `base`, `path`, and `contents`).
`contents` is a [Node Buffer](https://nodejs.org/api/buffer.html), and other properties describe a file path. If you have used Grunt your are no stranger to them:
`base` + `cwd` + `path` = full path.

From [Vinyl-fs](https://www.npmjs.org/package/vinyl-fs) comes the `.src()`, `.watch()` and `.dest()` functions exposed by Gulp: src will create vinyl objects from files, and dest
will write them to disk.


## Gulp plugins

In between `src` and `dest`, vinyl objects are streamed using the `.pipe()` function from plugin to plugin. Plugins are just here to transform streams, i.e. to modify vinyl objects.
Gulp plugins can therefore be truly specialised and each of them can have a single responsability, by contrast to [Grunt]([Grunt](/posts/2015/04/18/building-with-grunt-part-2/).
This is what made Gulp so attractive for many developers: you are fully in control of the transformation chain of your files and you are not limited by existing plugins.

If we compare Gulp with Grunt, in Grunt:

    Tasks = Plugins > Files

In Gulp

    Tasks > Files > Plugins


## Gulp 3 caveats and Gulp 4
