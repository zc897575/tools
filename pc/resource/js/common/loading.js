/*
 *   loading加载
 *  日期：2016-11-29
 *  作者：Math
 * */

;
(function (window, space) {
    'use strict'

    var timer = {}
    space.loadingIn = function (target) {
        if (!util.supCss3('animation')) {
            var n = 0,
                name = $(target).data('timer') || (+new Date())
            timer[name] = setInterval(function () {
                if (n > 9) {
                    n = 0
                } else {
                    n += 1
                }
                $(target).children('.loading').find('.loadingImg').css('background-position', '0 -' + (n * 40) + 'px')
            }, 80)
            $(target).data('timer', name)
            if ($(target).children('.loading').length == 0) {
                $(target).css({ position: 'relative', 'min-height': '180px' }).append('<div class="loading" style="display: block;"><span class="loadingImg">')
            } else {
                $(target).children('.loading').css('display', 'block')
            }
        } else {
            var loadingStr =
                '<div class="loading" style="display: block;"><div class="spinner">\
                  <div class="spinner-container container1">\
                    <div class="circle1"></div>\
                    <div class="circle2"></div>\
                    <div class="circle3"></div>\
                    <div class="circle4"></div>\
                  </div>\
                  <div class="spinner-container container2">\
                    <div class="circle1"></div>\
                    <div class="circle2"></div>\
                    <div class="circle3"></div>\
                    <div class="circle4"></div>\
                  </div>\
                  <div class="spinner-container container3">\
                    <div class="circle1"></div>\
                    <div class="circle2"></div>\
                    <div class="circle3"></div>\
                    <div class="circle4"></div>\
                  </div>\
                </div></div>'
            if ($(target).children('.loading').length == 0) {
                $(target).css({ position: 'relative', 'min-height': '120px' }).append(loadingStr)
            } else {
                $(target).children('.loading').css('display', 'block')
            }
        }
    }

    space.loadingOut = function (target) {
        $(target).children('.loading').css('display', 'none')
        if (!util.supCss3('animation')) {
            var name = $(target).data('timer')
            clearInterval(timer[name])
        }
    }
}(window, window.TL))
