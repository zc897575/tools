module.exports = {
    "extends": "D:/nodejs/node_global/node_modules/stylelint-config-standard",
    "plugins": [
        "D:/nodejs/node_global/node_modules/stylelint-scss"
    ],
    "rules": {
        "indentation": [4], //缩进4个空格
        "at-rule-no-unknown": null, //关闭 未知变量
        "selector-pseudo-element-colon-notation": null, //关闭 伪元素使用单冒号还是双冒号
        "function-name-case": null, //关闭 函数名称的大小写检测
        "property-no-unknown": null, //关闭 禁止使用未知属性
        "number-leading-zero": "never", //要求或禁止小于 1 的小数的前不导0。
        "max-nesting-depth": 3, //最大嵌套
    }
}