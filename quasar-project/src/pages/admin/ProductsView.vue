<template lang="pug">
#admin-products
  h3.text-center 商品管理
  .row
    .col-12
      q-btn(color="success" @click="openDialog(-1)") 新增商品
    .col-12
      q-table(title='Treats' :rows='rows' :columns='columns' row-key='name' binary-state-sort)
      template(v-slot:body='props')
        q-tr(:props='props')
          q-td(key='name' :props='props')
            {{ props.row.name }}
            q-popup-edit(v-model='props.row.name' v-slot='scope')
              q-input(v-model='scope.value' dense autofocus counter).

          q-td(key='calories' :props='props')
            {{ props.row.calories }}
            q-popup-edit(v-model='props.row.calories' title='Update calories' buttons v-slot='scope')
              q-input(type='number' v-model='scope.value' dense autofocus).

          q-td(key='carbs' :props='props')
            {{ props.row.carbs }}
            q-popup-edit(v-model='props.row.carbs' title='Update carbs' buttons persistent v-slot='scope')
              q-input(type='number' v-model='scope.value' dense autofocus hint='Use buttons to close').

          q-td(key='protein' :props='props') {{ props.row.protein }}
          q-td(key='sodium' :props='props') {{ props.row.sodium }}
          q-td(key='calcium' :props='props') {{ props.row.calcium }}
          q-td(key='iron' :props='props') {{ props.row.iron }}

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
import { apiAuth } from '@/plugins/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true, style: 'width: 10px' },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

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
