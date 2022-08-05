
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import './static/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$imgUrl = 'https://file-resource-1312729391.cos.ap-guangzhou.myqcloud.com/'
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif