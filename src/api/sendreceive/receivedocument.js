import request from '@/utils/request'

// 查询接收公文列表
export function listReceivedocument(query) {
  return request({
    url: '/sendreceive/receivedocument/list',
    method: 'get',
    params: query
  })
}

// 查询接收公文详细
export function getReceivedocument(id) {
  return request({
    url: '/sendreceive/receivedocument/' + id,
    method: 'get'
  })
}

// 新增接收公文
export function addReceivedocument(data) {
  return request({
    url: '/sendreceive/receivedocument',
    method: 'post',
    data: data
  })
}

// 修改接收公文
export function updateReceivedocument(data) {
  return request({
    url: '/sendreceive/receivedocument',
    method: 'put',
    data: data
  })
}

// 删除接收公文
export function delReceivedocument(id) {
  return request({
    url: '/sendreceive/receivedocument/' + id,
    method: 'delete'
  })
}

// 导出接收公文
export function exportReceivedocument(query) {
  return request({
    url: '/sendreceive/receivedocument/export',
    method: 'get',
    params: query
  })
}

export function reply(id) {
  return request({
    url: '/sendreceive/reply/list?receiveDocumentId='+id,
    method: 'get'
  })
}


export function replyMsg(data) {
  return request({
    url: '/sendreceive/reply',
    method: 'post',
    data: data
  })
}

export function setFlag(data) {
  return request({
    url: '/sendreceive/receivedocument',
    method: 'put',
    data: data
  })
}
export function retransmission(data) {
  return request({
    url: '/sendreceive/receivedocument/retransmission',
    method: 'post',
    data: data
  })
}
