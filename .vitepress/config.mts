import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "sky bear",
  description: "sky bear 的学习历程",
  head: [["link", { rel: "icon", href: "/icon.png" }]],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    outline: "deep",
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/example/markdown-examples" },
      { text: "Javascript", link: "/javascript/index" },

      { text: "css", link: "/css/css" },
      { text: "设计模式", link: "/designPattern/index" },

      { text: "数据结构和算法", link: "/algorithms/algorithms" },
      { text: "node", link: "/node/base" },
      { text: "vue", link: "/vue/index" },
      {
        text: "react", link: "/react/index"
      },
      {
        text: "浏览器", items: [
          { text: "浏览器相关内容", link: "/browser/index" },
          { text: "缓存", link: "/browser/cache" },
        ]
      },
      {
        text: "其他", items: [
          { text: "性能优化", link: "/other/performance/performance" },
          { text: "手写代码汇总", link: "/other/handwriting/handwriting" },
          { text: "工程化", link: "/other/specification/spec" },
          { text: "前端性能监控", link: "/other/monitor/monitor" },
          { text: "webpack", link: "/other/specification/webpack" },
          { text: "git常用命令", link: "/other/git" },
          { text: "安全", link: "/other/other/secure.md" },
          { text: "面试", link: "/other/interview/interview" },
        ]
      },
    ],

    sidebar: {
      "/example/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/example/markdown-examples" },
            { text: "Runtime API Examples", link: "/example/api-examples" },
          ],
        },
      ],
      "/javascript/": [
        {
          text: "Javascript",
          link: "/javascript/index",
          items: [
            {
              text: "基础专栏",
              link: "/javascript/basis/basis",
              collapsed: false,
              items: [
                { text: "常见知识", link: "/javascript/basis/common" },
                { text: "this指向", link: "/javascript/basis/this" },
                { text: "原型", link: "/javascript/basis/prototype" },
                { text: "执行上下文", link: "/javascript/basis/context" },
                { text: "异步编程", link: "/javascript/basis/promise" },
                { text: "模块化", link: "/javascript/basis/module" },
                { text: "作用域", link: "/javascript/basis/scope" },
                {
                  text: "垃圾回收 & 运行机制",
                  link: "/javascript/basis/GCAndEventLoop",
                },
                { text: "函数式编程", link: "/javascript/basis/FP" },
                {
                  text: "javascript 的深浅复制",
                  link: "/javascript/basis/copy",
                },
                {
                  text: "防抖和节流",
                  link: "/javascript/basis/debounceAndThrottle",
                },
              ],
            },
            {
              text: "ES6",
              link: "/javascript/es6/es6",
              items: [
                { text: "let & const", link: "/javascript/es6/letAndConst" },
              ],
            },
            {
              text: "typescript",
              link: "/javascript/typescript/typescript",
            },
            {
              text: "AST",
              link: "/javascript/ast/ast",
            },
            {
              text: "ES5",
              link: "/javascript/es5/es5",
            },
          ],
        },
      ],
      "/vue/": [
        {
          text: "vue",
          link: "/vue/index",
          items: [
            {
              text: "vue2",
              link: "/vue/vue2/vue2",
              items: [
                { text: "vue2的高级用法", link: "/vue/vue2/advancedUsage" },
                { text: "vuex", link: "/vue/vue2/vuex" },
              ],
            },
            {
              text: "vue3",
              link: "/vue/vue3/vue3",
              items: [
                // { text: "vue2的高级用法", link: "/vue/vue2/advancedUsage" },
                { text: "vuex", link: "/vue/vue3/vuex" },
                { text: "vueRouter", link: "/vue/vue3/vueRouter" },
              ],
            },
            {
              text: "性能优化",
              link: "/vue/optimize",
            },
          ],
        },
      ],
      "/react/": [
        {
          text: "react",
          link: "/react/index",
          items: [
            {
              text: "同构渲染",
              link: "/react/serve/serve",
            },
            {
              text: "性能优化",
              link: "/react/optimize",
            },
            {
              text: "react router",
              link: "/react/reactRouter/reactRouter",
            },
            {
              text: "React状态管理",
              link: "/react/redux",
            },
          ],
        },
      ],
      "/node/": [
        {
          text: "node",
          items: [
            {
              text: "基础",
              link: "/node/base",
            },
            {
              text: "网络详解",
              link: "/node/network",
            },
            {
              text: "缓存和鉴权",
              link: "/node/cache&JWT",
            },
          ],
        },
      ],
      "/other/interview/": [
        {
          text: "面试",
          items: [
            {
              text: "基础",
              link: "/other/interview/interview",
            },
            {
              text: "html+css",
              link: "/other/interview/html+css",
            },
            {
              text: "浏览器",
              link: "/browser/",
            },
            {
              text: "网络面试题",
              link: "/面试题/网络面试题",
            },
            {
              text: "前端工具",
              link: "/面试题/前端工具",
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/sky-bear" }],
  },
});
