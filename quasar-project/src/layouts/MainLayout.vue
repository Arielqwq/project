<template>
  <q-layout view="hHh lpR lff">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
        <q-btn font-awesome-icon icon="fa-solid fa-user" to="/register" label="註冊"/>
        <q-btn font-awesome-icon icon="fa-solid fa-right-to-bracket" to="/LoginView" label="登入"/>

      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/HomeView" label="首頁" />
        <q-route-tab to="/News" label="最新消息" />
        <q-route-tab to="/ProductView" label="最新商品" />
        <q-route-tab to="/ContactUs" label="聯絡我們" />
        <q-route-tab to="/AboutUs" label="關於我們" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" behavior="desktop" bordered>
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

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
