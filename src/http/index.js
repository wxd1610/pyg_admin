/*  导出一个已经配合好的axios  */
import axios from 'axios'
// 全局使用需要vue
// baseURL配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// 拦截器
// axios.interceptors.request.use(config => {
// config.header.abc = 100
// })
// 导出
export default axios
