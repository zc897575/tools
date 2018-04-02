/*
 *  工具方法库
 *  日期：2016-08-18
 *  作者：Math
 * */
;
(function (win, doc, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory(win, doc)
        })
    } else if (typeof exports === 'object') {
        module.exports = factory(win, doc)
    } else {
        win.util = factory(win, doc)
    }
}(window, document, function (window, document) {
    'use strict'

    var Util = {}

    /*
     * 初始化数据
     * */
    Util.init = function () {
        var local = document.location
        this.url = local.href
        this.domain = local.protocol + '//' + local.host
    }
    Util.init()
    /*
     * 打印日志
     * */
    Util.log = function () {
        if (Util.url.indexOf('http://192.168.1.39') >= 0) {
            var arr = [].slice.call(arguments)
            for (var i = 0, len = arr.length; i < len; i++) {
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
     * 判断数据类型
     * @return {Object}
     * */
    Util.type = (function () {
        var obj = {}

        var types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ')

        function type() {
            return Object.prototype.toString.call(this).slice(8, -1)
        }

        for (var i = types.length; i--;) {
            obj['is' + types[i]] = (function (self) {
                return function (elem) {
                    return type.call(elem) === self
                }
            }(types[i]))
        }
        return obj
    }())

    /*
     * 解析url参数
     * @param {String} paras 参数名
     * @param {String} url 链接地址
     * @return {String} 或 {Object}
     * */
    Util.getUrlParams = function (paras, url) {
        url = url || this.url
        url = url.split('#')[0]
        var paraData = url.substring(url.indexOf('?') + 1, url.length).split('&')
        var paraObj = {}
        for (var i = 0, len = paraData.length; i < len; i++) {
            var j = paraData[i]
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
            for (var i in key) {
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
        var reg = new RegExp('(\\?|\\&)' + key + '='),
            reg2 = new RegExp('((\\?|\\&)' + key + '=)[^&]+')
        if (url.indexOf('?') >= 0) {
            url = reg.test(url) ? url.replace(reg2, '$1' + value) : url + '&' + key + '=' + value
        } else {
            url = url + '?' + key + '=' + value
        }
        return url
    }
    /*
     * 检测移动终端浏览器版本信息
     * @return {Object}
     * */
    Util.mobile = (function () {
        var u = navigator.userAgent
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
            iosUp5: /OS [5-9]_\d[_\d]* like Mac OS X/i.test(u),
        }
    }())

    /*
     *  检测文档模式下的ie浏览器,在文档模式下经常检测错误
     *  @param {Number} v 具体版本号
     *  @return {Boolean} 如果不传返回具体版本号返回数字
     * */
    Util.isIE = (function () {
        var u = navigator.userAgent
        // 判断是否为IE
        var isIE = u.toLocaleLowerCase().indexOf('msie') !== -1

        // 判断是否为IE5678
        var isLteIE8 = isIE && !+[1]

        // 用于防止因通过IE8+的文档兼容性模式设置文档模式，导致版本判断失效
        var dm = document.documentMode,
            isIE5, 
            isIE6, 
            isIE7, 
            isIE8, 
            isIE9, 
            isIE10, 
            isIE11, 
            ie11Up
        if (dm) {
            isIE5 = dm === 5
            isIE6 = dm === 6
            isIE7 = dm === 7
            isIE8 = dm === 8
            isIE9 = dm === 9
            isIE10 = dm === 10
            isIE11 = dm === 11
            ie11Up = dm >= 12
        } else {
            // 判断是否为IE5，IE5的文本模式为怪异模式(quirks),真实的IE5.5浏览器中没有document.compatMode属性
            isIE5 = (isLteIE8 && (!document.compatMode || document.compatMode === 'BackCompat'))

            // 判断是否为IE6，IE7开始有XMLHttpRequest对象
            isIE6 = isLteIE8 && !isIE5 && !XMLHttpRequest

            // 判断是否为IE7，IE8开始有document.documentMode属性
            isIE7 = isLteIE8 && !isIE6 && !document.documentMode

            // 判断是否IE8
            isIE8 = isLteIE8 && document.documentMode

            // 判断IE9，IE10开始支持严格模式，严格模式中函数内部this为undefined
            isIE9 = !isLteIE8 && (function () {
                'use strict'

                return !!this
            }())

            // 判断IE10，IE11开始移除了attachEvent属性
            isIE10 = isIE && !!document.attachEvent && (function () {
                'use strict'

                return !this
            }())

            // 判断IE11
            isIE11 = isIE && !document.attachEvent

            ie11Up = isIE && u.match(/rv:(\d+)/) >= 12
        }
        var obj = {
            ie5: isIE5,
            ie6: isIE6,
            ie7: isIE7,
            ie8: isIE8,
            ie9: isIE9,
            ie10: isIE10,
            ie11: isIE11,
            'ie11+': ie11Up,
        }
        return function (v) {
            if (!isIE) {
                return false
            }
            if (v) {
                return obj['ie' + v]
            } 
            for (var i in obj) {
                if (obj[i]) {
                    return i.substring(2)
                }
            }
        }
    }())

    /*
     * 检测PC端浏览器版本信息
     * @return {Object}
     * */
    Util.pc = (function () {
        var u = navigator.userAgent
        return {
            language: (navigator.browserLanguage || navigator.language).toLowerCase(),
            ie: /MSIE\s(\d+\.\d+)/.test(u), // IE内核
            isEdge: /edge/i.test(u), // Edge
            firefox: /Firefox\/(\d+(\.|\d)+)/.test(u),
            opera: /OPR\/(\d+(\.|\d)+)/.test(u),
            safari: /Safari\/(\d+(\.|\d)+)/.test(u) && !/Chrome\/(\d+(\.|\d)+)/.test(u),
            chrome: /Chrome\/(\d+(\.|\d)+)/.test(u),
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
            var result = '',
                cookies = doc.cookie
            if (cookies.length > 0) {
                var begin = cookies.indexOf(name + '=')
                if (begin != -1) {
                    begin += name.length + 1 // cookie值的初始位置
                    var end = cookies.indexOf(';', begin) // 结束位置
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
            if (!name) return
            var expireDate = new Date()
            if (Object.prototype.toString.call(expire) === '[object Date]') {
                expireDate = expire
            } else if (typeof expire === 'number') {
                expireDate.setTime(expireDate.getTime() + expire)
            }
            doc.cookie = name + '=' + encodeURIComponent(value) +
                ((typeof expire === 'undefined' || expire == null) ? '' :
                    '; expires=' + expireDate.toGMTString()) + ';path=' + (path || '/')
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
            get: get,
            set: set,
            remove: remove,
        }
    }(document))

    /*
     * localStorage 操作
     * @return {Object}
     * */
    Util.ls = (function (space) {
        var ls = window.localStorage,
            isSupport = !!ls
        /*
         * 获取 localStorage
         * @param {String} key
         * @return {String}
         * */
        function get(key) {
            if (!key) return
            var result = ''
            if (isSupport) {
                result = ls.getItem(key)
                result = result ? decodeURIComponent(result) : ''
                try { // safari隐身浏览时
                    ls.setItem('test', 'test')
                } catch (e) {
                    result = space.cookie.get(key)
                }
            } else {
                result = space.cookie.get(key)
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
            value = encodeURIComponent(space.empty(value))
            var expire = 3153600000000 // 100年
            if (isSupport) {
                try { // safari隐身浏览时
                    ls.setItem(key, value)
                } catch (e) {
                    space.cookie.set(key, value, expire)
                }
            } else {
                space.cookie.set(key, value, expire)
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
                    space.cookie.remove(key)
                }
            } else {
                space.cookie.remove(key)
            }
        }
        return {
            get: get,
            set: set,
            remove: remove,
        }
    }(Util))

    /*
     * sessionStorage 操作
     * @return {Object}
     * */

    Util.ss = (function (space) {
        var ss = window.sessionStorage,
            isSupport = !!ss
        /*
         * 获取 sessionStorage
         * @param {String} key
         * @return {String}
         * */
        function get(key) {
            if (!key) return
            var result = ''
            if (isSupport) {
                result = ss.getItem(key)
                result = result ? decodeURIComponent(result) : ''
                try { // safari隐身浏览时
                    ss.setItem('test', 'test')
                } catch (e) {
                    result = space.cookie.get(key)
                }
            } else {
                result = space.cookie.get(key)
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
            value = encodeURIComponent(space.empty(value))
            if (isSupport) {
                try { // safari隐身浏览时
                    ss.setItem(key, value)
                } catch (e) {
                    space.cookie.set(key, value)
                }
            } else {
                space.cookie.set(key, value)
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
                    space.cookie.remove(key)
                }
            } else {
                space.cookie.remove(key)
            }
        }
        return {
            get: get,
            set: set,
            remove: remove,
        }
    }(Util))

    /*
    * 日期格式化
    * @param date 输入日期
    * @param input 日期格式表示
    * */
    Util.dateParse = function (date, input) {
        if (!date) {
            return ''
        }
        if (typeof date === 'string') {
            date = new Date(date.replace(/-/g, '/'))
        } else if (typeof date === 'number') {
            date = (date + '').length < 12 ? (date * 1000) : date
            date = new Date(date)
        }
        input = input || 'yyyy-MM-dd HH:mm:ss'
        var format = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
            'H+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds(), // 毫秒
        }
        var week = {
            0: '\u65e5',
            1: '\u4e00',
            2: '\u4e8c',
            3: '\u4e09',
            4: '\u56db',
            5: '\u4e94',
            6: '\u516d',
        }
        if (/(y+)/.test(input)) {
            input = input.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(input)) {
            input = input.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
        }
        for (var k in format) {
            if (new RegExp('(' + k + ')').test(input)) {
                input = input.replace(RegExp.$1, (RegExp.$1.length == 1) ? (format[k]) : (('00' + format[k]).substr(('' + format[k]).length)))
            }
        }
        return input
    }

    /*
     * 图片懒加载
     * @return {Function}
     * 使用：第一个参数{Dom Array} 图片对象列表，第二个参数{String} 默认图片地址
     * */
    Util.loadImg = (function (log) {
        var list = [],
            intervalId = null,
            // 停止所有定时器队列
            stop = function () {
                clearInterval(intervalId)
                intervalId = null
            },
            // 用来执行队列
            tick = function () {
                var i = 0
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i, 1) && (i -= 1) : list[i]()
                }!list.length && stop()
            }
        /*
         * 图片准备事件
         * @param imgs {Dom Object} 图片对象
         * @param url {String}
         * @param ready {Function}
         * @param load {Function}
         * @param error {Function}
         * */
        function imgReady(imgs, url, ready, load, error) {
            var onready, 
                width, 
                height, 
                newWidth, 
                newHeight,
                img = new Image()
            // 加载错误后的事件
            img.onerror = function () {
                error && error(img)
                onready.end = true
                if (img) {
                    img = img.onload = img.onerror = null // 置空，不然错误信息会执行两次
                }
            }
            // 图片尺寸就绪
            onready = function () {
                newWidth = img.width
                newHeight = img.height
                if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
                    ready.call(img)
                    onready.end = true
                }
            }
            onready()
            // 完全加载完毕的事件
            img.onload = function () {
                width = img.width
                height = img.height
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready()
                load && load(imgs, width, height)
                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null
                imgs.src = url
            }
            img.src = url

            // 加入队列中定期执行
            if (!onready.end) {
                list.push(onready)
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                intervalId = intervalId === null && setInterval(tick, 40)
            }
        }
        /*
         * 图片加载队列事件
         * @param imgLi {Dom Array} 图片对象列表
         * @param bg {String}
         * */
        function loadImg(imgLi, bg) {
            if (imgLi && imgLi.length > 0) {
                for (var i = 0; i < imgLi.length; i++) {
                    var theImg = imgLi[i],
                        url = theImg.getAttribute('url')

                    if (url && url != 'null' && url != 'undefined') {
                        imgReady(theImg, url, // imgReady(imgs, url, ready, load, error)
                            function () {}, // read
                            function (/* imgs, width, heights */) {}, // load
                            function (img) { // error
                                img.src = bg
                            })
                    }
                }
            } else {
                log('log', 'loadImg', '需要加载的图片集合不存在')
            }
        }
        var done = false, // 页面加载完成状态
            send = false, // 图片加载方法调用状态
            theImg,
            theBg,
            theList = []

        function callback() {
            if (!send) {
                setTimeout(function () { // 不知道原因，这样加载速度快
                    for (var i = 0, len = theList.length; i < len; i++) {
                        var str = theList[i]
                        loadImg(str.theImg, str.theBg)
                    }
                }, 100)
            }
        }

        function loadImgFn(imgLi, bg) {
            theImg = imgLi
            theBg = bg
            if (done) {
                send = true
                loadImg(theImg, theBg)
            } else {
                theList.push({
                    theImg: theImg,
                    theBg: theBg,
                })
            }
        }
        if (window.addEventListener) {
            window.addEventListener('load', function () {
                done = true
                callback()
            }, true)
        } else if (window.attachEvent) {
            window.attachEvent('onload', function () {
                done = true
                callback()
            })
        } else {
            window.onload = function () {
                done = true
                callback()
            }
        }
        return loadImgFn
    }(Util.log))

    /*
    * 去除html标签，保留纯文本内容
    * @param str html字符串
    * */
    Util.removeHtmlTag = function (str) {
        str = str || ''
        str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
        str = str.replace(/&nbsp;/ig, '') // 去掉&nbsp;
        return str
    }

    /*
     * 判断浏览器是否支持某一个CSS3属性
     * @param params 属性名称
     * @return {Boolean}
     * */
    Util.supCss3 = function (style) {
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i,
            humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase()
                })
            }

        for (i in prefix) {
            humpString.push(_toHumb(prefix[i] + '-' + style))
            humpString.push(_toHumb(style))
        }

        for (i in humpString) {
            if (humpString[i] in htmlStyle) return true
        }

        return false
    }

    /*
     * ajax请求共用方法 基于jquery
     * @param params 配置参数
     * */
    Util.comAjax = (function ($) {
        // var local = document.location
        var base = function comAjax(params) {
            var defaults = {
                timer: 1, // 请求次数记录
                two: false, // 是否在失败后自动发第二次请求
                type: 'POST',
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                target: '', // 点击的目标元素,防止频繁点击
                tab: '', // 当有tab切换请求数据，防止数据错乱显示
                cache: true,
                timeout: 15000,
                baseUrl: '',
                data: '',
                success: '', // 成功回调
                error: '', // 失败回调
                beforeSend: function () {},
                defer: new $.Deferred(),
            }
            if (Util.pc.ie) {
                defaults.cache = false
            }
            var opts = $.extend(defaults, params)
            if (opts.json) {
                opts.contentType = 'application/json;charset=utf-8'
                if (typeof opts.data === 'object') {
                    opts.data = JSON.stringify(opts.data)
                }
            }
            /* if (opts.url && opts.url.indexOf('http') < 0) { //mock数据
                opts.url = opts.baseUrl + opts.url
            }*/
            opts.url = opts.baseUrl
            if (opts.type.toLowerCase() == 'post' && opts.data.wMethod) {
                opts.url = Util.setUrlParams('wMethod', opts.data.wMethod, opts.url)
            }
            var hasTarget = false
            if (opts.target && $(opts.target).length > 0) {
                hasTarget = true
                if ($(opts.target).data('disabled')) {
                    return new $.Deferred()
                }
                $(opts.target).data('disabled', true)
            }
            var timestamp = null
            window.common = window.common || {}
            var common = window.common
            if (opts.tab) {
                timestamp = +new Date()
                common[opts.tab] = timestamp
            }
            $.ajax({
                beforeSend: opts.beforeSend,
                type: opts.type,
                url: opts.url,
                data: opts.data,
                dataType: opts.dataType,
                contentType: opts.contentType,
                cache: opts.cache,
                timeout: opts.timeout,
                context: timestamp,
                success: function (res) {
                    hasTarget && $(opts.target).removeData('disabled')

                    // 数据处理
                    res.Data = res.Data || []
                    res.ReturnCode *= 1
                    if (res.ReturnCode === 110) {
                        res.ReturnCode = 0
                    }

                    if (opts.tab && common[opts.tab] != Number(this)) {
                        return new $.Deferred()
                    }
                    opts.success && opts.success(res)
                    opts.defer.resolve(res)
                    if (res.ReturnCode !== 0 && window.liveApi) { // 打印日志
                        Util.log(window.liveApi[opts.data.a], 'ajax调用异常：' + res.ReturnCode)
                    }
                },
                error: function (res, status) {
                    hasTarget && $(opts.target).removeData('disabled')
                    if (window.liveApi) { // 打印日志
                        Util.log(window.liveApi[opts.data.a], 'ajax调用报错：', res)
                    }
                    if (opts.tab && common[opts.tab] != Number(this)) {
                        return new $.Deferred()
                    }
                    if (!opts.two) {
                        opts.error && opts.error(res, status)
                        opts.defer.reject(res)
                    } else if (opts.two && opts.timer == 2) {
                        opts.error && opts.error(res, status)
                        opts.defer.reject(res)
                    } else if (opts.two && opts.timer == 1) {
                        opts.timer = 2
                        base(opts)
                    }
                },
            })
            return opts.defer.promise()
        }
        return base
    }(jQuery))

    // export const { domain, log, empty, type, getUrlParams, setUrlParams, isIe, mobile, cookie, ls, ss, dateParse, loadImg, removeHtmlTag, supCss3, comAjax, } = Util
    return Util
}))

/*
 * 去除ie autocomplete
 * */
if (util.pc.ie) {
    $(window).on('load', function () {
        $('[autocomplete="off"]').val('')
    })
};
