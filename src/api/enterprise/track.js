import request from '@/utils/request'

// 查询快捷通道列表
export function listTrack(query) {
  return request({
    url: '/enterprise/track/list',
    method: 'get',
    params: query
  })
}

// 查询快捷通道详细
export function getTrack(id) {
  return request({
    url: '/enterprise/track/' + id,
    method: 'get'
  })
}

// 新增快捷通道
export function addTrack(data) {
  return request({
    url: '/enterprise/track',
    method: 'post',
    data: data
  })
}

// 修改快捷通道
export function updateTrack(data) {
  return request({
    url: '/enterprise/track',
    method: 'put',
    data: data
  })
}

// 删除快捷通道
export function delTrack(id) {
  return request({
    url: '/enterprise/track/' + id,
    method: 'delete'
  })
}

// 导出快捷通道
export function exportTrack(query) {
  return request({
    url: '/enterprise/track/export',
    method: 'get',
    params: query
  })
}