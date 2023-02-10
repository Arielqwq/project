<template lang="pug">
#cart
  h3.text-center 購物車
    .div(class="q-px-xl row")
      .col-12
        q-table(:columns="columns" :rows="cart" row-key="p_id" :rows-per-page-options="[5]")
          template( v-slot:body-cell-image="props")
            img(:src='props.row.p_id.image' style='height: 100px;')
          //- //- 新增數量
          //- template(v-slot:body-cell-quantity="props")
          //-   q-btn

          //-刪除
          template(#body-cell-edit="data")
            //- span {{ data.row._id }}
            q-btn(round color="red" @click="updateCart(data.row._id, data.row.quantity*-1 ,'刪除商品')" icon="fa-solid fa-trash-can")
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
    sortable: true
  },
  {
    name: 'image',
    required: true,
    label: '商品圖片',
    align: 'left',
    field: row => row.p_id.image,
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: '商品價格',
    align: 'left',
    field: row => row.p_id.price,
    sortable: true
  },
  {
    name: 'quantity',
    required: true,
    label: '商品數量',
    align: 'left',
    field: row => row.quantity,
    sortable: true
  },
  {
    name: 'value',
    required: true,
    label: '小計',
    align: 'left',
    field: row => row,
    format: cart => cart.p_id.price * cart.quantity,
    sortable: true
  },
  {
    name: 'edit',
    required: true,
    label: '編輯',
    align: 'left'
  }
]

const updateCart = async (id, quantity, text) => {
  const idx = cart.findIndex((cart) => cart._id === id)
  console.log(idx)
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
