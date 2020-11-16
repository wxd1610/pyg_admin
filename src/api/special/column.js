import request from '@/utils/request'

// 查询专题专栏列表
export function listColumn(query) {
  return request({
    url: '/special/column/list',
    method: 'get',
    params: query
  })
}

// 查询专题专栏详细
export function getColumn(id) {
  return request({
    url: '/special/column/' + id,
    method: 'get'
  })
}

// 新增专题专栏
export function addColumn(data) {
  return request({
    url: '/special/column',
    method: 'post',
    data: data
  })
}

// 修改专题专栏
export function updateColumn(data) {
  return request({
    url: '/special/column',
    method: 'put',
    data: data
  })
}

// 删除专题专栏
export function delColumn(id) {
  return request({
    url: '/special/column/' + id,
    method: 'delete',
  })
}

// 导出专题专栏
export function exportColumn(query) {
  return request({
    url: '/special/column/export',
    method: 'get',
    params: query
  })
}