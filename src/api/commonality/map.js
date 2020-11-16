import request from '@/utils/request'

// 查询网站地图列表
export function listMap(query) {
  return request({
    url: '/commonality/map/list',
    method: 'get',
    params: query
  })
}

// 查询网站地图详细
export function getMap(id) {
  return request({
    url: '/commonality/map/' + id,
    method: 'get'
  })
}

// 新增网站地图
export function addMap(data) {
  return request({
    url: '/commonality/map',
    method: 'post',
    data: data
  })
}

// 修改网站地图
export function updateMap(data) {
  return request({
    url: '/commonality/map',
    method: 'put',
    data: data
  })
}

// 删除网站地图
export function delMap(id) {
  return request({
    url: '/commonality/map/' + id,
    method: 'delete'
  })
}

// 导出网站地图
export function exportMap(query) {
  return request({
    url: '/commonality/map/export',
    method: 'get',
    params: query
  })
}