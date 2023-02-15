<template lang="pug">
#customersview
  h3.text-center 會員管理
  .div(class="q-px-xl row")
    //- .col-12
    //-   q-btn( @click="openDialog(-1)" color="primary" label="新增會員")
  .div(class="q-px-xl q-mt-md")
    q-table(:columns="columns" :rows="customers" row-key="_id" :filter="filter" :rows-per-page-options="[5]")
      template( v-slot:top-right)
        q-input( borderless dense debounce="300" v-model="filter" placeholder="Search")
          template( v-slot:append)
            q-icon( name="search")

      //- 編輯
      template(#body-cell-edit="data")
        q-td(class="q-pa-md q-gutter-sm")
          q-btn( round color="primary" text-color="white" icon="edit" @click="openDialog(customers.findIndex((customer)=> customer._id === data.row._id))")

    //- 新增編輯商品
    q-dialog(align="center" v-model="form.dialog" persistent)
      q-card( class="column" style="width: 700px; max-width: 80vw;")
        q-form(@submit="onSubmit" @reset="onReset")
          q-card-actions.row.flex.justify-between
            .div(align="left" class="q-pa-md row" )
              .text-center {{ form._id.length > 0 ? '編輯帳號' : '新增帳號' }}
            q-btn(dense flat icon='close' v-close-popup)
              q-tooltip Close
          q-card-section.column.q-gutter-md
            .col-12
              q-input(square filled v-model="form.account" label="帳號" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.password" type="number" label="密碼" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.email" type="email" label="信箱" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.name" type="text" label="姓名")
            .col-2
              q-checkbox(v-model="form.sell" label="狀態")

          q-card-actions(align='right')
            q-btn(:disabled="form.loading" flat label='reset' type="reset" color='red')
            q-btn(:disabled="form.loading" flat label='submit' type="submit" color='green')
</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'

const customers = reactive([])
const filter = ref('')

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const form = reactive({
  // 如果 id 有東西就是編輯，沒有是新增
  _id: '',
  account: '',
  password: '',
  email: 0,
  name: '',
  phone: '',
  sell: '',
  loading: false,
  dialog: false,
  idx: -1
})

const openDialog = (idx) => {
  if (idx === -1) {
    form._id = ''
    form.account = ''
    form.password = ''
    form.email = ''
    form.name = ''
    form.phone = ''
    form.sell = ''
    form.loading = false
    form.dialog = false
    form.idx = -1
  } else {
    form._id = customers[idx]._id
    form.account = customers[idx].account
    form.password = customers[idx].password
    form.email = customers[idx].email
    form.name = customers[idx].name
    form.phone = customers[idx].phone
    form.sell = customers[idx].sell
    form.loading = customers[idx].loading
    form.dialog = customers[idx].dialog
    form.idx = idx
  }
  form.dialog = true
}

const columns = [
  {
    name: 'account',
    required: true,
    label: '帳號',
    align: 'left',
    field: events => events.account
  },
  {
    name: 'email',
    required: true,
    label: '信箱',
    align: 'left',
    field: events => events.email,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'name',
    label: 'name',
    align: 'left',
    field: events => events.daysfrom
  },
  {
    name: 'phone',
    label: '連絡電話',
    align: 'left',
    field: events => events.daysto
  },
  {
    name: 'sell',
    required: true,
    label: '狀態',
    align: 'left',
    field: events => events.sell
  },
  {
    name: 'edit',
    label: '編輯',
    align: 'left'
  }]

const onReset = () => {
  form.account = null
  form.email = null
  form.name = null
  form.phone = null
  form.sell = false
  form.image = undefined
}
const onSubmit = async () => {
  // if (!form.valid) return
  form.loading = true
  // 建立一個新的 formdata 物件
  // fd.append(key, value)
  const fd = new FormData()
  fd.append('title', form.title)
  try {
    // 當id長度為 0，新增
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/users', fd)
      customers.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增活動成功'
      })
      console.log(customers)
    } else {
      const { data } = await apiAuth.patch('/users/' + form._id, fd)
      customers[form.idx] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯會員資料成功'
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
};

(async () => {
  try {
    const { data } = await apiAuth.get('/users/all')
    customers.push(...data.result)
    console.log(customers)
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
