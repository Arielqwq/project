<template lang="pug">
#admin-products
  h3.text-center 商品管理
  .div(class="q-px-xl row")
    .col-12
      q-btn( @click="openDialog(-1)" color="primary" label="新增商品")
        //- :rows='rows' :columns='columns' row-key='name' binary-state-sort
  .div(class="q-px-xl q-mt-md")
    q-markup-table(title='新增商品' :columns="columns")
      thead
        tr
          th 商品圖片
          th 商品名稱
          th 商品單價
          th 編輯
      tbody
        tr(v-for="(product, idx) in products" :key="product._id")
          td
            q-img(:src="product.image" spinner-color="white" style="height: 140px; max-width: 150px")
          td {{ product.name }}
          td {{ product.price }}
            q-btn( flat round color="white" icon="fa-solid fa-pen" text-color="primary" variant="text" @click="openDialog(idx)")
    q-dialog(align="center" v-model="form.dialog" persistent)
      q-card( class="column" style="width: 700px; max-width: 80vw;")
        q-form(@submit="onSubmit" @reset="onReset")
          q-card-actions.row.flex.justify-between
            .div(align="left" class="q-pa-md row" )
              .text-center {{ form._id.length > 0 ? '編輯商品' : '新增商品' }}
            q-btn(dense flat icon='close' v-close-popup)
              q-tooltip Close
          q-card-section.column.q-gutter-md
            .col-12
              q-input(square filled v-model="form.name" label="商品名稱" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.price" type="number" prefix="$" label="商品單價" :rules="[rules.required, rules.price]")
            .col-12
              q-input(square filled v-model="form.description" type="textarea" label="商品說明" :rules="[rules.required]")
            .col-12
              q-select(filled v-model="form.category" :options="categories" label="分類" :rules="[rules.required]")
            .col-12
              q-checkbox(v-model="form.sell" label="上架")
            .col-12
              v-image-input.mx-auto(v-model="form.image" removable :max-file-size="1")
          q-card-actions(align='right')
            q-btn(:disabled="form.loading" flat label='reset' type="reset" color='red')
            q-btn(:disabled="form.loading" flat label='submit' type="submit" color='green')

</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'

// const dialog = ref(false)

const categories = [
  '威士忌', '啤酒', '奶酒', '香檳', '清酒', '其他'
]

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  price (value) {
    return value >= 0 || '價格錯誤'
  }
}

const products = reactive([])
// const model = ref(null)
// const val = ref(true)
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
  // style: 'width: 30px'
  { name: '單價', label: '單價', field: 'productPicture', sortable: true },
  { name: '編輯', label: '編輯', field: 'edit', sortable: true }
]

const onReset = () => {
  form.name = null
  form.price = null
  form.description = null
  form.category = null
  form.sell = false
  form.image = undefined
}
const onSubmit = async () => {
  // if (!form.valid) return
  form.loading = true
  // 建立一個新的 formdata 物件
  // fd.append(key, value)
  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('price', form.price)
  fd.append('description', form.description)
  fd.append('image', form.image)
  fd.append('sell', form.sell)
  fd.append('category', form.category)

  try {
    // 當id長度為 0，新增
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

</script>

<!--
<style lang="sass">
$v-image-input-width: 100px !default
$v-image-input-height: 100px !default
// @import "node_modules/vue3-img-input/src/styles/style.scss"
</style> -->
