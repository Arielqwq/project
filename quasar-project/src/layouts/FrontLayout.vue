<template lang="pug">
q-layout
  q-header(elevated class="bg-primary text-white" height-hint="98")
    q-toolbar
      q-btn(dense flat round icon="menu" @click="toggleLeftDrawer")
      q-avatar
        img(src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg")
      q-toolbar-title(align="left") ~快樂的地方~

      q-btn(v-if="!isLogin" push round icon="fa-solid fa-user" @click="showLogin = true")
      //- <q-btn v-if="!isLogin" font-awesome-icon icon="fa-solid fa-user" to="/register" label="註冊"/>
      //- <q-btn v-if="!isLogin" font-awesome-icon icon="fa-solid fa-right-to-bracket" to="/login" label="登入"/>
      q-btn( v-if="isLogin"  icon="fa-solid fa-cart-shopping" to="/cart")
        q-badge( color="red" :label="cart" rounded floating)
      q-btn(v-if="isLogin"  icon="fa-solid fa-list" to="/orders" label="訂單")
      q-btn(v-if="isLogin && isAdmin" icon="fa-solid fa-hammer" to="/admin" label="管理")
      q-btn#logoutBtn(v-if="isLogin" icon="fa-solid fa-right-from-bracket" @click="logout" label="登出")

    q-tabs(align="left")
      q-route-tab(to="/" label="首頁" )
      q-route-tab(to="/News" label="最新消息")
      q-route-tab(to="/ProductView" label="最新商品")
      q-route-tab(to="/ContactUs" label="聯絡我們")
      q-route-tab(to="/AboutUs" label="關於我們")
      //- ref="loginFalse"
    q-dialog(v-if="showLogin" v-model="showLogin")
      q-card(class="q-dialog-plugin")
        RegisterShow(v-if="showRegister")
        LoginShow(v-if="!showRegister")
        q-btn(:label='showRegister ? "登入" : "註冊"' @click="showRegister = !showRegister")

  q-page-container
    router-view

  q-footer( elevated class="bg-grey-8 text-white")
    q-toolbar
      q-toolbar-title
        q-avatar
          img( src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg")
        .div Title

</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import LoginShow from '@/components/LoginShow.vue'
import RegisterShow from 'components/RegisterShow.vue'

const user = useUserStore()
const { isLogin, isAdmin, cart, showLogin } = storeToRefs(user)
const { logout } = user

const showRegister = ref(false)

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const dialoginHide = () => {
  if (!isLogin) showLogin.value = false
}

// const logoutBtn = document.querySelector('#logoutBtn')

// script 寫法
// export default{
//   setup(){
//     const leftDrawerOpen = ref(false)

//     return{
//       leftDrawerOpen,
//       toggleLeftDrawer(){
//         leftDrawerOpen.value = ! leftDrawerOpen.value
//       }
//     }
//   }
// }

</script>
