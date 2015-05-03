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

```nohighlight
npm uninstall -g gulp
npm install -g "gulpjs/gulp-cli#4.0"
```

On my machine (Linux Mint Rebecca), I had no problems continuing using Gulp < 4 after globally installing Gulp 4.


## Add Gulp 4 to your repositories

If you use a previous version of Gulp (i.e. Gulp 3.8.x or earlier), remove it from the repositories you want to upgrade.
Don't forget to specify `--save-dev` or `--save` so your `package.json` gets updated.

```nohighlight
cd YOUR_REPO
npm uninstall gulp --save-dev
npm install "gulpjs/gulp#4.0" --save-dev
```

## Possible issues uninstalling Gulp

On my machine, previous version of Gulp hadn't been properly removed and I started to get that error when trying to run Gulp:

```nohighlight
/usr/local/lib/node_modules/gulp/bin/gulp.js:129
    gulpInst.start.apply(gulpInst, toRun);
                   ^
TypeError: Cannot call method 'apply' of undefined
    at /usr/local/lib/node_modules/gulp/bin/gulp.js:129:20
    at process._tickDomainCallback (node.js:492:13)
```

What does this error trace tell use? `gulp.start()` is no longer in Gulp 4 and shouldn't be called,
and `gulp-cli` package should be called rather than an old `gulp` package.

I ran the following command:

    ls -l $`whereis gulp`

And realise I still had an old Gulp file in a bin folder:

```nohighlight
lrwxrwxrwx 1 root root 40 May  3 11:17 /usr/bin/gulp -> ../lib/node_modules/gulp-cli/bin/gulp.js
lrwxrwxrwx 1 root root 40 May  3 11:17 /usr/bin/X11/gulp -> ../lib/node_modules/gulp-cli/bin/gulp.js
lrwxrwxrwx 1 root root 36 Apr  3 21:41 /usr/local/bin/gulp -> ../lib/node_modules/gulp/bin/gulp.js
```

Simply remove old files and you will be good to go:

    $ sudo rm /usr/local/bin/gulp
    $ sudo rm -rf /usr/local/lib/node_modules/gulp
