import request from '@/utils/request'
//上次文件接口

export function uploadFile(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}
