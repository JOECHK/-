// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from "vue";
import App from "./App";
import router from "./router/router.js";
import ElementUI from "element-ui";
// 导入字体图标
import './assets/fonts/iconfont.css'
import "element-ui/lib/theme-chalk/index.css";
// 引入公共样式
import './assets/css/common.css'
// 处理axios的三个问题
import axios from 'axios'
// 1.每次请求都要写基准地址的问题
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 2.每个组件都要引入axios的问题
Vue.prototype.axios = axios //以后组件内都 this.axios
// 3. 每次都要携带token

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor /* { default global options } */)


// 使用请求拦截
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = localStorage.getItem('token')

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)


Vue.use(ElementUI);

Vue.config.productionTip = false;
 // 全局过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

/* eslint-disable no-new */
new Vue({
  router,
  el: "#app",
  components: { App },
  template: "<App/>"
});
