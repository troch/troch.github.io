---
title: Building with Broccoli Part 1 Introduction
lunr: true
draft: false
date: 2015-07-10 23:00:00
author: Thomas Roch
metaTags: node,nodejs,javascript,broccolijs,broccoli,broccoli js,build automation,build tool
tags: javascript,nodejs,build automation,broccolijs
image: https://github.com/broccolijs/broccoli/blob/master/logo/broccoli-logo.generated.png
---


# Building with Broccoli (Part 1: Introduction)

## What is Broccoli?

[Broccoli](http://broccolijs.com/) was first released (beta) in February 2014. Broccoli is a post-Grunt build tool and part of a new breed of Node based
build tools: Broccoli is not a task runner but is a __dedicated build tool__. It makes the asumption that you have all source files
in a directory (which can contain sub-directories) and that you want to build those files into a _build_ directory of your choice.

With Broccoli, you only have to specified the varioius steps you need to go from your source directory to your build directory: it
will automatically take care of cleaning your _build_ directory, watching your _source_ directory and perform incremental builds. Although
you cannot run a specific task / operation independently, it provides great confort by not having to define how to build _and_ rebuild.

Broccoli has gained popularity amongst the Ember community by being included in [ember-cli](http://www.ember-cli.com/) and will get even
more wind in its sails with the probable backing of [Angular 2](https://docs.google.com/document/d/150lerb1LmNLuau_a_EznPV1I1UHMTbEl61t4hZ7ZpS0/mobilebasic).


## Trees

Like Gulp, Broccoli seeks to reduce file I/O operations and to compose build operations, which we have seen is a major caveat of
[Grunt](/posts/2015/04/22/building-with-grunt-part-2-caveats/). Like Gulp, Broccoli uses memory to speed up and compose operations.
Gulp uses vinyl objects and streams for describing sources, while Broccoli uses __trees__ and simply pass them from module to module:
not using streams reduces complexity.
Trees contain files and subdirectories and the first tree Broccoli will create is a representation of your _source_ directory.

Each broccoli plugin receives a tree and outputs a new tree, Broccoli will pass around / merge trees until all operations have been performed.
The final tree will be written to your _build_ directory. In a way, this is simply a __map-reduce__ operation from _source_ to _build_.
