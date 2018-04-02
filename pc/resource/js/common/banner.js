/*
 *  jquery animate动画改成css3动画
 *  日期：2016-11-24
 *  作者：Math
 * */
;
(function ($) {
    'use strict'

    // 判断浏览器支持css3属性情况
    var supCss3 = function (style) {
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i,
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase()
                })
            }
        if (_toHumb(style) in htmlStyle) {
            return ''
        }
        for (i in prefix) {
            if (_toHumb(prefix[i] + '-' + style) in htmlStyle) {
                return '-' + prefix[i] + '-'
            }
        }

        return false
    }
    // 添加浏览器前缀
    var prefix
    var cssPrefix = function (style) {
        return prefix + style
    }
    if (supCss3('transition') !== false) {
        prefix = supCss3('transition')

        $.fn.isAnimated = function () {
            return !!$(this).data('animated')
        }
        $.fn.animates = function (css, time, callback) {
            var $this = $(this)
            for (var key in css) {
                if (/^transition|animation|transform/.test(key)) {
                    css[cssPrefix(key)] = css[key]
                }
            }
            time = (time || 500) + 50
            setTimeout(function () {
                $this.css(cssPrefix('transition'), 'all ' + time + 'ms ease-in-out').css(css).data('animated', true)
                setTimeout(function () {
                    $this.css(cssPrefix('transition'), 'none')
                    $this.removeData('animated')
                    callback && callback()
                }, time)
            })
        }
    } else {
        $.fn.animates = $.fn.animate
    }
}(jQuery))

/*
 *   banner轮播组件
 *  日期：2016-11-24
 *  作者：Math
 * */
