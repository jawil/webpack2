// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import App from './App.vue'
import Goods from 'components/goods/goods.vue'
import Seller from 'components/seller/seller.vue'
import Ratings from 'components/ratings/ratings.vue'
import 'common/stylus/main.scss'
Vue.config.productionTip = false

// 如果使用CommonJS模块规范，需要显式的使用Vue.use()安装路由模块:
// 使用独立编译文件不需要这么做,因为路由模块会自动安装.

Vue.use(VueRouter)

Vue.prototype.$http = axios

/* eslint-disable no-new */

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来

/*
const Goods = { template: '<div>goods</div>' }
const Seller = { template: '<div>seller</div>' }
const Ratings = { template: '<div>ratings</div>' }
*/

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
    { path: '/', component: Goods },
    { path: '/goods', component: Goods },
    { path: '/seller', component: Seller },
    { path: '/ratings', component: Ratings }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    linkActiveClass: 'active',
    routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能

/* eslint-disable no-new */
new Vue({
    el: "#main",
    render: x => x(App),
    router
})

// 现在，应用已经启动了！
