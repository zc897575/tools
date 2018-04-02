/*
 *  结构化代码demo演示
 *  日期：2017/12/29.
 *  作者：Math
 * */
 
struct(function ($, space, window, document) {
    'use strict'

    return {
        data: function () {
            return {
                msg: 'hello world',
                welcome: 'welcome',
                number: 10,
            }
        },
        computed: {
            count: function () {
                return (this.number += 10)
            },
        },
        dom: [
            '#dian',
            {
                ji: '#dian2',
            },
        ],
        created: function () {
            var self = this,
                dom = self.dom

            self.test = '测试一下'

            dom.dian.on('click', function () {
                console.log(self.count)
                self.alertMsg()
            })
            dom.ji.on('click', function () {
                console.log(self.count)
                self.testMixin(self.welcome)
            })
        },
        methods: {
            alertMsg: function () {
                alert(this.msg)
            },
        },
    }
})
