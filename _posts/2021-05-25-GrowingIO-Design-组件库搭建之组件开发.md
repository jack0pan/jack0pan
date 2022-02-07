在《GrowingIO Design 组件库搭建之开发工具》一文中介绍了搭建组件库的原因和使用的开发工具，这篇文章就来介绍组件库的主角：组件。先从组件的定义说起。
## 组件的定义
组件是标准化的、可互换的 UI 模块。它们封装了 UI 部分的外观和功能。想想乐高积木。乐高积木可用于建造从城堡到宇宙飞船的所有东西，组件可以拆开并用于创建新功能。
组件通过将状态与应用程序业务逻辑隔离来实现互换性。这样，你可以将复杂的屏幕分解成简单的组件。每个组件都有定义明确的 API 和可被 Mock 的系列状态。这允许组件被拆开和重组，以构建不同的 UI。
### 组件驱动 UI
前面明确了组件定义之后，如何从一个个组件构建出完整的 UI。过程如下：


1. 一次构建一个组件：隔离构建每个组件并定义其相关状态。从小处着手。
1. 组合组件：将小组件组合在一起以解锁新功能，同时逐渐增加复杂性。
1. 组装页面：通过组合复合组件来构建页面。使用 Mock 数据模拟页面的难以到达状态和边缘情况。
1. 集成到项目中：通过连接数据和连接业务逻辑，将页面添加到您的应用程序。



组件驱动 UI 的好处：

- **质量**: 通过隔离构建组件并定义其相关状态，验证用户界面在不同场景中工作。
- **耐用性**: 通过在组件级别进行测试，将缺陷精确到细节。它比测试屏幕工作更少，也更精确。
- **速度**: 通过重用组件库或设计系统中的现有组件，更快地组装 UI。
- **效率**: 通过将用户界面分解成离散的组件，然后在不同的团队成员之间分担负载，并行化开发和设计。



接下来就得介绍如何用代码实现组件了。但是，在此，先说说代码仓库的事。
## 代码仓库
从代码仓库的两种风格说起：Monorepo 和 Multirepo。

- **Monorepo**：是将所有的代码都存放在一个仓库中。组件库中使用此种方式的是 Material Components for the web，所有组件都存放在 packages 目录下，每个组件都是一个 package，并且统一发版。
- **Multirepo**：将代码分成多个部分，存放在不同的仓库中。此种方式的代表是 react-component，每个组件都是单独仓库，每个组件都可单独发版。



对于 GrowingIO Design 来说以上两种都不适合，一方面是做不到 Material Design 那样统一发版，有些简单组件开发完后会长时间不更新；另一方面是组件太多，使用 Multirepo 方式，导致仓库很多，维护成本太大。所以，GrowingIO Design 采用了常见的 Monolith 风格，用一个仓库，不同组件放在不同目录下，并且最终只有一个 package。
## 组件目录
代码仓库风格问题解决了，上一节也提到了不同组件放在不同目录下，考虑到组件会随着迭代越来越多，有必要提前规范一下组件的目录结构，明确一下一个组件至少应该包含哪些文件。
```
component
├── Component.mdx
├── Component.stories.tsx
├── Component.tsx
├── __tests__
├── index.ts
├── interfaces.ts
└── style
```

- Component.mdx 是组件的文档，包括组件定义的规范等内容；
- Component.stories.tsx 存放组件的各种使用场景的 Demo；
- Component.tsx 就是组件的具体实现文件了；
- index.ts 主要是 export 组件和各种 props；
- interfaces.ts 定义组件的各种 props。

​

> 其中， __tests__ 和 style 两个目录，这里先不介绍，埋个伏笔，它们的详细介绍会放在组件测试和组件打包两篇文章中。



## 组件实现
对于单个组件的实现，这里就不详细介绍。这是因为组件的编写需要各位“八仙过海，各显神通”了。
GrowingIO Design 大部分组件是基于 react-component 封装的，剩下的就是完全自己实现了。具体代码可以去我们 GitHub 上的仓库查看。
## 组件文档
到这里，就剩下组件如何使用组件的问题，这就需要组件的文档工具了，可选的工具有好多。
### 工具选型
![cdd-2019.jpeg](https://cdn.nlark.com/yuque/0/2021/jpeg/86170/1612969015513-64717bb8-e9f0-4072-bdb1-8306e6248a91.jpeg#height=1433&id=kni9N&margin=%5Bobject%20Object%5D&name=cdd-2019.jpeg&originHeight=1433&originWidth=2097&originalType=binary&size=133639&status=done&style=none&width=2097)
常用的几种工具：

- **Storybook**：可帮助你编写组件文档以供重用，并自动可视化测试组件以防止 Bug。
- **docz**：使您能够使用 MDX 快速创建实时重载、搜索引擎优化友好、可用于生产的文档网站，并在需要时利用 GatsbyJS 和 Gatsby 主题定制外观、感觉和行为。
- **React Styleguidist**：带有生活风格指南的聚合反应组件开发环境。
- **dumi**：中文发音嘟米，是一款为组件开发场景而生的文档工具，与 father 一起为开发者提供一站式的组件开发体验，father 负责构建，而 dumi 负责组件开发及组件文档生成。



GrowingIO Design 最终选用了 Stroybook，原因只有一点：Controls 插件支持改变组件的 props，实时看到效果，可以减少很多 Demo 代码。具体示例如下：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1613641467532-37394639-f90f-4f2d-8e17-d2193c5e04a8.png#height=839&id=vC6DB&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1678&originWidth=1788&originalType=binary&size=338354&status=done&style=none&width=894)
### 文档规范
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1613641503456-d8710449-b113-4889-a644-571d98376954.png#height=848&id=wAIjp&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1696&originWidth=1806&originalType=binary&size=462851&status=done&style=none&width=903)
文档主要包含以下几部分：


1. **标题和子标题：**标题直接是组件的英文名称和中文名称，用 Markdown 的一级标题语法，子标题使用 Storybook 的 `Subtitle` 组件。
1. **使用规范：**使用 Markdown 的二级标题语法，主要描述组件的各种使用场景。
1. **参数说明**：使用 Markdown 的二级标题语法，使用 Storybook 的 `ArgsTable` 展示组件的 `Props` 类型。
1. **代码演示**：用 `Story` 来展示组件的各种使用场景，每种场景对应一个 `Story`。主要提供场景的描述和 `Story` 链接，场景名称使用 Markdown 的三级标题，`Story` 链接使用相对链接。



## 总结
本文主要从以下几个方面介绍如何开发组件：

- 代码仓库采用最常见的 Monolith 风格，统一管理所有组件的代码；
- 组件目录规范了不同类型的文件命名方式；
- 组件文档使用 Storybook 来 Demo 组件的样式，并提供组件的设计规范。
## 参考

- Component Driven User Interfaces [https://www.componentdriven.org/](https://www.componentdriven.org/)
- Monorepo [https://en.wikipedia.org/wiki/Monorepo](https://en.wikipedia.org/wiki/Monorepo)
- Material Components for the web [https://github.com/material-components/material-components-web](https://github.com/material-components/material-components-web)
- react-component [https://github.com/react-component](https://github.com/react-component)
- Storybook [https://storybook.js.org/](https://storybook.js.org/)
- docz [https://www.docz.site/](https://www.docz.site/)
- React Styleguidist [https://react-styleguidist.js.org/](https://react-styleguidist.js.org/)
- dumi [https://d.umijs.org/](https://d.umijs.org/)



