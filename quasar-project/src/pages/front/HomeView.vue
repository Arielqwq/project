<template lang="pug">
#home
  q-page
    .col-12
      h4.text-center 我是首頁
    //- q-col(v-for="product in products" :key="product._id" cols="12" md="6" lg="3")
    //-   ProductCard(v-bind="product")

</template>
<script setup>
import { reactive } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
// import ProductCard from '@/components/ProductCard'

const products = reactive([]);

(async () => {
  try {
    const { data } = await api.get('/products')
    products.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>
