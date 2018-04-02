// 整站的配置文件
;
(function (window, document, space) {
    'use strict'

    var local = document.location,
        domain = local.protocol + '//' + local.host
    var config = {
        domain: domain,
        apiUrl: domain + '/api/jsonapi.aspx', // 'https://www.easy-mock.com/mock/5a128624ef842836ae776bf7/jg/',
        defaultImg: 'resource/img/common/default.png', // 加载时显示的图片
        indexBanner: 'resource/img/common/default-banner.png', // 首页banner默认图
    }
    space.config = config

    space.links = {
        index: '/', // 首页链接
        path: '/', // 其它页面跳转目录
    }
}(window, document, (window.TL = {})))
