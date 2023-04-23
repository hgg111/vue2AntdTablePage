import Vue from 'vue'
// 引入路由
import VueRouter from 'vue-router'

// 使用路由
Vue.use(VueRouter)

// 创建VueRouter的实例
const router  = new VueRouter({
    mode: 'history',
    // 配置路由的path和组件
    routes: [
        {
            path: "/",
            name: 'home',
            component: () => import('../components/HelloWorld.vue'),
            meta:{
                title: 'vue'
            }
        },
        {
            path: "/index",
            name: 'indexPage',
		    component: () => import('../views/indexPage.vue'),
            meta:{
                title: '首页'
            }
        },
        {
            path: "/tableTest",
            name: 'tableTest',
		    component: () => import('../views/tableTest.vue'),
            meta:{
                title: '首页'
            }
        },
        {
            path: "/draggableIndex",
            name: 'draggableIndex',
		    component: () => import('../views/draggableIndex.vue'),
            meta:{
                title: '拖拽页面'
            }
        },
    ]
})

// 导入路由实例
export default router