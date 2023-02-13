<template lang="pug">
#front-layout
  q-layout
    //- .headerImage
    //-   q-img(src="https://cdn.quasar.dev/img/quasar.jpg")

    q-header.q-header(elevated height-hint="98")
      q-toolbar.q-toolbar(align="right" col-6)
        q-btn(v-if="!isLogin" push round icon="fa-solid fa-user" @click="showLogin = true")
        //- <q-btn v-if="!isLogin" font-awesome-icon icon="fa-solid fa-user" to="/register" label="註冊"/>
        //- <q-btn v-if="!isLogin" font-awesome-icon icon="fa-solid fa-right-to-bracket" to="/login" label="登入"/>
        q-btn(flat rounded v-if="isLogin"  icon="fa-solid fa-cart-shopping" to="/cart")
          q-badge( color="red" :label="cart" rounded floating)
        q-btn(flat rounded v-if="isLogin"  icon="fa-solid fa-list" to="/orders" label="訂單")
        q-btn(flat rounded v-if="isLogin && isAdmin" icon="fa-solid fa-hammer" to="/admin" label="管理")
        q-btn#logoutBtn(flat rounded v-if="isLogin" icon="fa-solid fa-right-from-bracket" @click="logout" label="登出")

        //- q-btn(dense flat round icon="menu" @click="toggleLeftDrawer")
      //-   q-avatar
      //-     img(src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg")
      //-   q-toolbar-title(align="left") ~快樂的地方~

      q-tabs.header-tabs( indicator-color="transparent")
        //- q-route-tab( to="/" label="首頁" )
        q-route-tab(to="/News" label="最新消息")
        q-route-tab(to="/ProductsView" label="最新商品")
        q-route-tab(to="/Events" label="課程活動")
        q-route-tab(to="/" indicator-color="none")
          img(src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg")
        q-route-tab(to="/ContactUs" label="聯絡我們")
        q-route-tab(to="/AboutUs" label="關於我們")

        //- div(align="right")

        //- ref="loginFalse"
      q-dialog(v-if="showLogin" v-model="showLogin")
        q-card(class="q-dialog-plugin")
          RegisterShow(v-if="showRegister")
          LoginShow(v-if="!showRegister")
          q-btn(:label='showRegister ? "登入" : "註冊"' @click="showRegister = !showRegister")

    //- div.q-carousel(style="margin-top:130px")
    //-   q-carousel(animated v-model="slide" navigation infinite :autoplay="autoplay" arrows transition-prev="slide-right" transition-next="slide-left" @mouseenter="autoplay = false" @mouseleave="autoplay = true")
    //-     q-carousel-slide(:name="1" img-src="https://images.unsplash.com/photo-1525268323446-0505b6fe7778?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80")
    //-     q-carousel-slide(:name="2" img-src="https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80")
    //-     q-carousel-slide(:name="3" img-src="https://images.unsplash.com/photo-1597290282695-edc43d0e7129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=875&q=80")
    //-     q-carousel-slide(:name="4" img-src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2029&q=80")

    q-page-container()
      router-view

</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import LoginShow from '@/components/LoginShow.vue'
import RegisterShow from 'components/RegisterShow.vue'

// quasar-swiper
// const slide = ref(1)
// const autoplay = ref(true)

const user = useUserStore()
const { isLogin, isAdmin, cart, showLogin } = storeToRefs(user)
const { logout } = user

const showRegister = ref(false)

const leftDrawerOpen = ref(false)

// const toggleLeftDrawer = () => {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }

// const dialoginHide = () => {
//   if (!isLogin) showLogin.value = false
// }

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
