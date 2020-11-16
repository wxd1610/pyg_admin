import request from '@/utils/request'

// 查询提案答复列表
export function listResponse(query) {
  return request({
    url: '/affairs/response/list',
    method: 'get',
    params: query
  })
}

// 查询提案答复详细
export function getResponse(id) {
  return request({
    url: '/affairs/response/' + id,
    method: 'get'
  })
}

// 新增提案答复
export function addResponse(data) {
  return request({
    url: '/affairs/response',
    method: 'post',
    data: data
  })
}

// 修改提案答复
export function updateResponse(data) {
  return request({
    url: '/affairs/response',
    method: 'put',
    data: data
  })
}

// 删除提案答复
export function delResponse(id) {
  return request({
    url: '/affairs/response/' + id,
    method: 'delete'
  })
}

// 导出提案答复
export function exportResponse(query) {
  return request({
    url: '/affairs/response/export',
    method: 'get',
    params: query
  })
}