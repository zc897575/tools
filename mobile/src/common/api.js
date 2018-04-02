/*
 *  接口
 *  日期：2017/6/8.
 *  作者：Math
 * */

import axios from 'axios'
import qs from 'qs'
import cryptoJSMD5 from 'crypto-js/md5'
import { DES3 } from './3des'

// axios 配置
axios.defaults.timeout = 10000
/*
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}*/
axios.defaults.headers = {
    'Content-Type': 'application/json',
}
axios.defaults.baseURL = '/Api/Tran.svc/h'

// 请求处理
axios.interceptors.request.use((config) => {
    if (config.data && config.data.wMethod) {
        config.url = config.url + '?wMethod=' + config.data.wMethod
        delete config.data.wMethod
    }
    if (config.method === 'post') {
        config.data = qs.stringify(config.data)
    }
    if (config.url.indexOf('.json') >= 0) {
        config.url = config.url.replace('/Api/Tran.svc/h', '/static/')
    }
    return config
}, (error) => {
    alert('网络异常，请刷新页面重试')
    return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
    res.data.returnCode *= 1
    res.data.data = res.data.data || {}
    if (typeof (res.data.data) === 'string') {
        res.data.data = JSON.parse(res.data.data)
    }
    return res.data
}, (error) => {
    alert('系统繁忙，请刷新页面重试')
    return Promise.reject(error)
})

function comAjax(opt) {
    opt.url = opt.url || ''
    if (opt.target) { // 防止提交按钮重复提交
        if (opt.target.disabled) {
            return new Promise(() => { })
        }
        opt.target.disabled = true
        return new Promise((resolve, reject) => {
            if (opt.type === 'get') {
                axios.get(opt.url).then((res) => {
                    opt.target.disabled = false
                    resolve(res)
                }).catch((error) => {
                    opt.target.disabled = false
                    reject(error)
                })
            } else {
                axios.post(opt.url, opt.data).then((res) => {
                    opt.target.disabled = false
                    resolve(res)
                }).catch((error) => {
                    opt.target.disabled = false
                    reject(error)
                })
            }
        })
    }
    if (opt.type === 'get') {
        return axios.get(opt.url)
    }
    return axios.post(opt.url, opt.data)
}

function get(url, data) {
    for (const i in data) {
        if (Object.prototype.hasOwnProperty.call(data, i)) {
            if (url.indexOf('?') >= 0) {
                url += `&${i}=${data[i]}`
            } else {
                url += `?${i}=${data[i]}`
            }
        }
    }
    return comAjax({
        type: 'get',
        url,
        data,
    })
}

// 新后端调用方式全部使用post请求，加密请求参数
const KEY = '' // 接入应用秘钥
const AGENT = 1234 // 应用编号
const DES3KEY = 'u9ker873jd63hs882j28ss1q' // 3Des密钥

// 转3des
function to3des(message) {
    const des3 = DES3.encrypt(DES3KEY, message)
    return des3
}
// 转MD5
function toMD5(message) {
    const md5 = cryptoJSMD5(message)
    return md5.toString()
}
// 统一生成请求参数列表
function encryptData(param, wAction) {
    let data = {}
    data.wAgent = AGENT
    data.wAction = wAction
    data.wMsgID = `${new Date().getTime()}`
    data.wParam = to3des(JSON.stringify(param))
    data.wSign = toMD5(`${data.wAgent}${data.wAction}${data.wMsgID}${data.wParam}${KEY}`)
    data = JSON.stringify(data)
    return data
}

// post 示例
export const wxSign = function (data) {
    return comAjax({
        data: encryptData(data, 700)
    })
}

// get 示例
export const housingDetail = function (data) {
    data.wMethod = '207'
    return get('', data)
}

