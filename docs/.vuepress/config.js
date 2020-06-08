// .vuepress/config.js
module.exports = {
    title: 'faroit',
    base: "/",
    plugins: [
        [
            '@vuepress/nprogress'
        ],
        [
            'vuepress-plugin-mathjax',
            {
                target: 'svg',
                macros: {
                    '*': '\\times',
                },
            },
        ],
        [
            '@vuepress/google-analytics',
            {
                'ga': 'UA-120462573-2'
            }
        ]
    ],
    head: [
        [
            'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Fira+Sans:300,400,500&display=swap' }
        ],
        [
            'script', { type: 'text/ javascript', src: 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js' }
        ],
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
