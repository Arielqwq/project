<template lang="pug">
#product
  .row.flex
    #product-img.col-12.col-lg-6.flex.justify-center
      q-img(:src="product.image" cover )
    .flex.column.no-wrap.col-12.col-lg-6
      h3 {{ product.name }}
      p ${{ product.price }}
      p.pre {{ product.description }}
      q-form(@submit="submitCart")
        //-v-model.number傳入數字，v-model 預設是文字
        q-input(filled v-model.number="quantity" type="number" label="數量" :rules="[rules.required, rules.number]")
        q-btn(type="submit" color="primary") 加入購物車

  q-dialog(:v-model="!product.sell" persistent )
    q-card(class="bg-accent text-white" style="width: 300px")
      q-card-section
        h5.text-white.text-weight-bold 賣完ㄌ餒
      q-card-actions( align="right" class="bg-white text-accent")
        q-btn(@click="router.go(-1)" flat label="back" v-close-popup )

</template>

<script setup>
import { reactive, ref } from 'vue'
import { api } from '@/boot/axios'
// 有沒有 r 的區別，有 r 是跳頁，沒 r 是取資料(在哪一頁)
import { useRoute, useRouter } from 'vue-router'
import { Swal } from 'sweetalert2'
import { useUserStore } from '@/stores/user'

// 取資訊
const route = useRoute()
// 換頁
const router = useRouter()

const user = useUserStore()
const { editCart } = user

// const valid = ref(false)
const quantity = ref(0)

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

function back () {
  console.log('yayayya')
}

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
    // 修改 og 的 title 無效，
    // document.querySelector('meta[property="og:title"]').setAttribute('content', product.name)
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
