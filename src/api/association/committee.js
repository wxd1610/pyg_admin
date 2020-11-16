import request from '@/utils/request'

// 查询专门委员会列表
export function listCommittee(query) {
  return request({
    url: '/association/committee/list',
    method: 'get',
    params: query
  })
}

// 查询专门委员会详细
export function getCommittee(id) {
  return request({
    url: '/association/committee/' + id,
    method: 'get'
  })
}

// 新增专门委员会
export function addCommittee(data) {
  return request({
    url: '/association/committee',
    method: 'post',
    data: data
  })
}

// 修改专门委员会
export function updateCommittee(data) {
  return request({
    url: '/association/committee',
    method: 'put',
    data: data
  })
}

// 删除专门委员会
export function delCommittee(id) {
  return request({
    url: '/association/committee/' + id,
    method: 'delete'
  })
}

// 导出专门委员会
export function exportCommittee(query) {
  return request({
    url: '/association/committee/export',
    method: 'get',
    params: query
  })
}