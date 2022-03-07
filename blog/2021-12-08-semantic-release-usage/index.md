---
title: semantic-release 使用教程
description: semantic-release 是一个全自动的版本管理和包发布工具。
authors: jack
tags: ["semantic-release", "图标库"]
category: 前端
---

semantic-release 是一个全自动的版本管理和包发布工具。

## 工作原理

semantic-release 会分析 commint message，来决定对用户的实际影响。根据语义化版本来自动生成下一个版本号，并生成变更日志和发布。
默认情况下，semantic-release 要 commit message 遵从 [Angular Commit Message Conventions](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format)。然后通过[@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer#options) 和 [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator#options) 两个插件来分析 commit message。
下面给出几个示例：

| Commit message | Release type |
| --- | --- |
| fix(pencil): stop graphite breaking when too much pressure applied | ~~Patch~~ Fix Release |
| feat(pencil): add 'graphiteWidth' option | ~~Minor~~ Feature Release |
| perf(pencil): remove graphiteWidth option
​

BREAKING CHANGE: The graphiteWidth option has been removed.The default graphite width of 10mm is always used for performance reasons. | ~~Major~~ Breaking Release (Note that the BREAKING CHANGE: token must be in the footer of the commit) |

## 快速开始
按照以下步骤来操作：

1. 在项目中安装 semantic-release
1. 配置 CI 服务来运行 semantic-release
1. 在 CI 服务中配置 Git 仓库和包管理仓库的认证权限
1. 配置 semantic-release 的选项和插件

​

另一种方式是通过交互式命令行：
```bash
$ npx semantic-release-cli setup
Need to install the following packages:
  semantic-release-cli
Ok to proceed? (y) y
? What is your npm registry? https://registry.npmjs.org/
? What is your npm username? xxx
? What is your npm password? [hidden]
? Provide a GitHub Personal Access Token (create a token at https://github.com/settings/tokens/n
ew?scopes=repo) xxx
? What CI are you using? Github Actions

```
## 配置
### 配置文件
配置文件支持三种方式：

1. 名为`.releaserc`的文件，后缀可以为`.yaml`、 `.yml`、 `.json`和 `.js`
1. 名为`release.config.js`文件，并且要 export 出对象
1. 在`package.json`文件中有`release`关键字

各种配置项见：[https://semantic-release.gitbook.io/semantic-release/usage/configuration#options](https://semantic-release.gitbook.io/semantic-release/usage/configuration#options)
​

### CI 配置
以 GitHub Actions 为例，访问远程仓库和 npm 用到的环境变量：

- `GH_TOKEN`或`GITHUB_TOKEN`：GitHub 的 [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line)
- `NPM_TOKEN`：npm token created via [npm token create](https://docs.npmjs.com/getting-started/working_with_tokens#how-to-create-new-tokens). **Note**: Only the auth-only [level of npm two-factor authentication](https://docs.npmjs.com/getting-started/using-two-factor-authentication#levels-of-authentication) is supported

​

## 详细流程
![](https://cdn.nlark.com/yuque/__mermaid_v3/b92a5e376df5da2b479c8087b56d6d52.svg#lake_card_v2=eyJ0eXBlIjoibWVybWFpZCIsImNvZGUiOiIlJXtpbml0OiB7J3RoZW1lJzogJ2ZvcmVzdCd9fSUlXG5cbmZsb3djaGFydCBMUlxuICBzdWJncmFwaCBTdGFnZTFcbiAgICBWQyhWZXJpZnkgY29uZGl0aW9ucykgLS0-IEdMUihHZXQgbGFzdCByZWxlYXNlKSAtLT4gQUMoQW5hbHl6ZSBjb21taXRzKTtcblx0ZW5kXG5cdHN1YmdyYXBoIFN0YWdlMlxuICAgIFZSKFZlcmlmeSByZWxlYXNlKSAtLT4gR04oR2VuZXJhdGUgbm90ZXMpIC0tPiBDR1QoQ3JlYXRlIEdpdCB0YWcpO1xuXHRlbmRcblx0c3ViZ3JhcGggU3RhZ2UzXG5cdFx0UDEoUHJlcGFyZSkgLS0-IFAyKFB1Ymxpc2gpIC0tPiBOKE5vdGlmeSk7XG5cdGVuZFxuXHRTdGFnZTEgLS0-IFN0YWdlMiAtLT4gU3RhZ2UzOyIsInVybCI6Imh0dHBzOi8vY2RuLm5sYXJrLmNvbS95dXF1ZS9fX21lcm1haWRfdjMvYjkyYTVlMzc2ZGY1ZGEyYjQ3OWM4MDg3YjU2ZDZkNTIuc3ZnIiwiaWQiOiJmaXlFMSIsIm1hcmdpbiI6eyJ0b3AiOnRydWUsImJvdHRvbSI6dHJ1ZX0sImNhcmQiOiJkaWFncmFtIn0=) 

整个流程如上图所示，这里给出一个示例配置来完成整个流程：
```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": [
          "CHANGELOG.md",
          "package.json"
        ],
        "message": "chore(release): version ${nextRelease.version} changelog\n\n${nextRelease.notes}"
      }
    ],
  ]
}
```
## 可扩展的配置包
不想自己配置，可以直接使用 [semantic-release-npm-config](https://github.com/jack0pan/semantic-release-npm-config)。
假如，在 GitHub 上开发了一个 package，现在要发布到 npm，并在 GitHub 上创建 release，过程如下：

1. 安装依赖：
```bash
yarn add -D semantic-release semantic-release-npm-config @semantic-release/github
```

2. 创建配置文件：
```javascript
const { plugins } = require('semantic-release-npm-config');

module.exports = {
  plugins: plugins.concat(['@semantic-release/github']),
};
```

3. 执行结果：
```bash
$ npx semantic-release
[12:53:32 PM] [semantic-release] › ℹ  Running semantic-release version 19.0.2
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "verifyConditions" from "@semantic-release/changelog"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "verifyConditions" from "@semantic-release/npm"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "verifyConditions" from "@semantic-release/git"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "verifyConditions" from "@semantic-release/github"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "analyzeCommits" from "@semantic-release/commit-analyzer"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "generateNotes" from "@semantic-release/release-notes-generator"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "prepare" from "@semantic-release/changelog"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "prepare" from "@semantic-release/npm"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "prepare" from "@semantic-release/git"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "publish" from "@semantic-release/npm"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "publish" from "@semantic-release/github"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "addChannel" from "@semantic-release/npm"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "addChannel" from "@semantic-release/github"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "success" from "@semantic-release/github"
[12:53:33 PM] [semantic-release] › ✔  Loaded plugin "fail" from "@semantic-release/github"
[12:53:34 PM] [semantic-release] › ✔  Run automated release from branch master on repository https://x-access-token:[secure]@github.com/jack0pan/semantic-release-npm-config.git
[12:53:34 PM] [semantic-release] › ✔  Allowed to push to the Git repository
[12:53:34 PM] [semantic-release] › ℹ  Start step "verifyConditions" of plugin "@semantic-release/changelog"
[12:53:34 PM] [semantic-release] › ✔  Completed step "verifyConditions" of plugin "@semantic-release/changelog"
[12:53:34 PM] [semantic-release] › ℹ  Start step "verifyConditions" of plugin "@semantic-release/npm"
[12:53:34 PM] [semantic-release] [@semantic-release/npm] › ℹ  Verify authentication for registry https://registry.npmjs.org/
[12:53:34 PM] [semantic-release] [@semantic-release/npm] › ℹ  Wrote NPM_TOKEN to /tmp/8339f61cd180f3e3e89e61ea220e519d/.npmrc
jack0pan
[12:53:35 PM] [semantic-release] › ✔  Completed step "verifyConditions" of plugin "@semantic-release/npm"
[12:53:35 PM] [semantic-release] › ℹ  Start step "verifyConditions" of plugin "@semantic-release/git"
[12:53:35 PM] [semantic-release] › ✔  Completed step "verifyConditions" of plugin "@semantic-release/git"
[12:53:35 PM] [semantic-release] › ℹ  Start step "verifyConditions" of plugin "@semantic-release/github"
[12:53:35 PM] [semantic-release] [@semantic-release/github] › ℹ  Verify GitHub authentication (https://api.github.com)
[12:53:35 PM] [semantic-release] › ✔  Completed step "verifyConditions" of plugin "@semantic-release/github"
[12:53:35 PM] [semantic-release] › ℹ  Found git tag v0.0.1 associated with version 0.0.1 on branch master
[12:53:35 PM] [semantic-release] › ℹ  Found 4 commits since last release
[12:53:35 PM] [semantic-release] › ℹ  Start step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  Analyzing commit: chore: update the name in package.json
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  The commit should not trigger a release
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  Analyzing commit: chore(release): version 1.0.0 changelog
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  The commit should not trigger a release
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  Analyzing commit: feat: rename package to semantic-release-npm-config

BREAKING CHANGE: Remove the @semantic-release@github dependency.
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  The release type for the commit is major
[12:53:35 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  Analysis of 4 commits complete: major release
[12:53:35 PM] [semantic-release] › ✔  Completed step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[12:53:35 PM] [semantic-release] › ℹ  The next release version is 1.0.0
[12:53:35 PM] [semantic-release] › ℹ  Start step "generateNotes" of plugin "@semantic-release/release-notes-generator"
[12:53:35 PM] [semantic-release] › ✔  Completed step "generateNotes" of plugin "@semantic-release/release-notes-generator"
[12:53:35 PM] [semantic-release] › ℹ  Start step "prepare" of plugin "@semantic-release/changelog"
[12:53:35 PM] [semantic-release] [@semantic-release/changelog] › ℹ  Create /home/runner/work/semantic-release-npm-config/semantic-release-npm-config/CHANGELOG.md
[12:53:35 PM] [semantic-release] › ✔  Completed step "prepare" of plugin "@semantic-release/changelog"
[12:53:35 PM] [semantic-release] › ℹ  Start step "prepare" of plugin "@semantic-release/npm"
[12:53:35 PM] [semantic-release] [@semantic-release/npm] › ℹ  Write version 1.0.0 to package.json in /home/runner/work/semantic-release-npm-config/semantic-release-npm-config
v1.0.0
[12:53:35 PM] [semantic-release] › ✔  Completed step "prepare" of plugin "@semantic-release/npm"
[12:53:35 PM] [semantic-release] › ℹ  Start step "prepare" of plugin "@semantic-release/git"
[12:53:35 PM] [semantic-release] [@semantic-release/git] › ℹ  Found 2 file(s) to commit
[12:53:36 PM] [semantic-release] [@semantic-release/git] › ℹ  Prepared Git release: v1.0.0
[12:53:36 PM] [semantic-release] › ✔  Completed step "prepare" of plugin "@semantic-release/git"
[12:53:36 PM] [semantic-release] › ℹ  Start step "generateNotes" of plugin "@semantic-release/release-notes-generator"
[12:53:36 PM] [semantic-release] › ✔  Completed step "generateNotes" of plugin "@semantic-release/release-notes-generator"
[12:53:37 PM] [semantic-release] › ✔  Created tag v1.0.0
[12:53:37 PM] [semantic-release] › ℹ  Start step "publish" of plugin "@semantic-release/npm"
[12:53:37 PM] [semantic-release] [@semantic-release/npm] › ℹ  Publishing version 1.0.0 to npm registry on dist-tag latest
...
npm notice Publishing to https://registry.npmjs.org/
+ semantic-release-npm-config@1.0.0
[12:53:39 PM] [semantic-release] [@semantic-release/npm] › ℹ  Published semantic-release-npm-config@1.0.0 to dist-tag @latest on https://registry.npmjs.org/
[12:53:39 PM] [semantic-release] › ✔  Completed step "publish" of plugin "@semantic-release/npm"
[12:53:39 PM] [semantic-release] › ℹ  Start step "publish" of plugin "@semantic-release/github"
[12:53:39 PM] [semantic-release] [@semantic-release/github] › ℹ  Published GitHub release: https://github.com/jack0pan/semantic-release-npm-config/releases/tag/v1.0.0
[12:53:39 PM] [semantic-release] › ✔  Completed step "publish" of plugin "@semantic-release/github"
[12:53:39 PM] [semantic-release] › ℹ  Start step "success" of plugin "@semantic-release/github"
[12:53:42 PM] [semantic-release] › ✔  Completed step "success" of plugin "@semantic-release/github"
[12:53:42 PM] [semantic-release] › ✔  Published release 1.0.0 on default channel
Done in 9.87s.
```

## 参考

- [https://semantic-release.gitbook.io/semantic-release/](https://semantic-release.gitbook.io/semantic-release/)
- [https://semantic-release.gitbook.io/semantic-release/extending/plugins-list](https://semantic-release.gitbook.io/semantic-release/extending/plugins-list)
