<template lang="pug">
#orders
  h3.text-center 我的商品訂單
    .div(class="q-px-xl row")
      .col-12
        q-table(:columns="columns" :rows="orders")
          //- 商品內容
          template(v-slot:body-cell-content='data')
            q-td
              ul
                li(v-for="product in data.row.products")
                  p {{product.quantity + ' 個 ' + product.p_id.name}}

  hr
  h3.text-center 我的課程
    .div(class="q-px-xl row")
      .col-12
        q-table(:columns="columnsOfEvents" :rows="events")
</template>

<script setup>
import { reactive } from 'vue'
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'

const orders = reactive([])
const events = reactive([])

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
    label: '訂單內容',
    align: 'left'
  }
]

const columnsOfEvents = [
  {
    name: 'title',
    required: true,
    label: '名稱',
    align: 'left',
    field: events => events.title
  },
  {
    name: 'price',
    required: true,
    label: '費用',
    align: 'left',
    field: events => events.price,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'daysfrom',
    required: true,
    label: '開始日期',
    align: 'left',
    field: events => events.daysfrom
  },
  {
    name: 'daysto',
    required: true,
    label: '結束日期',
    align: 'left',
    field: events => events.daysto
  },
  {
    name: 'description',
    required: true,
    label: '簡介',
    align: 'left',
    field: events => events.description
  },
  {
    name: 'lecturer',
    required: true,
    label: '講者',
    align: 'left',
    field: events => events.lecturer
  },
  {
    name: 'image',
    required: true,
    label: '圖片',
    align: 'left',
    field: events => events.image
  }];

(async () => {
  try {
    const { data } = await apiAuth.get('/orders')
    orders.push(...data.result.map(order => {
      order.totalPrice = order.products.reduce((total, current) => total + current.p_id.price * current.quantity, 0)
      return order
      // order.products.product.quantity = orders.findIndex((product) => product in orders.products)
    }))
    const { eventsData } = await apiAuth.get('/events/me')
    events.push(...eventsData.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得訂單失敗'
    })
  }
})()

</script>
