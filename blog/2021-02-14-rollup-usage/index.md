---
title: Rollup 使用教程
authors: jack
tags: ["编译工具"]
category: 前端
---

本文介绍如何使用 rollup 来实现 JavaScript 打包。

<!-- truncate -->

## 快速开始

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。
安装：

```bash
npm install --global rollup
```

假设应用程序入口起点的名称为 main.js，并且你想要所有 import 的依赖(all imports)都编译到一个名为 bundle.js 的单个文件中。
对于浏览器：

```bash
rollup main.js --file bundle.js --format iife
```

对于 Node.js:

```bash
rollup main.js --file bundle.js --format cjs
```

对于浏览器和 Node.js:

```bash
rollup main.js --file bundle.js --format umd --name "myBundle"
```

## 配置

当 rollup 的自定义配置比较多时，建议都放在配置文件中。给个例子：

```javascript title='rollup.config.js'
export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
};
```

### 配置项提示

第一种是使用 JSDoc 的类型提示：

```javascript title='rollup.config.js'
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  // ...
};

export default config;
```

第二种是使用 `defineConfig`：

```javascript title='rollup.config.js'
import { defineConfig } from "rollup";

export default defineConfig({
  // ...
});
```

第三种是用 TypeScript 类型的配置文件，但这要求安装`@rollup/plugin-typescript`插件，还需要使用命令行参数`--configPlugin`：

```typescript
rollup --config rollup.config.ts --configPlugin typescript
```

### 打包成多种格式

可以直接 export 一个数组，也可以把 output 设置成一个数组，比如：

```javascript
export default [
  {
    input: "main-a.js",
    output: {
      file: "dist/bundle-a.js",
      format: "cjs",
    },
  },
  {
    input: "main-b.js",
    output: [
      {
        file: "dist/bundle-b1.js",
        format: "cjs",
      },
      {
        file: "dist/bundle-b2.js",
        format: "es",
      },
    ],
  },
];
```

## 与其他工具集成

### rollup-plugin-node-resolve

当遇到这种报错时：

```plain
(!) Unresolved dependencies
https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
the-answer (imported by main.js)
```

打包后的 bundle.js 仍然会在 Node.js 中工作，因为 import 声明转变成了 CommonJS 中的 require 语句，但是 the-answer 不包含在包中。因此，我们需要一个插件。

```bash
yarn add -D rollup-plugin-node-resolve
```

然后加到配置文件中：

```javascript title='rollup.config.js'
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins: [resolve()],
};
```

### rollup-plugin-commonjs

还有一种情况时，npm 中大多数包都是以 CommonJS 模块的形式出现的。 在它们更改之前，我们需要将 CommonJS 模块转换为 ES2015 供 Rollup 处理。这里需要用到另一个插件：

```bash
yarn add -D rollup-plugin-commonjs
```

修改配置：

```javascript title='rollup.config.js'
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins: [commonjs()],
};
```

### Gulp

与 gulp 集成很简单，不需要额外的插件：

```javascript
const gulp = require("gulp");
const rollup = require("rollup");
const rollupTypescript = require("@rollup/plugin-typescript");

gulp.task("build", () => {
  return rollup
    .rollup({
      input: "./src/main.ts",
      plugins: [rollupTypescript()],
    })
    .then((bundle) => {
      return bundle.write({
        file: "./dist/library.js",
        format: "umd",
        name: "library",
        sourcemap: true,
      });
    });
});
```

另外，也可以使用 `async/await` 语法：

```javascript
const gulp = require("gulp");
const rollup = require("rollup");
const rollupTypescript = require("@rollup/plugin-typescript");

gulp.task("build", async function () {
  const bundle = await rollup.rollup({
    input: "./src/main.ts",
    plugins: [rollupTypescript()],
  });

  await bundle.write({
    file: "./dist/library.js",
    format: "umd",
    name: "library",
    sourcemap: true,
  });
});
```

## 参考

- [https://rollupjs.org/guide/en/](https://rollupjs.org/guide/en/)
