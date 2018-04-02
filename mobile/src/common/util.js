/*
 *   工具方法
 *  日期：2016-08-18
 *  作者：Math
 * */

const Util = {}

/*
 * 初始化数据
 * */
Util.init = function () {
    const local = document.location
    this.url = local.href
    this.domain = `${local.protocol}//${local.host}`
}
Util.init()

/*
 * 打印日志
 * */
Util.log = function (...arg) {
    if (Util.url.indexOf('http://192.168.1.89') >= 0) {
        const arr = [].slice.call(arg)
        for (let i = 0, len = arr.length; i < len; i++) {
            if (typeof (arr[i]) === 'object') {
                arr[i] = JSON.stringify(arr[i])
            }
        }
        console.log(arr.join('~~~~~~~'))
        console.trace && console.trace()
    }
}
/*
* 空值处理 null undefine 等
* */
Util.empty = function (str) {
    if (typeof str === 'number') {
        return str
    }
    if (!str) {
        return ''
    }
    return str
}

/*
 * 解析url参数
 * @param {String} paras 参数名
 * @param {String} url 链接地址
 * @return {String} 或 {Object}
 * */
Util.getUrlParams = function (paras, url, place) {
    url = url || window.location.href
    place = typeof (place) === 'number' ? place : 1
    url = url.split('#')[place]
    const paraData = url.substring(url.indexOf('?') + 1, url.length).split('&')
    const paraObj = {}
    for (let i = 0, len = paraData.length; i < len; i++) {
        const j = paraData[i]
        paraObj[j.substring(0, j.indexOf('='))] = decodeURIComponent(j.substring(j.indexOf('=') + 1, j.length))
    }
    if (paras) {
        return paraObj[paras] ? paraObj[paras] : ''
    }
    return paraObj
}

/*
 * 设置url参数
 * @param {String} url 链接地址
 * @param {String} key
 * @param {String} value
 * @return {String}
 * */
Util.setUrlParams = function (key, value, url) {
    if (typeof key === 'object') {
        url = value || ''
        for (const i in key) {
            if (Object.prototype.hasOwnProperty.call(key, i)) {
                url = Util.setUrlParams(i, key[i], url)
            }
        }
        return url
    }
    if (!key) {
        return url
    }
    value = Util.empty(value)
    value = encodeURIComponent(value)
    url = url || window.location.href
    const reg = new RegExp(`(\\?|\\&)${key}=`),
        reg2 = new RegExp(`((\\?|\\&)${key}=)[^&]+`)
    if (url.indexOf('?') >= 0) {
        url = reg.test(url) ? url.replace(reg2, `$1${value}`) : `${url}&${key}=${value}`
    } else {
        url = `${url}?${key}=${value}`
    }
    return url
}
/*
 * 检测移动终端浏览器版本信息
 * @return {Object}
 * */
Util.mobile = (function () {
    const u = navigator.userAgent
    return {
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
        iosUp5: /OS [5-9]_\d[_\d]* like Mac OS X/i.test(u)
    }
}())

/*
 * cookie的操作
 * */
Util.cookie = (function (doc) {
    /*
     * 获取cookie
     * @param {String} name cookie名称
     * */
    function get(name) {
        if (!name) return ''
        let result = ''
        const cookies = doc.cookie
        if (cookies.length > 0) {
            let begin = cookies.indexOf(`${name}=`)
            if (begin != -1) {
                begin += name.length + 1 // cookie值的初始位置
                let end = cookies.indexOf(';', begin) // 结束位置
                if (end == -1) {
                    end = cookies.length
                } // 没有;则end为字符串结束位置
                result = cookies.substring(begin, end)
                result = result ? decodeURIComponent(result) : ''
            }
        }
        return result
    }

    /*
     * 设置cookie
     * @param {String} name cookie名称
     * @param {String} value cookie值
     * @param {Date}或{Number} expire 过期时间 (日期对象或者为毫秒数)
     * @param {String} path cookie的路径
     * */
    function set(name, value, expire, path) {
        if (!name) {
            return
        }
        value = Util.empty(value)
        let expireDate = new Date()
        if (Object.prototype.toString.call(expire) === '[object Date]') {
            expireDate = expire
        } else if (typeof expire === 'number') {
            expireDate.setTime(expireDate.getTime() + expire)
        }
        doc.cookie = `${name}=${encodeURIComponent(value) 
        }${(typeof expire === 'undefined' || expire == null) ? '' :
            `; expires=${expireDate.toGMTString()}`};path=${path || '/'}`
    }

    /*
     * 删除cookie
     * @param {String} name cookie名称
     * @param {String} path cookie的路径
     * */
    function remove(name, path) {
        if (!name) return
        set(name, '', -1, path)
    }

    return {
        get,
        set,
        remove
    }
}(document))

