import request from '@/utils/request'

// 查询其他单位列表
export function listOtherunit(query) {
  return request({
    url: '/association/otherunit/list',
    method: 'get',
    params: query
  })
}

// 查询其他单位详细
export function getOtherunit(id) {
  return request({
    url: '/association/otherunit/' + id,
    method: 'get'
  })
}

// 新增其他单位
export function addOtherunit(data) {
  return request({
    url: '/association/otherunit',
    method: 'post',
    data: data
  })
}

// 修改其他单位
export function updateOtherunit(data) {
  return request({
    url: '/association/otherunit',
    method: 'put',
    data: data
  })
}

// 删除其他单位
export function delOtherunit(id) {
  return request({
    url: '/association/otherunit/' + id,
    method: 'delete'
  })
}

// 导出其他单位
export function exportOtherunit(query) {
  return request({
    url: '/association/otherunit/export',
    method: 'get',
    params: query
  })
}