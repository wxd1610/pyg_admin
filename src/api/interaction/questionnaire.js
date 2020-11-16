import request from '@/utils/request'

// 查询问卷列表
export function listQuestionnaire(query) {
  return request({
    url: '/interaction/questionnaire/list',
    method: 'get',
    params: query
  })
}

// 查询问卷详细
export function getQuestionnaire(id) {
  return request({
    url: '/interaction/questionnaire/' + id,
    method: 'get'
  })
}

// 新增问卷
export function addQuestionnaire(data) {
  return request({
    url: '/interaction/questionnaire',
    method: 'post',
    data: data
  })
}

// 修改问卷
export function updateQuestionnaire(data) {
  return request({
    url: '/interaction/questionnaire',
    method: 'put',
    data: data
  })
}

// 删除问卷
export function delQuestionnaire(id) {
  return request({
    url: '/interaction/questionnaire/' + id,
    method: 'delete'
  })
}

// 导出问卷
export function exportQuestionnaire(query) {
  return request({
    url: '/interaction/questionnaire/export',
    method: 'get',
    params: query
  })
}