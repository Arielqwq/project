<template lang="pug">
#Mypage-info
  h3.text-center 我的資料
    div(align="left")
      p 帳號 : {{ myInfo.account }}
      //- p 信箱：{{  myInfo[0].email }}
      //- p 姓名：{{ myInfo[0].name }}
      //- p 電話：{{  myInfo[0].phone }}

  </template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { apiAuth } from '@/boot/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { data } from 'browserslist'

const router = useRouter()

const user = useUserStore()
const { getUser } = user
const filter = ref('')

const myInfo = reactive([])

;
(async () => {
  try {
    const { data } = await apiAuth.get('/users/me')
    console.log(data)
    myInfo.account = data.result.account
    myInfo.email = data.result.email
    myInfo.name = data.result.name
    myInfo.phone = data.result.phone
    myInfo._id = data.result._id
    console.log(myInfo)
  } catch (error) {
    console.log(myInfo)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得我的資料失敗'
    })
  }
})()
</script>
