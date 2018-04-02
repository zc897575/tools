/*
 *  数组扩展方法
 *  日期：2017/9/26.
 *  作者：Math
 * */
;(function () {
    if (typeof Array.prototype.forEach !== 'function') {
        Array.prototype.forEach = function (fn, context) {
            for (var k = 0, length = this.length; k < length; k++) {
                if (typeof fn === 'function' && Object.prototype.hasOwnProperty.call(this, k)) fn.call(context, this[k], k, this)
            }
        }
    }
    if (typeof Array.prototype.map !== 'function') {
        Array.prototype.map = function (fn, context) {
            var arr = []
            if (typeof fn === 'function') {
                for (var k = 0, length = this.length; k < length; k++) {
                    arr.push(fn.call(context, this[k], k, this))
                }
            }
            return arr
        }
    }
    if (typeof Array.prototype.filter !== 'function') {
        Array.prototype.filter = function (fn, context) {
            var arr = []
            if (typeof fn === 'function') {
                for (var k = 0, length = this.length; k < length; k++) {
                    fn.call(context, this[k], k, this) && arr.push(this[k])
                }
            }
            return arr
        }
    }

    if (typeof Array.prototype.some !== 'function') {
        Array.prototype.some = function (fn, context) {
            var passed = false
            if (typeof fn === 'function') {
                for (var k = 0, length = this.length; k < length; k++) {
                    if (passed === true) break
                    passed = !!fn.call(context, this[k], k, this)
                }
            }
            return passed
        }
    }

    if (typeof Array.prototype.every !== 'function') {
        Array.prototype.every = function (fn, context) {
            var passed = true
            if (typeof fn === 'function') {
                for (var k = 0, length = this.length; k < length; k++) {
                    if (passed === false) break
                    passed = !!fn.call(context, this[k], k, this)
                }
            }
            return passed
        }
    }

    if (typeof Array.prototype.some !== 'function') {
        Array.prototype.some = function (fn, context) {
            var passed = false
            if (typeof fn === 'function') {
                for (var k = 0, length = this.length; k < length; k++) {
                    if (passed === true) break
                    passed = !!fn.call(context, this[k], k, this)
                }
            }
            return passed
        }
    }

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var index = -1
            fromIndex = fromIndex * 1 || 0

            for (var k = 0, length = this.length; k < length; k++) {
                if (k >= fromIndex && this[k] === searchElement) {
                    index = k
                    break
                }
            }
            return index
        }
    }

    if (typeof Array.prototype.reduce !== 'function') {
        Array.prototype.reduce = function (callback, initialValue) {
            var previous = initialValue, 
                k = 0, 
                length = this.length
            if (typeof initialValue === 'undefined') {
                previous = this[0]
                k = 1
            }

            if (typeof callback === 'function') {
                for (k; k < length; k++) {
                    Object.prototype.hasOwnProperty.call(this, k) && (previous = callback(previous, this[k], k, this))
                }
            }
            return previous
        }
    }
}())
