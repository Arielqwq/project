<template lang="pug">
#productView
  div(style="height:500px; margin:0 0 110px 0").row.flex.justify-center
    .product-img.col-12.col-lg-3.flex.justify-center
      q-img(:src="product.image" cover style="width:200px")
    .flex.column.no-wrap.col-12.col-lg-7
      h3 {{ product.name }}
      p $ {{ product.price }}
      p.pre {{ product.description }}
      q-form(@submit="submitCart")
        //-v-model.number傳入數字，v-model 預設是文字
        q-input(filled v-model.number="quantity" type="number" label="數量" :rules="[rules.required, rules.number]")
        q-btn(type="submit" color="primary") 加入購物車
        q-btn(flat round color='red' :icon=" love ? 'fa-solid fa-heart':'fa-regular fa-heart'" @click="editLove({_id:product._id})")

  div(style="height:400px").row.flex.justify-center
    .col-10
      .text-h5 YOU MAY ALSO LIKE
  q-dialog(:v-model="!product.sell" persistent )
    q-card(class="bg-accent text-white" style="width: 300px")
      q-card-section
        h5.text-white.text-weight-bold 賣完ㄌ餒
      q-card-actions( align="right" class="bg-white text-accent")
        q-btn(@click="router.go(-1)" flat label="back" v-close-popup )

</template>

<script setup>
import { reactive, ref } from 'vue'
import { api, apiAuth } from '@/boot/axios'
// 有沒有 r 的區別，有 r 是跳頁，沒 r 是取資料(在哪一頁)
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// 取資訊
const route = useRoute()
// 換頁
const router = useRouter()

const user = useUserStore()
const { editCart, isLogin } = storeToRefs(user)

// const valid = ref(false)
const quantity = ref(0)

const love = ref(false)

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  number (value) {
    // 0 加購物車沒意義
    return value > 0 || '數量錯誤'
  }
}

const product = reactive({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  images: [],
  // 預設是 false 會看到已下架
  sell: true,
  category: ''
})

const submitCart = () => {
  // if (!valid.value) return
  editCart({ _id: product._id, quantity: quantity.value, text: '加入購物車' })
}

const editLove = async () => {
  try {
    const { data } = await apiAuth.post('/users/love', { p_id: route.params.id, love: !love.value })
    love.value = !love.value
    if (love.value === true) {
      Swal.fire({
        title: '加入收藏',
        color: 'pink'
      })
    } else {
      Swal.fire({
        title: '移除收藏',
        color: 'pink'
      })
    }
  } catch (error) {
    Swal.fire({
      message: '失敗',
      caption: error?.response?.data?.message || '發生錯誤',
      color: 'pink'
    })
  }
}

// function back () {
//   console.log('yayayya')
// }

(async () => {
  try {
    const { data } = await api.get('/products/' + route.params.id)
    // 不能直接 product.result 因為 product 是 const
    product._id = data.result._id
    product.name = data.result.name
    product.price = data.result.price
    product.description = data.result.description
    product.image = data.result.image
    product.images = data.result.images
    product.sell = data.result.sell
    product.category = data.result.category
    // 對使用者來說，頁面標題有變化
    document.title = '購物網 | ' + product.name

    if (isLogin.value) {
      const { data } = await apiAuth.get('/users/love/' + route.params.id)
      love.value = data.result
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得商品失敗'
    })
    // 取失敗就回上一頁
    router.go(-1)
  }
})()
</script>
<style lang="sass">

</style>
