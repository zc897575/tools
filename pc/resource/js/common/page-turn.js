/*
 *  翻页组件
 *  日期：2016-08-09
 *  作者：Math
 */
;(function ($, window) {
    'use strict'

    function Base(ele, options) {
        var defaults = {
            classname: 'pink-page', // 添加样式
            currentPage: 1, // 当前页码
            showPage: 8, // 连续显示分页数
            skip: false, // 是否开启跳页
            totalPage: 50, // 总页码
            callback: '', // 点击后回调事件
        }
        if (!(this instanceof Base)) {
            return new Base(ele, options)
        }

        var opts = $.extend(defaults, options),
            This = this,
            $this = This.ele = $(ele),
            len = $this.length
        if (len == 0) return
        if (len > 1) {
            $this.each(function () {
                return new Base(this, opts)
            })
            return
        }
        This.opts = opts
        This.init()
    }

    window.PageTurn = Base
    var pro = Base.prototype

    pro.init = function () {
        var This = this
        if (This.opts.totalPage <= 1) {
            This.opts.skip = false
        }
        This.ele.off('click')
        This.renderSkip()
        This.renderPage(This.opts.currentPage, 'init')
        This.jump()
    }

    /*
     * 检查是否合法数据
     * */
    pro.check = function (current) {
        var This = this
        This.opts.currentPage = current
        if (This.opts.totalPage <= 1) {
            This.$skip && (This.$skip = This.$skip.detach())
            This.ele.html('')
            return false
        }
        if (current <= 0 || This.opts.showPage <= 0 || current > This.opts.totalPage) {
            return false
        }
        return true
    }

    /*
     * 生成html代码
     * @param current {Number} 当前页
     * */
    pro.renderPage = function (current, init) {
        var This = this,
            $first,
            $last,
            $prevMore,
            $prev,
            $nextMore,
            $next,
            $groups = $(document.createDocumentFragment())
        current = current * 1 || 0
        if (!This.check(current)) {
            return
        }
        if (!init) {
            This.opts.callback && This.opts.callback(current)
        }
        if (This.opts.totalPage <= This.opts.showPage + 2) { // 加上首尾2条
            for (var i = 1; i < This.opts.totalPage + 1; i++) {
                if (i == current) {
                    $groups.append($('<span class="on">' + i + '</span>'))
                } else {
                    $groups.append($('<a href="javascript:;" data-page="' + i + '">' + i + '</a>'))
                }
            }
        } else {
            if (current == 1) {
                $first = $('<span class="on">1</span>')
            }
            if (current > 1) {
                $prev = $('<a href="javascript:;" data-page="' + (current - 1) + '" class="prev"><i></i></a>')
                $first = $('<a href="javascript:;" data-page="1">1</a>')
            }
            if (current < This.opts.totalPage - 1) {
                $nextMore = $('<span>...</span>')
            }
            if (current < This.opts.totalPage) {
                $next = $('<a href="javascript:;" data-page="' + (current + 1) + '" class="next"><i></i></a>')
                $last = $('<a href="javascript:;" data-page="' + This.opts.totalPage + '">' + This.opts.totalPage + '</a>')
            }
            if (current == This.opts.totalPage) {
                $last = $('<span class="on">' + This.opts.totalPage + '</span>')
            }
            var number = current - Math.floor((This.opts.showPage / 2) * 1 || 0) // 连续显示开始数
            number = number > 2 ? number : 2
            var last = This.opts.showPage + number
            number = last >= This.opts.totalPage ? ($nextMore = null, (This.opts.totalPage - last) + number) : number
            if (number > 2) {
                $prevMore = $('<span>...</span>')
            }
            for (var j = 0; j < This.opts.showPage; j++) {
                if (number == current) {
                    $groups.append($('<span class="on">' + number + '</span>'))
                } else {
                    $groups.append($('<a href="javascript:;" data-page="' + number + '">' + number + '</a>'))
                }
                number += 1
            }
        }
        var $page = $('<div class="page-turn">')
        $page.addClass(This.opts.classname)
        $prev && $page.append($prev)
        $first && $page.append($first)
        $page.append($groups)
        $last && $page.append($last)
        $next && $page.append($next)
        This.$skip && $page.append(This.$skip)
        $prevMore && $prev.after($first) && $first.after($prevMore)
        $nextMore && $last.before($nextMore)
        This.ele.html($page)
    }

    /*
     * 生成跳转组件
     * */
    pro.renderSkip = function () {
        var str =
            '<span class="page-skip">\
                <label>到第</label>\
                <input type="text" class="page-input" />\
                <label>页</label>\
                <button type="button" class="page-btn">确定</button>\
            </span>'
        this.$skip = this.opts.skip ? $(str) : ''
    }

    /*
     * 翻页跳转
     * */
    pro.jump = function () {
        var This = this
        This.ele.on('click', 'a', function () {
            var number = $(this).data('page')
            This.renderPage(number)
        })
        if (this.opts.skip) {
            This.$skip.on('click', 'button', function () {
                var number = This.$skip.find('input').val() * 1
                if (number == This.opts.currentPage) {
                    return
                }
                This.renderPage(number)
            })
            This.$skip.on('keyup', 'input', function () {
                var $this = $(this),
                    val = $this.val()
                $this.val(val.replace(/\D+/, ''))
            })
            This.$skip.on('keydown', 'input', function (e) {
                var code = e.keyCode || e.which
                if (code == 13) {
                    var number = this.value * 1
                    if (number == This.opts.currentPage) {
                        return
                    }
                    This.renderPage(number)
                }
            })
        }
    }

    /*
     * 当数据发生变化时，刷新翻页组件的样式
     * @param current {Number} 当前页
     * @param totalPage {Number} 总页数
     * */
    pro.reload = function (current, totalPage) {
        var This = this
        This.opts.totalPage = totalPage
        This.renderPage(current, 'init')
    }

    $.fn.pageTurn = function (options) {
        var name = 'pageTurn'
        var arg = [].slice.call(arguments, 1)
        this.each(function () {
            var $this = $(this),
                data = $this.data(name)
            if (typeof options === 'string') {
                data[options].apply(data, arg)
            } else {
                $this.data(name, new Base(this, options))
            }
        })
        return this
    }
}(jQuery, window))
