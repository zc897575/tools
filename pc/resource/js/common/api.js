/*
 *  整站 ajax 请求
 *  日期：2017/11/16.
 *  作者：Math
 * */
;
(function (window) {
    'use strict'

    window.apis = {}

    // 首页banner
    apis.homeBanner = function () {
        return util.comAjax({
            type: 'GET',
            url: 'homeBanner',
            data: {
                wMethod: '100',
                type: 0,
            },
        })
    }
}(window, document, window.TL))
