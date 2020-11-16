import request from '@/utils/request'

// 查询商会人民调解委员会列表
export function listCommittee(query) {
  return request({
    url: '/homepage/committee/list',
    method: 'get',
    params: query
  })
}

// 查询商会人民调解委员会详细
export function getCommittee(id) {
  return request({
    url: '/homepage/committee/' + id,
    method: 'get'
  })
}

// 新增商会人民调解委员会
export function addCommittee(data) {
  return request({
    url: '/homepage/committee',
    method: 'post',
    data: data
  })
}

// 修改商会人民调解委员会
export function updateCommittee(data) {
  return request({
    url: '/homepage/committee',
    method: 'put',
    data: data
  })
}

// 删除商会人民调解委员会
export function delCommittee(id) {
  return request({
    url: '/homepage/committee/' + id,
    method: 'delete'
  })
}

// 导出商会人民调解委员会
export function exportCommittee(query) {
  return request({
    url: '/homepage/committee/export',
    method: 'get',
    params: query
  })
}