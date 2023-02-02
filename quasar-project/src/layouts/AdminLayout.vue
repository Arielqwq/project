<template lang="pug">
q-layout(height="300" class="shadow-2 rounded-borders")
  q-header(elevated class="bg-black")
    q-toolbar
      q-btn(flat @click="drawer = !drawer" round dense icon="menu" )
      q-toolbar-title 會員管理頁面
      //- @mouseover="miniState = false" @mouseout="miniState = true"
  q-drawer(v-model="drawer" :width="200" :breakpoint="500" bordered)
    q-img( class="absolute-top" src="https://cdn.quasar.dev/img/material.png"  style="height: 150px")
      .div(class="absolute-bottom bg-transparent")
        q-avatar( size="56px" class="q-mb-sm")
          img(src="https://cdn.quasar.dev/img/boy-avatar.png")
          //- {{  }}
        .div(class="text-weight-bold")
        .div @rstoenescu

    q-scroll-area(class="fit" style="height: calc(100% - 150px); margin-top: 150px;" )
      q-list
        template(v-for="(menuItem, index) in menuList" :key="index")
          q-item(clickable :active="menuItem.label === 'Outbox'" v-ripple :to="menuItem.route")
            q-item-section(q-avatar)
              q-icon(:icon="menuItem.icon")
            q-item-section {{ menuItem.label }}
              q-separator

  q-page-container
    q-page
      p(v-for="n in 7" :key="n") Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?

//- v-navigation-drawer(permanent)
//-   v-list
//-     v-list-item(:prepend-avatar="avatar" :title="account")
//-   v-divider
//-   v-list
//-     v-list-item(to="/admin/products" title="商品管理" prepend-icon="mdi-shopping")
//-     v-list-item(to="/admin/orders" title="訂單管理" prepend-icon="mdi-format-list-bulleted")
//-     v-list-item(to="/" title="回首頁" prepend-icon="mdi-home")
//- v-main
//-   v-container
//-     router-view
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const user = useUserStore()
const { avatar, account } = storeToRefs(user)
const drawer = ref(false)
const miniState = ref(true)

const menuList = [
  {
    icon: 'inbox',
    label: '商品管理',
    route: '/admin/products',
    separator: true
  },
  {
    icon: 'send',
    label: '貼文管理',
    route: '/admin/news',
    separator: false
  },
  {
    icon: 'delete',
    label: '訂單管理',
    route: '/admin/orders',
    separator: false
  },
  {
    icon: 'error',
    label: '會員管理',
    route: '/admin/customers',
    separator: true
  },
  {
    icon: 'settings',
    label: '回應管理',
    route: '/admin/feedbacks',
    separator: false
  },
  {
    icon: 'feedback',
    label: '關於我們管理',
    route: '/admin/aboutus',
    separator: false
  },
  {
    icon: 'help',
    iconColor: 'primary',
    label: '回首頁',
    route: '/',
    separator: false
  }
]
</script>
