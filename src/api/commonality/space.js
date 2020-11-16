import request from '@/utils/request'

// 查询图片占位列表
export function listSpace(query) {
  return request({
    url: '/commonality/space/list',
    method: 'get',
    params: query
  })
}

// 查询图片占位详细
export function getSpace(id) {
  return request({
    url: '/commonality/space/' + id,
    method: 'get'
  })
}

// 新增图片占位
export function addSpace(data) {
  return request({
    url: '/commonality/space',
    method: 'post',
    data: data
  })
}

// 修改图片占位
export function updateSpace(data) {
  return request({
    url: '/commonality/space',
    method: 'put',
    data: data
  })
}

// 删除图片占位
export function delSpace(id) {
  return request({
    url: '/commonality/space/' + id,
    method: 'delete'
  })
}

// 导出图片占位
export function exportSpace(query) {
  return request({
    url: '/commonality/space/export',
    method: 'get',
    params: query
  })
}