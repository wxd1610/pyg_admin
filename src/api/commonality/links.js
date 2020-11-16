import request from '@/utils/request'

// 查询友情链接列表
export function listLinks(query) {
  return request({
    url: '/commonality/links/list',
    method: 'get',
    params: query
  })
}

// 查询友情链接详细
export function getLinks(id) {
  return request({
    url: '/commonality/links/' + id,
    method: 'get'
  })
}

// 新增友情链接
export function addLinks(data) {
  return request({
    url: '/commonality/links',
    method: 'post',
    data: data
  })
}

// 修改友情链接
export function updateLinks(data) {
  return request({
    url: '/commonality/links',
    method: 'put',
    data: data
  })
}

// 删除友情链接
export function delLinks(id) {
  return request({
    url: '/commonality/links/' + id,
    method: 'delete'
  })
}

// 导出友情链接
export function exportLinks(query) {
  return request({
    url: '/commonality/links/export',
    method: 'get',
    params: query
  })
}