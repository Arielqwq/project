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
        //- 購物車及數量
        q-btn(flat rounded v-if="isLogin && !isAdmin" icon="fa-solid fa-cart-shopping" to="/Mypage/Mypagecart")
          q-badge( color="red" :label="cart" rounded floating)

        //- 會員登入後的下拉選單
        q-btn-dropdown(v-if="isLogin && !isAdmin" flat rounded icon="fa-solid fa-user-gear" )
          q-list
            q-item(clickable v-close-popup to="/Mypage" )
              q-item-section(avatar)
                q-icon(name="fa-solid fa-gear")
              q-item-section 會員資料
            q-item(clickable v-close-popup to="/Mypage/Paymentcards")
              q-item-section(avatar)
                q-icon(name="fa-solid fa-gear")
              q-item-section
                q-item-label 付款資訊
            q-item(clickable v-close-popup to="/Mypage/MypageOrders")
              q-item-section(avatar)
                q-icon(name="fa-solid fa-gear")
              q-item-section
                q-item-label 我的訂單
            q-item(clickable v-close-popup to="/Mypage/Mypagecart")
              q-item-section(avatar)
                q-icon(name="fa-solid fa-gear")
              q-item-section
                q-item-label 我的購物車
            q-item(clickable v-close-popup to="/Mypage/Wishlist")
              q-item-section(avatar)
                q-icon(name="fa-solid fa-gear")
              q-item-section
                q-item-label 我的收藏
            q-item(clickable v-close-popup  @click="logout")
              q-item-section(avatar)
                q-icon(name="fa-solid fa-gear")
              q-item-section
                q-item-label 登出

        q-btn(flat rounded v-if="isLogin && isAdmin" icon="fa-solid fa-hammer" to="/admin" label="管理")
        q-btn#logoutBtn(flat rounded v-if="isLogin && isAdmin" icon="fa-solid fa-right-from-bracket" @click="logout" label="登出")

      //- q-btn(dense flat round icon="menu" @click="toggleLeftDrawer")
      //-   q-avatar
      //-     img(src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg")
      //-   q-toolbar-title(align="left") ~快樂的地方~

      q-tabs.header-tabs( indicator-color="transparent")
        //- q-route-tab( to="/" label="首頁" )
        q-route-tab(to="/News" label="最新消息")
        q-route-tab(to="/Products" label="最新商品")
        q-route-tab(to="/Events" label="課程活動")
        q-route-tab(to="/" indicator-color="none")
          img(src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg")
        q-route-tab(to="/ContactUs" label="聯絡我們")
        q-route-tab(to="/AboutUs" label="關於我們")

        //- div(align="right")

        //- ref="loginFalse"
      q-dialog( v-if="showLogin" v-model="showLogin")
        q-card(class="q-dialog-plugin")
          RegisterShow(v-if="showRegister")
          LoginShow(v-if="!showRegister")
          .q-pa-lg
            q-btn(:label='showRegister ? "登入" : "註冊"' @click="showRegister = !showRegister")

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

function onItemClick () {
  console.log('Clicked on an Item')
}

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
