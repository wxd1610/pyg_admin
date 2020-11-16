import request from '@/utils/request'

// 查询百强企业列表
export function listEnterprises(query) {
  return request({
    url: '/homepage/enterprises/list',
    method: 'get',
    params: query
  })
}

// 查询百强企业详细
export function getEnterprises(id) {
  return request({
    url: '/homepage/enterprises/' + id,
    method: 'get'
  })
}

// 新增百强企业
export function addEnterprises(data) {
  return request({
    url: '/homepage/enterprises',
    method: 'post',
    data: data
  })
}

// 修改百强企业
export function updateEnterprises(data) {
  return request({
    url: '/homepage/enterprises',
    method: 'put',
    data: data
  })
}

// 删除百强企业
export function delEnterprises(id) {
  return request({
    url: '/homepage/enterprises/' + id,
    method: 'delete'
  })
}

// 导出百强企业
export function exportEnterprises(query) {
  return request({
    url: '/homepage/enterprises/export',
    method: 'get',
    params: query
  })
}