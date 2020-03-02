// .vuepress/config.js
module.exports = {
    base: "/website/",
    plugins: ['@vuepress/nprogress'],
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'CV', link: '/cv' },
            { text: 'Software', link: '/#software' },
            { text: 'Datasets', link: '/#datasets' },
            { text: 'Publications', link: '/#publications' },
            { text: 'Twitter', link: 'https://twitter.com/faroit' }
        ]
    }
}
