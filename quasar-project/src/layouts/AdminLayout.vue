<template lang="pug">
q-layout(height="300" class="shadow-2 rounded-borders")
  q-header(elevated style="background-color: #230b0b")
    q-toolbar(style="height:100px")
      q-btn(flat @click="drawer = !drawer" round dense icon="menu" )
      q-toolbar-title 管理者後台
      //- @mouseover="miniState = false" @mouseout="miniState = true"
  q-drawer( show-if-above v-model="drawer"  :width="250" :breakpoint="500" bordered )

    q-scroll-area(class="fit" style="height: calc(100% - 150px); margin-top: 150px;")
      q-list(padding class="menu-list")
        template(v-for="(menuItem, index) in menuList" :key="index")
          q-item.col-10(class="q-px-xl" clickable v-ripple :active="menuItem.label === 'Outbox'" :to="menuItem.route")
            q-item-section.col-3
              q-icon(:name="menuItem.icon" :color="menuItem.iconColor")
            q-item-section {{ menuItem.label }}
              q-separator

    q-img(class="absolute-top" src="https://cdn.quasar.dev/img/material.png"  style="height: 150px")
      .div(class="absolute-bottom bg-transparent")
        q-avatar( size="56px" class="q-mb-sm")
          img(:src="avatar")
          //- {{  }}
        .div(class="text-weight-bold")
        .div Hi !  {{ account }}

  q-page-container
    q-page
      router-view

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
    icon: 'fa-solid fa-bag-shopping',
    label: '商品管理',
    route: '/admin',
    separator: true
  },
  {
    icon: 'fa-solid fa-martini-glass-citrus',
    label: '活動管理',
    route: '/admin/events',
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
    icon: 'fa-solid fa-user-group',
    label: '會員管理',
    route: '/admin/customers',
    separator: true
  },
  {
    icon: 'fa-solid fa-comments',
    label: '回應管理',
    route: '/admin/feedbacks',
    separator: false
  },
  {
    icon: 'error',
    label: '關於我們管理',
    route: '/admin/aboutus',
    separator: false
  },
  {
    icon: 'fa-solid fa-house',
    iconColor: 'primary',
    label: '回首頁',
    route: '/',
    separator: false
  }
]
</script>
