import request from '@/utils/request'

// 查询答题记录列表
export function listRecord(query) {
  return request({
    url: '/interaction/record/list',
    method: 'get',
    params: query
  })
}

// 查询答题记录详细
export function getRecord(id) {
  return request({
    url: '/interaction/record/' + id,
    method: 'get'
  })
}

// 新增答题记录
export function addRecord(data) {
  return request({
    url: '/interaction/record',
    method: 'post',
    data: data
  })
}

// 修改答题记录
export function updateRecord(data) {
  return request({
    url: '/interaction/record',
    method: 'put',
    data: data
  })
}

// 删除答题记录
export function delRecord(id) {
  return request({
    url: '/interaction/record/' + id,
    method: 'delete'
  })
}

// 导出答题记录
export function exportRecord(query) {
  return request({
    url: '/interaction/record/export',
    method: 'get',
    params: query
  })
}