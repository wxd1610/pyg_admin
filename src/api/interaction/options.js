import request from '@/utils/request'

// 查询选项（1单选、2多选）列表
export function listOptions(query) {
  return request({
    url: '/interaction/options/list',
    method: 'get',
    params: query
  })
}

// 查询选项（1单选、2多选）详细
export function getOptions(id) {
  return request({
    url: '/interaction/options/' + id,
    method: 'get'
  })
}

// 新增选项（1单选、2多选）
export function addOptions(data) {
  return request({
    url: '/interaction/options',
    method: 'post',
    data: data
  })
}

// 修改选项（1单选、2多选）
export function updateOptions(data) {
  return request({
    url: '/interaction/options',
    method: 'put',
    data: data
  })
}

// 删除选项（1单选、2多选）
export function delOptions(id) {
  return request({
    url: '/interaction/options/' + id,
    method: 'delete'
  })
}

// 导出选项（1单选、2多选）
export function exportOptions(query) {
  return request({
    url: '/interaction/options/export',
    method: 'get',
    params: query
  })
}