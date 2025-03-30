# Node

## 基础

Node.js 就是一个可以运行 javascrip 的环境，它使得 javascript 可以脱离浏览器运行

## 脚手架

- 全局命令行工具
- 创建项目初始化代码文件及目录
- 命令行交互能力
  - 命令行接受参数处理

## 创建过程

- 先创建 bin 目录，里面放一个可执行的文件
- 根目录下执`npm init`
  ```json
  // package.json
  {
    "name": "test-cli",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "bin": {
      "test-cli": "cli.js"
    },
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
  }
  ```
- npm link
  这里要注意要手动修改 bin 的路径，否则会报错

  ```json
  {
    "name": "test-cli",
    "version": "1.0.0",
    "main": "index.js",
    "bin": {
      "test-cli": "/bin/cli.js"
    },
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
  }
  ```

- cli.js 编写

```js
// 当前脚本执行调用当前系统环境下的node
#! /usr/bin/env node

console.log("Hello World");
```

此时执行`test-cli`命令， 控制台就会打印出`Hello World`


bet