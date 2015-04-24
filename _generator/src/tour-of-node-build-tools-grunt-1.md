---
title: Building with Grunt Part 1
lunr: true
draft: false
date: 2015-04-18 14:00:00
author: Thomas Roch
tags: node,nodejs,javascript,grunt,gruntjs,build automation,build tool,task runner
image: http://gruntjs.com/img/grunt-logo.png
---

# Building with Grunt (Part 1)

## Hello Grunt

[Grunt](http://www.gruntjs.com) is (or was) not _per se_ a build automation tool. Or at least, This is how Grunt describe itself: _"The JavaScript task runner"_.
So what is exactly Grunt? Since 4.0, Grunt is definitely a task runner... running tasks for automating builds!

Grunt was first release in January 2012 (v0.1.0) and it is with the well known version 0.4.x (first stable release in February 2013) that
Grunt became the reference for building front-end source code, thanks to the release of "contribution" packages by the Grunt team
(packages named `grunt-contrib-xxx`) for common tasks like concatenating, copying, watching, serving files etc...

Grunt was a precursor in the wonderful land of JavaScript (and `Node`) based build tools. Today its package ecosystem and its user base
are very large. For many developers working with front-end technologies, Grunt is the first building tool they use, before having ever programmed on
the `Node` platform. On that aspect, Grunt is very accessible thanks to its config-based approach. This is a pro as well as a con, and we will
talk more about it later in this article. Grunt has also been adopted by other tools, including a lot of [Yeoman](http://yeoman.io/) generators and
project skeletons. Other building tools are based on Grunt. [Angus](https://github.com/nickjanssen/angus) was one of them but later moved
to [Gulp](http://gulpjs.com/).

So... Grunt became very popular. Maybe too popular? I have seen many `Grunfile.js` (either online or in some projects I worked on),
and often make the same observation: Grunt tasks could be optimised or managed better by applying more Node style programming.


## Getting started with Grunt

First install Grunt globally:

    $ npm install -g grunt-cli
    $ npm install -g grunt

Add grunt in your package.json and create a `Gruntfile.js` (see examples on [Grunt's website](http://www.gruntjs.com))

    $ npm install --save-dev grunt
    $ touch Gruntfile.js

## Configuration over code

When using a Grunt plugin (for concatenating, linting, etc...), we have to add configuration entry for that task in Grunt's config object and call `loadNpmTasks`
to make Grunt aware of it. A task can contain `targets`, configure `options` that targets can extend and a task is generally about using some `src` files to produce a result in `dest`. Tasks and targets cam also be configured using `files` (a map or array) in lieu of `src` and `dest`.

Let see a `Gruntfile.js` example where we have a `src` folder containing JavaScript files which we want to lint and then concat in a `build` folder (using `grunt-contrib-concat` and `grunt-contrib-jshint` packages).

```
├── build
|   └── app.js
├── src
|   ├── a.js
|   ├── b.js
|   └── c.js
├── Gruntfile.js
└── package.json
```

```javascript
module.exports = function (grunt) {
    grunt.initConfig({
        // Concat task
        concat: {
            files: {
                'build/app.js': 'src/*.js'
            }
        },
        // JsHint task
        jshint: {
            files: ['src/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['jshint', 'concat'];
};
```

And we can now run `grunt build`, `grunt concat`, `grunt jshint` or even `grunt jshint concat`.


## Splitting the Gruntfile

The most common issue developers encounter with Grunt is the size its config file. The more a build process requires tasks and targets,
the longer the config object. Very quickly a `Gruntfile.js` can exceed a few hundred lines and this will affect its **maintainability**. A quick solution
for this is to split our Gruntfile using [Node modules](https://nodejs.org/api/modules.html), and use more of Grunt comprehensive API (surprisingly
relatively unknown)!

We create a tasks folder where we are going to create a file per task, keeping our `Gruntfile.js` very slim:

```
├── build
|   └── app.js
├── src
|   ├── a.js
|   ├── b.js
|   └── c.js
├── tasks
|   ├── concat.js
|   └── jshint.js
├── Gruntfile.js
└── package.json
```

**concat.js**

```javascript
module.exports = function (grunt) {
    grunt.config.set('concat', {
        files: {
            'build/app.js': 'src/*.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};
```

**jshint.js**

```javascript
module.exports = function (grunt) {
    grunt.config.set('jshint', {
        files: {
            files: ['src/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
```

**Gruntfile.js**

```javascript
module.exports = function (grunt) {
    require('./tasks/concat')(grunt);
    require('./tasks/jshint')(grunt);

    grunt.registerTask('build', ['jshint', 'concat'];
};
```

In a second article about Grunt, we will explore Grunt caveats, how we can deal with them and how it inspired other tools.
