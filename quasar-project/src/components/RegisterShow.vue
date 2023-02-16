<template lang="pug">
#register
  .row.column
    .col-12
      h4.text-center 註冊
    .col.text-left(cols="12")
      q-form.q-pa-lg( @submit.prevent="registerSumbit")
        //- 需要哪些規則再引進
        q-input(v-model="form.email" type="email" :rules="[rules.email, rules.required]" label="信箱")
        q-input(v-model="form.account" type="text" :rules="[rules.required, rules.length]" label="帳號" counter maxlength="20")
        q-input(v-model="form.password" type="password" :rules="[rules.required, rules.length]" label="密碼" counter maxlength="20")
        q-input(v-model="form.passwordConfirm" type="password" :rules="[rules.required, rules.length, rules.passwordConfirm]" label="確認密碼" counter maxlength="20")
        .q-pa-lg.text-center.my-5
          q-btn(color="primary" type="submit" size="large" :loading="loading" text-color="white" label="註冊" )
</template>

<script setup>
import { ref, reactive } from 'vue'
import validator from 'validator'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const users = useUserStore()
const { register } = users

const router = useRouter()

// const valid = ref(false)
const loading = ref(false)
const form = reactive({
  account: '',
  password: '',
  passwordConfirm: '',
  email: ''
})

const rules = {
  email (value) {
    return validator.isEmail(value) || '格式錯誤'
  },
  required (value) {
    return !!value || '欄位必填'
  },
  length (value) {
    return (value.length >= 4 && value.length <= 20) || '長度必須為 4 ~ 20 個字'
  },
  passwordConfirm (value) {
    return (value === form.password) || '密碼不一致'
  }
}

const registerSumbit = async () => {
  // if (!valid.value) return
  loading.value = true
  await register(form)
  loading.value = false
}
</script>
