import request from '@/utils/request'

// 查询在线访谈列表
export function listInterview(query) {
  return request({
    url: '/interaction/interview/list',
    method: 'get',
    params: query
  })
}

// 查询在线访谈详细
export function getInterview(id) {
  return request({
    url: '/interaction/interview/' + id,
    method: 'get'
  })
}

// 新增在线访谈
export function addInterview(data) {
  return request({
    url: '/interaction/interview',
    method: 'post',
    data: data
  })
}

// 修改在线访谈
export function updateInterview(data) {
  return request({
    url: '/interaction/interview',
    method: 'put',
    data: data
  })
}

// 删除在线访谈
export function delInterview(id) {
  return request({
    url: '/interaction/interview/' + id,
    method: 'delete'
  })
}

// 导出在线访谈
export function exportInterview(query) {
  return request({
    url: '/interaction/interview/export',
    method: 'get',
    params: query
  })
}