<template lang="pug">
#login
  .row
    .col-12
      h1.text-center 登入
    .col-12
      q-form(@submit="login")
        q-input(v-model="form.account" type="text" :rules="[rules.required, rules.length]" label="帳號" counter maxlength="20")
        q-input(v-model="form.password" type="password" :rules="[rules.required, rules.length]" label="密碼" counter maxlength="20")
        .text-center.my-5
          q-btn(color="primary" type="submit" size="large" :loading="loading" text-color="white" label="登入")
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = useUserStore()

// const valid = ref(false)
const loading = ref(false)
const form = reactive({
  account: '',
  password: ''
})

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  length (value) {
    return (value.length >= 4 && value.length <= 20) || '長度必須為 4 ~ 20 個字'
  }
}

const login = async () => {
  loading.value = true
  await user.login(form)
  loading.value = false
}

</script>
