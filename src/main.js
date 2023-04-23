import Vue from 'vue'
import Antd from 'ant-design-vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
// 引入导出的路由
import router from './router';

Vue.config.productionTip = false

Vue.use(Antd).use(ElementUI);

new Vue({
  // 注册路由
  router,
  render: h => h(App),
}).$mount('#app')
