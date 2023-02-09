<template lang="pug">
#cart
  h3.text-center 購物車
    .div(class="q-px-xl row")
      .col-12
        q-table(:columns="columns" :rows="cart" row-key="p_id" :rows-per-page-options="[5]")
          //- template( v-slot:body-cell-image="props")
          //-   img(:src='props.row.image' style='height: 100px;')
  //- v-row
  //-   v-col(cols="12")
  //-     h1.text-center 購物車
  //-   v-divider
  //-   v-col(cols="12")
  //-     v-table
  //-       thead
  //-         tr
  //-           th 圖片
  //-           th 名稱
  //-           th 單價
  //-           th 數量
  //-           th 小計
  //-           th 操作
  //-       tbody
  //-         tr(v-for="(product, idx) in cart" :key="product._id" :class="{'bg-red': !product.p_id.sell}")
  //-           td
  //-             v-img(:aspect-ratio="1" :width="200" :src="product.p_id.image")
  //-           td {{ product.p_id.name }}
  //-           td {{ product.p_id.price }}
  //-           td
  //-             v-btn(color="primary" @click="updateCart(idx, -1,'修改成功')") -
  //-             | &nbsp;{{ product.quantity }}&nbsp;
  //-             v-btn(color="primary" @click="updateCart(idx, 1,'修改成功')") +
  //-           td {{ product.quantity * product.p_id.price }}
  //-           td
  //-             v-btn(color="red" @click="updateCart(idx, product.quantity*-1 ,'刪除商品')") 刪除
  //-         tr(v-if="cart.length === 0")
  //-           td.text-center(colspan="6") 沒有商品
  //-   v-divider
  //-   v-col.text-center(cols="12")
  //-     p 總金額 {{ totalPrice }}
  //-     v-btn(color="green" :disabled="!canCheckout" @click="onCheckoutBtnClick") 結帳
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { apiAuth } from '@/boot/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = useUserStore()
const { editCart, checkout } = user
const filter = ref('')

const cart = reactive([])

const columns = [
  {
    name: 'name',
    required: true,
    label: '商品名稱',
    align: 'left',
    field: cart => cart.p_id.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'image',
    required: true,
    label: '商品圖片',
    align: 'left',
    field: row => row.p_id.image,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: '商品價格',
    align: 'left',
    field: row => row.p_id.price,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'value',
    required: true,
    label: '小計',
    align: 'left',
    // format: cart => cart[idx].quantity * cart[idx].p_id.price,
    sortable: true
  },
  {
    name: 'edit',
    required: true,
    label: '編輯',
    align: 'left'
  }
]

const updateCart = async (idx, quantity, text) => {
  await editCart({ _id: cart[idx].p_id._id, quantity, text })
  cart[idx].quantity += quantity
  if (cart[idx].quantity <= 0) {
    cart.splice(idx, 1)
  }
}

const onCheckoutBtnClick = async () => {
  await checkout()
  router.push('/orders')
}

const totalPrice = computed(() => {
  return cart.reduce((total, current) => {
    return total + (current.p_id.price * current.quantity)
  }, 0)
})

const canCheckout = computed(() => {
  return cart.length > 0 && !cart.some(product => {
    return !product.p_id.sell
  })
});

(async () => {
  try {
    const { data } = await apiAuth.get('/users/cart')
    cart.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得購物車失敗'
    })
  }
})()
</script>
