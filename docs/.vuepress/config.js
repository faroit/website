// .vuepress/config.js
module.exports = {
    title: 'faroit',
    base: "/",
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
            { text: 'About Me', link: '/#about-me' },
            { text: 'Scientific Service', link: '/#scientific-service' },
            { text: 'Software', link: '/#software' },
            { text: 'Datasets', link: '/#datasets' },
            { text: 'Publications', link: '/#publications' }
        ]
    },
    watch: {
        // scroll position hack
        // https://github.com/vuejs/vuepress/issues/1499
        $page(newPage, oldPage) {
            if (newPage.key !== oldPage.key) {
                requestAnimationFrame(() => {
                    if (this.$route.hash) {
                        const element = document.getElementById(this.$route.hash.slice(1));

                        if (element && element.scrollIntoView) {
                            element.scrollIntoView();
                        }
                    }
                });
            }
        }
    }
}
