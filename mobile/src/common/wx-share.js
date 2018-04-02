/*
 *  微信分享公共方法
 *  日期：2017/11/30.
 *  作者：Math
 * */
import Vue from 'vue'
import { getUrlParams, ss } from './util'
import { wxSign } from './api'

// 微信appid
const appid = 'wx1babf7dbf9eb6909'
// 微信jssdk文件
const wxJs = 'static/js/jweixin-1.2.0.js'

// 注意这里的域名地址 不同环境要修改
const webUrl = 'http://api.1qixiang.com'

// 获取微信授权地址
const getOauthUrl = function (url) {
    url = url || window.location.href
    const href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_base&state=yqx#wechat_redirect`
    return href
}

// 微信授权地址跳转
const oauthUrl = function (url) {
    // 判断微信浏览器
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') === -1) {
        return
    }
    const href = getOauthUrl(url)
    if (window.location.href.indexOf(webUrl) === 0) {
        window.location.replace(href)
    }
}

function wxLoad(callback) {
    if (window.wx) {
        callback()
        return
    }
    const script = document.createElement('script')
    script.defer = true
    script.async = true
    script.onload = () => {
        callback()
    }
    script.src = wxJs
    document.body.appendChild(script)
}
// 微信签名
function signature(data, shareData) {
    wx.config({
        debug: false,
        appId: appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
    })
    const shareConfig = {
        title: shareData.title,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        desc: shareData.desc,
        trigger() {
            // alert('用户点击分享');
        },
        success() {
            // alert('已分享');
        },
        cancel() {
            // alert('已取消');
        },
        fail() {
            // alert(JSON.stringify(res));
        }
    }
    wx.ready(() => {
        wx.onMenuShareTimeline(shareConfig)
        wx.onMenuShareAppMessage(shareConfig)
        wx.onMenuShareQQ(shareConfig)
        wx.onMenuShareTimeline(shareConfig)
    })
}

/*
* @param title 标题
* @param desc 描述
* @param link 链接
* @param imgUrl 小图标
* */
const wxShare = function (shareData) {
    // 判断微信浏览器
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') === -1) {
        return
    }
    const href = window.location.href
    const code = getUrlParams('code', href, 0)
    const oldCode = ss.get('wxCode')
    if (!code || code === oldCode) {
        oauthUrl()
        return
    }
    ss.set('wxCode', code)
    wxLoad(() => {
        wxSign({
            Url: encodeURIComponent(href.split('#')[0])
        }).then((res) => {
            if (res.returnCode == 1000) {
                signature(res.data, shareData)
            } else {
                Vue.$vux.toast.text('微信签名失败，请刷新重试')
            }
        })
    })
}

export { wxShare, oauthUrl, getOauthUrl }
