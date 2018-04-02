/*
 *  vue Mixins
 *  日期：2017/7/5.
 *  作者：Math
 * */

import Vue from 'vue'
import router from '../router'
import { loginToken, inviteToken } from './config'
import { cookie, dateParse } from './util'


// 页面统计
router.afterEach((to) => {
    console.log(to.path)
})

Vue.mixin({
    methods: {
        goBack() {
            router.go(-1)
        },
        goHome() {
            router.push('/index')
        },
        goLogin(noReplace) {
            const href = this.$route.path
            if (noReplace) {
                router.push(`/login?redir=${encodeURIComponent(href)}`)
            } else {
                router.replace(`/login?redir=${encodeURIComponent(href)}`)
            }
        },
        isLogin() { // 判断是否为登录状态
            return cookie.get(loginToken)
        },
        tipGoLogin(isLogout) { // 提示后去登录页面
            const self = this
            // 是否登出（1-是 0-否 2026-登录过期)
            if (isLogout * 1 === 0) {
                return false
            }
            cookie.remove(loginToken)
            cookie.remove(inviteToken)
            self.$vux.toast.show({
                type: 'text',
                text: '您还未登录，请先登录',
                time: 3000,
                onHide() {
                    self.goLogin(true)
                }
            })
            return true
        },
        hideLoading() { // 隐藏全局loading
            this.$store.commit('updateLoadingStatus', { isLoading: false })
        },
        showLoading() { // 显示全局loading
            this.$store.commit('updateLoadingStatus', { isLoading: true })
        },
        setTitle(title) { // 设置页面标题
            title = title || '一起享'
            document.title = title
            // 微信浏览器
            if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
                let iframe = document.createElement('iframe')
                iframe.src = 'static/img/favicon.png'
                iframe.style.display = 'none'
                iframe.onload = function () {
                    setTimeout(() => {
                        document.body.removeChild(iframe)
                        iframe.onload = iframe = null
                    }, 50)
                }
                document.body.appendChild(iframe)
            }
        },
        timeFormat(date, input) {
            return dateParse(date, input)
        }
    },
})
