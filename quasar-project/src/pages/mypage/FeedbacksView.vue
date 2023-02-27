<template lang="pug">
#myfeedback
  .row
    .col-12
      h4.text-center 我的回應
        div.q-ma-md.q-px-xl.row
          .col-12
            q-table(:columns="columns" :rows="feedbacks" row-key="p_id"  :filter="filter")
</template>

<script setup>
import { reactive, ref } from 'vue'
import { apiAuth } from '@/boot/axios'
import Swal from 'sweetalert2'

const feedbacks = reactive([])

const columns = [
  {
    name: 'title',
    required: true,
    label: '主旨',
    align: 'left',
    field: feedbacks => feedbacks.title
  },
  {
    name: 'description',
    required: true,
    label: '我的訊息',
    align: 'left',
    field: feedbacks => feedbacks.description
  },
  {
    name: 'createDate',
    required: true,
    label: '寄件時間',
    align: 'left',
    field: feedbacks => new Date(feedbacks.createDate).toLocaleDateString()
  },
  {
    name: 'reply',
    required: true,
    label: '管理員回覆',
    align: 'left',
    field: feedbacks => feedbacks.reply
  },
  {
    name: 'replyDate',
    required: true,
    label: '回應時間',
    align: 'left',
    field: feedbacks => new Date(feedbacks.replyDate).toLocaleDateString()
  },
  {
    name: 'status',
    required: true,
    label: '狀態',
    align: 'left',
    field: feedbacks => feedbacks.status
  }
]

;(async () => {
  try {
    const { data } = await apiAuth.get('/feedbacks')
    feedbacks.push(...data.result)
    console.log(feedbacks)
  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得回應失敗'
    })
  }
})()
</script>
