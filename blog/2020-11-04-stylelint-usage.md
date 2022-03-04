---
title: Stylelint 使用教程
tag: 开发工具
category: 前端
last_modified_at: 2022-02-09
---

Stylelint 是一个强大的、现代的 linter，可以帮助你在编写样式过程中避免错误和强制执行约定。

## 特性

它的强大之处在于：

- 有超过 170 条内置规则来支持现代 CSS 语法和特性
- 支持插件，所以你可以创建自己的规则
- 尽可能的自动修复问题
- 本身被很好的测试过，有超过 15000 个单元测试
- 支持可共享的配置，所以你可以扩展已有的或创建新的
- 有一个增长的社区，被 Google、GitHub 和 WordPress 所使用

通过扩展也可以做到：

- 解析 CSS-like 语法，像 SCSS、Sass、Less 和 SugarSS
- 从 HTML、Markdown 和 CSS-inJS 对象/模版中提取出嵌入的样式

## 开始使用

先安装 stylelint：

```bash
$ yarn add -D stylelint
```

### Lint CSS

1. 安装 stylelint 的标准配置：

```bash
$ yarn add -D stylelint-config-standard
```

2. 在项目的根目录中，创建配置文件`stylelint.config.js`，然后添加如下内容：

```javascript
module.exports = {
  extends: ["stylelint-config-standard"],
};
```

3. 执行 stylelint 检查所有的 CSS 文件：

```bash
$ yarn stylelint "**/*.css"
```

### Lint SCSS

1. 安装 stylelint 的 SCSS 配置：

```bash
$ yarn add -D stylelint-config-standard-scss
```

2. 在项目的根目录中，创建配置文件`stylelint.config.js`，然后添加如下内容：

```javascript
module.exports = {
  extends: ["stylelint-config-standard-scss"],
};
```

3. 执行 stylelint 检查所有的 SCSS 文件：

```bash
$ yarn stylelint "**/*.scss"
```

## 集成

### 与 Prettier 集成

使用 Prettier 共享的配置，先安装：

```bash
$ yarn add -D stylelint-config-prettier
```

然后修改配置文件：

```javascript
module.exports = {
  extends: ['stylelint-config-standard'， ‘stylelint-config-prettier’],
};
```

### 编辑器集成

- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - VS Code
- [linter-stylelint](https://github.com/AtomLinter/linter-stylelint) - Atom plugin for Stylelint
- [SublimeLinter-stylelint](https://github.com/SublimeLinter/SublimeLinter-stylelint) - Sublime Text plugin for Stylelint
- [Ale](https://github.com/dense-analysis/ale) - Vim plugin that supports Stylelint
- [Flycheck](https://github.com/flycheck/flycheck) - Emacs extension that supports Stylelint
- [JetBrains IDEs](https://www.jetbrains.com/products/#lang=js) – WebStorm, IntelliJ IDEA, PhpStorm, PyCharm, RubyMine, and other JetBrains IDEs have [built-in support](https://www.jetbrains.com/help/webstorm/using-stylelint-code-quality-tool.html) for Stylelint

## 参考链接

- [https://stylelint.io/](https://stylelint.io/)
