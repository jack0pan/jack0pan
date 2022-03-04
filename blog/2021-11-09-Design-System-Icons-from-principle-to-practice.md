---
title: Design System 图标库：从原理到实践
excerpt: 本文先介绍 Bootstrap Icons 的各种实现方式，然后再 GrowingIO Design Icons 的原理与实现。
tags: ["Design System", "图标库"]
category: 前端
---

随着前端技术的发展，网页中的图标（Icon）已经不再局限于 `<img>`  标签，还有很多实现方式，比如：Sprites（俗称雪碧图）、Icon Font（字体图标）、SVG 等等。而一个被工程师所熟知的前端框架 Bootstrap，用这些技术实现了它的图标库。
本文先介绍 Bootstrap Icons 的各种实现方式，然后再 GrowingIO Design Icons 的原理与实现。

<!--truncate-->

## Bootstrap Icons

### `<img>`

![bootstap-logo.png](https://ik.imagekit.io/jnskuq5ualk/jack0pan/design-system-icons/bootstrap-logo_r6tTTtLjr.png?ik-sdk-version=javascript-1.4.3&updatedAt=1644306159334)
通过 `<img>` 标签来展示图标是最原始、最简单的实现方式，实现上图的效果只需在 HTML 中插入如下代码：

```html
<img src="/assets/img/bootstrap.svg" alt="Bootstrap" width="32" height="32" />
```

但是，这种方式也有一个缺点：在图片显示前需要等待一个 HTTP 会话的时间，当一个页面有若干个图标时，这个时间就的很长。

### Sprites

为了解决上面提到的问题，雪碧图就应运而生。假设下图为页面上需要展示的三个图标：

![bootstrap-sprites.png](https://ik.imagekit.io/jnskuq5ualk/jack0pan/design-system-icons/bootstrap-sprites_2JkQMUNAR0x.png?ik-sdk-version=javascript-1.4.3&updatedAt=1644306158996)

实现代码如下：

```html
<svg class="bi" width="32" height="32" fill="currentColor">
  <use xlink:href="bootstrap-icons.svg#heart-fill" />
</svg>
<svg class="bi" width="32" height="32" fill="currentColor">
  <use xlink:href="bootstrap-icons.svg#toggles" />
</svg>
<svg class="bi" width="32" height="32" fill="currentColor">
  <use xlink:href="bootstrap-icons.svg#shop" />
</svg>
```

雪碧图的原理就是把所有的图标都汇总到一个文件中，再通过 CSS 切图或者 SVG 的 `<symbol>` 来实现。不管要展示多少个图标，都只会有一个 HTTP 会话。
虽然通过 Sprites，把 HTTP 会话数量降低到一个，但是它的下载时机还是在第一次展示图标的时候，还是需要用户等在这个大文件的下载。

### Icon font

CSS 中 @font-face 的出现，为解决上述问题提供了思路。
@font-face CSS at-rule 指定一个用于显示文本的自定义字体，字体能从远程服务器或者用户本地安装的字体加载。使用方法如下：

```css
@font-face {
  font-family: "bootstrap-icons";
  src: url("./fonts/bootstrap-icons.woff2?a97b3594ad416896e15824f6787370e0") format("woff2"), url("./fonts/bootstrap-icons.woff?a97b3594ad416896e15824f6787370e0")
      format("woff");
}
```

展示如下图标：
![bootstrap-icon-font.png](https://ik.imagekit.io/jnskuq5ualk/jack0pan/design-system-icons/bootstrap-icon-font_25o1hoLpT.png?ik-sdk-version=javascript-1.4.3&updatedAt=1644306158467)

HTML 代码如下：

```html
<i class="bi-alarm" style="font-size: 2rem; color: cornflowerblue;"></i>
```

这样之后，可以用 `<link>` 来预先加载字体文件：

```html
<link rel="preload" href="./fonts/bootstrap-icons.woff2?a97b3594ad416896e15824f6787370e0" as="font" type="font/woff2" />
```

Icon font 虽然可以使用预加载，但还是需要一次 HTTP 会话。有没有不需要额外 HTTP 会话的方式？

### SVG

这时候就不得不提 SVG 了，因为可以用 `<svg>` 标签把 SVG 的定义嵌入到 HTML 代码中。比如下面的图标：
![bootstrap-svg.png](https://ik.imagekit.io/jnskuq5ualk/jack0pan/design-system-icons/bootstrap-svg_QCSpQw781.png?ik-sdk-version=javascript-1.4.3&updatedAt=1644306590857)

它的 SVG 代码为：

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  fill="currentColor"
  class="bi bi-chevron-right"
  viewBox="0 0 16 16"
>
  <path
    fill-rule="evenodd"
    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
  />
</svg>
```

这样只加载 HTML 页面就行了，不需要额外的 HTTP 请求来加载文件。

## GrowingIO Design Icons

基于上文的技术对比，GrowingIO Design Icons 选用 SVG 实现方式。但需要和 GrowingIO Design 配合使用，而后者定位是 React 组件库，所以需要将 SVG 转换成 React 组件，这样做也带来一些好处：

- 将 SVG 转换为 React 组件可减少一些多余的 SVG 样式。
- 转换成 React 组件后，可以更容易的控制 SVG 的样式。
- 可以使用 Babel 工具来实现按需引用，或者 Webpack 等打包工具来优化打包体积。

### 转换工具

实现方式确定了，接下来的问题就是：前端工程师从设计师那里拿到 SVG 文件后，如何自动的转换成 React 组件？
这里要引入一个新的工具—— SVGR。用它来转换一下 GrowingIO 的 Logo 文件：

![logo-black.svg](https://ik.imagekit.io/jnskuq5ualk/jack0pan/design-system-icons/gio-logo-black_n9XVGml24.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1644307036726)

得到代码如下：

```typescript
import * as React from "react";

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={143} height={30} fill="none" {...props}>
      <path
        d="M33.563 7.528c-.008.09-.008.183-.016.27v.011a8.823 8.823 0 01-.98 3.57c-.415.04-1.294.133-1.606.29-.406.183-.77.449-1.082.788-.32.356-.563.77-.742 1.22-.168.456-.258.949-.258 1.452v7.391c-.508.125-1.031.2-1.574.23a9.886 9.886 0 01-.344.008h-.383a9.042 9.042 0 01-1.5-.152V8.141a8.925 8.925 0 013.645-1.191h.156V8.39s1.61-.945 3.941-.91c.14.004.285.008.438.02.101.003.203.015.304.027zM77.012 1.684v3.043c-.028 0-.059.004-.09.004a9.055 9.055 0 00-3.727 1.086V2.762a8.955 8.955 0 013.707-1.074c.035-.004.075-.004.11-.004zM77.012 6.961v15.485c-.035.011-.075.015-.11.027a8.71 8.71 0 01-1.87.196 8.262 8.262 0 01-1.825-.192L73.195 8.09a8.989 8.989 0 013.817-1.129zM94.27 13.247v9.242a8.98 8.98 0 01-1.817.18 8.967 8.967 0 01-1.988-.22v-7.417c0-.055 0-.102-.012-.153a4.151 4.151 0 00-.262-1.316 3.672 3.672 0 00-.734-1.207 3.35 3.35 0 00-1.078-.797 2.991 2.991 0 00-2.586-.027c-.012.011-.04.015-.059.027a3.545 3.545 0 00-1.082.797 3.953 3.953 0 00-.734 1.207 4.258 4.258 0 00-.262 1.469v7.441a8.915 8.915 0 01-1.87.196c-.665 0-1.313-.07-1.934-.212V8.047c1.87-1.152 3.379-1.117 3.804-1.066v1.777a6.839 6.839 0 012.082-1.09 6.92 6.92 0 011.403-.285c.191-.011.386-.023.593-.023.168 0 .329.004.489.02a6.712 6.712 0 012.242.558c1.914.863 3.687 2.809 3.804 5.309zM71.832 7.368l-2.707 7.734-2.617 7.453-.047.137c-.04.008-.074.012-.113.02-.633.12-1.27.18-1.918.18-.192 0-.383-.005-.57-.02a7.926 7.926 0 01-1.297-.18l-.672-2.32-1.028-3.555-.707-2.445-.43 1.488-1.566 5.375-.406 1.39c-.309.067-.613.11-.922.141a10.124 10.124 0 01-2.945-.113l-.043-.11-2.57-7.707-2.497-7.476a8.872 8.872 0 011.95-.211c.722 0 1.418.086 2.093.246l.813 2.582 2.156 6.828 1.688-6.61.722-2.827a8.946 8.946 0 011.98-.22c.665 0 1.31.071 1.93.212l.782 3.078 1.605 6.367 2.242-6.812.844-2.559a8.978 8.978 0 012.254-.285 9.06 9.06 0 011.996.219z"
        fill="#161C3A"
      />
      <path
        d="M117.945.016v22.402c-.035.008-.066.02-.101.024a8.66 8.66 0 01-1.867.2 8.3 8.3 0 01-1.832-.196V1.122c1.835-1.157 3.328-1.157 3.8-1.106z"
        fill="#FF671B"
      />
      <path
        d="M41.324 18.676a3.828 3.828 0 01-3.828-3.824 3.825 3.825 0 017.648 0c0 2.11-1.71 3.824-3.82 3.824zm0-11.687a7.866 7.866 0 100 15.73c4.34 0 7.86-3.523 7.86-7.867a7.861 7.861 0 00-7.86-7.863zM23.7 11.551c0 5.106-3.512 9.426-8.34 10.86a12.23 12.23 0 01-3.512.508C5.305 22.919 0 17.829 0 11.55c0-.144.004-.293.012-.437C.246 5.04 5.457.188 11.848.188c2.75 0 5.277.895 7.28 2.402l.032-.03c.414.304.809.636 1.18.995a8.976 8.976 0 01-4.445 1.988l.015-.011a7.618 7.618 0 00-4.062-1.153c-3.977 0-7.23 2.973-7.47 6.735a8.166 8.166 0 00-.01.437c0 3.969 3.347 7.184 7.48 7.184.351 0 .695-.027 1.03-.066 2.43-.325 4.49-1.766 5.587-3.762h-6.043a8.917 8.917 0 011.234-3.793h10.031c.004.144.012.293.012.437zM102.98 19.172a3.66 3.66 0 01-3.664-3.66 3.66 3.66 0 013.664-3.656 3.656 3.656 0 013.657 3.656 3.657 3.657 0 01-3.657 3.66zm4.141-11.082v.77a7.686 7.686 0 10.012 13.203v.879c.008.023.008.055.008.082 0 .039 0 .078-.008.113a3.272 3.272 0 01-2.406 3.043 3.25 3.25 0 01-3.036-.695c-.003.004-.003.004-.003 0a9.122 9.122 0 00-.461-.012c-.164 0-.321.004-.481.016-.035 0-.074 0-.113.004a8.748 8.748 0 00-2.727.617 6.882 6.882 0 006.141 3.758 6.867 6.867 0 003.996-1.274 6.903 6.903 0 002.871-4.949c.016-.164.024-.324.024-.492V6.958a8.997 8.997 0 00-3.817 1.132z"
        fill="#161C3A"
      />
      <path
        d="M131.062 18.274a6.878 6.878 0 01-6.874-6.879 6.88 6.88 0 016.874-6.879 6.883 6.883 0 016.883 6.879 6.88 6.88 0 01-6.883 6.879zm0-18.125c-6.207 0-11.246 5.031-11.246 11.246 0 6.211 5.039 11.25 11.246 11.25 6.215 0 11.254-5.039 11.254-11.25 0-6.215-5.039-11.246-11.254-11.246z"
        fill="#FF671B"
      />
    </svg>
  );
}

export default SvgComponent;
```

通过这个示例可以知道 SVGR 可以满足我们的需求，接下来介绍一下如何管理若干个图标。

### 图标管理

```
├── package.json
├── src
├── svgs
└── templates
```

- `svgs` 存放设计师提供的 SVG 文件；
- `src` 把 SVG 文件转成的 React 代码，并存放在 `src` 目录下。

前端工程师得到 SVG 文件放 `svgs` 目录中，然后运行命令：

```bash
$ npx @svgr/cli --out-dir src svgs
```

到这里，我们的大部分工作已经完成了。但在实际应用的时候，还会有自定义样式的需求。

### 自定义样式

为了满足各种场景，需要对样式做一些修改。比如以下的场景：
![gio-design-icons.png](https://ik.imagekit.io/jnskuq5ualk/jack0pan/design-system-icons/gio-design-icons_Ft6jXXLwi.png?ik-sdk-version=javascript-1.4.3&updatedAt=1644306158562)

- 图标需要有背景，不状态下背景颜色不同；
- 图标的颜色可自定义；
- 图标可以一直旋转；
- 图标可自定义大小。

在代码结构上，在 `<svg>` 标签外面增一层 `<span>`标签，可以用来设置背景。

```html
<span class="gio-icon">
  <svg viewBox="0 0 64 64" fill="currentColor" class="gio-icon-svg" width="1rem" height="1rem">...</svg>
  <span></span
></span>
```

然后通过 `gio-icon` 来定义 CSS 样式，实现 Hover、Click、Disable 等样式效果。

## 参考

- [https://github.com/growingio/gio-design-icons](https://github.com/growingio/gio-design-icons)
- [https://react-svgr.com/docs/getting-started/](https://react-svgr.com/docs/getting-started/)
- [https://icons.getbootstrap.com/](https://icons.getbootstrap.com/)
