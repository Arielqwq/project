<template lang="pug">
#customersview
  q-page
    h3 會員管理
</template>

<script setup>
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'

const customers = reactive([])
const filter = ref('')

const form = reactive({
  // 如果 id 有東西就是編輯，沒有是新增
  _id: '',
  account: '',
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
      const { data } = await apiAuth.post('/events', fd)
      customers.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增活動成功'
      })
      console.log(customers)
    } else {
      const { data } = await apiAuth.patch('/customers/' + form._id, fd)
      customers[form.idx] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯活動成功'
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
    const { data } = await apiAuth.get('/events')
    events.push(...data.result)
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
