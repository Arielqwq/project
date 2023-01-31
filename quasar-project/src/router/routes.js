import FrontHomeView from '@/pages/front/HomeView.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
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
          login: false,
          admin: false
        }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/front/LoginView.vue'),
        meta: {
          title: '購物網 | 登入',
          login: false,
          admin: false
        }
      },
      {
        path: 'products/:id',
        name: 'product',
        component: () => import('@/views/front/ProductView.vue'),
        meta: {
          title: '購物網 | 商品',
          login: false,
          admin: false
        }
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/front/CartView.vue'),
        meta: {
          title: '購物網 | 購物車',
          login: true,
          admin: false
        }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/front/OrdersView.vue'),
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
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-home',
        component: () => import('@/views/admin/HomeView.vue'),
        meta: {
          title: '購物網 | 管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/ProductsView.vue'),
        meta: {
          title: '購物網 | 商品管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/OrdersView.vue'),
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
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
