// .vuepress/config.js
module.exports = {
    base: "/website/",
    themeConfig: {
        sidebar: [
            '/',
            '/projects/A.md',
        ],
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
