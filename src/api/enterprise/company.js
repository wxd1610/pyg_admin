import request from '@/utils/request'

// 查询企业风采列表
export function listCompany(query) {
  return request({
    url: '/enterprise/company/list',
    method: 'get',
    params: query
  })
}

// 查询企业风采详细
export function getCompany(id) {
  return request({
    url: '/enterprise/company/' + id,
    method: 'get'
  })
}

// 新增企业风采
export function addCompany(data) {
  return request({
    url: '/enterprise/company',
    method: 'post',
    data: data
  })
}

// 修改企业风采
export function updateCompany(data) {
  return request({
    url: '/enterprise/company',
    method: 'put',
    data: data
  })
}

// 删除企业风采
export function delCompany(id) {
  return request({
    url: '/enterprise/company/' + id,
    method: 'delete'
  })
}

// 导出企业风采
export function exportCompany(query) {
  return request({
    url: '/enterprise/company/export',
    method: 'get',
    params: query
  })
}