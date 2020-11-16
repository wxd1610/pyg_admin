import request from '@/utils/request'

// 查询信息采集列表
export function listCollect(query) {
  return request({
    url: '/homepage/collect/list',
    method: 'get',
    params: query
  })
}

// 查询信息采集详细
export function getCollect(id) {
  return request({
    url: '/homepage/collect/' + id,
    method: 'get'
  })
}

// 新增信息采集
export function addCollect(data) {
  return request({
    url: '/homepage/collect',
    method: 'post',
    data: data
  })
}

// 修改信息采集
export function updateCollect(data) {
  return request({
    url: '/homepage/collect',
    method: 'put',
    data: data
  })
}

// 删除信息采集
export function delCollect(id) {
  return request({
    url: '/homepage/collect/' + id,
    method: 'delete'
  })
}

// 导出信息采集
export function exportCollect(query) {
  return request({
    url: '/homepage/collect/export',
    method: 'get',
    params: query
  })
}