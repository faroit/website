// .vuepress/config.js
module.exports = {
    base: "/website/",
    plugins: [
        ['@vuepress/nprogress'],
        [
            'vuepress-plugin-mathjax',
            {
                target: 'svg',
                macros: {
                    '*': '\\times',
                },
            },
        ],
    ],
    head: [
        [
            'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Fira+Sans:300,400,500&display=swap' }
        ]
    ],
    themeConfig: {
        smoothScroll: true,
        displayAllHeaders: true,
        nav: [
            { text: 'Home', link: '/' },
            { text: 'CV', link: '/cv' },
            { text: 'Software', link: '/#software' },
            { text: 'Datasets', link: '/#datasets' },
            { text: 'Publications', link: '/#publications' }
        ]
    }
}
