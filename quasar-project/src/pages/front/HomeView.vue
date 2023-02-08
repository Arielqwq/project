<template lang="pug">
#home
  div
    div
      h4.text-center 我是首頁
    hr
    div.flex.q-ma-lg.justify-center.row
      q-card.flex.justify-center.q-ma-lg.q-pa-lg.col-12.col-md-6.col-lg-3(v-for="product in products" :key="product._id" )
        ProductCard(v-bind="product")

</template>
<script setup>
import { reactive } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
import ProductCard from '@/components/ProductCard.vue'

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
