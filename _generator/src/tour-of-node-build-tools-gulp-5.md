---
title: Building with Gulp Part 5 Caveats
lunr: true
draft: false
date: 2015-05-05 15:00:00
author: Thomas Roch
metaTags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner
tags: javascript,nodejs,build automation,gulpjs
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp.png
---

# Building with Gulp: Caveats

After all those parts extolling Gulp's capabilities on how much it is an improvement from Grunt, it is now only fair to discuss Gulp's limitations. Remember, in the fast evolving world of software development, tools are created to overcome limitations from their predecessors as well as trying to be as much future-proof as possible. It would be presumptuous to think that Gulp is a silver bullet (nothing is) and Gulp has also its own limitations and caveats, edge cases were its architecture is not so suitable.


## Error management in Gulp 3

In Gulp 3, error management is an issue. In Gulp 3 it is unclear what strategy needs to be adopted when a piece of pipeline or a task fails. This is most problematic when using `.watch()`
and in most cases developers are forced to re-start the build process manually either because the process exited, or because watching got messed up. Watch can stop working as expected
because by design, when an event error is raised, a Node stream stops accepting data coming in. [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) is a monkey-patch preventing
Node stream's default behavious on error (it prevents streams to unpipe on error).

However, this is not the only case where error management is not efficient. With linters, errors are raised when encountered and all linting errors are not all logged at once.
If we use a _jshint_ + _uglify_ combination, ideally _jshint_ would log all errors encountered but wouldn't write downstream so _uglify_ itself wouldn't raise an exception if the AST cannot
be parsed.

Gulp's team told its community error management is a priority in Gulp 4.


## `MANY:1` disguised as a `1:1`

In [Part 4: incremental builds](/posts/2015/05/01/building-with-gulp-4-part-4-incremental-builds/), I deliberately eclipsed one case which makes Gulp suck at incremental builds: I call
those cases the `MANY:1` disguised as a `1:1`. Those are the cases where a plugin will receive one file, but will end up processing many for finally passing downstream one file. Examples
of this include: LESS, SASS or Browserify. LESS and SASS will need to follow `@import` files and read them from disk, and _Browserify_ will track
down module dependencies on your file system. Streams are bypassed and consequently incremental builds are not always possible.

## Conclusion

Gulp is an amazing tool, don't get me wrong, and its syntax is awesome. Using `.pipe()` to create a transformation pipeline on a group of files is very nice and Gulp is a massive step
forward from Grunt. But I don't think Gulp is the ultimate build tool of today (it doesn't mean it cannot become the ultimate build tool of tomorrow). Why is that?
Simply because Gulp is _NOT_ a build tool out of the box: you still have after having defined your tasks to tell Gulp how to clean, how to build, how to watch and how to increment.
