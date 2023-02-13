<template lang="pug">
#aboutus
  div.q-ma-lg
    h5.text-center {{ aboutus[0]?.title }}
    h6 {{ aboutus[0]?.description }}
    div(align='center')
      img(:src='aboutus[0]?.image' style='height: 100px;')

</template>

<script setup>
import { reactive } from 'vue'
import { api } from '@/boot/axios'
import Swal from 'sweetalert2'

defineProps({
  /* eslint-disable */
  _id: {
      type: String,
      default: ''
  },
  /* eslint-enable */
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
})

const aboutus = reactive([]);

(async () => {
  try {
    const { data } = await api.get('/aboutus')
    aboutus.push(...data.result)
    console.log(aboutus)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()

</script>
