---
title: Building with Gulp 3 and 4 Part 2 Gulp Anatomy
draft: false
date: 2015-04-23 16:00:00
author: Thomas Roch
tags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner,vinyl,vinyl-fs,npm,gulp 4
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp.png
---

# Building with Gulp 3 and 4 (Part 2: Gulp's anatomy)

Gulp itself is a pretty bare package: it integrates a few packages to create a simple but performant tool by exposing an API and adding a CLI.
The packages Gulp is composed of are from the same authors and embrace the _single responsability_ and _separation of concerns_ principles: Gulp parts are _loosely coupled_,
are individually tested to ensure they fulfill their duties and can easily be re-used in other projects. These principles are also the main guidelines for Gulp plugins:
do one thing and do it well!


## Orchestrator (Gulp 3) and Undertaker (Gulp 4)

[Orchestrator](https://www.npmjs.com/package/orchestrator) is a module for registring tasks, specifying their dependencies and running them in maximum concurrency.
Tasks created with Orchestrator need to return a Promise or a stream, or invoke a done callback to ensure completion. Synchronous tasks are not supported and will have to
invoke a callback too. Orchestrator tasks can define their dependencies and Orchestrator will run tasks in maxium concurrency.

[Undertaker](https://www.npmjs.com/package/undertaker) removes task dependencies in favour of two new functions: `.series()` and `.parallel()`. In
[Part 1](/posts/2015/04/23/building-with-gulp-3-and-4-part-1-examples/#gulp-3-with-_run-sequence_), we mentioned the disadvantages of specifying task dependencies.
Undertaker adresses those issues and provides an easier way to explicitely define in which order tasks should be executed. `.series()` and `parallel` can take as argument
a task name or a function (returning a promise, a stream or invoking a done callback). The tree of registerd tasks can be retrieved calling `tree()`. Undertaker also tracks
the last time a task was run, accessible with `lastRun()`.


## Vinyl and vinyl-fs

Gulp is built on top of two packages called `vinyl` and `vinyl-fs`.

[Vinyl](https://www.npmjs.org/package/vinyl) is an object used for modelling files. It has four properties (`cwd`, `base`, `path`, and `contents`).
`contents` is a [Node Buffer](https://nodejs.org/api/buffer.html), and other properties describe a file path. If you have used Grunt your are no stranger to them:
`base` + `cwd` + `path` = full path.

From [Vinyl-fs](https://www.npmjs.org/package/vinyl-fs) comes the `.src()`, `.watch()` and `.dest()` functions exposed by Gulp: `src()` will create vinyl objects from your file system,
and `dest()` will write them to disk. Vinyl-fs is also depending on [through2](https://www.npmjs.org/package/throught2), a wrapper around Node streams2 (Streams in Node v0.10.x). From
streams2 comes the `.pipe()` and `.on('error|end|data|readable|close')` methods.

> In most cases, a vinyl-fs pipeline is simply a **map-reduce** operation on a set of files.

## Gulp plugins

In between `src` and `dest`, vinyl objects are streamed using the `.pipe()` function from plugin to plugin. Plugins are just here to transform streams, i.e. to modify vinyl objects.
Gulp plugins can therefore be truly specialised, by contrast to [Grunt]([Grunt](/posts/2015/04/18/building-with-grunt-part-2/).
This is what makes Gulp so attractive for many developers: being fully in control of the build process, step by step, by **composing** multiple plugins to create a pipeline.
