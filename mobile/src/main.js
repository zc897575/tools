// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Lazyload from 'vue-lazyload'
import { sync } from 'vuex-router-sync'
import { ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
import FastClick from 'fastclick'

import router from './router'
import App from './App'
import store from './store'
import './common'
import { defaultImg, proUrl } from './common/config'
import { ss } from './common/util'
import { wxShare } from './common/wx-share'

Vue.use(Vuex)
Vue.use(store)
sync(store, router)

Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.$vux.toast.text = function (text, position, time) {
    position = position || 'middle'
    time = time || 3000
    setTimeout(() => {
        Vue.$vux.toast.show({
            type: 'text',
            time,
            isShowMask: true,
            text,
            position,
        })
    }, 200)
}
window.addEventListener('load', () => {
    document.querySelector('.vux-toast .weui-mask_transparent').addEventListener('touchstart', () => {
        Vue.$vux.toast.hide()
    }, false)
}, false)

// 微信分享
const shareImg = ss.get('shareImg')
let shareUrl = proUrl + '/#/popularize'

if (shareImg) {
    shareUrl = proUrl + '/#/sharePopularize?shareImg=' + encodeURIComponent(shareImg)
    Vue.prototype.hasShre = true
}
const path = window.location.hash.split('?')[0].replace('#', '')
if (/^\/(popularize|bePopularize|sharePopularize)$/i.test(path)) {
    wxShare({
        title: '解放双手，一起享给生活充电！',
        desc: '邀请好友注册一起享，每周送出千元读书大礼！',
        link: shareUrl,
        imgUrl: proUrl + '/static/img/favicon.png'
    })
}

Vue.use(Lazyload, {
    preLoad: 1.3,
    error: defaultImg,
    loading: defaultImg,
    attempt: 1,
})
FastClick.attach(document.body)
if (process.env.NODE_ENV === 'development') {
    Vue.config.productionTip = true
}


const pathName = 'paths'
ss.remove(pathName)
ss.remove('count')
let historyCount = 0
let winLoad = false
router.beforeEach((to, from, next) => {
    let paths = ss.get(pathName) || '{}'
    try {
        paths = JSON.parse(paths)
    } catch (e) {
        paths = {}
    }
    const toIndex = paths[to.path]
    const fromIndex = paths[from.path]
    winLoad && store.commit('updateLoadingStatus', { isLoading: true })
    if (toIndex) {
        if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
            store.commit('updateDirection', { direction: 'forward' })
        } else {
            store.commit('updateDirection', { direction: 'reverse' })
        }
    } else {
        historyCount += 1
        ss.set('count', historyCount)
        paths[to.path] = historyCount
        ss.set(pathName, JSON.stringify(paths))
        if (winLoad) {
            store.commit('updateDirection', { direction: 'forward' })
        } else {
            store.commit('updateDirection', { direction: 'opacity' })
        }
    }
    winLoad = true
    next()
})

router.afterEach((to) => {
    setTimeout(() => {
        if (to.path.search(/\/(list)(\?)?$/) === 0) {
            return
        }
        store.commit('updateLoadingStatus', { isLoading: false })
    }, 100)
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app-box')
