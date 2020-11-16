import request from '@/utils/request'

// 查询采集反馈列表
export function listFeedback(query) {
  console.log(query)
  return request({
    url: '/homepage/feedback/list',
    method: 'get',
    params: query
  })
}

// 查询采集反馈详细
export function getFeedback(collectId,groupId) {
  return request({
    url: '/homepage/feedback/item?collectId='+collectId+'&groupId='+groupId,
    method: 'get'
  })
}

// 新增采集反馈
export function addFeedback(data) {
  return request({
    url: '/homepage/feedback',
    method: 'post',
    data: data
  })
}

// 修改采集反馈
export function updateFeedback(data) {
  return request({
    url: '/homepage/feedback',
    method: 'put',
    data: data
  })
}

// 删除采集反馈
export function delFeedback(id) {
  return request({
    url: '/homepage/feedback/' + id,
    method: 'delete'
  })
}

// 导出采集反馈
export function exportFeedback(query) {
  return request({
    url: '/homepage/feedback/export',
    method: 'get',
    params: query
  })
}