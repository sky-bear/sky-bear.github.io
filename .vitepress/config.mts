import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
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
            items: [
              { text: '基础专栏', link: '/javascript/basis' },
              { text: 'ES6', link: '/javascript/es6' },
            ]
          }
        ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sky-bear' }
    ]
  }
})
