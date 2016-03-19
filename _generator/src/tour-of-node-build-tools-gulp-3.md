---
title: Building with Gulp 3 and 4 Part 3 Writing transformers
lunr: true
draft: false
date: 2015-04-28 22:30:00
author: Thomas Roch
metaTags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner,vinyl,vinyl-fs,npm,gulp 4,event-stream,map-stream
tags: javascript,nodejs,build automation,gulpjs
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp.png
---

# Building with Gulp 3 and 4 (Part 3: Writing transformers)

When building with Gulp, we rely on available plugins for _atomic or specific operations_ (like adding a file header or footer, concatenating files, ...). But what if
there is no plugin for what you are trying to achieve? It is fairly simply to write a custom stream transformer, and if you think it can benefit others then publish
your gulp plugin using npm. Make sure you first read the [guidelines](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md).

When writing this article, I was trying to find a plugin idea for illustrating this article but could not find something simple which doesn't already exist in the large
Gulp plugins ecosystem. Instead, I will use a _replace_ operation as example (covered by `gulp-replace`) and then finish with a concatenation example using a reduce plugin.


## In and out

Each Gulp plugin receives vinyl objects (representing files) and is expected to pipe to the next plugin transformed vinyl objects. Depending on what a plugin does, it could
return:

- No vinyl objects at all
- Only one vinyl object (_gulp-concat_)
- The same untouched vinyl objects (_gulp-jshint_)
- The same vinyl objects with transformed contents (_gulp-header_)
- Extra vinyl objects

All (or almost all) Gulp plugins will need to access contents of a file. In [Part 2: Gulp's anatomy](/posts/2015/04/23/building-with-gulp-3-and-4-part-2-gulp-anatomy/), we briefly
mentionned the `contents` property being a buffer. Contents are not always buffers and can also be streams. Most of Gulp plugins will only deal with buffers and
throw an exception if used with streams (like `gulp-concat`), `gulp.src()` itself will return vinyl ojbects with buffered contents by default. Most of the common
building tasks I can think of will need to read the whole contents of a file before carrying on:

- If _replace_ was used with streams, portions of a file to replace could be split over two chunks of data
- Javascript linters and uglifiers need to parse entire scripts to get their Abstract Syntax Tree (AST)
- CSS pre-processors can not compile one chunk at a time
- Etc...

I hear you are confused. Isn't Gulp _the streaming build system_ afterall? Yes it is, don't forget vinyl objects are streamed through the pipeline. Then file contents can be streamed or buffered,
you can see this as a _two dimension stream_. So why bother with streaming contents? When building an application, sooner or later files will need to be buffered. However for certain tasks like
copying files, streams can be used.

If you want to use streams, use `gulp.src()` with option `{buffer: false}` to return non-buffered vinyl objects. In this article, we won't deal with streams but if you'd like to explore further,
you can look at Gulp official documentation on [dealing with streams](httpss://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/dealing-with-streams.md).

## Using map-stream

Using [map-stream](https://www.npmjs.com/package/map-stream) is the quickest way to get going. First install _map-stream_:

    $ npm install --save-dev map-stream

Let's see an example where we want to replace all instances 'abc' by '123' (I know this is totally pointless):

```javascript
var gulp = require('gulp');
var map  = require('map-stream');

gulp.task('replace', function() {
    return gulp.src('src/**/*.js')
        .pipe(map(function (file, cb) {
            var contents = file.contents.toString('utf8');
            contents = contents.replace(/abc/g, '123');
            file.contents = new Buffer(contents, 'utf8');
            cb(null, file);
        }));
});
```

## Using through2

[through2](https://www.npmjs.org/rvagg/through2) has an `.obj()` function for object streams:

    $ npm install --save-dev map-stream

```javascript
var gulp    = require('gulp');
var through = require('through2');

gulp.task('replace', function() {
    return gulp.src('src/**/*.js')
        .pipe(through.obj(function (file, enc, cb) {
            // Replacing takes place here
            cb(null, file);
            // Or
            // this.push(file);
            // cb();
        }));
});
```

## Using event-stream

[event-stream](https://www.npmjs.com/package/event-stream) is a package containing various functions to write more functional code when working with streams.
_event-stream_ creates Node 0.8 streams (compatible with Node 0.10 streams) but since we are only interested in mapping functions, this is not an issue.
_event-stream_ has a `.mapSync()` function as well as a `.map()` function, _mapSync_ is useful in our example as it removes one line of code in our transformer:

    $ npm install --save-dev event-stream

```javascript
var gulp = require('gulp');
var es   = require('event-stream');

gulp.task('replace', function() {
    return gulp.src('src/**/*.js')
        .pipe(es.mapSync(function (file) {
            // Replacing takes place here
        }));
    });
```


## A plugin example: reduce

Let's now write a plugin for performing reduce operations on files. It takes two arguments:
- `fileName`: the file name we want to give to our reduced file (String)
- `iteratee`: a reduce function called for each value in the array (except the first one). It takes 3 arguments: `firstFile`, `file` and `cb`.

```javascript
var through2 = require('through2');
var File = require('vinyl');
var path = require('path');

// This is our plugin
function myReducePlugin(fileName, iteratee) {
    var firstFile;

    return through2.obj(function(file, enc, cb) {
        if (!firstFile) {
            firstFile = file;
            cb();
            return;
        }
        iteratee(firstFile, file, cb);
    }, function () {
        firstFile.path = path.join(firstFile.base, fileName);
        this.push(firstFile);
    });
}
```

Now we can use this practical plugin for concatenating files (you can try it):

```javascript
gulp.task('concat', function () {
    return gulp.src('src/**/*.js')
        .pipe(myReducePlugin('concat.js', function (firstFile, file, cb) {
                firstFile.contents = Buffer.concat([
                    firstFile.contents,
                    file.contents
                ]);
                cb();
            }
        ))
        .pipe(gulp.dest('./build'));
})
```
