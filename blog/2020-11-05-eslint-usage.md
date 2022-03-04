---
title: ESLint 使用教程
tag: 开发工具
category: 前端
last_modified_at: 2022-02-09
---

ESLint——在你的 JavaScript 代码中查找并解决问题。

## 特性

ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。在许多方面，它和 JSLint、JSHint 相似，除了少数的例外：

- ESLint 使用 [Espree](https://github.com/eslint/espree) 解析 JavaScript。
- ESLint 使用 AST 去分析代码中的模式
- ESLint 是完全插件化的。每一个规则都是一个插件并且你可以在运行时添加更多的规则。

## 开始使用

### 安装

先决条件：支持 SSL 的 [Node.js](https://nodejs.org/en/) (^12.22.0, ^14.17.0, or >=16.0.0)，如果 Node.js 使用的官方版本，SSL 已经支持了。
安装到项目：

```bash
$ yarn add -D eslint
```

然后创建配置文件，可以使用命令：

```bash
$ yarn create @eslint/config
```

### 配置

#### 使用流行配置

对于 eslint 的 config，可以用预置的，比如下面的例子是用 Airbnb 的配置：

```
success Installed "@eslint/create-config@0.1.2" with binaries:
      - create-config
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser, node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · airbnb
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-airbnb@latest
The config that you've selected requires the following dependencies:

eslint-plugin-react@^7.28.0 @typescript-eslint/eslint-plugin@latest eslint-config-airbnb@latest eslint@^7.32.0 || ^8.2.0 eslint-plugin-import@^2.25.3 eslint-plugin-jsx-a11y@^6.5.1 eslint-plugin-react-hooks@^4.3.0 @typescript-eslint/parser@latest
✔ Would you like to install them now with npm? · No / Yes
A config file was generated, but the config file itself may not follow your linting rules.
Successfully created .eslintrc.js file
✨  Done in 244.26s.
```

#### 自定义

如果以上的都不使用，可以根据提示完全自定义：

```
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser, node
✔ How would you like to define a style for your project? · prompt
✔ What format do you want your config file to be in? · JavaScript
✔ What style of indentation do you use? · 4
✔ What quotes do you use for strings? · single
✔ What line endings do you use? · unix
✔ Do you require semicolons? · No / Yes
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
✔ Would you like to install them now with npm? · No / Yes
A config file was generated, but the config file itself may not follow your linting rules.
Successfully created .eslintrc.js file in /Users/Jack/Projects/Frontend/design-system-template-react
✨  Done in 64.41s.
```

#### 另一种选择

对于 React 项目，我们大多会使用 create-react-app 这个工具来初始化。为了保持一致，我们可以使用 react-app 的配置。
首先，安装：

```bash
$ yarn add -D eslint-config-react-app
```

然后修改`.eslintrc.js`文件：

```javascript
module.exports = {
  extends: ["react-app", "react-app/jest"],
};
```

## 集成

### 与 Prettier 集成

安装 eslint-config-prettier：

```bash
$ yarn add -D eslint-config-prettier
```

修改配置文件，在 `extends`数组中增加`"prettier"`，比如：

```javascript
module.exports = {
  extends: ["react-app", "react-app/jest", "prettier"],
};
```

### 与编辑器集成

- VS Code: [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Vim:
  - [ALE](https://github.com/w0rp/ale)
  - [Syntastic](https://github.com/vim-syntastic/syntastic/tree/master/syntax_checkers/javascript)
- Emacs: [Flycheck](http://www.flycheck.org/) supports ESLint with the [javascript-eslint](http://www.flycheck.org/en/latest/languages.html#javascript) checker.
- Atom: [linter-eslint](https://atom.io/packages/linter-eslint)
- IntelliJ IDEA, WebStorm, PhpStorm, PyCharm, RubyMine, and other JetBrains IDEs: [How to use ESLint](https://www.jetbrains.com/help/webstorm/eslint.html)

## 参考链接

- [https://eslint.org/docs/user-guide/getting-started](https://eslint.org/docs/user-guide/getting-started)
