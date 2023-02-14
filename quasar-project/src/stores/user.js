import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import router from '@/router/routes'

export const useUserStore = defineStore('user', function () {
  const token = ref('')
  const account = ref('')
  const email = ref('')
  const cart = ref(0)
  const role = ref(0)

  const showLogin = ref(false)

  const isLogin = computed(() => {
    return token.value.length > 0
  })
  const isAdmin = computed(() => {
    return role.value === 1
  })
  const avatar = computed(() => {
    return `https://source.boringavatars.com/beam/256/${account.value}?colors=84bfc3,fff5d6,e9c46a,D96153,000511`
  })

  async function login (form) {
    showLogin.value = false
    try {
      const { data } = await api.post('/users/login', form)
      token.value = data.result.token
      account.value = data.result.account
      email.value = data.result.email
      cart.value = data.result.cart
      role.value = data.result.role
      router.push('/')
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '登入成功'
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: error?.response?.data?.message || '發生錯誤'
      })
    }
  }

  async function logout () {
    try {
      await apiAuth.delete('/users/logout')
    } catch (_) {}
    token.value = ''
    account.value = ''
    role.value = 0
    cart.value = 0
    this.router.push('/')
    console.log('push')
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '登出成功'
    })
  }

  async function getUser () {
    if (token.value.length === 0) return
    try {
      const { data } = await apiAuth.get('/users/me')
      account.value = data.result.account
      email.value = data.result.email
      cart.value = data.result.cart
      role.value = data.result.role
    } catch (error) {
      logout()
    }
  }

  async function editCart ({ _id, quantity, text }) {
    // 先判斷使用者是否登入
    if (token.value.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: '請先登入'
      })
      router.push('/login')
      return
    }
    try {
      // parseInt(quantity) 傳入數字
      const { data } = await apiAuth.post('/users/cart', { p_id: _id, quantity: parseInt(quantity) })
      cart.value = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        // text: '加入購物車成功'
        text
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: error?.response?.data?.message || '發生錯誤'
      })
    }
  }

  async function checkout () {
    try {
      await apiAuth.post('/orders')
      cart.value = 0
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '結帳成功'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: error?.response?.data?.message || '發生錯誤'
      })
    }
  }

  async function editEventParticipant (id, phone) {
    // 先判斷是否登入
    if (token.value.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: '請先登入'
      })
      router.push('/login')
    }
    try {
      const { data } = await apiAuth.patch('/events/' + id + '/participant', { phone })
      cart.value = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        // text: '加入購物車成功'
        text: '報名成功'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: error?.response?.data?.message || '發生錯誤'
      })
    }
  }

  const register = async (form) => {
    showLogin.value = false
    try {
      await api.post('/users', form)
      await Swal.fire({
        icon: 'success',
        title: '成功',
        text: '註冊成功'
      })
      router.push('/')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: error?.response?.data?.message || '發生錯誤'
      })
      console.log(error)
    }
  }

  return {
    token,
    account,
    email,
    cart,
    role,
    showLogin,
    login,
    logout,
    getUser,
    isLogin,
    isAdmin,
    avatar,
    editCart,
    checkout,
    register,
    editEventParticipant
  }
},
{
  persist: {
    key: 'WprojectW',
    paths: ['token']
  }
}

  // {
  //     state: () => ({
  //     token:'',
  //     account:'',
  //     email:'',
  //     cart:0,
  //     role:0
  //   }),
  //   getters: {
  //     isLogin(){
  //     return token.value.length > 0
  //     }
  //   },
  //   actions: {
  //      login (form) {
  //       try {
  //         const { data } = await api.post('/users/login', form)
  //         this.token = data.result.token
  //         this.account = data.result.account
  //         this.email = data.result.email
  //         this.cart = data.result.cart
  //         this.role = data.result.role
  //         Swal.fire({
  //           icon: 'success',
  //           title: '成功',
  //           text: '登入成功'
  //         })
  //         router.push('/')
  //       } catch (error) {
  //         console.log(error)
  //         Swal.fire({
  //           icon: 'error',
  //           title: '失敗',
  //           text: error?.response?.data?.message || '發生錯誤'
  //         })
  //       }
  //     }
  //   },
  //   persist: {
  //         key: '20230103',
  //         paths: ['token']
  //       }
  // }
)

// export const useCounterStore = defineStore('counter', {
//   state: () => ({
//     counter: 0
//   }),
//   getters: {
//     doubleCount: (state) => state.counter * 2
//   },
//   actions: {
//     increment () {
//       this.counter++
//     }
//   }
// })
