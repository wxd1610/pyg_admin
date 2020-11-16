import request from '@/utils/request'

// 查询领导新闻列表
export function listNews(query) {
  return request({
    url: '/commonality/news/list',
    method: 'get',
    params: query
  })
}

// 查询领导新闻详细
export function getNews(id) {
  return request({
    url: '/commonality/news/' + id,
    method: 'get'
  })
}

// 新增领导新闻
export function addNews(data) {
  return request({
    url: '/commonality/news',
    method: 'post',
    data: data
  })
}

// 修改领导新闻
export function updateNews(data) {
  return request({
    url: '/commonality/news',
    method: 'put',
    data: data
  })
}

// 删除领导新闻
export function delNews(id) {
  return request({
    url: '/commonality/news/' + id,
    method: 'delete'
  })
}

// 导出领导新闻
export function exportNews(query) {
  return request({
    url: '/commonality/news/export',
    method: 'get',
    params: query
  })
}

// 获取所有的领导
export function getAllLeader() {
  return request({
    url: '/association/leadership/all',
    method: 'get'
  })
}
