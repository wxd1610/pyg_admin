import request from '@/utils/request'

// 查询答题人列表
export function listPerson(query) {
  return request({
    url: '/interaction/person/list',
    method: 'get',
    params: query
  })
}

// 查询答题人详细
export function getPerson(id) {
  return request({
    url: '/interaction/person/' + id,
    method: 'get'
  })
}

// 新增答题人
export function addPerson(data) {
  return request({
    url: '/interaction/person',
    method: 'post',
    data: data
  })
}

// 修改答题人
export function updatePerson(data) {
  return request({
    url: '/interaction/person',
    method: 'put',
    data: data
  })
}

// 删除答题人
export function delPerson(id) {
  return request({
    url: '/interaction/person/' + id,
    method: 'delete'
  })
}

// 导出答题人
export function exportPerson(query) {
  return request({
    url: '/interaction/person/export',
    method: 'get',
    params: query
  })
}

export function getDetile(id) {
  console.log(id)
  return request({
    url: '/interaction/person/'+id,
    method: 'get'
  })
}
