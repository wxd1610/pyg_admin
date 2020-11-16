import request from '@/utils/request'

// 查询领军人物列表
export function listEnterpriser(query) {
  return request({
    url: '/enterprise/enterpriser/list',
    method: 'get',
    params: query
  })
}

// 查询领军人物详细
export function getEnterpriser(id) {
  return request({
    url: '/enterprise/enterpriser/' + id,
    method: 'get'
  })
}

// 新增领军人物
export function addEnterpriser(data) {
  return request({
    url: '/enterprise/enterpriser',
    method: 'post',
    data: data
  })
}

// 修改领军人物
export function updateEnterpriser(data) {
  return request({
    url: '/enterprise/enterpriser',
    method: 'put',
    data: data
  })
}

// 删除领军人物
export function delEnterpriser(id) {
  return request({
    url: '/enterprise/enterpriser/' + id,
    method: 'delete'
  })
}

// 导出领军人物
export function exportEnterpriser(query) {
  return request({
    url: '/enterprise/enterpriser/export',
    method: 'get',
    params: query
  })
}