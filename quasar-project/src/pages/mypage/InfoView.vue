<template lang="pug">
#Mypage-info
  h3.text-center
  div(class="q-px-xl row")
    .col-12
      q-btn(@click="openDialog(myInfo._id.length > 0 ? 0 : -1)" color="primary" label="編輯")
  div(class="q-px-xl q-mt-md " )
    div(align="left" style="width:80% ;height:500px ;border-radius: 30px; background-color:rgb(255, 245, 238); padding:20px ")
      p 帳號 : {{ myInfo.account }}
      p 密碼 : {{ myInfo.password }}
      p 信箱 :{{  myInfo.email }}
      p 姓名 :{{ myInfo.name }}
      p 電話 :{{  myInfo.phone }}
      p 生日 :{{myInfo.birth}}

    q-dialog(align="center" v-model="form.dialog" persistent)
      q-card( class="column" style="width: 700px; max-width: 80vw;")
        q-form(@submit="onSubmit" @reset="onReset")
          q-card-actions.row.flex.justify-between
            .div(align="left" class="q-pa-md row" )
              .text-center {{ myInfo._id.length > 0 ? '編輯關於我們' : '新增關於我們' }}
            q-btn(dense flat icon='close' v-close-popup)
              q-tooltip Close
          q-card-section.column.q-gutter-md
            .col-12
              q-input(square filled v-model="form.account" label="帳號" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.password" type="password" label="密碼" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.email" type="email" label="信箱" :rules="[rules.required]")
            .col-12
              q-input(square filled v-model="form.name" type="text" label="姓名" :rules="[]")
            .col-12
              q-input(square filled v-model="form.phone" type="phone" label="手機" :rules="[]")
            .col-12
              q-input(square filled v-model="form.birth" type="birth" label="出生年月日" :rules="[]")

          q-card-actions(align='right')
            q-btn(:disabled="form.loading" flat label='reset' type="reset" color='red')
            q-btn(:disabled="form.loading" flat label='submit' type="submit" color='green')

  </template>

<script setup>
import { ref, reactive } from 'vue'
import Swal from 'sweetalert2'
import { apiAuth } from '@/boot/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
// import { data } from 'browserslist'

const router = useRouter()

const user = useUserStore()
const { getUser } = user

const myInfo = reactive([])

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}
const form = reactive({
  _id: '',
  account: '',
  password: '',
  email: '',
  name: '',
  phone: '',
  birth: ''
})

const openDialog = (idx) => {
  console.log(idx)
  console.log(myInfo._id)
  if (idx !== -1) {
    form._id = myInfo._id
    form.account = myInfo.account
    form.password = myInfo.password
    form.email = myInfo.email
    form.name = myInfo.name
    form.phone = myInfo.phone
    form.birth = myInfo.birth
    form.idx = idx
  }
  form.dialog = true
  console.log(form._id)
}

const onReset = () => {
  form.account = ''
  form.password = ''
  form.email = ''
  form.name = ''
  form.phone = ''
  form.birth = ''
}

const onSubmit = async () => {
  // if (!form.valid) return
  form.loading = true
  // 建立一個新的 formdata 物件
  // fd.append(key, value)
  const fd = new FormData()
  fd.append('_id', form._id)
  fd.append('account', form.account)
  fd.append('password ', form.password)
  fd.append('email', form.email)
  fd.append('name', form.name)
  fd.append('phone', form.phone)
  fd.append('birth', form.birth)
  console.log(form)
  console.log(form._id)
  console.log('myInfo' + myInfo)

  try {
    // 當id長度為 0，新增
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/myInfo', fd)
      myInfo.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增成功'
      })
    } else {
      const { data } = await apiAuth.patch('/users/' + form._id, fd)
      console.log(form[form.idx] = data.result)
      data.result = form[form.idx]
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯成功'
      })
    }
    form.dialog = false
  } catch (error) {
    console.log('123' + error)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
  form.loading = false
}
;
(async () => {
  try {
    const { data } = await apiAuth.get('/users/me')
    myInfo._id = data.result._id
    myInfo.account = data.result.account
    myInfo.password = data.result.password
    myInfo.email = data.result.email
    myInfo.name = data.result.name
    myInfo.phone = data.result.phone
    myInfo.birth = data.result.birth

    console.log(data.result._id)
  } catch (error) {
    console.log(myInfo)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得我的資料失敗'
    })
  }
})()
</script>
