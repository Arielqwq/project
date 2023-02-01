<template lang="pug">
q-drawer(v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" :width="200" :breakpoint="500" bordered content-class="bg-grey-3")
  q-scroll-area .fit (:horizontal-thumb-style="{ opacity: 0 }")
    q-list(padding)
      q-item(clickable v-ripple)
        q-item-section(avatar)
          q-icon(name="inbox")
        q-item-section(:account)
          Inbox
      q-separator

q-page-container
  q-page (padding)
    .p(v-for="n in 15" :key="n")
        //- router-view
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?

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

const user = useUserStore()
const { avatar, account } = storeToRefs(user)
</script>
