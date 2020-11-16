import request from '@/utils/request'

// 查询公文列表
export function listDocument(query) {
  return request({
    url: '/sendreceive/document/list',
    method: 'get',
    params: query
  })
}

// 查询公文详细
export function getDocument(id) {
  return request({
    url: '/sendreceive/document/' + id,
    method: 'get'
  })
}

// 新增公文
export function addDocument(data) {
  return request({
    url: '/sendreceive/document',
    method: 'post',
    data: data
  })
}

// 修改公文
export function updateDocument(data) {
  return request({
    url: '/sendreceive/document',
    method: 'put',
    data: data
  })
}

// 删除公文
export function delDocument(id) {
  return request({
    url: '/sendreceive/document/' + id,
    method: 'delete'
  })
}

// 导出公文
export function exportDocument(query) {
  return request({
    url: '/sendreceive/document/export',
    method: 'get',
    params: query
  })
}