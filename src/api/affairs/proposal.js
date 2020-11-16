import request from '@/utils/request'

// 查询团体提案列表
export function listProposal(query) {
  return request({
    url: '/affairs/proposal/list',
    method: 'get',
    params: query
  })
}

// 查询团体提案详细
export function getProposal(id) {
  return request({
    url: '/affairs/proposal/' + id,
    method: 'get'
  })
}

// 新增团体提案
export function addProposal(data) {
  return request({
    url: '/affairs/proposal',
    method: 'post',
    data: data
  })
}

// 修改团体提案
export function updateProposal(data) {
  return request({
    url: '/affairs/proposal',
    method: 'put',
    data: data
  })
}

// 删除团体提案
export function delProposal(id) {
  return request({
    url: '/affairs/proposal/' + id,
    method: 'delete'
  })
}

// 导出团体提案
export function exportProposal(query) {
  return request({
    url: '/affairs/proposal/export',
    method: 'get',
    params: query
  })
}