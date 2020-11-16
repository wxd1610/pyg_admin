import request from '@/utils/request'

// 查询发送公文列表
export function listSenddocument(query) {
    return request({
        url: '/sendreceive/senddocument/list',
        method: 'get',
        params: query
    })
}

// 查询发送公文详细
export function getSenddocument(id) {
    return request({
        url: '/sendreceive/senddocument/' + id,
        method: 'get'
    })
}
// /sendreceive/receivedocument / { id }
// 新增发送公文
export function addSenddocument(data) {
    return request({
        url: '/sendreceive/senddocument',
        method: 'post',
        data: data
    })
}

// 修改发送公文
export function updateSenddocument(data) {
    return request({
        url: '/sendreceive/senddocument',
        method: 'put',
        data: data
    })
}

// 删除发送公文
export function delSenddocument(id) {
    return request({
        url: '/sendreceive/senddocument/' + id,
        method: 'delete'
    })
}

// 导出发送公文
export function exportSenddocument(query) {
    return request({
        url: '/sendreceive/senddocument/export',
        method: 'get',
        params: query
    })
}



// 导出发送公文
export function sendDocument(query) {
    return request({
        url: '/sendreceive/receivedocument',
        method: 'post',
        data: query
    })
}


export function sendlist(id) {
    return request({
        url: '/sendreceive/reply/sendlist?sendDocumentId=' + id,
        method: 'get'
    })
}

export function receiveDocumentId(id) {
    return request({
        url: 'sendreceive/reply/list?receiveDocumentId=' + id,
        method: 'get'
    })
}



export function reply(data) {
    return request({
        url: 'sendreceive/reply ',
        method: 'post',
        data: data
    })
}

export function readProjectReq(id) {
    return request({
        url: 'sendreceive/document/download/' + id,
        method: 'get'
    })
}