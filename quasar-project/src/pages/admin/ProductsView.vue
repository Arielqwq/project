<template lang="pug">
#admin-products
  h3.text-center 商品管理
  div(class="q-px-xl row")
    .col-12
      q-btn( @click="openDialog(-1)" color="primary" label="新增商品")
  div(class="q-px-xl q-mt-md")
    q-table(title="商品資訊" :columns="columns" :rows="products" row-key="_id" :filter="filter" )
      template( v-slot:body-cell-image="props")
        q-td
          img(:src='props.row.image' style='height: 100px;')

      template( v-slot:top-right)
        q-input( borderless dense debounce="300" v-model="filter" placeholder="Search")
          template( v-slot:append)
            q-icon( name="search")

        //- 編輯
      template(#body-cell-edit="data")
        q-td(class="q-pa-md q-gutter-sm")
          q-btn( round color="primary" text-color="white" icon="edit" @click="openDialog(products.findIndex((product)=> product._id === data.row._id))")
          //- 編輯商品按鈕的另一種寫法
          //- q-btn( round color="primary" text-color="white" icon="edit" @click="openDialog(products.indexOf(data.row))")
          //- 刪除(但不適用)
          //- q-btn(round color="red" text-color="white" icon="fa-solid fa-trash-can" @click="deleteProduct(data.row._id)")

    //- 新增編輯商品
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
            .col-2
              q-checkbox(v-model="form.sell" label="上架")
            .col-5
              .row
                  //- .col-3( v-for="i in products[form.idx]?.image" :key="i")
                  q-img(:src="products[form.idx]?.image" style="height:100px")
                  q-file(filled v-model="form.image" label="請上傳主圖片" style="max-height: 50px")
                    template(v-slot:append)
                      q-icon(name="close" @click="clear")

            .col-5
              .row
                  .col-3(v-if="form.idx >= 0" v-for="img in products[form.idx]?.images" :key="img")
                    q-img.fullwidth(:src="img")
                      .absolute-full.flex.flex-center(v-if="form.delImages.includes(img)")
                        q-icon(name="delete")
                    q-checkbox(v-model="form.delImages" :val="img")
              q-file(v-model="form.images" label="請上傳補充圖片" filled multiple style="max-width: 300px")
                template(v-slot:append)
                  q-icon(name="close" @click="clears")

          q-card-actions(align='right')
            q-btn(:disabled="form.loading" flat label='reset' type="reset" color='red')
            q-btn(:disabled="form.loading" flat label='submit' type="submit" color='green')

</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'

const categories = [
  '葡萄酒', '白蘭地', '清酒', '燒酒', '香檳氣泡酒', '啤酒', '奶酒', '其他'
]

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  price (value) {
    return value >= 0 || '價格錯誤'
  }
}

const clear = () => {
  form.image = []
}

const clears = () => {
  form.images = []
}
const products = reactive([])
const filter = ref('')
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
  images: [],
  delImages: [],
  // 預設下架
  sell: false,
  category: '',
  valid: false,
  loading: false,
  dialog: false,
  idx: -1
})

const openDialog = (idx) => {
  // 陣列索引從 0 開始，設定 -1 代表不在陣列裡，為新增商品
  if (idx === -1) {
    form._id = ''
    form.name = ''
    form.price = 0
    form.description = ''
    form.image = undefined
    form.images = []
    form.delImages = []
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
    form.image = products[idx].image
    form.images = []
    form.delImages = []
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
    field: products => products.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'image',
    required: true,
    label: '商品圖片',
    align: 'left',
    field: row => row.image,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: '商品價格',
    align: 'left',
    field: row => row.price,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'sell',
    required: true,
    label: '上架狀態',
    align: 'left',
    field: row => row.sell,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'edit',
    required: true,
    label: '編輯',
    align: 'left'
  }
]

// const updateproducts = async (id, quantity, text) => {
//   const idx = products.findIndex((products) => products._id === id)
//   console.log(idx)
//   await editproducts({ _id: products[idx].p_id._id, quantity, text })
//   products[idx].quantity += quantity
//   if (products[idx].quantity <= 0) {
//     products.splice(idx, 1)
//   }
// }

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
  // fd.append('images', form.images)
  console.log(form.images)
  for (const i of form.images) { fd.append('images', i) }
  for (const i of form.delImages) { fd.append('delImages', i) }
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

// const deleteProduct = async (_id) => {
//   try {
//     console.log(111)
//     await apiAuth.patch('/products/delete/' + _id, {
//       status: 1
//     })
//     const index = products.findIndex(item => item._id === _id)
//     console.log(index)
//     products.splice(index, 1)
//     Swal.fire({
//       icon: 'success',
//       title: '成功',
//       text: '刪除成功'
//     })
//   } catch (error) {
//     Swal.fire({
//       icon: 'error',
//       title: '刪除失敗',
//       text: error?.response?.data?.message || '發生錯誤'
//     })
//   }
// };

(async () => {
  try {
    const { data } = await apiAuth.get('/products/all')
    products.push(...data.result)
    console.log(products)
  } catch (error) {
    console.log(error)
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
