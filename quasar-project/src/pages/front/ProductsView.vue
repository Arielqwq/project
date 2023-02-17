<template lang="pug">
#front-ProductsView.text-center.q-pa-xl
  h3.text-center 最新商品
  q-btn.q-ml-lg.q-mb-lg(v-for="(name, i) in filterName" :key="i" :label="name" @click="filterCategory = name" push rounded color="blue")
  div.product-area.flex.q-ma-lg.justify-center.row.col-5
    q-card.flex.justify-center.q-pa-lg.q-ma-md.col-12.col-md-6.col-lg-3(v-for="product in products" :key="product._id" )
      ProductCard(v-bind="product")
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
import ProductCard from '@/components/ProductCard.vue'

const products = reactive([])
const filterName = ['全部', '葡萄酒', '白蘭地', '清酒', '燒酒', '香檳氣泡酒', '啤酒', '奶酒', '其他']
const filterCategory = ref('全部')
const categories = ['葡萄酒', '白蘭地', '清酒', '燒酒', '香檳氣泡酒', '啤酒', '奶酒', '其他']

const filterData = computed(() => {
  if (filterCategory.value !== '全部') {
    return products.filter(item => item.category === filterCategory.value)
  }
  return products
})

;(async () => {
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
