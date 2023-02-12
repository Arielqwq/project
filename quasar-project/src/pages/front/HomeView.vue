<template lang="pug">
#home
  div
    h4.text-center 我是首頁
    div.product-area.flex.q-ma-lg.justify-center.row.col-5
      swiper
        swiper-slide(v-for="product in products" :key="product._id" :slidesPerView="3")
          q-card(style="width:250px").flex.justify-center.q-pa-lg.col-12.col-md-6.col-lg-3
            ProductCard(v-bind="product")

</template>
<script setup>
import { reactive } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
import ProductCard from '@/components/ProductCard.vue'
import { SwiperSlide, Swiper } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
