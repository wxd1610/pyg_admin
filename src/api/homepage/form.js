import request from '@/utils/request'

// 查询采集单列表
export function listForm(query) {
  return request({
    url: '/homepage/form/list',
    method: 'get',
    params: query
  })
}

// 查询采集单详细
export function getForm(id) {
  return request({
    url: '/homepage/form/' + id,
    method: 'get'
  })
}

// 新增采集单
export function addForm(data) {
  return request({
    url: '/homepage/form',
    method: 'post',
    data: data
  })
}

// 修改采集单
export function updateForm(data) {
  return request({
    url: '/homepage/form',
    method: 'put',
    data: data
  })
}

// 删除采集单
export function delForm(id) {
  return request({
    url: '/homepage/form/' + id,
    method: 'delete'
  })
}

// 导出采集单
export function exportForm(query) {
  return request({
    url: '/homepage/form/export',
    method: 'get',
    params: query
  })
}