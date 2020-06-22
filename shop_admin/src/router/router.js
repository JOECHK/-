// 引入
import vue from 'vue'
import VueRouter from 'vue-router'
// 3.引入子组件
import Login from '../components/Login/Login'
// 下面采用路由懒加载
const Home = () => import('../components/Home/Home.vue')
const Users = () => import('../components/user/User.vue')
const Rights = () => import('../components/rights/Rights.vue')
const Roles = () => import('../components/roles/Roles.vue')
const Categories = () => import('../components/categories/Categories.vue')
const Goods = () => import('../components/goods/Goods.vue')
const GoodsAdd = () => import('../components/goods/GoodAdd.vue')
const Reports = () => import('../components/reports/Reports.vue')
const Orders = () => import('../components/order/Orders.vue')
const Params = () => import('../components/params/Params.vue')
vue.use(VueRouter)
// 实例化
const router = new VueRouter({
  // 2. 规则
  routes: [
    // 重定向
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: '/users/:page?', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/categories', name: 'categories', component: Categories },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/goods/add', name: 'goodsAdd', component: GoodsAdd },
        { path: '/reports', name: 'reports', component: Reports },
        { path: '/orders', name: 'ordes', component: Orders },
        { path: '/params', name: 'params', component: Params }

      ]
    }
  ]
})
/* 前置导航守卫 router 里有个方法
router.beforeEach((to,from,next) => {
  to 目标路由对象
  from 来源路由对象非
  next 下一步
})
*/
router.beforeEach((to, from, next) => {
  // 1， 判断是否是登录页
  if (to.path === '/login') {
    next()
  } else {
    // 2. 判读是否登陆过，验证是否有登陆令牌token

    const token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
})
// 导出
export default router