/*
 * localStorage 操作
 * @return {Object}
 * */
Util.ls = (function (window) {
    const ls = window.localStorage,
        isSupport = !!ls
        /*
         * 获取 localStorage
         * @param {String} key
         * @return {String}
         * */
    function get(key) {
        if (!key) return
        let result = ''
        if (isSupport) {
            result = ls.getItem(key)
            result = result ? decodeURIComponent(result) : ''
            try { // safari隐身浏览时
                ls.setItem('test', 'test')
            } catch (e) {
                result = Util.cookie.get(key)
            }
        } else {
            result = Util.cookie.get(key)
        }
        return result
    }

    /*
     * 设置 localStorage
     * @param {String} key
     * @param {String} value
     * */
    function set(key, value) {
        if (!key) {
            return
        }
        value = encodeURIComponent(Util.empty(value))
        if (isSupport) {
            try { // safari隐身浏览时
                ls.setItem(key, value)
            } catch (e) {
                const expire = 3153600000000 // 100年
                Util.cookie.set(key, value, expire)
            }
        } else {
            const expire = 3153600000000 // 100年
            Util.cookie.set(key, value, expire)
        }
    }

    /*
     * 删除 localStorage
     * @param {String} key
     * */
    function remove(key) {
        if (!key) return
        if (isSupport) {
            ls.removeItem(key)
            try { // safari隐身浏览时
                ls.setItem('test', 'test')
            } catch (e) {
                Util.cookie.remove(key)
            }
        } else {
            Util.cookie.remove(key)
        }
    }
    return {
        get,
        set,
        remove
    }
}(window, Util))

/*
 * sessionStorage 操作
 * @return {Object}
 * */

Util.ss = (function (window) {
    const ss = window.sessionStorage,
        isSupport = !!ss
    /*
     * 获取 sessionStorage
     * @param {String} key
     * @return {String}
     * */
    function get(key) {
        if (!key) return
        let result = ''
        if (isSupport) {
            result = ss.getItem(key)
            result = result ? decodeURIComponent(result) : ''
            try { // safari隐身浏览时
                ss.setItem('test', 'test')
            } catch (e) {
                result = Util.cookie.get(key)
            }
        } else {
            result = Util.cookie.get(key)
        }
        return result
    }

    /*
     * 设置 sessionStorage
     * @param {String} key
     * @param {String} value
     * */
    function set(key, value) {
        if (!key) {
            return
        }
        value = encodeURIComponent(Util.empty(value))
        if (isSupport) {
            try { // safari隐身浏览时
                ss.setItem(key, value)
            } catch (e) {
                Util.cookie.set(key, value)
            }
        } else {
            Util.cookie.set(key, value)
        }
    }

    /*
     * 删除 sessionStorage
     * @param {String} key
     * */
    function remove(key) {
        if (!key) return
        if (isSupport) {
            ss.removeItem(key)
            try { // safari隐身浏览时
                ss.setItem('test', 'test')
            } catch (e) {
                Util.cookie.remove(key)
            }
        } else {
            Util.cookie.remove(key)
        }
    }
    return {
        get,
        set,
        remove
    }
}(window, Util))

Util.dateParse = function (date, input) {
    if (!date) {
        return
    }
    if (typeof date === 'string') {
        date = new Date(date.replace(/-/g, '/'))
    } else if (typeof date === 'number') {
        date = new Date(date)
    }
    input = input || 'yyyy-MM-dd HH:mm:ss'
    const format = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    }
    const week = {
        0: '\u65e5',
        1: '\u4e00',
        2: '\u4e8c',
        3: '\u4e09',
        4: '\u56db',
        5: '\u4e94',
        6: '\u516d'
    }
    if (/(y+)/.test(input)) {
        input = input.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(input)) {
        input = input.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[`${date.getDay()}`])
    }
    for (const k in format) {
        if (new RegExp(`(${k})`).test(input)) {
            input = input.replace(RegExp.$1, (RegExp.$1.length == 1) ? (format[k]) : ((`00${format[k]}`).substr((`${format[k]}`).length)))
        }
    }
    return input
}

export default Util
export const { domain, log, empty, getUrlParams, setUrlParams, mobile, cookie, ls, ss, dateParse } = Util
