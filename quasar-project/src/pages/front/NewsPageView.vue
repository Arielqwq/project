<template lang="pug">
#front-news(style="margin:50px 0 ")
  div.flex.justify-center.row
    .col-10
      q-img(:src="newsPage.image")
    .col-10
      .text-h3.q-my-xl.q-mx-md {{ newsPage.title }}
    .col-9.q-ma-md
      .text-h5.q-ma-md.pre {{ newsPage.description }}
</template>

<script setup>
import { reactive } from 'vue'
import { api, apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 取資訊
const route = useRoute()
// 換頁
const router = useRouter()
const newsPage = reactive({
  _id: '',
  title: '',
  description: '',
  image: ''
})

;(async () => {
  try {
    const { data } = await apiAuth.get('/news/' + route.params.id)
    newsPage._id = data.result._id
    newsPage.title = data.result.title
    newsPage.description = data.result.description
    newsPage.image = data.result.image

    console.log(data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>
