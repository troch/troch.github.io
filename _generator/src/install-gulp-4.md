---
title: How to Install Gulp 4
lunr: true
draft: false
date: 2015-05-01 16:00:00
author: Thomas Roch
metaTags: node,nodejs,javascript,gulp,gulpjs,build automation,build tool,streams,task runner,gulp 4
tags: javascript,nodejs,build automation,gulpjs,incremental build
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp.png
---

# How to install Gulp 4

[Gulp 4](https://github.com/gulpjs/gulp) is not released yet and if you cannot wait to get your hands on it, here is how to install Gulp 4.

## Install Gulp globally

If you have a previous version of Gulp installed, uninstall it first. You might need run this command as an administrator or a superuser, depending on your system.
On my machine (Linux Mint Rebecca), I had no problems continuing using Gulp 3.8.11 after installing Gulp 4.

```bash
$ npm uninstall -g gulp
$ npm install -g "gulpjs/gulp-cli#4.0"
```

## Add Gulp 4 to your repositories

If you use a previous version of Gulp (i.e. Gulp 3.8.x or earlier), remove it from the repositories you want to upgrade.
Don't forget to specify `--save-dev` or `--save` so your `package.json` gets updated.

```bash
$ cd <your_repo>
$ npm uninstall gulp [--save-dev|--save]
$ npm install "gulpjs/gulp#4.0" [--save-dev|--save]
```
