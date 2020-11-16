import request from '@/utils/request'

// 查询网站信息列表
export function listInfo(query) {
  return request({
    url: '/commonality/info/list',
    method: 'get',
    params: query
  })
}

// 查询网站信息详细
export function getInfo(id) {
  return request({
    url: '/commonality/info/' + id,
    method: 'get'
  })
}

// 新增网站信息
export function addInfo(data) {
  return request({
    url: '/commonality/info',
    method: 'post',
    data: data
  })
}

// 修改网站信息
export function updateInfo(data) {
  return request({
    url: '/commonality/info',
    method: 'put',
    data: data
  })
}

// 删除网站信息
export function delInfo(id) {
  return request({
    url: '/commonality/info/' + id,
    method: 'delete'
  })
}

// 导出网站信息
export function exportInfo(query) {
  return request({
    url: '/commonality/info/export',
    method: 'get',
    params: query
  })
}