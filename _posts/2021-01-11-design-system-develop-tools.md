---
title: Design System 组件库搭建之开发工具
excerpt: 本篇文章主要介绍组件库使用的开发工具，正所谓：工欲善其事，必先利其器。
tags: ["Design System", "开发工具"]
category: 前端
last_modified_at: 2022-02-08
---

## 前言

在 20 世纪 60 年代，计算机技术开始超过软件编程的速度。计算机变得更快、更便宜，但是软件开发仍然缓慢，难以维护，并且容易出错。这种差距，以及如何应对，被称为“软件危机”。1968 年，在北约软件工程会议上，Douglas McIlroy 提出了基于组件的开发作为解决这一困境的可能方法。基于组件的开发提供了一种通过使代码可重用来加快编程潜力的方法，从而使其更高效且更易于扩展。这降低了工作量，提高了软件开发的速度，使软件能够更好地利用现代计算机的力量。

现在，50 年后，我们正经历着类似的挑战，但这次是在设计方面。设计正在努力扩展它所支持的应用程序，因为设计仍然是针对单个问题的定制解决方案。你是否曾经执行过用户界面审计，发现你使用了几十种相似的蓝色色调，或者相同按钮的排列？将其乘以应用程序中的每个 UI，您就会开始意识到设计变得多么不一致、不完整和难以维护。

设计系统通过设计可重复使用，让团队能够更快更好地研发出产品。这是设计系统的核心和主要价值。设计系统是可重用组件的集合，遵循明确的标准，可以将其组装在一起以构建任意数量的应用程序。

