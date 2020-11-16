import request from '@/utils/request'

// 查询内设机构列表
export function listOrganization(query) {
  return request({
    url: '/association/organization/list',
    method: 'get',
    params: query
  })
}

// 查询内设机构详细
export function getOrganization(id) {
  return request({
    url: '/association/organization/' + id,
    method: 'get'
  })
}

// 新增内设机构
export function addOrganization(data) {
  return request({
    url: '/association/organization',
    method: 'post',
    data: data
  })
}

// 修改内设机构
export function updateOrganization(data) {
  return request({
    url: '/association/organization',
    method: 'put',
    data: data
  })
}

// 删除内设机构
export function delOrganization(id) {
  return request({
    url: '/association/organization/' + id,
    method: 'delete'
  })
}

// 导出内设机构
export function exportOrganization(query) {
  return request({
    url: '/association/organization/export',
    method: 'get',
    params: query
  })
}