import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download, handleTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import request from '@/utils/request'
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false
    //后台请求路径
Vue.prototype.contextPath = `http://192.168.1.195:8082`
    // Vue.prototype.contextPath = `http://ym.nmgfic.org.cn/prod-api`

// Vue.prototype.contextPath = `http://192.168.1.169:81`
// Vue.prototype.contextPath = `http://127.0.0.1:8082`
//查询请求路径内的数据
Vue.prototype.getQueryValue = function(queryName) {
    // console.log(queryName)
    var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    // console.log(reg)
    // console.log(r)
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}

//根据数据字典类型数据数据字典
Vue.prototype.getDictList = function(dictType) {
    return request({
        url: '/system/dict/data/type/' + dictType,
        method: 'get'
    })
}

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})