---
title: Building with Grunt Part 2 Caveats
draft: false
date: 2015-04-22 00:00:00
author: Thomas Roch
tags: node,nodejs,javascript,grunt,gruntjs,build automation,build tool,task runner
image: http://gruntjs.com/img/grunt-logo.png
---

# Building with Grunt (Part 2: caveats)

In [Building with Grunt Part 1](/posts/2015/04/18/building-with-grunt-part-1/), we briefly talked about Grunt _"configuration over code"_ approcah and its limitations (**maintainability**).
There is also another aspect of Grunt which doesn't make it the ideal build tool: `plugins` (tasks) are ranked higher than files. In other words: instead of performing a series
of operations on a group of files, we can only perform an operation (`task`) on different groups of files (`targets`). The consequences of this are:

- No _"linking"_ between tasks
- Multiple read operations
- Non specialisation

## No linking between tasks

Temporary or transitional files have sometimes to be created during builds to allow another task to be performed later. This adds an extra read / write operation per transitional file: task A will write on disk a transitional file task B will read later.

## Multiple read operations

A file can be read multiple times per build which can cause **scalability** issues when your code base expands. For example, if you decide to copy your javascript files
from your source directory to your build directory and lint those files, each file will be read twice from disk (by the copy task and the linting task).
The more operations a file requires, the more Grunt tasks you will need and therefore the more times your file will be read from disk.

## Non specialisation

Grunt plugins are not always specialised, and this is the direct consequence of the two points above (trying to avoid transitional files and to limit the number of tasks on a same
group of file). Some Grunt plugins tend to offer much more than what is written on their tin, bringing overlaping functionalities between them and bad **separation of concerns**.
For instance, `grunt-contrib-concat` can add a header or a footer to your file, replace or template some content and add source maps as well as concatenating files.
`grunt-contrib-uglify` can do the same for you as well as uglifying files.

## Conclusion

Grunt is very mature and stable but limited by design. Grunt is the perfect build tool for you if:

- Your code base is fairly small
- You only need to perform a small number of operations / transformations per group of file
- You don't need to compose tasks
