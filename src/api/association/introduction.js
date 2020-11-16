import request from '@/utils/request'

// 查询本会介绍列表
export function listIntroduction(query) {
  return request({
    url: '/association/introduction/list',
    method: 'get',
    params: query
  })
}

// 查询本会介绍详细
export function getIntroduction(id) {
  return request({
    url: '/association/introduction/' + id,
    method: 'get'
  })
}

// 新增本会介绍
export function addIntroduction(data) {
  return request({
    url: '/association/introduction',
    method: 'post',
    data: data
  })
}

// 修改本会介绍
export function updateIntroduction(data) {
  return request({
    url: '/association/introduction',
    method: 'put',
    data: data
  })
}

// 删除本会介绍
export function delIntroduction(id) {
  return request({
    url: '/association/introduction/' + id,
    method: 'delete'
  })
}

// 导出本会介绍
export function exportIntroduction(query) {
  return request({
    url: '/association/introduction/export',
    method: 'get',
    params: query
  })
}