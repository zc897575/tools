/**
 *  判断当前页面所在位置
 *  日期：2016-08-18
 *  作者：Math
 */
;
(function (window, $) {
    'use strict'

    var url = window.location.href,
        $header = $('#header'),
        $li = $header.find('.link'),
        pages = [
            /index\.html/,
            /(news-list|news-detail)\.html/,
            /(company-list|company-detail|download)\.html/,
            /(product-list|product-detail)\.html/,
            /(businesses|address|contact-client|contact-provider|job)\.html/,
        ]

    for (var i = 0, len = pages.length; i < len; i++) {
        if (url.indexOf('.html') < 0) {
            $li.eq(0).addClass('on')
            break
        }
        if (pages[i].test(url)) {
            $li.eq(i).addClass('on')
            break
        }
    }
}(window, jQuery))
