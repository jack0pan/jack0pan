---
title: gulp 使用教程
authors: jack
tags: ["编译工具"]
category: 前端
---

gulp 将开发流程中让人痛苦或耗时的任务自动化，从而减少你所浪费的时间、创造更大价值。

<!-- truncate -->

## 安装

### 检查依赖

```bash
$ node -v
v14.18.2
$ npm -v
8.1.4
$ npx -v
8.1.4
```

### 安装 gulp

1. 直接安装命令行工具

```bash
$ npm install --global gulp-cli
# or
$ yarn global add gulp-cli
```

2. 或者在项目中安装

```bash
$ npm install --save-dev gulp
# or
$ yarn add --dev gulp
```

### 检查版本

```bash
$ yarn gulp --version
yarn run v1.22.17
$ node_modules/.bin/gulp --version
CLI version: 2.3.0
Local version: 4.0.2
✨  Done in 0.88s.
```

## Gulpfile

Gulp 允许你使用现有 JavaScript 知识来书写 gulpfile 文件，或者利用你所掌握的 gulpfile 经验来书写普通的 JavaScript 代码。虽然 gulp 提供了一些实用工具来简化文件系统和命令行的操作，但是你所编写的其他代码都是纯 JavaScript 代码。
gulpfile 是项目目录下名为 gulpfile.js（或者首字母大写 Gulpfile.js，就像 Makefile 一样命名）的文件，在运行 gulp 命令时会被自动加载。

## 任务

每个 gulp 任务（task）都是一个异步的 JavaScript 函数，此函数是一个可以接收 callback 作为参数的函数，或者是一个返回 stream、promise、event emitter、child process 或 observable 类型值的函数。由于某些平台的限制而不支持异步任务，因此 gulp 还提供了一个漂亮替代品。

### 导出任务

任务（tasks）可以是 **public（公开）** 或 **private（私有）** 类型的。

- **公开任务（Public tasks）** 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用。
- **私有任务（Private tasks）** 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分。

### 组合任务

Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。series() 和 parallel() 可以互相嵌套至任意深度。
如果需要让任务（task）按顺序执行，请使用 series() 方法。
对于希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来。

```javascript title='gulpfile.js'
const { series, parallel } = require("gulp");

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(cssTranspile, series(jsTranspile, jsBundle)),
  parallel(cssMinify, jsMinify),
  publish
);
```

## 处理文件

gulp 暴露了 `src()` 和 `dest()` 方法用于处理计算机上存放的文件。
`src()` 接受 [glob](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs) 参数，并从文件系统中读取文件然后生成一个 [Node 流（stream）](https://nodejs.org/api/stream.html)。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。
`dest()` 接受一个输出目录作为参数，并且它还会产生一个 [Node 流（stream）](https://nodejs.org/api/stream.html)，通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。gulp 还提供了 `symlink()` 方法，其操作方式类似 `dest()`，但是创建的是链接而不是文件（ 详情请参阅 [symlink()](https://www.gulpjs.com.cn/docs/api/symlink) ）。
大多数情况下，利用 `.pipe()` 方法将插件放置在 `src()` 和 `dest()` 之间，并转换流（stream）中的文件。

### 向流中添加文件

`src()` 也可以放在管道（pipeline）的中间，以根据给定的 glob 向流（stream）中添加文件。新加入的文件只对后续的转换可用。如果 [glob 匹配的文件与之前的有重复](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs#overlapping-globs)，仍然会再次添加文件。
这对于在添加普通的 JavaScript 文件之前先转换部分文件的场景很有用，添加新的文件后可以对所有文件统一进行压缩并混淆（uglifying）。

```javascript
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

exports.default = function () {
  return src("src/*.js").pipe(babel()).pipe(src("vendor/*.js")).pipe(uglify()).pipe(dest("output/"));
};
```

### 分阶段输出

`dest()` 可以用在管道（pipeline）中间用于将文件的中间状态写入文件系统。当接收到一个文件时，当前状态的文件将被写入文件系统，文件路径也将被修改以反映输出文件的新位置，然后该文件继续沿着管道（pipeline）传输。
此功能可用于在同一个管道（pipeline）中创建未压缩（unminified）和已压缩（minified）的文件。

```javascript
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

exports.default = function () {
  return src("src/*.js")
    .pipe(babel())
    .pipe(src("vendor/*.js"))
    .pipe(dest("output/"))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest("output/"));
};
```

## Glob 详解

glob 是由普通字符和/或通配字符组成的字符串，用于匹配文件路径。可以利用一个或多个 glob 在文件系统中定位文件。

### 特殊字符： \* (一个星号)

在一个字符串片段中匹配任意数量的字符，包括零个匹配。对于匹配单级目录下的文件很有用。

### 特殊字符： \*\* (两个星号)

在多个字符串片段中匹配任意数量的字符，包括零个匹配。 对于匹配嵌套目录下的文件很有用。请确保适当地限制带有两个星号的 glob 的使用，以避免匹配大量不必要的目录。

### 特殊字符： ! (取反)

由于 glob 匹配时是按照每个 glob 在数组中的位置依次进行匹配操作的，所以 glob 数组中的取反（negative）glob 必须跟在一个非取反（non-negative）的 glob 后面。第一个 glob 匹配到一组匹配项，然后后面的取反 glob 删除这些匹配项中的一部分。如果取反 glob 只是由普通字符组成的字符串，则执行效率是最高的。

## 参考

- [https://gulpjs.com/](https://gulpjs.com/)
