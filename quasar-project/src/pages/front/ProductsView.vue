<template lang="pug">
#front-ProductsView
  h3 最新商品
  div.product-area.flex.q-ma-lg.justify-center.row.col-5
    btn()
    q-card.flex.justify-center.q-pa-lg.col-12.col-md-6.col-lg-3(v-for="product in products" :key="product._id" )
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
<style lang="sass">

</style>
