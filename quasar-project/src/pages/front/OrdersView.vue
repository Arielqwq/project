<template lang="pug">
#orders
  h3.text-center 購物車
      .div(class="q-px-xl row")
        .col-12
          q-table(:columns="columns" :rows="orders")
            //- 商品內容
            //- template(v-slot:body-cell-content='orders')
            //-   q-td
            //-     p {{order.products.product.quantity + ' 個 ' + order.products.product.p_id.name}}
</template>

<script setup>
import { reactive } from 'vue'
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'

const orders = reactive([])

const columns = [
  {
    name: 'name',
    required: true,
    label: '訂單編號',
    align: 'left',
    field: orders => orders._id,
    sortable: true
  },
  {
    name: 'date',
    required: true,
    label: '訂單日期',
    align: 'left',
    field: orders => new Date(orders.date).toLocaleDateString(),
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: '訂單金額',
    align: 'left',
    field: orders => orders.totalPrice,
    sortable: true
  },
  {
    name: 'content',
    required: true,
    label: '訂單內容',
    align: 'left',
    field: orders => orders,
    sortable: true
  }
];

(async () => {
  try {
    const { data } = await apiAuth.get('/orders')
    console.log(data)
    orders.push(...data.result.map(order => {
      order.totalPrice = order.products.reduce((total, current) => total + current.p_id.price * current.quantity, 0)
      // order.products.product.quantity = orders.findIndex((product) => product in orders.products)
      return order
    }
    ))
  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得訂單失敗'
    })
  }
})()
</script>
