---
title: Prettier 使用教程
descirption: Prettier 是一个代码格式工具，支持大部分常用的编程语言，本文介绍如何使用 Prettier。
authors: jack
tags: ["开发工具"]
category: 前端
---

## Prettier 是什么

Prettier 是一个“有态度”的代码格式化工具，它支持：

- JavaScript ：JSX、TypeScript 和 Flow
- HTML：Ember、Angular 和 Vue
- CSS：Less、SCSS、styled-components、styled-jsx
- Markdown：CommonMark、GitHub-Flavored Markdown、MDX
- 其他：GraphQL、YAML

<!--truncate-->

对于其他语言也有社区的支持，比如：

- [Apex](https://github.com/dangmai/prettier-plugin-apex)
- [Elm](https://github.com/gicentre/prettier-plugin-elm)​
- [Java](https://github.com/jhipster/prettier-java)
- [PHP](https://github.com/prettier/plugin-php)
- [Ruby](https://github.com/prettier/plugin-ruby)
- [TOML](https://github.com/bd82/toml-tools/tree/master/packages/prettier-plugin-toml)
- [XML](https://github.com/prettier/plugin-xml)

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

## Prettier vs. Linters

对于像 ESLint 这种 Linter，它的规则可以分为两类：

1.  格式规则

    - ​[max-len](https://eslint.org/docs/rules/max-len)
    - [no-mixed-spaces-and-tabs](https://eslint.org/docs/rules/no-mixed-spaces-and-tabs)
    - [keyword-spacing](https://eslint.org/docs/rules/keyword-spacing)
    - [comma-style](https://eslint.org/docs/rules/comma-style)

2.  代码质量规则

    - [no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)
    - [no-extra-bind](https://eslint.org/docs/rules/no-extra-bind)
    - [no-implicit-globals](https://eslint.org/docs/rules/no-implicit-globals)
    - [prefer-promise-reject-error](https://eslint.org/docs/rules/prefer-promise-reject-errors)

对于代码质量规则，Prettier 无能为力，但是格式规则完全可以胜任，甚至做的更好。换句话说：

**用 Prettier 来格式化代码，linters 提升代码质量！**

## 使用

### 安装

首先，本地安装 Prettier：

```bash
$ yarn add --dev --exact prettier
```

然后，创建一个空的配置文件，用来告诉编辑器和其它工具，你正在使用 Prettier：

```bash
$ echo {}> prettier.config.js
```

现在，就可以用 Prettier 来格式化所有文件了：

```bash
$ yarn prettier --write .
```

### 忽略代码

使用`.prettierignore`文件来忽略某些文件或目录，它的语法和 [gitignore syntax](https://git-scm.com/docs/gitignore#_pattern_format) 一致。
比如：

```
# Ignore artifacts:
build
coverage

# Ignore all HTML files:
*.html
```

也可以用`prettier-ignore`注释来文件中的一部分。
比如：

```javascript
// prettier-ignore
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)
```

```jsx
<div>
  {/* prettier-ignore */}
  <span     ugly  format=''   />
</div>
```

```html
<!-- prettier-ignore -->
<div         class="x"       >hello world</div            >

<!-- prettier-ignore-attribute -->
<div (mousedown)="       onStart    (    )         " (mouseup)="         onEnd      (    )         "></div>

<!-- prettier-ignore-attribute (mouseup) -->
<div (mousedown)="onStart()" (mouseup)="         onEnd      (    )         "></div>
```

```css
/* prettier-ignore */
.my    ugly rule
{

}
```

```markdown
<!-- prettier-ignore -->
Do   not    format   this
```

```yaml
# prettier-ignore
key  : value
hello: world
```

### 和 Linters 集成

Linters 往往不仅仅有代码质量的规则，也会有代码格式的规则。它们的大部分格式规则会和 Prettier 冲突。
Prettier 官方提供了一下配置和 Linters 共存：

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- [tslint-config-prettier](https://github.com/alexjoverm/tslint-config-prettier)
- [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier)

​

### 和编辑器集成

- VS Code：[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Atom：`apm install prettier-atom`
- Emacs：[prettier-emacs](https://github.com/prettier/prettier-emacs)
- Vim：[vim-prettier](https://github.com/prettier/vim-prettier)

## 参考链接

- [https://prettier.io/](https://prettier.io/)
