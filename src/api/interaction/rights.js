import request from '@/utils/request'

// 查询法律维权列表
export function listRights(query) {
  return request({
    url: '/interaction/rights/list',
    method: 'get',
    params: query
  })
}

// 查询法律维权详细
export function getRights(id) {
  return request({
    url: '/interaction/rights/' + id,
    method: 'get'
  })
}

// 新增法律维权
export function addRights(data) {
  return request({
    url: '/interaction/rights',
    method: 'post',
    data: data
  })
}

// 修改法律维权
export function updateRights(data) {
  return request({
    url: '/interaction/rights',
    method: 'put',
    data: data
  })
}

// 删除法律维权
export function delRights(id) {
  return request({
    url: '/interaction/rights/' + id,
    method: 'delete'
  })
}

// 导出法律维权
export function exportRights(query) {
  return request({
    url: '/interaction/rights/export',
    method: 'get',
    params: query
  })
}