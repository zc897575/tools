import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component(resolve) {
                require(['../pages/Menu'], resolve)
            },
        },
        {
            path: '/scroller',
            component(resolve) {
                require(['../pages/DemoScroller'], resolve)
            },
        },
        {
            path: '/loading',
            component(resolve) {
                require(['../pages/DemoLoading'], resolve)
            },
        },
        {
            path: '/search',
            component(resolve) {
                require(['../pages/DemoSearch'], resolve)
            },
        },
        {
            path: '/signature',
            component(resolve) {
                require(['../pages/DemoSignature'], resolve)
            },
        },
        {
            path: '/txMap',
            component(resolve) {
                require(['../pages/DemoTxMap'], resolve)
            },
        },
        {
            path: '/swipeTab',
            component(resolve) {
                require(['../pages/DemoSwipeTab'], resolve)
            },
        },
    ]
})
