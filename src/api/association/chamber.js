import request from '@/utils/request'

// 查询直属商会列表
export function listChamber(query) {
  return request({
    url: '/association/chamber/list',
    method: 'get',
    params: query
  })
}

// 查询直属商会详细
export function getChamber(id) {
  return request({
    url: '/association/chamber/' + id,
    method: 'get'
  })
}

// 新增直属商会
export function addChamber(data) {
  return request({
    url: '/association/chamber',
    method: 'post',
    data: data
  })
}

// 修改直属商会
export function updateChamber(data) {
  return request({
    url: '/association/chamber',
    method: 'put',
    data: data
  })
}

// 删除直属商会
export function delChamber(id) {
  return request({
    url: '/association/chamber/' + id,
    method: 'delete'
  })
}

// 导出直属商会
export function exportChamber(query) {
  return request({
    url: '/association/chamber/export',
    method: 'get',
    params: query
  })
}