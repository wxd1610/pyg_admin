import request from '@/utils/request'

// 查询直属事业单位列表
export function listDirectunit(query) {
  return request({
    url: '/association/directunit/list',
    method: 'get',
    params: query
  })
}

// 查询直属事业单位详细
export function getDirectunit(id) {
  return request({
    url: '/association/directunit/' + id,
    method: 'get'
  })
}

// 新增直属事业单位
export function addDirectunit(data) {
  return request({
    url: '/association/directunit',
    method: 'post',
    data: data
  })
}

// 修改直属事业单位
export function updateDirectunit(data) {
  return request({
    url: '/association/directunit',
    method: 'put',
    data: data
  })
}

// 删除直属事业单位
export function delDirectunit(id) {
  return request({
    url: '/association/directunit/' + id,
    method: 'delete'
  })
}

// 导出直属事业单位
export function exportDirectunit(query) {
  return request({
    url: '/association/directunit/export',
    method: 'get',
    params: query
  })
}