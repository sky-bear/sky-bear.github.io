import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  head: [["link", { rel: "icon", href: "/public/icon.png" }]],
  themeConfig: {
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/example/markdown-examples" },
      { text: "Javascript", link: "/javascript/index" },
      { text: "browser", link: "/browser/index" },
      { text: "设计模式", link: "/designPattern/index" },
      { text: "vue", link: "/vue/index" },
      { text: "react", link: "/react/index" },
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
          ],
        },
      ],
      "/vue/": [
        {
          text: "vue",
          items: [
            {
              text: "vue2",
              link: "/vue/vue2/vue2",
              items: [
                { text: "vue2的高级用法", link: "/vue/vue2/advancedUsage", },
                { text: "vuex", link: "/vue/vue2/vuex", },
              ],
            },
            { text: "vue3", link: "/vue/vue3/vue3" },
          ],
        },
      ],
      "/react/": [
        {
          text: "react",
          items: [
            {
              text: "服务端渲染",
              link: "/react/serve/serve",
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/sky-bear" }],
  },
});
