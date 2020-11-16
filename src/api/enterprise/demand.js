import request from '@/utils/request'

// 查询供求信息列表
export function listDemand(query) {
  return request({
    url: '/enterprise/demand/list',
    method: 'get',
    params: query
  })
}

// 查询供求信息详细
export function getDemand(id) {
  return request({
    url: '/enterprise/demand/' + id,
    method: 'get'
  })
}

// 新增供求信息
export function addDemand(data) {
  return request({
    url: '/enterprise/demand',
    method: 'post',
    data: data
  })
}

// 修改供求信息
export function updateDemand(data) {
  return request({
    url: '/enterprise/demand',
    method: 'put',
    data: data
  })
}

// 删除供求信息
export function delDemand(id) {
  return request({
    url: '/enterprise/demand/' + id,
    method: 'delete'
  })
}

// 导出供求信息
export function exportDemand(query) {
  return request({
    url: '/enterprise/demand/export',
    method: 'get',
    params: query
  })
}