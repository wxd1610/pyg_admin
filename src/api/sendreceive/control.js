import request from '@/utils/request'

// 查询印章管理列表
export function listControl(query) {
    return request({
        url: '/sendreceive/stamp/list',
        method: 'get',
        params: query
    })
}

// 查询印章管理详细
export function getControl(id) {
    return request({
        url: '/sendreceive/stamp/' + id,
        method: 'get'
    })
}

// 新增印章管理
export function addControl(data) {
    return request({
        url: '/sendreceive/stamp',
        method: 'post',
        data: data
    })
}

// 修改印章管理
export function updateControl(data) {
    return request({
        url: '/sendreceive/stamp',
        method: 'put',
        data: data
    })
}

// 删除印章管理
export function delControl(id) {
    return request({
        url: '/sendreceive/stamp/' + id,
        method: 'delete'
    })
}

// 导出印章管理
export function exportControl(query) {
    return request({
        url: '/sendreceive/stamp/export',
        method: 'get',
        params: query
    })
}

//验证印章新旧密码

export function verify(query) {
    return request({
        url: '/sendreceive/stamp/verify',
        method: 'get',
        params: query
    })
}

export function getpdf(query) {
    return request({
        url: 'http://192.168.1.195:8082/download/document/67',
        method: 'get',
        responseType: 'document'
    })
}