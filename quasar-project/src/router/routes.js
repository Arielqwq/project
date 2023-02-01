import { createRouter, createWebHashHistory } from 'vue-router'
import FrontHomeView from '@/pages/front/HomeView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('src/layouts/FrontLayout.vue'),
      children: [
        {
        //  children的 path 前面不用加 '/'
          path: '',
          name: 'home',
          component: FrontHomeView,
          meta: {
            title: '購物網',
            login: false,
            admin: false
          }
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/front/RegisterView.vue'),
          meta: {
            title: '購物網 | 註冊',
            // 是否登入才能看
            login: false,
            admin: false
          }
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/front/LoginView.vue'),
          meta: {
            title: '購物網 | 登入',
            login: false,
            admin: false
          }
        },
        {
          path: 'products/:id',
          name: 'product',
          component: () => import('@/pages/front/ProductView.vue'),
          meta: {
            title: '購物網 | 商品',
            login: false,
            admin: false
          }
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/pages/front/CartView.vue'),
          meta: {
            title: '購物網 | 購物車',
            login: true,
            admin: false
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/pages/front/OrdersView.vue'),
          meta: {
            title: '購物網 | 訂單',
            login: true,
            admin: false
          }
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/pages/admin/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-home',
          component: () => import('@/pages/admin/HomeView.vue'),
          meta: {
            title: '購物網 | 管理',
            login: true,
            admin: true
          }
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/pages/admin/ProductsView.vue'),
          meta: {
            title: '購物網 | 商品管理',
            login: true,
            admin: true
          }
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/pages/admin/OrdersView.vue'),
          meta: {
            title: '購物網 | 訂單管理',
            login: true,
            admin: true
          }
        }
      ]
    },
    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/404',
      name: '404',
      // component: NotFoundView,
      component: () => import('pages/ErrorNotFound.vue'),
      meta: {
        title: '購物網 | 404',
        login: false,
        admin: false
      }
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'all',
    //   redirect: '/404'
    // },
    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue')
    }
  ]
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

router.beforeEach(async (to, from, next) => {
  // console.log('beforeEach')
  const user = useUserStore()
  if (user.isLogin && (to.path === '/register' || to.path === '/login')) {
    next('/')
  } else if (to.meta.login && !user.isLogin) {
    next('/login')
    // } else if (to.meta.admin) {
    //   await user.getUser()
    //   if (!user.isAdmin) {
    //     next('/')
    //   } else {
    //     next()
    //   }
  } else if (to.meta.admin && !user.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