;(function ($, window) {
    'use strict'

    function Base(ele, options) {
        var defaults = {
            auto: true, // 自动播放
            hand: true, // 鼠标移到图片上是否停止动画
            handEle: '', // 鼠标移到该元素上是否停止动画
            speed: 500, // 动画执行时间
            width: '80%', // 图片宽度支持百分比
            height: 768, // 图片高度
            time: 5000, // 自动播放时间时隔
            activeClass: 'on', // 聚焦圆点样式
            active: 0, // 默认显示的图片
            dotsSpace: 18, // 小圆点宽度加上边距
            prevBtn: '.prev', // 上翻按钮
            nextBtn: '.next', // 下翻按钮
            numBox: '.number', // 小圆点容器
            initCallback: function () {}, // 初始化完成回调
            swipeCallback: function () {}, // 切换后的回调
        }
        /*
        if (!(this instanceof Base)) {
            return new Base(ele, options)
        }*/
        var opts = $.extend(defaults, options),
            self = this,
            $this = $(ele)
        self.$ele = $this

        if ($this.length <= 0) return
        if ($this.length > 1) {
            $this.each(function () {
                return new Base(this, options)
            })
            return
        }
        self.opts = opts
        self.init()
    }

    window.Banner = Base
    var pro = Base.prototype
    pro.init = function () {
        var self = this,
            $this = self.$ele,
            opt = self.opts,
            str = '',
            number = $this.find('li').length,
            $numBox = $this.find(opt.numBox)
        self.$ul = $this.find('ul')

        // ul初始化
        $this.css('height', opt.height)
        var _width = opt.width + '',
            _widthNum
        if (_width.indexOf('%') > 0) {
            _widthNum = _width.replace('%', '') / 100
        }
        self.width = _width.indexOf('%') > 0 ? $this.parent().width() * _widthNum : _width * 1
        self.$ul.css('width', self.width * number)

        if ($this.find('li').length <= 1) {
            return
        }
        // 小圆点初始化
        $this.find('li').each(function () {
            $(this).find('.pic-h').css('height', opt.height)
            str += '<span></span>'
        })
        $numBox.html(str)
        $numBox.find('span').eq(opt.active).attr('class', 'on')
        $this.css('width', self.width).find('li').css('width', self.width)

        // 方法状态初始化
        self.dotPlay(opt.active)

        // 事件绑定
        if (!self.bindEvent) {
            self.bindEvent = true

            $(window).on('resize', function () {
                self.initResize()
            })
            opt.auto && self.startAuto()
            $this.find(opt.nextBtn).click(function () {
                self.next()
            })
            $this.find(opt.prevBtn).click(function () {
                self.prev()
            })
            $numBox.on('click', 'span', function () {
                self.dotPlay($(this).index())
            })
            if (!opt.handEle) {
                opt.handEle = $this
            }
            opt.handEle.hover(function () {
                self.handOn()
            }, function () {
                opt.auto && self.startAuto()
            })
        }
        opt.initCallback()
    }
    var resizeTimer = null,
        resizeStatus = true
    pro.initResize = function () {
        var self = this,
            _width = self.opts.width + ''
        if (_width.indexOf('%') > 0) {
            resizeStatus && self.init()
            resizeStatus = false
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(function () { // 防抖动执行
                self.init()
                resizeStatus = true
            }, 300)
        }
    }
    // 小圆点聚焦方法
    pro.dotPlay = function (i) {
        var self = this,
            $this = self.$ele,
            opt = self.opts
        opt.active = i
        if (self.$ul.css('marginLeft') != (-i * self.width) + 'px') {
            self.$ul.animates({ marginLeft: (-i * self.width) + 'px' }, opt.speed)
            self.cur($this.find(opt.numBox).find('span').eq(i))
            self.$ul.find('li').eq(opt.active).addClass('on').siblings('li').removeClass('on')
            opt.swipeCallback(opt.active)
        }
    }
    // 小圆点聚焦样式
    pro.cur = function (ele) {
        var self = this
        ele = $(ele) ? $(ele) : ele
        ele.addClass(self.opts.activeClass).siblings().removeClass(self.opts.activeClass)
    }
    // 轮播图滚动方法
    pro.arrowPlay = function (j) {
        var self = this,
            $this = self.$ele,
            opt = self.opts,
            number = $this.find('li').length
        if (self.$ul.isAnimated(':animated') == false) {
            opt.active += j
            if (opt.active != -1 && opt.active != number) {
                self.$ul.animates({
                    marginLeft: (-opt.active * self.width) + 'px',
                }, opt.speed)
            } else if (opt.active == number) {
                opt.active = 0
                self.$ul.find('li:first-child').css({ left: (self.width * number) + 'px', position: 'relative' })
                self.$ul.animates({
                    marginLeft: (-number * self.width) + 'px',
                }, opt.speed, function () {
                    self.$ul.find('li:first-child').css('left', '0')
                    self.$ul.css('marginLeft', '0')
                })
            } else if (opt.active == -1) {
                opt.active = number - 1
                self.$ul.find('li:last-child').css('marginLeft', (-self.width * number) + 'px')
                self.$ul.animates({
                    marginLeft: self.width + 'px',
                }, opt.speed, function () {
                    self.$ul.find('li:last-child').css('marginLeft', '0')
                    self.$ul.css('marginLeft', (-opt.active * self.width) + 'px')
                })
            }

            self.$ul.find('li').eq(opt.active).addClass('on').siblings('li').removeClass('on')
            self.cur($this.find(opt.numBox).find('span').eq(opt.active))
            opt.swipeCallback(opt.active)
        }
    }
    // 自动播放
    pro.startAuto = function () {
        var self = this,
            $this = self.$ele,
            opt = self.opts
        if ($this.find('li').length <= 1) {
            return
        }
        self.animation && clearInterval(self.animation)
        self.animation = setInterval(function () {
            self.arrowPlay(1)
        }, opt.time)
    }
    // 鼠标
    pro.handOn = function () {
        var self = this
        self.opts.hand && self.animation && clearInterval(self.animation)
    }

    // 切换下一页
    pro.next = function () {
        this.arrowPlay(1)
    }
    // 切换上一页
    pro.prev = function () {
        this.arrowPlay(-1)
    }

    $.fn.banner = function (options) {
        var name = 'carouselBanner'
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

/*
 *   banner渐变组件
 *  日期：2016-11-24
 *  作者：Math
 * */
;(function ($) {
    'use strict'

    var Banner = window.Banner
    function Base(ele, options) {
        var opts = $.extend({
            opacity: 0.1, // 最低透明度
        }, options)
        Banner.call(this, ele, opts)
    }

    // 继承Banner的方法和属性
    for (var i in Banner.prototype) {
        Base.prototype[i] = Banner.prototype[i]
    }
    window.bOpacity = Base

    var pro = Base.prototype
    pro.arrowPlay = function (j) {
        var self = this,
            $this = self.$ele,
            opt = self.opts,
            number = $this.find('li').length
        if ($this.find('li').eq(opt.active).isAnimated(':animated') == false) {
            opt.active += j
            if (opt.active >= number) {
                opt.active = 0
            } else if (opt.active < 0) {
                opt.active = number - 1
            }
            $this.find('li').eq(opt.active).siblings().css({ 'z-index': '1' }).animates({
                opacity: opt.opacity,
            }, opt.speed)
            $this.find('li').eq(opt.active).css('z-index', '2').animates({
                opacity: 1,
            }, opt.speed)
            self.$ul.find('li').eq(opt.active).addClass('on').siblings('li').removeClass('on')
            self.cur($this.find(opt.numBox).find('span').eq(opt.active))
            opt.swipeCallback(opt.active)
        }
    }
    // 小圆点聚焦方法
    pro.dotPlay = function (j) {
        var self = this,
            $this = self.$ele,
            opt = self.opts
        opt.active = j
        $this.find('li').eq(j).siblings().css({ 'z-index': '1' }).animates({
            opacity: opt.opacity,
        }, opt.speed)
        setTimeout(function () {
            $this.find('li').eq(j).css('z-index', '2').animates({
                opacity: 1,
            }, opt.speed)
        }, opt.speed / 2)
        self.cur($this.find(opt.numBox).find('span').eq(j))
        opt.swipeCallback(opt.active)
    }

    $.fn.bOpacity = function (options) {
        var name = 'opacityBanner'
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
