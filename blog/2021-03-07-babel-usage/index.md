---
title: Babel 使用教程
authors: jack
tags: ["编译工具"]
category: 前端
---

本文主要介绍 Babel 的基础使用，以及一些常用的预设。

<!-- truncate -->

## Babel 是什么

Babel 是一个 JavaScript 编译器。Babel 也是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

```javascript
// Babel 输入： ES2015 箭头函数
[1, 2, 3].map(n => n + 1);

// Babel 输出： ES5 语法实现的同等功能
[1, 2, 3].map(function(n) {
  return n + 1;
});
```

## 快速开始

1. 运行以下命令安装所需的包（package）：

```bash
yarn add -D @babel/core @babel/cli
```

2. 在项目的根目录下创建一个命名为`babel.config.js`的配置文件：

```javascript
module.exports = {};
```

3. 运行此命令将 src 目录下的所有代码编译到 lib 目录：

```bash
npx babel src --out-dir lib
```

## 预设（Presets）

### preset-env

`@babel/preset-env` 是一个智能的预设，可以让你无负担的使用最新的 JavaScript，不用针对目标环境做一些语法转换。

1. 安装：

```bash
yarn add -D @babel/preset-env
```

2. 修改`babel.config.js`配置：

```javascript
module.exports = {
	presets: [
  	[
      "@babel/preset-env",
      {
        useBuiltIns: "entry"
      }
    ]
  ],
};
```

3. 配置 `.browserslistrc`：

```plain
> 0.25%
not dead
```

> 这里配置是只支持市场占有率大于 0.25% 的那些浏览器，忽略没有安全更新的浏览器，比如 IE 10 和 黑莓移动浏览器。

### preset-react

此预设包含以下插件：

- [@babel/plugin-syntax-jsx](https://www.babeljs.cn/docs/babel-plugin-syntax-jsx)
- [@babel/plugin-transform-react-jsx](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx)
- [@babel/plugin-transform-react-display-name](https://www.babeljs.cn/docs/babel-plugin-transform-react-display-name)

1. 安装：

```bash
yarn add -D @babel/preset-react
```

2. 配置：

```javascript
module.exports = {
  presets: ["@babel/preset-react"]
}
```

### preset-typescript

项目中使用了 TypeScript，推荐使用此预设。它包含以下插件：

- [@babel/plugin-transform-typescript](https://www.babeljs.cn/docs/babel-plugin-transform-typescript)

1. 安装：

```bash
yarn add -D @babel/preset-typescript
```

2. 配置：

```javascript
module.exports = {
  presets: ["@babel/preset-typescript"]
}
```

## 参考

- [https://babeljs.io/docs/en/](https://babeljs.io/docs/en/)
