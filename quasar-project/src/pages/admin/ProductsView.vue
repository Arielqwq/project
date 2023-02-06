<template lang="pug">
#admin-products
  q-page
    h3.text-center 商品管理
    .div(class="q-pa-md row")
      .col-12
        q-btn( @click="openDialog(-1)" color="primary" label="新增商品")
          //- :rows='rows' :columns='columns' row-key='name' binary-state-sort
    .div(class="q-pa-md")
      q-table( title='新增商品' :columns="columns")

      q-dialog(align="center" v-model="form.dialog" persistent)
        q-card(style="width: 700px; max-width: 80vw;")
          q-card-actions(align="right")
            q-btn( dense flat icon='close' v-close-popup)
              q-tooltip Close
          q-card-section.row.items-center
            q-avatar(icon='signal_wifi_off' color='primary' text-color='white')
            span.q-ml-sm You are currently not connected to any network.
          q-card-actions(align='right')
            q-btn(flat label='reset' color='primary' v-close-popup)
            q-btn(flat label='submit' color='primary' v-close-popup).

      //-
        thead
          tr
            th 圖片
            th 名稱
            th 管理
        tbody
          tr(v-for="(product, idx) in products" :key="product._id")
            td
              v-img(:src="product.image" :aspect-ratio="1" :width="200")
            td {{ product.name }}
            td
              v-btn(color="primary" icon="mdi-pencil" variant="text" @click="openDialog(idx)")
//-
  v-dialog(v-model="form.dialog" persistent)
    v-form(v-model="form.valid" @submit.prevent="submit")
      v-card
        v-card-title
          h1.text-center {{ form._id.length > 0 ? '編輯商品' : '新增商品' }}
        v-card-text
          v-row
            v-col(cols="12")
              v-text-field(v-model="form.name" type="text" label="名稱" :rules="[rules.required]")
            v-col(cols="12")
              v-text-field(v-model="form.price" type="number" label="價格" :rules="[rules.required, rules.price]")
            v-col(cols="12")
              v-textarea(v-model="form.description" rows="3" auto-grow label="說明" :rules="[rules.required]")
            v-col(cols="12")
              v-select(v-model="form.category" :items="categories" :rules="[rules.required]")
            v-col(cols="12")
              v-checkbox(v-model="form.sell" label="上架")
            v-col(cols="12")
              v-image-input.mx-auto(v-model="form.image" removable :max-file-size="1")
              //- 可自己放檔案格式 :accepted-types="['jpg','svg']"
        v-card-actions
          v-spacer
          v-btn(:disabled="form.loading" color="red" @click="form.dialog = false") 取消
          v-btn(:disabled="form.loading" color="green" type="submit") 送出

</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'

const dialog = ref(false)

const products = reactive([])
// 新增，編輯 共用同一個 form 物件
const form = reactive({
  // 如果 id 有東西就是編輯，沒有是新增
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: undefined,
  // 預設下架
  sell: false,
  category: '',
  valid: false,
  loading: false,
  dialog: false,
  idx: -1
})

const openDialog = (idx) => {
  if (idx === -1) {
    form._id = ''
    form.name = ''
    form.price = 0
    form.description = ''
    form.image = undefined
    form.sell = false
    form.category = ''
    form.valid = false
    form.loading = false
    form.idx = -1
  } else {
    form._id = products[idx]._id
    form.name = products[idx].name
    form.price = products[idx].price
    form.description = products[idx].description
    form.image = undefined
    form.sell = products[idx].sell
    form.category = products[idx].category
    form.valid = false
    form.loading = false
    form.idx = idx
  }
  form.dialog = true
}

const columns = [
  {
    name: 'name',
    required: true,
    label: '商品名稱',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: '商品圖片', align: 'center', label: '商品圖片', field: 'productName', sortable: true },
  { name: '單價', label: '單價', field: 'productPicture', sortable: true, style: 'width: 10px' },
  { name: '編輯', label: '編輯', field: 'edit' }
]

