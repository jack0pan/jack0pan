---
title: 打包工具
description: 本文介绍如何前端组建库如何打包出 CommonJS、ES Module 和 UMD 三种形式的产物。
tags: ["Design System", 打包工具]
category: 前端
---

对标 [Ant Design 的产物](https://github.com/ant-design/ant-design/blob/master/package.json#L44)：

```json
{
  "main": "lib/index.js",
  "module": "es/index.js",
  "unpkg": "dist/antd.min.js",
  "typings": "lib/index.d.ts"
}
```

1. 需要有 CommonJS、ES Module 和 UMD 三种形式的产物；
1. 需要类型声明文件，比如：`"typings": "lib/index.d.ts"`；
1. 对于 Design System 来说，可能还会有`dist/index.css`这样的样式文件。

## CommonJS

将 Typescript 代码编译成 CommonJS 形式，使用 tsc 和 babel 都可以，它们的对比见 [Using Babel with TypeScript](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html)。
​

> **共识：babel 来做编译，tsc 做类型检查。**

1. 通过以下命令安装相关工具包：

```bash
yarn add --dev @babel/cli @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-transform-runtime
```

另外安装 [@babel/runtime](https://babeljs.io/docs/en/babel-runtime) 作为生产依赖：

```bash
yarn add @babel/runtime
```

2. 在项目根目录创建 `babel.config.js` ，并添加以下内容：

```javascript
module.exports = {
  plugins: ["@babel/plugin-transform-runtime"],
  presets: ["@babel/preset-env", "@babel/typescript", "@babel/react"],
};
```

3. 然后执行命令：

```bash
npx babel src --out-dir lib
```

这样就得到 CommonJS 产物：

```javascript
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (_typeof(obj) !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

var Button = /*#__PURE__*/ React.forwardRef(function (props, ref) {
  var _classNames;

  var disabled = props.disabled,
    type = props.type,
    htmlType = props.htmlType,
    children = props.children,
    icon = props.icon;
  var classPrefix = "md-button";
  var classes = (0, _classnames.default)(
    classPrefix,
    ((_classNames = {}),
    (0, _defineProperty2.default)(_classNames, "".concat(classPrefix, "_").concat(type), true),
    (0, _defineProperty2.default)(_classNames, "".concat(classPrefix, "_").concat(type, "--disabled"), disabled),
    (0, _defineProperty2.default)(_classNames, "".concat(classPrefix, "-icon"), icon),
    _classNames)
  );
  return /*#__PURE__*/ React.createElement(
    "button",
    {
      disabled: disabled,
      type: htmlType,
      className: classes,
      ref: ref,
    },
    Boolean(icon) &&
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className: "material-icons md-18",
        },
        icon
      ),
    children
  );
});
Button.displayName = "Button";
Button.defaultProps = {
  type: "filled",
  htmlType: "button",
  disabled: false,
};
var _default = Button;
exports.default = _default;
```

## ES Module

同样使用 babel，只需修改 `babel.config.js`文件：

```javascript
module.exports = {
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        useESModules: true,
      },
    ],
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    "@babel/typescript",
    "@babel/react",
  ],
};
```

运行命令：

```bash
npx babel src --out-dir es
```

得到产物：

```javascript
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as React from "react";
import classNames from "classnames";
var Button = /*#__PURE__*/ React.forwardRef(function (props, ref) {
  var _classNames;

  var disabled = props.disabled,
    type = props.type,
    htmlType = props.htmlType,
    children = props.children,
    icon = props.icon;
  var classPrefix = "md-button";
  var classes = classNames(
    classPrefix,
    ((_classNames = {}),
    _defineProperty(_classNames, "".concat(classPrefix, "_").concat(type), true),
    _defineProperty(_classNames, "".concat(classPrefix, "_").concat(type, "--disabled"), disabled),
    _defineProperty(_classNames, "".concat(classPrefix, "-icon"), icon),
    _classNames)
  );
  return /*#__PURE__*/ React.createElement(
    "button",
    {
      disabled: disabled,
      type: htmlType,
      className: classes,
      ref: ref,
    },
    Boolean(icon) &&
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className: "material-icons md-18",
        },
        icon
      ),
    children
  );
});
Button.displayName = "Button";
Button.defaultProps = {
  type: "filled",
  htmlType: "button",
  disabled: false,
};
export default Button;
```

## UMD

UMD 格式就属于打包范畴了，这里用到工具：rollup。

1. 安装：

```javascript
yarn add -D rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript
```

2. 配置，创建 `rollup.config.js`文件：

```javascript
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "index.js",
    format: "umd",
  },
  plugins: [commonjs(), resolve(), typescript()],
};
```

3. 执行：

```bash
npx rollup
```

## .d.ts

最后就是生成类型声明文件`.d.ts`，这里使用 TypeScript 的编译工具 tsc。

1. 创建`tsconfig.json`文件：

```json
{
  "esModuleInterop": true,
  "skipLibCheck": true,
  "declaration": true,
  "emitDeclarationOnly": true,
  "jsx": "react"
}
```

2. 然后执行：

```bash
npx tsc -p tsconfig.json
```

## 整合

前面介绍了各种工具和命令来生成不同的产物，这里介绍一种工具把它们串起来：gulp，它使用教程见：[gulp.js 速成指南](https://www.yuque.com/jackpan/blog/gulp-usage?view=doc_embed)

先安装依赖：

```bash
yarn add --dev gulp gulp-babel gulp-typescript gulp-sourcemaps
```

接下来介绍如何整合，后文内容均在 `gulpfile.js`文件中。

### 编译成 CommonJS

```javascript
const gulp = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

const CJS_OUTPUT_PATH = "lib";
const TS_INTPUT_PATHS = ["src/**/*.{ts,tsx}", "!src/**/{demos,__test__}/*.{ts,tsx}"];

function compileTsToCjs() {
  return gulp
    .src(TS_INTPUT_PATHS)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        plugins: ["@babel/plugin-transform-runtime"],
        presets: ["@babel/preset-env", "@babel/typescript", "@babel/react"],
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(CJS_OUTPUT_PATH));
}
```

### 编译成 ES Module

```javascript
const gulp = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

const ESM_OUTPUT_PATH = "esm";
const TS_INTPUT_PATHS = ["src/**/*.{ts,tsx}", "!src/**/{demos,__test__}/*.{ts,tsx}"];

function compileTsToEsm() {
  return gulp
    .src(TS_INTPUT_PATHS)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        plugins: ["@babel/plugin-transform-runtime"],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
            },
          ],
          "@babel/typescript",
          "@babel/react",
        ],
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(ESM_OUTPUT_PATH));
}
```

### 打包成 UMD

```javascript
const rollup = require("rollup");
const rollupCommonjs = require("@rollup/plugin-commonjs");
const rollupTS = require("@rollup/plugin-typescript");
const { nodeResolve: rollupNodeResolve } = require("@rollup/plugin-node-resolve");
const { terser: rollupTerser } = require("rollup-plugin-terser");

const UMD_OUTPUT_PATH = "dist";

async function bundleUmd() {
  const bundle = await rollup.rollup({
    input: "./src/index.ts",
    plugins: [rollupCommonJs(), rollupNodeResolve(), rollupTS()],
  });

  const umdOutputConfig = {
    format: "umd",
    globals: { react: "React" },
    name: "material-components",
    sourcemap: true,
  };
  await bundle.write({
    ...umdOutputConfig,
    file: `./${UMD_OUTPUT_PATH}/index.js`,
  });
  await bundle.write({
    ...umdOutputConfig,
    plugins: [rollupTerser()],
    file: `./${UMD_OUTPUT_PATH}/index.min.js`,
  });
}
```

### 编译成声明文件

```javascript
const gulp = require("gulp");
const ts = require("gulp-typescript");

const CJS_OUTPUT_PATH = "lib";
const ESM_OUTPUT_PATH = "esm";
const TS_INTPUT_PATHS = ["src/**/*.{ts,tsx}", "!src/**/{demos,__test__}/*.{ts,tsx}"];

function compileTsToTypes() {
  return gulp
    .src(TS_INTPUT_PATHS)
    .pipe(
      ts({
        esModuleInterop: true,
        skipLibCheck: true,
        declaration: true,
        emitDeclarationOnly: true,
        jsx: "react",
      })
    )
    .pipe(gulp.dest(CJS_OUTPUT_PATH))
    .pipe(gulp.dest(ESM_OUTPUT_PATH));
}
```

### 打包 CSS

先用 postcss 来打包 CSS，然后用 cssnano 压缩，最后生成 source map 文件：

```javascript
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");
const sourcemaps = require("gulp-sourcemaps");

const UMD_OUTPUT_PATH = "dist";

function bundleCss() {
  return gulp
    .src("src/index.css")
    .pipe(postcss())
    .pipe(gulp.dest(UMD_OUTPUT_PATH))
    .pipe(sourcemaps.init())
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(UMD_OUTPUT_PATH));
}
```

### 执行效果

```bash
$ npx gulp
[16:16:27] Using gulpfile
[16:16:27] Starting 'default'...
[16:16:27] Starting 'clean'...
[16:16:27] Finished 'clean' after 5.53 ms
[16:16:27] Starting 'bundleCss'...
[16:16:27] Starting 'bundleTsToUmd'...
[16:16:27] Starting 'compileTsToTypes'...
[16:16:27] Starting 'compileTsToCjs'...
[16:16:27] Starting 'compileTsToEsm'...
[16:16:30] Finished 'bundleCss' after 3.01 s
[16:16:30] Finished 'compileTsToEsm' after 3.02 s
[16:16:30] Finished 'compileTsToCjs' after 3.02 s
[16:16:30] Finished 'compileTsToTypes' after 3.02 s
[16:16:31] Finished 'bundleTsToUmd' after 3.64 s
[16:16:31] Finished 'default' after 3.65 s
```

## 参考

- [https://babeljs.io/docs/en/](https://babeljs.io/docs/en/)
- [https://rollupjs.org/guide/en/](https://rollupjs.org/guide/en/)
