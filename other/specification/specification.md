# 工程化

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## 规范约定

- 代码相关：js/ts/style 编码规范
- 命名与单词拼写规范
- git 提交规范等

### 样式约束`stylelint`

```json
{
  "script": {
    "lint:style": "stylelint src/**/*.{css,vue} --fix"
  },
  // 版本很重要， 错了会有很多错误
  "devDependencies": {
    "stylelint": "15.10.2",
    "stylelint-config-html": "^1.1.0",
    "stylelint-config-prettier": "9.0.5",
    "stylelint-config-standard": "34.0.0",
    "stylelint-config-vue": "1.0.0"
  }
}
```

新增`stylelint.config.cjs`文件

```js
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-prettier",
    "stylelint-config-html/vue",
  ],
};
```

包说明

- `stylelint`
- `stylelint-config-standard` 是 Stylelint 的官方推荐配置之一，基于现代 CSS 标准和最佳实践。它适用于大多数项目，尤其适合需要遵循标准化 CSS 编写风格的团队
- `stylelint-config-prettier` 是一个用于关闭所有与 Prettier 冲突的 Stylelint 规则的配置包。它确保 Stylelint 和 Prettier 可以和平共处，避免两者在格式化规则上的冲突。
- `stylelint-config-html` 是一个专门用于处理嵌入在 HTML 文件中的 `<style>` 标签内容的 Stylelint 配置包。它扩展了 Stylelint 的能力，使其能够正确解析和检查 HTML 中的样式代码 -`stylelint-config-vue` 是专门为 Vue.js 项目设计的 Stylelint 配置包。Vue 单文件组件（.vue 文件）中通常包含 `<style>` 标签，该配置可以帮助 Stylelint 正确解析和检查这些样式代码

### 命名约束

安装`cspell`

```json
{
  "script": {
    "spellcheck": "cspell lint --dot --gitignore --color --cache --show-suggestions \"src/**/*.@(html|js|cjs|mjs|ts|tsx|css|scss|md|vue)\""
  },
  // 版本很重要， 错了会有很多错误
  "devDependencies": {
    "cspell": "^6.31.2"
  }
}
```

配置:新增 `cspell.json`

```json
{
  "import": ["@cspell/dict-lorem-ipsum/cspell-ext.json"],
  "caseSensitive": false,
  "dictionaries": ["custom-words"],
  "dictionaryDefinitions": [
    {
      "name": "custom-words",
      "path": "./.cspell/custom-words.txt",
      "addWords": true
    }
  ],
  "ignorePaths": [
    "**/node_modules/**",
    "**/dist/**",
    "**/lib/**",
    "**/docs/**",
    "**/stats.html"
  ]
}
```

并在项目根目录创建 .cspell/custom-words.txt，把那些你主观认为是对的的单词放进去，比如：

```txt
behaviour
Byelide
commitlint
conventionalcommits
optimizelegibility
pinia
tiptap
vuedraggable
vuejs
```

### commit 检查

为了在提交时进行代码检测，我们就需要使用 git 提交钩子进行处理，方便起见我们一般使用 husky，同时我们需要使用 commitlint 以及 lint-stage 相关来配置如何检测

#### husky 相关

新增配置

```json
{
  "script": {
    "prepare": "husky install",
    "lint:stage": "lint-staged",
    "commit": "git-cz",
    "commitlint": "commitlint --edit" // 提交commit 触发的校验
  },
  "lint-staged": {
    "*.{html,vue,css,sass,scss,ts}": "prettier --write",
    "*.{vue,ts}": "eslint --fix",
    "*.{vue,css,sass,scss}": "stylelint --fix"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  },
  "devDependencies": {
    "@commitlint/cli": "17.6.7",
    "@commitlint/config-conventional": "17.6.7",
    "@commitlint/cz-commitlint": "17.6.7",
    "commitizen": "4.3.0",
    "husky": "8.0.3",
    "lint-staged": "13.2.3",
    "cz-git": "1.7.0",
    "zx": "2.0.0"
  }
}
```

执行`npm run prepare`,就会在根目录生成 .husky，钩子相关的内容写在这里
<Image  src="/other/specification/images/output.png" />

创建`commit-msg`,commit 信息校验的

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
npm run commitlint ${1}


```

创建`pre-commit`， 触发提交的 husky 钩子, 这里触发执行的是根目录下的`scripts`的函数

```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npm exec tsno run ./scripts/pre-commit.ts
```

执行以下命令，实现 husky 提交前的约束 hook

```sh
npx husky add .husky/pre-commit 
npx husky add .husky/commit-msg
```

在项目根目录下创建 scripts/xxx 具体脚本的内容我们在 scripts/pre-commit.ts 中编写。
`pre-commit.ts`文件

```ts
#!/usr/bin/env zx

import { $ } from "zx";

console.log("开始执行代码质量评估...\n");

await import("./check").catch((out) => {
  console.log(out);
  throw new Error("代码质量评估失败, 请检查代码");
});

