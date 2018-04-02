/*
 *  代码结构化方法
 *  日期：2017/12/29.
 *  作者：Math
 * */

;
(function ($, space, window, document) {
    'use strict'

    // 继承方法
    function extend(oldObj, newObj) {
        for (var i in oldObj) {
            if (Object.prototype.hasOwnProperty.call(oldObj, i) && !Object.prototype.hasOwnProperty.call(newObj, i)) {
                newObj[i] = oldObj[i]
            }
        }
        return newObj
    }

    // 定义类方法
    function Base(obj) {
        this.created = obj.created
        extend(obj.data(), this)
        extend(obj.methods, this)

        for (var i in obj.computed) {
            if (Object.prototype.hasOwnProperty.call(obj.computed, i)) {
                this[i] = obj.computed[i].call(this, i)
            }
        }
        var dom = {}
        obj.dom.forEach(function (item) {
            if (typeof item === 'string') {
                var name = item.replace(/(\.|#)/, '')
                dom[name] = $(item)
            } else {
                for (var j in item) {
                    dom[j] = $(item[j])
                }
            }
        })
        this.dom = dom
        this.created()
    }

    function struct(callback) {
        // 默认配置
        var defaults = {
            data: function () { // 数据体
                return {}
            },
            dom: [
                /*
                 '#aa', // 方法1
                 {
                 'cc': '#bb', // 方法2
                 }*/
            ], // 页面dom元素列表
            created: function () { // 初始化方法

            },
            methods: { // 方法列表

            },
        }
        var obj = callback($, space, window, document)

        extend(defaults, obj)

        var base = new Base(obj)
        return base
    }

    // 公共方法
    struct.mixin = function (obj) {
        // 默认mixin
        var mixins = {
            constructor: Base,
        }
        if (obj.data) {
            extend(obj.data(), mixins)
        }
        extend(obj.methods, mixins)
        Base.prototype = mixins
    }

    window.struct = struct
}(jQuery, window.TL, window, document))
