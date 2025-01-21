import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/example/markdown-examples' },
      { text: 'Javascript', link: '/javascript/index' },
      { text: 'browser', link: '/browser/index' }
    ],

    sidebar:{
      "/example/":[
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/example/markdown-examples' },
              { text: 'Runtime API Examples', link: '/example/api-examples' }
            ]
          }
        ],
        "/javascript/":[
          {
            text: 'Javascript',
            link: '/javascript/index',
            items: [
              { text: '基础专栏', 
                link: '/javascript/basis/basis',
                collapsed: false,
                items:[
                { text: 'this指向', link: '/javascript/basis/this' },
                { text: '原型', link: '/javascript/basis/prototype' },
                { text: '执行上下文', link: '/javascript/basis/context' },
                { text: '异步编程', link: '/javascript/basis/promise' },
                { text: '模块化', link: '/javascript/basis/module' },
                { text: '垃圾回收 & 运行机制', link: '/javascript/basis/GCAndEventLoop' },
              ] },
              // { text: 'ES6', link: '/javascript/es6' },
            ]
          }
        ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sky-bear' }
    ]
  }
})