console.log('printf "检测通过, 创建 commit 中...\n');

await $`git add .`;
```

`check.ts`文件

```ts
#!/usr/bin/env zx

import type { ProcessOutput } from "zx";
import { $ } from "zx";

import { printObject } from "./utils";

await $`npm run spellcheck`.catch((out: ProcessOutput) => {
  console.log(out);

  throw new Error(out.stdout);
});

// await Promise.all([$`pnpm type-check`, $`pnpm lint`]).catch((out: ProcessOutput) => {
//   printObject(out)
//   throw new Error(out.stdout)
// })

// check type and stage
await Promise.all([$`npm run type-check`, $`npm run lint:stage`]).catch(
  (out: ProcessOutput) => {
    printObject(out);
    throw new Error(out.stdout);
  }
);
```

`utils.ts`文件

```ts
import { ProcessOutput } from "zx/core";

export function printObject(
  object: Record<string, unknown> | ProcessOutput,
  method: "log" | "warn" | "error" = "log"
) {
  for (const [key, value] of Object.entries(object)) {
    console[method](`${key}:\n${value}\n`);
  }
}
```

#### commitlint 相关

新增 `commitlint.config.cjs`

```ts
// module.exports = { extends: ['@commitlint/config-conventional'] }

module.exports = {
  extends: ["@commitlint/config-conventional"], // extends can be nested
  parserPreset: "conventional-changelog-conventionalcommits",
  prompt: {
    settings: {},
    messages: {
      skip: ":skip",
      max: "upper %d chars",
      min: "%d chars at least",
      emptyWarning: "can not be empty",
      upperLimitWarning: "over limit",
      lowerLimitWarning: "below limit",
    },
    types: [
      { value: "feat", name: "feat:     ✨  A new feature", emoji: "✨ " },
      { value: "fix", name: "fix:      🐛  A bug fix", emoji: "🐛 " },
      {
        value: "docs",
        name: "docs:     📝  Documentation only changes",
        emoji: "📝 ",
      },
      {
        value: "style",
        name: "style:    💄  Changes that do not affect the meaning of the code",
        emoji: "💄 ",
      },
      {
        value: "refactor",
        name: "refactor: 📦️   A code change that neither fixes a bug nor adds a feature",
        emoji: "📦️ ",
      },
      {
        value: "perf",
        name: "perf:     🚀  A code change that improves performance",
        emoji: "🚀 ",
      },
      {
        value: "test",
        name: "test:     🚨  Adding missing tests or correcting existing tests",
        emoji: "🚨 ",
      },
      {
        value: "build",
        name: "build:    🛠   Changes that affect the build system or external dependencies",
        emoji: "🛠 ",
      },
      {
        value: "ci",
        name: "ci:       🎡  Changes to our CI configuration files and scripts",
        emoji: "🎡 ",
      },
      {
        value: "chore",
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: "🔨 ",
      },
      {
        value: "revert",
        name: "revert:   ⏪️  Reverts a previous commit",
        emoji: ":rewind:",
      },
    ],
    useEmoji: true,
    confirmColorize: true,
    emojiAlign: "center",
    questions: {
      scope: {
        description:
          "What is the scope of this change (e.g. component or file name)",
      },
      subject: {
        description:
          "Write a short, imperative tense description of the change",
      },
      body: {
        description: "Provide a longer description of the change",
      },
      isBreaking: {
        description: "Are there any breaking changes?",
      },
      breakingBody: {
        description:
          "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself",
      },
      breaking: {
        description: "Describe the breaking changes",
      },
      isIssueAffected: {
        description: "Does this change affect any open issues?",
      },
      issuesBody: {
        description:
          "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself",
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
  rules: {
    "type-enum": [
      // type枚举
      2,
      "always",
      [
        "build", // 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        "feat", // 新功能
        "fix", // 修补bug
        "docs", // 文档修改
        "style", // 代码格式修改, 注意不是 css 修改
        "refactor", // 重构
        "perf", // 优化相关，比如提升性能、体验
        "test", // 测试用例修改
        "revert", // 代码回滚
        "ci", // 持续集成修改
        "config", // 配置修改
        "chore", // 其他改动
      ],
    ],
    // 'type-empty': [2, 'never'], // never: type不能为空; always: type必须为空
    // 'type-case': [0, 'always', 'lower-case'], // type必须小写，upper-case大写，camel-case小驼峰，kebab-case短横线，pascal-case大驼峰，等等
    // 'scope-empty': [0],
    // 'scope-case': [0],
    // 'subject-empty': [2, 'never'], // subject不能为空
    // 'subject-case': [0],
    // 'subject-full-stop': [0, 'never', '.'], // subject以.为结束标记
    // 'header-max-length': [2, 'always', 72], // header最长72
    // 'body-leading-blank': [0], // body换行
    // 'footer-leading-blank': [0, 'always'], // footer以空行开头
  },
};
```


