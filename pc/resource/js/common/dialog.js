/*
 *   UI组件
 *  日期：2016-08-09
 *  作者：Math
 * */
;
(function (win, doc, $, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jQuery'], function ($j) {
            return factory(win, doc, $j)
        })
    } else if (typeof exports === 'object') {
        module.exports = factory(win, doc, $)
    } else {
        win.dialog = factory(win, doc, $)
    }
}(window, document, jQuery, function (window, document, $) {
    'use strict'

    /*
    *  模拟窗
    *  @return {Function}
    * */

    /*
     * 提示框
     * @return {Function}
     * */
    var dialog = (function () {
        var tipList = [],
            isShow = false,
            animateTime = 500 // 动画持续时间
        /*
         * 创建模拟窗口
         * @param type {String} 窗口类型
         * @return {Dom Object}
         * */
        function renderModal(params) {
            var defaults = {
                    sizes: '', // 窗口大小三种类型 (小：modal-sm  大：modal-lg 中：默认)
                    title: '标题',
                    body: '内容', // 内容区域，可放入html代码片段
                    cancel: '取消', // 取消按钮
                    ok: '确定', // 确认按钮
                },
                opts = $.extend(defaults, params)
            var str = '<div class="modal ' + opts.sizes + '">\
                    <div class="modal-mask"></div> \
                    <div class="modal-content">\
                        <div class="modal-title">\
                            <a href="javascript:;" class="close" modal="close">×</a>\
                            <h4>' + opts.title + '</h4>\
                        </div>\
                        <div class="modal-body">' + opts.body + '</div>\
                        <div class="modal-footer">\
                            <button class="default" modal="cancel">' + opts.cancel + '</button>\
                            <button class="ok" modal="ok">' + opts.ok + '</button>\
                        </div>\
                    </div>\
                </div>'
            return $(str)
        }
        var $body = $('body')
        /*
         * 模拟窗口
         *
         * */
        function Modal(ele, params) {
            var This = this,
                $this = This.ele = $(ele),
                len = $this.length
            if (len == 0) {
                $this = This.ele = renderModal(params)
                $body.append(This.ele)
            }
            if (len > 1) {
                $this.each(function () {
                    return new Modal(this, params)
                })
                return
            }
            This.init()
        }
        var pro = Modal.prototype

        pro.init = function () {
            var This = this
            This.ele.on('click', '.modal-mask', function () {
                This.close()
                This.cancelFn && This.cancelFn()
            })
            var $content = This.ele.find('.modal-content')
            if (This.ele.find('.modal-mask').length == 0) {
                $content.before($('<div class="modal-mask">'))
            }
            $content.on('click', '[modal="close"]', function () {
                This.close('cancel')
            })
            $content.on('click', '[modal="cancel"]', function () {
                This.close('cancel')
            })
            $content.on('click', '[modal="ok"]', function () {
                This.okFn() && This.close('ok')
            })
            This.ele.on('scroll', function () {
                var top = This.ele.scrollTop()
                This.ele.find('.modal-mask').css('top', top)
            })
        }

        pro.open = function (callback) {
            var This = this
            This.ele.css('display', 'block')
            if (util.mobile.mobile) {
                This.ele.find('.modal-content').addClass('fade-in-mobile').removeClass('fade-out')
            } else {
                This.ele.find('.modal-content').addClass('fade-in').removeClass('fade-out')
            }
            $body.addClass('modal-open')
            callback && callback()
        }
        pro.close = function (type) {
            var This = this
            var u = navigator.userAgent
            var ieV = u.match(/MSIE\s(\d+)/) || u.match(/rv:(\d+)/)
            ieV = ieV && ieV.length == 2 ? ieV[1] : null
            if (ieV && ieV < 10) {
                This.ele.css('display', 'none')
                if (type != 'ok') {
                    This.cancelFn && This.cancelFn()
                }
            } else {
                setTimeout(function () {
                    This.ele.css('display', 'none')
                    if (type != 'ok') {
                        This.cancelFn && This.cancelFn()
                    }
                }, animateTime)
            }
            $body.removeClass('modal-open')
            if (util.mobile.mobile) {
                This.ele.find('.modal-content').addClass('fade-out').removeClass('fade-in-mobile')
            } else {
                This.ele.find('.modal-content').addClass('fade-out').removeClass('fade-in')
            }
        }
        // 点击确定按钮回调函数
        pro.okFn = function () {
            return true
        }
        /*
         * 初始化dom节点
         * @param ele {String}
         * @return {Dom Object}
         * */

        function getDom(ele) {
            var $ele = $(ele)
            if ($ele.length > 0) {
                return $ele
            }

            if (ele == '#tip') {
                $ele = renderModal({
                    sizes: 'modal-sm',
                    ok: '知道了',
                })
                $ele.attr('id', 'tip').css('z-index', '102').find('.modal-body').html('<div class="modal-tip-box"><span class="modal-tip">')
                $ele.find('.modal-footer').find('.default').remove()
            }
            if (ele == '#confirm') {
                $ele = renderModal({
                    sizes: 'modal-sm',
                    ok: '知道了',
                })
                $ele.attr('id', 'confirm').css('z-index', '102').find('.modal-body').html('<div class="modal-tip-box"><span class="modal-tip">')
            }
            if (ele == '#toast') {
                $ele = $('<div id="toast"><div class="text">')
            }
            $body.append($ele)
            return $ele[0]
        }
        var tips,
            confirms,
            $toast
        /*
         * 展示消息
         * */
        function allShow() {
            if (tipList.length && !isShow) {
                var obj = tipList.shift()
                if (obj.type == 'tipInfo') {
                    showTipInfo.apply(showTipInfo, obj.arg)
                } else if (obj.type == 'confirmInfo') {
                    showConfirmInfo.apply(showConfirmInfo, obj.arg)
                } else if (obj.type == 'toast') {
                    showToast.apply(showToast, obj.arg)
                }
            }
        }

        /*
         * 提示消息框
         * @param mes {String} 或 {Dom Object}
         * @param callback {Function}
         * @param title {String}
         * */
        function tipInfo(/* mes, callback, title */) {
            tipList.push({
                type: 'tipInfo',
                arg: [].slice.call(arguments),
            })
            allShow()
        }

        function showTipInfo(mes, callback, title) {
            isShow = true
            if (!tips) {
                tips = new Modal(getDom('#tip'))
            }
            var $title = tips.ele.find('.modal-title'),
                $tip = tips.ele.find('.modal-body').find('.modal-tip')
            if (typeof arguments[1] === 'string') {
                title = callback
                callback = null
            }
            if (title) {
                $title.css('display', 'block').find('h4').html(title)
            } else {
                $title.css({ display: 'block', background: '#fff' }).find('h4').remove()
            }

            $tip.html(mes)
            tips.okFn = tips.cancelFn = function () {
                setTimeout(function () {
                    callback && callback()
                    isShow = false
                    allShow()
                }, animateTime + 1)
                return true
            }
            tips.open()
        }

        /*
         * 确认消息框
         * @param mes {String} 或 {Dom Object}
         * @param submitFn {Function}
         * @param cancelFn {Function}
         * @param title {String}
         * */
        function confirmInfo(/* mes, submitFn, cancelFn, title */) {
            tipList.push({
                type: 'confirmInfo',
                arg: [].slice.call(arguments),
            })
            allShow()
        }
        function showConfirmInfo(mes, submitFn, cancelFn, title) {
            isShow = true
            if (!confirms) {
                confirms = new Modal(getDom('#confirm'))
            }
            var $title = confirms.ele.find('.modal-title'),
                $tip = confirms.ele.find('.modal-body .modal-tip')
            if (typeof arguments[2] === 'string') {
                title = cancelFn
                cancelFn = null
            }
            if (title) {
                $title.css('display', 'block').find('h4').html(title)
            } else {
                $title.css({ display: 'block', background: '#fff' }).find('h4').remove()
            }
            $tip.html(mes)
            confirms.okFn = function () {
                setTimeout(function () {
                    submitFn && submitFn()
                    isShow = false
                    allShow()
                }, animateTime + 1)
                return true
            }
            confirms.cancelFn = function () {
                cancelFn && cancelFn()
                isShow = false
                allShow()
            }
            confirms.open()
        }
        /*
         * 提示文本
         * @param mes {String}
         * @param time {Number}
         * */
        var toastFlag = false
        function toast(/* mes, time */) {
            if (toastFlag) {
                return
            }
            toastFlag = true
            setTimeout(function () {
                toastFlag = false
            }, 1000)
            tipList.push({
                type: 'toast',
                arg: [].slice.call(arguments),
            })
            allShow()
        }
        function showToast(mes, time) {
            isShow = true
            if (!$toast) {
                $toast = $(getDom('#toast'))
            }
            time = time || 2000
            $toast.css('display', 'block').find('.text').html(mes).addClass('fade-in').removeClass('fade-out')
            setTimeout(function () {
                $toast.find('.text').addClass('fade-out').removeClass('fade-in').removeClass('fade-in-mobile')
                setTimeout(function () {
                    $toast.css('display', 'none')
                    isShow = false
                    allShow()
                }, 1000)
            }, time)
        }
        return {
            tipInfo: tipInfo,
            confirmInfo: confirmInfo,
            toast: toast,
            modal: Modal,
        }
    }())
    return dialog
}))

