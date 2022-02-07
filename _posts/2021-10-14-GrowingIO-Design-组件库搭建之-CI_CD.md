## 前言
在《[GrowingIO SaaS 产品 CI/CD 实践](https://mp.weixin.qq.com/s/4FGtVwpsJqyeOoMGjEfnuA)》一文中，介绍了持续集成（Continuous Intergration，简称 CI）、持续交付（Continuous Delivery，简称 CD）和持续部署（Continuous Deployment，简称 CD）三个概念，以及在 GrowingIO SaaS 产品中的实践。
文中还强调一个典型的 CI/CD 流程建设至少需要具备以下功能的工具：

- 代码存储库，即需要版本控制软件来保障代码的可维护性，同时作为构建过程的素材库
- 持续集成服务器，用于自动执行构建，测试，部署等任务
- 集中的制品管理仓库，用于存放构建的成果物，用于部署
- 自动部署工具，用于将构建到的程序自动的部署到目标服务器

对于 GrowingIO Design，使用的工具是：

- 代码存储库：GitHub
- 持续集成服务器：GitHub Actions
- 集中的制品管理仓库：npm
- 自动部署工具：Vercel

​

## 持续集成
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1634046270200-53b0a396-ca13-4139-a97b-3bf246e2cacf.png#clientId=u5d4a6c54-9ba8-4&from=paste&height=244&id=u16775e11&margin=%5Bobject%20Object%5D&name=image.png&originHeight=488&originWidth=1900&originalType=binary&ratio=1&size=53026&status=done&style=none&taskId=u35fcfe62-615d-4156-bf3a-4c2561d56d5&width=950)
### 代码检查（Lint codes）
在《[GrowingIO Design 组件库搭建之开发工具](https://mp.weixin.qq.com/s/rdgj9ZI-gGfDWj-bCNtHng)》一文中，介绍了组件库使用 stylelint 和 ESLint 作为代码规范工具。
为了方便使用，在 package.json 文件中增加一下两个脚本（后文简称脚本化）：
```json
{
  "scripts": {
    "eslint": "eslint src --ext .ts,.tsx",
    "stylelint": "stylelint 'src/**/*.{css,less}' --syntax less",
  },
}
```
然后用 GitHub Actions 来执行这两个命令：
```yaml
jobs:
  lint:
    name: Lint codes
    needs: install
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - name: Setup Node.js
        uses: actions/setup-node@v2.4.1
        with:
          node-version: 14
      - name: Restore Node.js modules
        uses: actions/cache@v2.1.6
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: StyleLint
        run: yarn stylelint
      - name: ESLint
        run: yarn eslint
```
### 单元测试（Unit test）
《[GrowingIO Design 组件库搭建之单元测试](https://mp.weixin.qq.com/s/BPLgYsZ9B94P0vuH65N0Mw)》中提到单元测试工具主要使用 Jest，在 CI 流程中除了保证单元测试通过，还要统计测试覆盖情况（通过 --coverage 参数来实现）。
命令脚本化：
```json
{
  "scripts": {
    "test": "jest",
  },
}
```
GitHub Actions 中的 job：
```yaml
jobs:
  unit_test:
    name: Unit test
    needs: install
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - name: Setup Node.js
        uses: actions/setup-node@v2.4.1
        with:
          node-version: 14
      - name: Restore Node.js modules
        uses: actions/cache@v2.1.6
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: Cache test report
        id: cache-test-report
        uses: actions/cache@v2.1.6
        with:
          path: coverage/lcov.info
          key: test-report-${{ github.event.pull_request.head.sha }}
      - name: Test
        if: steps.cache-test-report.outputs.cache-hit != 'true'
        run: yarn test --coverage
```


### 打包（Build package）
组件库打包使用 father-build 工具，主要看重它的三个特性：

- 基于 rollup 和 babel 的组件打包功能
- 支持 TypeScript
- 支持 cjs、esm 和 umd 三种格式的打包

​

三种格式打包对应的目录为：

| 打包格式 | 存放目录 |
| --- | --- |
| cjs | lib |
| esm | es |
| umd | dist |

打包命令脚本化：
```json
{
  "scripts": {
    "build": "father-build",
  },
}
```
GitHub Actions 中的 job：
```yaml
jobs:
  build:
    name: Build package
    needs: install
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - name: Setup Node.js
        uses: actions/setup-node@v2.4.1
        with:
          node-version: 14
      - name: Restore Node.js modules
        uses: actions/cache@v2.1.6
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: Cache package
        id: cache-package
        uses: actions/cache@v2.1.6
        with:
          path: |
            dist
            es
            lib
          key: package-${{ github.event.pull_request.head.sha }}
      - name: Build
        if: steps.cache-package.outputs.cache-hit != 'true'
        run: yarn build
```
### 代码质量（Sonar scan）
使用 Sonar 来检测代码质量，并且用来展示单元测试报告。
GitHub Actions 中的 job：
```yaml
jobs:
  sonar:
    name: Sonar scan
    needs: unit_test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
          ref: ${{ github.event.pull_request.head.sha }}
      - name: Restore test report
        uses: actions/cache@v2.1.6
        with:
          path: coverage/lcov.info
          key: test-report-${{ github.event.pull_request.head.sha }}
      - name: Upload reports to SonarCloud
        uses: sonarsource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```
这个 job 会把代码扫描结果和覆盖测试报告上传到 sonar cloud，并把结果反馈在 PR 上：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1634047931418-2845c9d8-6e3e-4361-af8b-b423f53c0615.png#clientId=u5d4a6c54-9ba8-4&from=paste&height=275&id=nfPRQ&margin=%5Bobject%20Object%5D&name=image.png&originHeight=550&originWidth=1848&originalType=binary&ratio=1&size=99748&status=done&style=none&taskId=u96e69b15-f13c-4ee3-a89a-ffb25bab7f8&width=924)
## 持续交付
有了持续集成流程后，持续交付流程就比较简单了。因为对于 GrowingIO Design 来说，交付产物是 npm 包，对应的命令就是：
```bash
$ yarn build
$ yarn publish
```
GitHub Actions 的 job：
```yaml
jobs:
  publish-package:
    if: ${{ startsWith(github.event.head_commit.message, 'docs(release)') }}
    name: Publish package
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2.4.1
        with:
          node-version: 14
          registry-url: 'https://registry.npmjs.org'
      - name: Cache Node.js modules
        id: cache-node-modules
        uses: actions/cache@v2.1.6
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - name: Install
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: yarn install
      - name: Build
        run: yarn build
      - name: Publish package
        run: yarn publish --non-interactive --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - name: Get package version
        id: get-package-version
        run: echo "::set-output name=version::$(yarn -s get-version)"
      - name: Publish GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.get-package-version.outputs.version }}
          release_name: v${{ steps.get-package-version.outputs.version }}
          body_path: VERSION.md
          draft: false
          prerelease: false

```
额外说一下，在发布包之后，我们还想把当前版本的 changelog 发布到 GitHub 的 release 中，我们约定先提交一个用于发版的 Pull Request，例如：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1634126548998-27957fe4-733e-484d-a60b-073c2a325f4c.png#clientId=u4127f2af-9761-4&from=paste&height=615&id=ue67eaa32&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1230&originWidth=3292&originalType=binary&ratio=1&size=271217&status=done&style=none&taskId=u2180f127-f71d-4ed0-ab5e-1539bebf30a&width=1646)
当这个 Pull Request 被合并后，就会触发持续交付流程，这也是有以下判断条件的原因：
```yaml
if: ${{ startsWith(github.event.head_commit.message, 'docs(release)') }}
```
当 job 执行完后，会在 GitHub 上创建对应的 release：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/86170/1634126727659-522c6109-d237-4cf4-a9ad-0de2320e142f.png#clientId=u4127f2af-9761-4&from=paste&height=361&id=u3f6606a7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=722&originWidth=1860&originalType=binary&ratio=1&size=65879&status=done&style=none&taskId=ua36f579f-4619-4f11-a843-0fadf51fec9&width=930)
## 其他流程
### 依赖包更新
这里使用 [GitHub Dependabot](https://docs.github.com/cn/github/administering-a-repository/keeping-your-dependencies-updated-automatically)自动维护仓库的依赖项。Dependabot 确定依赖项是否有新版本，它通过查看依赖的语义版本 ([semver](https://semver.org/)) 来决定是否应更新该版本。当 Dependabot 发现过时的依赖项时，它会发起 Pull Request 以将清单更新到依赖项的最新版本。检查测试是否通过，查看 Pull Request 摘要中包含的更改日志和发行说明，然后合并它。 
![image.png](https://cdn.nlark.com/yuque/0/2020/png/86170/1597760828012-15583797-c314-4bf8-a9c3-c8c06fd5a475.png#height=593&id=TJENh&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1186&originWidth=1862&originalType=binary&ratio=1&size=729419&status=done&style=none&width=931)
dependabot 的配置：
```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    ignore:
      - dependency-name: '*'
        update-types: ['version-update:semver-patch']
      - dependency-name: '@storybook/*'

  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'monthly'
```
### 部署预览网站
在[《GrowingIO Design 组件库搭建之组件开发》](https://mp.weixin.qq.com/s/Eyik5KsiPzSv4n9DG3RGOA)文章中提到组件文档使用 Storybook 来生成网站，为了实现每个 Pull Request 能单独部署生成预览网站，调研了一些产品，最终筛选出三个 Netlify、Vercel 和 Surge，以下是这个三个产品的特性对比：

| ​
 | Netlify | Surge | Vercel（个人版） | Vercel（组织版） |
| --- | --- | --- | --- | --- |
| 收费标准 | 免费 | 免费 | 免费 | 按账号收费 |
| 部署限制 | 300 分钟/月 | 部署次数不限制 | 无限制 | 无限制 |
| 自定义域名 | 支持 | 支持 | 支持 | 支持 |
| HTTPS | 支持 | 对于自定义域名收费 | 支持 | 支持 |
| 自动部署 | 支持 | 手动部署 | 支持 | 支持 |

对于 Netlify，每个 Pull Request 提交频率会比较频繁，300 分钟的额度会很快被用完，所以 Netlify 也不适合在此使用。
​

对于 Surge，一开始想通过 GitHub Actions 把网站部署到 Surge，但是遇到一个问题，Surge 网站的 token 只能存放在仓库的 secrets 中，GitHub 禁止从 fork 仓库提交的 Pull Request 访问 secrets，GitHub 上的原话是：
> Secrets are not passed to workflows that are triggered by a pull request from a fork.

我们只能另辟蹊径，使用 Azure DevOps，它是通过环境变量来存储 token，但是不会像 GitHub 对 fork 仓库的 Pull Request 有限制。参考 Netlify 的实现，把部署的 URL 通过评论的形式添加到 Pull Request 上。
​

对于 Vercel，对 GitHub 上的组织账号是收费，但是对于开源项目可以申请 Open Source 的 License，我们用 GrowingIO Design 申请了 License 后，最终使用 Vercel 来托管预览网站。
## 总结
通过 CI/CD 流程把组件库搭建的前序工作都串联起来了，基础设施已搭建完成，接下来主要工作就是丰富组件了。
GrowingIO Design 组件库搭建系列文章只是告一段落，但并不是结束。接下来还会一些复杂组件实现的文章，或者相关工具库的实现。随着时间推移和技术迭代，未来甚至可能会推到现有基础设施，重新构建。敬请期待！
## 参考文献

1. [https://mp.weixin.qq.com/s/4FGtVwpsJqyeOoMGjEfnuA](https://mp.weixin.qq.com/s/4FGtVwpsJqyeOoMGjEfnuA)
1. [https://mp.weixin.qq.com/s/rdgj9ZI-gGfDWj-bCNtHng](https://mp.weixin.qq.com/s/rdgj9ZI-gGfDWj-bCNtHng)
1. [https://mp.weixin.qq.com/s/BPLgYsZ9B94P0vuH65N0Mw](https://mp.weixin.qq.com/s/BPLgYsZ9B94P0vuH65N0Mw)
1. [https://mp.weixin.qq.com/s/Eyik5KsiPzSv4n9DG3RGOA](https://mp.weixin.qq.com/s/Eyik5KsiPzSv4n9DG3RGOA)
1. [GitHub Actions](https://docs.github.com/en/actions)

​

