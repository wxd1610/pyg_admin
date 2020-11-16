import request from '@/utils/request'

// 查询领导之窗列表
export function listLeadership(query) {
  return request({
    url: '/association/leadership/list',
    method: 'get',
    params: query
  })
}

// 查询领导之窗详细
export function getLeadership(id) {
  return request({
    url: '/association/leadership/' + id,
    method: 'get'
  })
}

// 新增领导之窗
export function addLeadership(data) {
  return request({
    url: '/association/leadership',
    method: 'post',
    data: data
  })
}

// 修改领导之窗
export function updateLeadership(data) {
  return request({
    url: '/association/leadership',
    method: 'put',
    data: data
  })
}

// 删除领导之窗
export function delLeadership(id) {
  return request({
    url: '/association/leadership/' + id,
    method: 'delete'
  })
}

// 导出领导之窗
export function exportLeadership(query) {
  return request({
    url: '/association/leadership/export',
    method: 'get',
    params: query
  })
}