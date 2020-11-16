import request from '@/utils/request'

// 查询文章列表
export function listArticle(query) {
  return request({
    url: '/commonality/article/list',
    method: 'get',
    params: query
  })
}

// 查询文章详细
export function getArticle(id) {
  return request({
    url: '/commonality/article/' + id,
    method: 'get'
  })
}

// 新增文章
export function addArticle(data) {
  return request({
    url: '/commonality/article',
    method: 'post',
    data: data
  })
}

// 修改文章
export function updateArticle(data) {
  return request({
    url: '/commonality/article',
    method: 'put',
    data: data
  })
}

// 删除文章
export function delArticle(id) {
  return request({
    url: '/commonality/article/' + id,
    method: 'delete'
  })
}

// 导出文章
export function exportArticle(query) {
  return request({
    url: '/commonality/article/export',
    method: 'get',
    params: query
  })
}


//上次文件接口

export function uploadFile(data) {
  return request({
    url: '/commonality/article/uploadFile',
    method: 'post',
    data: data
  })
}


// 查询文章详细
export function getFile(url) {
  return request({
    url: url,
    method: 'get'
  })
}


// 查询文章审核状态
export function getCheckStatusList() {
  return request({
    url: '/system/dict/data/type/audit_status',
    method: 'get'
  })
}