// const rows = [
//   {
//     name: 'Frozen Yogurt',
//     calories: 159,
//     fat: 6.0,
//     carbs: 24,
//     protein: 4.0,
//     sodium: 87,
//     calcium: '14%',
//     iron: '1%'
//   },
//   {
//     name: 'Ice cream sandwich',
//     calories: 237,
//     fat: 9.0,
//     carbs: 37,
//     protein: 4.3,
//     sodium: 129,
//     calcium: '8%',
//     iron: '1%'
//   },
//   {
//     name: 'Eclair',
//     calories: 262,
//     fat: 16.0,
//     carbs: 23,
//     protein: 6.0,
//     sodium: 337,
//     calcium: '6%',
//     iron: '7%'
//   },
//   {
//     name: 'Cupcake',
//     calories: 305,
//     fat: 3.7,
//     carbs: 67,
//     protein: 4.3,
//     sodium: 413,
//     calcium: '3%',
//     iron: '8%'
//   },
//   {
//     name: 'Gingerbread',
//     calories: 356,
//     fat: 16.0,
//     carbs: 49,
//     protein: 3.9,
//     sodium: 327,
//     calcium: '7%',
//     iron: '16%'
//   },
//   {
//     name: 'Jelly bean',
//     calories: 375,
//     fat: 0.0,
//     carbs: 94,
//     protein: 0.0,
//     sodium: 50,
//     calcium: '0%',
//     iron: '0%'
//   },
//   {
//     name: 'Lollipop',
//     calories: 392,
//     fat: 0.2,
//     carbs: 98,
//     protein: 0,
//     sodium: 38,
//     calcium: '0%',
//     iron: '2%'
//   },
//   {
//     name: 'Honeycomb',
//     calories: 408,
//     fat: 3.2,
//     carbs: 87,
//     protein: 6.5,
//     sodium: 562,
//     calcium: '0%',
//     iron: '45%'
//   },
//   {
//     name: 'Donut',
//     calories: 452,
//     fat: 25.0,
//     carbs: 51,
//     protein: 4.9,
//     sodium: 326,
//     calcium: '2%',
//     iron: '22%'
//   },
//   {
//     name: 'KitKat',
//     calories: 518,
//     fat: 26.0,
//     carbs: 65,
//     protein: 7,
//     sodium: 54,
//     calcium: '12%',
//     iron: '6%'
//   }
// ]

// export default {
//   setup () {
//     return {
//       columns,
//       rows: ref(rows)
//     }
//   }
// }

/*
const categories = ['衣服', '皮件', '鞋子', '飾品', '3C', '其他']

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  price (value) {
    return value >= 0 || '價格錯誤'
  }
}

const products = reactive([])
const form = reactive({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: undefined,
  sell: false,
  category: '',
  valid: false,
  loading: false,
  dialog: false,
  idx: -1
})

const openDialog = (idx) => {
  if (idx === -1) {
    form._id = ''
    form.name = ''
    form.price = 0
    form.description = ''
    form.image = undefined
    form.sell = false
    form.category = ''
    form.valid = false
    form.loading = false
    form.idx = -1
  } else {
    form._id = products[idx]._id
    form.name = products[idx].name
    form.price = products[idx].price
    form.description = products[idx].description
    form.image = undefined
    form.sell = products[idx].sell
    form.category = products[idx].category
    form.valid = false
    form.loading = false
    form.idx = idx
  }
  form.dialog = true
}

const submit = async () => {
  if (!form.valid) return
  form.loading = true
  // fd.append(key, value)
  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('price', form.price)
  fd.append('description', form.description)
  fd.append('image', form.image)
  fd.append('sell', form.sell)
  fd.append('category', form.category)

  try {
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/products', fd)
      products.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增成功'
      })
    } else {
      const { data } = await apiAuth.patch('/products/' + form._id, fd)
      products[form.idx] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯成功'
      })
    }
    form.dialog = false
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
  form.loading = false
}

(async () => {
  try {
    const { data } = await apiAuth.get('/products/all')
    products.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
*/
</script>