GrowingIO 产品研发团队也开始通过搭建自己的设计系统—— GrowingIO Design System，来提供交互体验一致的产品和提升研发效率。组件库做为设计系统的重要组成部分，前端团队通过系列文章来介绍如何一步步搭建组件库。本篇文章主要介绍组件库 [GrowingIO Design](https://github.com/growingio/gio-design) 使用的开发工具，正所谓：工欲善其事，必先利其器。

## TL;DR

本文按照工具的作用把工具分为：代码规范和代码管理两类，这两类主要用到的工具有：

1. 代码规范工具
   a. `Prettier`：用于代码格式化
   b. `stylelint`：对样式文件（ `CSS`  和 `Less` ）进行规范检查
   c. `ESLint`：对`ECMAScript/JavaScript` 代码进行规范检查
2. 代码管理工具
   a. `Commitzen`：帮助编写规范的 commit message
   b. `commitlint`：对 commit message 格式进行检查
   c. `lint-stage`：只对 `git`  缓存的代码文件进行规范检查，提高速度
   d. `husky`：整合所有的检查工具

`husky` 如何把检查工具都整合的，如下图所示：
其中：

- `pre-commit` 阶段：执行 `lint-staged` ，会对暂存的文件执行 `prettier` 、`stylelint` 和 `eslint` 三个命令。
- `commit-msg` 阶段：执行 `commitlint`，检查 commit message 是否符合规范。

接下来，对这两类用到的工具进行详细介绍。

## 代码规范工具

代码规范相当于团队乃至公司的整个技术团队协作的契约，同时这些规范是经过许多项目实践出来的宝贵经验，可以在开发中少走很多的弯路。代码规范性靠人工在 Code Review 时候检查太费时费力，所以主要用工具来保障。这里主要使用的是 `Prettier` 、`stylelint` 和 `ESLint` 三个工具。

### Prettier

`Prettier`  是一个“有态度”的代码格式化工具，它支持：

- JavaScript （包括实验性功能）
- [JSX](https://facebook.github.io/jsx/)
- [Angular](https://angular.io/)
- [Vue](https://vuejs.org/)
- [Flow](https://flow.org/)
- [TypeScript](https://www.typescriptlang.org/)
- CSS、[Less](http://lesscss.org/) 和 [SCSS](https://sass-lang.com/)
- [HTML](https://en.wikipedia.org/wiki/HTML)
- [JSON](https://json.org/)
- [GraphQL](https://graphql.org/)
- [Markdown](https://commonmark.org/)，包括 [GFM](https://github.github.com/gfm/) 和 [MDX](https://mdxjs.com/)
- [YAML](https://yaml.org/)

它移除了所有原始样式并确保输出的所有代码都符合一致的样式。它也会把代码行的长度也纳入考量，然后把代码重新打印出来。
例如，对于以下代码：

```javascript
foo(arg1, arg2, arg3, arg4);
```

这段代码一行正合适，因此格式化后代码将保持原样。但是，我们都遇到过这种情况：

```javascript
foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());
```

这段代码太长了，我们之前调用方法的格式就不适用了。Prettier 会做详尽的工作重新输出这段代码，像下面的代码一样：

```javascript
foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());
```

#### 安装

```bash
$ yarn add --dev --exact prettier
```

#### 配置

在项目根目录创建配置文件：

```bash
$ echo {}> .prettierrc.js
```

下一步创建 `.prettierignore`  文件，用来告诉 `Prettier CLI`  或者编辑器哪些文件不需要代码格式化：

```
build
coverage
```

#### 使用

运行一下命令来格式化现有代码：

```bash
$ yarn prettier --write .
```

这部分工作可以集成到 `Git`  流程中，详情见后文。

### stylelint

`stylelint`  是一个强大的，现代的 `linter`，帮助你避免错误，并在你的风格中执行惯例。
它的强大之处:

- 了解最新的 `CSS`  语法，包括自定义属性和 4 级选择器
- 从 `HTML`、 `markdown`  和 `CSS-in-JS`  对象和模板文字中提取嵌入样式
- 解析类似 `CSS`  的语法，如 `SCSS`、 `Sass`、 `Less`  和 `SugarSS`
- 有超过 170 个 内置规则来捕捉错误、应用限制和执行风格惯例
- 支持插件，因此您可以创建自己的规则或使用社区编写的插件
- 自动修复大多数风格违规
- 通过超过 15000 个单元测试进行了良好的测试
- 支持可扩展或创建的共享配置
- 不固执己见，因此您可以根据自己的实际需要对其进行自定义
- 拥有不断发展的社区，并被 Facebook、GitHub 和 WordPress 使用

#### 安装

前文提到使用 `Prettier`  工具，为了和 `Prettier`  配置，这里额外安装 `stylelint-config-prettier`  插件：

```bash
$ yarn add --dev stylelint stylelint-config-standard stylelint-config-prettier
```

#### 配置

在项目根目录创建配置文件 `.stylelintrc.js`：

```javascript
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
};
```

#### 使用

检查文件的命令：

```bash
$ npx stylelint --syntax less --fix
```

GrowingIO Design 使用 `less`  来编写样式，这里增加了 `--syntax less`  参数，通过 `--fix`  参数直接修改不符合规范的文件。

### ESLint

`ESLint`  是在 `ECMAScript/JavaScript`  代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。在许多方面，它和 `JSLint`、 `JSHint` 相似，除了少数的例外：

- `ESLint`  使用 [Espree](https://github.com/eslint/espree) 解析`JavaScript`；
- `ESLint` 使用 AST 去分析代码中的模式；
- `ESLint` 是完全插件化的,每一个规则都是一个插件并且你可以在运行时添加更多的规则。

> Esprima 是用 ECMAScript 编写的高性能、标准兼容的 ECMAScript 解析器。
> Espree 现在建立在 Acorn 之上，Acorn 具有模块化架构，允许扩展核心功能。Espree 的目标是通过类似的 API 产生类似于 Esprima 的输出，以便可以代替 Esprima 使用。

#### 安装

```bash
$ yarn add --dev eslint
```

#### 配置

这里用 `ESLint`  命令来初始化配置：

```bash
$ npx eslint --init
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · airbnb
✔ What format do you want your config file to be in? · YAML
Checking peerDependencies of eslint-config-airbnb@latest
The config that you've selected requires the following dependencies:

eslint-plugin-react@^7.20.0
@typescript-eslint/eslint-plugin@latest
eslint-config-airbnb@latest
eslint@^5.16.0 || ^6.8.0 || ^7.2.0
eslint-plugin-import@^2.21.2
eslint-plugin-jsx-a11y@^6.3.0
eslint-plugin-react-hooks@^4 || ^3 || ^2.3.0 || ^1.7.0
@typescript-eslint/parser@latest

```

同样，为了和 `Prettier`  配合，额外安装：

```bash
$ yarn add --dev eslint-plugin-prettier eslint-config-prettier
```

然后修改 `.eslintrc.js`  文件：

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier", "prettier/react"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
```

#### 使用

运行命令：

```bash
$ npx eslint --cache --fix
```

- `--cache` ：存储有关已处理文件的信息，以便仅对更改的文件进行操作。
- `--fix` ：对违反规则的代码，会根据规则进行修改。

### 最终效果

代码规范工具前面都介绍完了，把它们集成到 CI 流程中，如下图所示：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1610021216771-0e435ed5-cb15-4431-b194-2d91b20f1da6.png#align=left&display=inline&height=491&margin=%5Bobject%20Object%5D&name=image.png&originHeight=982&originWidth=1750&size=914151&status=done&style=none&width=875)
这里 CI 工具用的是 [GitHub Actions](https://github.com/features/actions)，这样可以把结果注释到代码中，如下图所示：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1610021249937-1565e981-79d0-46dc-ad16-2c943db14dcd.png#align=left&display=inline&height=652&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1304&originWidth=1220&size=592708&status=done&style=none&width=610)

## 代码管理工具

这部分主要介绍如何把前面介绍的代码规范工具集成到代码提交流程中，并且规范每次代码提交。本文以代码管理工具 `Git` 为例， `Git`  每次提交代码，都要写 Commit Message（提交说明），否则就不允许提交。格式化的 Commit Message，有几个好处：

- 提供更多的历史信息，方便快速浏览。
- 可以过滤某些 commit（比如文档改动），便于快速查找信息。
- 可以直接从 commit 生成 Change log。

更多内容查看[《Commit message 和 Change log 编写指南》](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)文章。

### Commitizen

`Commitizen`  是一个撰写合格 Commit Message 的工具。

#### 安装

命令如下：

```bash
$ yarn global add commitizen
```

然后，在项目目录里，运行下面的命令，使其支持规范的 Commit Message 格式：

```bash
$ commitizen init cz-conventional-changelog --yarn --dev --exact
```

#### 使用

以后，凡是用到 `git commit`  命令，一律改为使用 `git cz`。这时，就会出现选项，用来生成符合格式的 Commit Message。

### commitlint

`commitlint`  帮助您的团队遵守提交约定。通过支持 npm 安装的配置，可以轻松共享提交约定。

#### 安装

```bash
yarn add --dev @commitlint/config-conventional @commitlint/cli
```

#### 配置

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > .commitlintrc.js
```

### lint-stage

针对暂存的 `git`  文件运行 `linters`。

#### 安装

```bash
$ npx mrm lint-staged
```

#### 配置

创建 `.lintstagedrc.js`  文件：

```javascript
module.exports = {
  "**/*": "prettier --write --ignore-unknown",
  "*.less": "stylelint --syntax less --fix",
  "*.(j|t)s?(x)": "eslint --cache --fix",
};
```

### husky

`husky`  改善你的 `commits`  和更多 🐶 喔！您可以使用它来删除提交消息、运行测试、删除代码等。当您提交或推送时。`husky` 支持所有的 `git hooks`。

#### 安装

```bash
$ yarn add --dev husky
```

#### 配置

这里通过配置 `git hooks`  把前文提到的工具全都串起来！
创建 `.huskrc.js`  文件：

```javascript
module.exports = {
  hooks: {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  },
};
```

#### 使用

以后只要执行 `git cz`  后，就可以看到以下信息：

```bash
$ git cz
...
husky > pre-commit (node v12.20.0)
✔ Preparing...
✔ Running tasks...
✔ Applying modifications...
✔ Cleaning up...
husky > commit-msg (node v12.20.0)
...
```

## 小结

文章开头介绍了设计系统通过设计可重复使用，让团队能够更快更好地研发出产品。这也是 GrowingIO 产品研发团队搭建组件库的主要原因。后续详细介绍了组件库用到的开发工具，可以做为大家在搭建组件库时候的一份参考。

## 参考

- [Design Systems Handbook](https://www.designbetter.co/design-systems-handbook)
- [GrowingIO Design](https://github.com/growingio/gio-design)
- [Prettier · Opinionated Code Formatter](https://prettier.io/)
- [A mighty, modern style linter · stylelint](https://stylelint.io/)
- [ESLint - Pluggable JavaScript linter](https://eslint.org/)
- [Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [Commitizen by commitizen](http://commitizen.github.io/cz-cli/)
- [commitlint - Lint commit messages](https://commitlint.js.org/#/)
- [lint-staged - Run linters on git staged files](https://github.com/okonet/lint-staged)
- [Husky improves your commits and more 🐶 woof!](https://github.com/typicode/husky/tree/master)
