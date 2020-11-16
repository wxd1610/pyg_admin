import request from '@/utils/request'

// 查询服务专栏列表
export function listColumn(query) {
  return request({
    url: '/enterprise/column/list',
    method: 'get',
    params: query
  })
}

// 查询服务专栏详细
export function getColumn(id) {
  return request({
    url: '/enterprise/column/' + id,
    method: 'get'
  })
}

// 新增服务专栏
export function addColumn(data) {
  return request({
    url: '/enterprise/column',
    method: 'post',
    data: data
  })
}

// 修改服务专栏
export function updateColumn(data) {
  return request({
    url: '/enterprise/column',
    method: 'put',
    data: data
  })
}

// 删除服务专栏
export function delColumn(id) {
  return request({
    url: '/enterprise/column/' + id,
    method: 'delete'
  })
}

// 导出服务专栏
export function exportColumn(query) {
  return request({
    url: '/enterprise/column/export',
    method: 'get',
    params: query
  })
}