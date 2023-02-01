<template>
  <q-layout view="hHh lpR lff">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          ~快樂的地方~
        </q-toolbar-title>
        <q-btn v-if="!isLogin" font-awesome-icon icon="fa-solid fa-user" to="/register" label="註冊"/>
        <q-btn v-if="!isLogin" font-awesome-icon icon="fa-solid fa-right-to-bracket" to="/login" label="登入"/>
        <q-btn v-if="isLogin" font-awesome-icon icon="fa-solid fa-cart-shopping" to="/cart">
          <q-badge color="red" :label="cart" rounded floating/>
        </q-btn>
        <q-btn v-if="isLogin" font-awesome-icon icon="fa-solid fa-list" to="/orders" label="訂單"/>
        <q-btn v-if="isLogin && isAdmin" font-awesome-icon icon="fa-solid fa-hammer" to="/admin" label="管理"/>
        <q-btn v-if="isLogin" font-awesome-icon icon="fa-solid fa-right-from-bracket" @click="logout" label="登出"/>

      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="首頁" />
        <q-route-tab to="/News" label="最新消息" />
        <q-route-tab to="/ProductView" label="最新商品" />
        <q-route-tab to="/ContactUs" label="聯絡我們" />
        <q-route-tab to="/AboutUs" label="關於我們" />
      </q-tabs>
    </q-header>

    <!-- show-if-above 預設側邊欄顯示 -->
    <q-drawer v-model="leftDrawerOpen" side="left" behavior="desktop" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const { isLogin, isAdmin, cart } = storeToRefs(user)
const { logout } = user

// export default {
//   setup () {
//     const leftDrawerOpen = ref(false)

//     return {
//       leftDrawerOpen,
//       toggleLeftDrawer () {
//         leftDrawerOpen.value = !leftDrawerOpen.value
//       }
//     }
//   }
// }
</script>
