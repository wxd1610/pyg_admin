import request from '@/utils/request'

// 查询公文回复列表
export function listReply(query) {
  return request({
    url: '/sendreceive/reply/list',
    method: 'get',
    params: query
  })
}

// 查询公文回复详细
export function getReply(id) {
  return request({
    url: '/sendreceive/reply/' + id,
    method: 'get'
  })
}

// 新增公文回复
export function addReply(data) {
  return request({
    url: '/sendreceive/reply',
    method: 'post',
    data: data
  })
}

// 修改公文回复
export function updateReply(data) {
  return request({
    url: '/sendreceive/reply',
    method: 'put',
    data: data
  })
}

// 删除公文回复
export function delReply(id) {
  return request({
    url: '/sendreceive/reply/' + id,
    method: 'delete'
  })
}

// 导出公文回复
export function exportReply(query) {
  return request({
    url: '/sendreceive/reply/export',
    method: 'get',
    params: query
  })
}